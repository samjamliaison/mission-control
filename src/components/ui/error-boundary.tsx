"use client"

import React, { Component, ReactNode } from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
  title?: string
  description?: string
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })
    
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
    
    // Call custom reset handler if provided
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return <ErrorFallback onRetry={this.handleReset} {...this.props} error={this.state.error} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  onRetry: () => void
  title?: string
  description?: string
  error?: Error | null
}

function ErrorFallback({ 
  onRetry, 
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again or return to the dashboard.",
  error
}: ErrorFallbackProps) {
  const isDev = process.env.NODE_ENV === 'development'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-[400px] p-6"
    >
      <Card className="max-w-lg w-full glass-morphism border-red-500/20">
        <CardContent className="p-8 text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            <div className="p-4 bg-red-500/10 rounded-full">
              <AlertTriangle className="h-12 w-12 text-red-400" />
            </div>
          </motion.div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="text-white/70 text-sm">{description}</p>
          </div>

          {/* Development error details */}
          {isDev && error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ delay: 0.3 }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-left"
            >
              <div className="text-xs font-mono text-red-300 mb-2">Development Error:</div>
              <div className="text-xs font-mono text-white/80 whitespace-pre-wrap break-all">
                {error.message}
              </div>
              {error.stack && (
                <details className="mt-2">
                  <summary className="text-xs text-white/60 cursor-pointer hover:text-white/80">
                    Stack Trace
                  </summary>
                  <div className="text-xs font-mono text-white/60 mt-1 whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
                    {error.stack}
                  </div>
                </details>
              )}
            </motion.div>
          )}

          <div className="flex gap-3 justify-center">
            <Button
              onClick={onRetry}
              className="btn-premium flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="glass-morphism border-white/20 text-white hover:bg-white/10 flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Hook for functional components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryConfig?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryConfig}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Simplified error boundary for specific sections
export function SectionErrorBoundary({ 
  children, 
  sectionName 
}: { 
  children: ReactNode
  sectionName: string 
}) {
  return (
    <ErrorBoundary
      title={`${sectionName} Error`}
      description={`There was an error loading the ${sectionName.toLowerCase()} section. This may be a temporary issue.`}
    >
      {children}
    </ErrorBoundary>
  )
}