"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react'
import { Toast as ToastType, ToastVariant, useToast } from '@/contexts/toast-context'
import { cn } from '@/lib/utils'

interface ToastProps {
  toast: ToastType
}

const variantStyles: Record<ToastVariant, string> = {
  success: 'bg-green-500/10 border-green-500/20 text-green-400',
  error: 'bg-red-500/10 border-red-500/20 text-red-400',
  info: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
  warning: 'bg-amber-500/10 border-amber-500/20 text-amber-400'
}

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4 text-green-400" />,
  error: <XCircle className="h-4 w-4 text-red-400" />,
  info: <Info className="h-4 w-4 text-cyan-400" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-400" />
}

function ToastItem({ toast }: ToastProps) {
  const { removeToast } = useToast()

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "group relative flex items-start gap-3 p-4 rounded-lg border backdrop-blur-md",
        "shadow-lg shadow-black/20 min-w-[320px] max-w-[420px]",
        "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br",
        "before:from-white/[0.08] before:to-transparent before:pointer-events-none",
        variantStyles[toast.variant]
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {variantIcons[toast.variant]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-white text-sm leading-5">
          {toast.title}
        </div>
        {toast.description && (
          <div className="text-white/70 text-sm mt-1 leading-5">
            {toast.description}
          </div>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => removeToast(toast.id)}
        className={cn(
          "flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity",
          "p-1 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2",
          "focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent"
        )}
        aria-label="Close notification"
      >
        <X className="h-4 w-4 text-white" />
      </button>
    </motion.div>
  )
}

export function ToastContainer() {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Convenience hook with common toast patterns
export function useToastActions() {
  const { addToast } = useToast()

  return {
    success: (title: string, description?: string) =>
      addToast({ title, description, variant: 'success' }),
    error: (title: string, description?: string) =>
      addToast({ title, description, variant: 'error' }),
    info: (title: string, description?: string) =>
      addToast({ title, description, variant: 'info' }),
    warning: (title: string, description?: string) =>
      addToast({ title, description, variant: 'warning' }),
    custom: (toast: Omit<ToastType, 'id' | 'createdAt'>) =>
      addToast(toast)
  }
}