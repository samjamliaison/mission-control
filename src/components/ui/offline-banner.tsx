'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, RefreshCw } from 'lucide-react'

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true)
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    // Initial state
    setIsOnline(navigator.onLine)

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Periodic connectivity check
    const checkConnectivity = async () => {
      if (!navigator.onLine) {
        setIsOnline(false)
        return
      }

      try {
        // Attempt to fetch a small resource to verify real connectivity
        const response = await fetch('/api/health', {
          method: 'HEAD',
          cache: 'no-cache',
        })
        setIsOnline(response.ok)
      } catch {
        setIsOnline(false)
      }
    }

    // Check connectivity every 30 seconds
    const intervalId = setInterval(checkConnectivity, 30000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(intervalId)
    }
  }, [])

  const handleRetry = async () => {
    if (isRetrying) return

    setIsRetrying(true)
    
    try {
      // Wait a moment before retrying
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check connectivity
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-cache',
      })
      
      if (response.ok) {
        setIsOnline(true)
      }
    } catch {
      // Still offline
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-50 bg-red-500/90 backdrop-blur-sm text-white shadow-lg border-b border-red-400/20"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <WifiOff className="h-5 w-5 text-red-100" />
                <div>
                  <p className="font-semibold text-sm">You're offline</p>
                  <p className="text-xs text-red-100 opacity-90">
                    Some features may not work properly without internet connection
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="flex items-center gap-2 px-3 py-1 bg-red-400/20 hover:bg-red-400/30 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRetrying ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Wifi className="h-4 w-4" />
                )}
                {isRetrying ? 'Checking...' : 'Retry'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for other components to check online status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}