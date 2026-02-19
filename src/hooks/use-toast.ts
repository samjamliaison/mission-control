import { useContext } from 'react'
import { ToastContext } from '@/contexts/toast-context'

export interface ToastOptions {
  title: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
  duration?: number
}

export function toast(options: ToastOptions) {
  // Get toast context if available
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('show-toast', { detail: options })
    window.dispatchEvent(event)
  }
}

export function useToast() {
  const context = useContext(ToastContext)
  
  if (!context) {
    // Fallback when context is not available
    return {
      toast: (options: ToastOptions) => {
        console.warn('Toast context not available, using fallback')
        toast(options)
      }
    }
  }
  
  return context
}