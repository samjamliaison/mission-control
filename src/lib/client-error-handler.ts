import { toast } from '@/hooks/use-toast'

export interface APIResponse<T = any> {
  data?: T
  error?: string
  code?: string
  field?: string
  timestamp?: string
  retryAfter?: number
}

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public field?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred') {
    super(message)
    this.name = 'NetworkError'
  }
}

export class OfflineError extends Error {
  constructor(message: string = 'You are currently offline') {
    super(message)
    this.name = 'OfflineError'
  }
}

export async function handleFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    // Check online status
    if (!navigator.onLine) {
      throw new OfflineError()
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const data: APIResponse<T> = await response.json()

    if (!response.ok) {
      const errorMessage = data.error || `HTTP ${response.status}: ${response.statusText}`
      throw new APIError(errorMessage, response.status, data.code, data.field)
    }

    return data.data || data as T
  } catch (error) {
    // Handle different types of errors
    if (error instanceof APIError || error instanceof OfflineError) {
      throw error
    }

    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new NetworkError('Unable to connect to server')
    }

    if (error instanceof SyntaxError) {
      throw new APIError('Invalid response format', 500, 'INVALID_RESPONSE')
    }

    // Generic network error
    throw new NetworkError(error instanceof Error ? error.message : 'Unknown network error')
  }
}

export function handleClientError(error: unknown, context?: string): void {
  console.error(`Client Error${context ? ` (${context})` : ''}:`, error)

  if (error instanceof OfflineError) {
    toast({
      title: 'Offline',
      description: 'You are currently offline. Some features may not work.',
      variant: 'destructive',
    })
    return
  }

  if (error instanceof NetworkError) {
    toast({
      title: 'Connection Error',
      description: 'Unable to connect to the server. Please check your internet connection.',
      variant: 'destructive',
    })
    return
  }

  if (error instanceof APIError) {
    const title = error.status === 404 ? 'Not Found' :
                  error.status === 403 ? 'Access Denied' :
                  error.status === 429 ? 'Rate Limited' :
                  error.status >= 500 ? 'Server Error' :
                  'Request Failed'

    toast({
      title,
      description: error.message,
      variant: 'destructive',
    })
    return
  }

  // Generic error
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
  toast({
    title: 'Error',
    description: errorMessage,
    variant: 'destructive',
  })
}

export function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  return new Promise((resolve, reject) => {
    let attempt = 0

    const tryRequest = async () => {
      try {
        const result = await fn()
        resolve(result)
      } catch (error) {
        attempt++

        if (attempt >= maxRetries) {
          reject(error)
          return
        }

        // Don't retry certain errors
        if (error instanceof APIError && [400, 401, 403, 404].includes(error.status)) {
          reject(error)
          return
        }

        if (error instanceof OfflineError) {
          reject(error)
          return
        }

        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt - 1)
        setTimeout(tryRequest, delay)
      }
    }

    tryRequest()
  })
}

// Global error handler for unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    
    // Prevent the default browser error handling
    event.preventDefault()
    
    // Handle the error gracefully
    handleClientError(event.reason, 'Unhandled Promise')
  })
}