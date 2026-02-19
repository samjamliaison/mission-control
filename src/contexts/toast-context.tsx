"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import { nanoid } from 'nanoid'
import { soundSystem } from '@/lib/sound-system'

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  title: string
  description?: string
  variant: ToastVariant
  duration?: number
  createdAt: number
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id' | 'createdAt'>) => void
  removeToast: (id: string) => void
  clearAll: () => void
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined)

interface ToastProviderProps {
  children: React.ReactNode
  defaultDuration?: number
  maxToasts?: number
}

export function ToastProvider({
  children,
  defaultDuration = 3000,
  maxToasts = 5
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const addToast = useCallback((toast: Omit<Toast, 'id' | 'createdAt'>) => {
    const newToast: Toast = {
      ...toast,
      id: nanoid(),
      createdAt: Date.now(),
      duration: toast.duration ?? defaultDuration
    }

    // Play appropriate sound based on variant
    try {
      switch (newToast.variant) {
        case 'success':
          soundSystem.playSuccess()
          break
        case 'error':
          soundSystem.playError()
          break
        case 'info':
          soundSystem.playNotificationPing()
          break
        case 'warning':
          soundSystem.playError()
          break
      }
    } catch (error) {
      // Silently fail - don't block toast
      console.debug('Toast sound failed:', error)
    }

    setToasts(prev => {
      const updated = [newToast, ...prev].slice(0, maxToasts)
      return updated
    })

    // Auto-dismiss after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(newToast.id)
      }, newToast.duration)
    }
  }, [defaultDuration, maxToasts, removeToast])

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  const value: ToastContextValue = {
    toasts,
    addToast,
    removeToast,
    clearAll
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}