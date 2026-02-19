import { NextResponse } from 'next/server'

export interface APIError extends Error {
  statusCode?: number
  code?: string
}

export class ValidationError extends Error {
  statusCode = 400
  code = 'VALIDATION_ERROR'
  
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends Error {
  statusCode = 404
  code = 'NOT_FOUND'
  
  constructor(message: string = 'Resource not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends Error {
  statusCode = 401
  code = 'UNAUTHORIZED'
  
  constructor(message: string = 'Unauthorized access') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export class RateLimitError extends Error {
  statusCode = 429
  code = 'RATE_LIMIT_EXCEEDED'
  
  constructor(message: string = 'Rate limit exceeded') {
    super(message)
    this.name = 'RateLimitError'
  }
}

export function handleAPIError(error: unknown): NextResponse {
  console.error('API Error:', error)
  
  // Handle known error types
  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        field: error.field,
        timestamp: new Date().toISOString()
      },
      { status: error.statusCode }
    )
  }
  
  if (error instanceof NotFoundError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString()
      },
      { status: error.statusCode }
    )
  }
  
  if (error instanceof UnauthorizedError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString()
      },
      { status: error.statusCode }
    )
  }
  
  if (error instanceof RateLimitError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString(),
        retryAfter: 60 // seconds
      },
      { status: error.statusCode, headers: { 'Retry-After': '60' } }
    )
  }
  
  // Handle file system errors
  if (error instanceof Error) {
    if (error.message.includes('ENOENT')) {
      return NextResponse.json(
        {
          error: 'File or directory not found',
          code: 'FILE_NOT_FOUND',
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      )
    }
    
    if (error.message.includes('EACCES')) {
      return NextResponse.json(
        {
          error: 'Permission denied',
          code: 'PERMISSION_DENIED',
          timestamp: new Date().toISOString()
        },
        { status: 403 }
      )
    }
    
    if (error.message.includes('EMFILE') || error.message.includes('ENFILE')) {
      return NextResponse.json(
        {
          error: 'Too many open files',
          code: 'RESOURCE_EXHAUSTED',
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      )
    }
  }
  
  // Handle JSON parsing errors
  if (error instanceof SyntaxError && error.message.includes('JSON')) {
    return NextResponse.json(
      {
        error: 'Invalid JSON format',
        code: 'INVALID_JSON',
        timestamp: new Date().toISOString()
      },
      { status: 400 }
    )
  }
  
  // Generic server error
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
  return NextResponse.json(
    {
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      timestamp: new Date().toISOString()
    },
    { status: 500 }
  )
}

export function validateRequired(value: any, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    throw new ValidationError(`${fieldName} is required`, fieldName)
  }
}

export function validateString(value: any, fieldName: string, minLength?: number, maxLength?: number): void {
  validateRequired(value, fieldName)
  
  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`, fieldName)
  }
  
  if (minLength !== undefined && value.length < minLength) {
    throw new ValidationError(`${fieldName} must be at least ${minLength} characters long`, fieldName)
  }
  
  if (maxLength !== undefined && value.length > maxLength) {
    throw new ValidationError(`${fieldName} must not exceed ${maxLength} characters`, fieldName)
  }
}

export function validateEmail(value: any, fieldName: string): void {
  validateString(value, fieldName)
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    throw new ValidationError(`${fieldName} must be a valid email address`, fieldName)
  }
}

export function sanitizePath(inputPath: string): string {
  // Remove any directory traversal attempts
  const sanitized = inputPath
    .replace(/\.\./g, '') // Remove ..
    .replace(/\/+/g, '/') // Remove multiple slashes
    .replace(/^\//, '') // Remove leading slash
  
  // Ensure it doesn't start with sensitive paths
  const dangerous = ['etc', 'var', 'usr', 'bin', 'boot', 'dev', 'home', 'root', 'sys', 'tmp']
  const firstPart = sanitized.split('/')[0]
  
  if (dangerous.includes(firstPart)) {
    throw new ValidationError('Invalid path: access to system directories not allowed', 'path')
  }
  
  return sanitized
}