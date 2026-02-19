'use client'

import { useEffect, useState } from 'react'

export function PWARegistration() {
  const [isLoading, setIsLoading] = useState(true)
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Register service worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', {
          scope: '/',
        })
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration.scope)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
          setIsLoading(false)
        })
    }

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setIsInstallable(false)
      setDeferredPrompt(null)
      console.log('Mission Control PWA was installed')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }
    
    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  // Show install banner if installable
  if (isInstallable && !isLoading) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4">
        <div className="glass-morphism border border-[hsl(var(--command-accent))] p-4 rounded-lg max-w-sm">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📱</div>
            <div className="flex-1 text-sm">
              <p className="font-semibold text-[hsl(var(--command-text))]">Install Mission Control</p>
              <p className="text-[hsl(var(--command-text-muted))]">Add to home screen for quick access</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsInstallable(false)}
                className="text-xs text-[hsl(var(--command-text-muted))] hover:text-[hsl(var(--command-text))] transition-colors"
              >
                Dismiss
              </button>
              <button
                onClick={handleInstallClick}
                className="text-xs bg-[hsl(var(--command-accent))] text-white px-3 py-1 rounded hover:bg-[hsl(var(--command-accent))]/80 transition-colors"
              >
                Install
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}