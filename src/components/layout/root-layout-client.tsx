"use client"

import { Navigation } from "@/components/navigation"
import { PageTransitionProvider } from "@/components/ui/page-transition"
import { CommandPalette } from "@/components/command-palette/command-palette"
import { ToastProvider } from "@/contexts/toast-context"
import { ToastContainer } from "@/components/ui/toast"
import { useCommandPalette } from "@/hooks/use-command-palette"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { ShortcutsHelpModal } from "@/components/keyboard-shortcuts/shortcuts-help-modal"
import { ThemeProvider } from "@/lib/theme-context"

interface RootLayoutClientProps {
  children: React.ReactNode
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  const { open, setOpen } = useCommandPalette()
  const { shortcuts, showHelp, setShowHelp, pendingSequence } = useKeyboardShortcuts()

  return (
    <ThemeProvider>
      <ToastProvider>
        {/* Skip to content link for screen readers */}
        <a 
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] bg-white text-black px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          aria-label="Skip to main content"
        >
          Skip to content
        </a>
        
        <div className="min-h-screen bg-[hsl(var(--command-background))] flex">
          <Navigation />
          <main id="main-content" className="flex-1 min-h-screen" role="main" aria-label="Main content area">
            <PageTransitionProvider>
              <div className="p-4 sm:p-6 lg:p-8">
                {children}
              </div>
            </PageTransitionProvider>
          </main>
          
          {/* Command Palette */}
          <CommandPalette open={open} onOpenChange={setOpen} />
          
          {/* Keyboard Shortcuts Help */}
          <ShortcutsHelpModal 
            open={showHelp} 
            onOpenChange={setShowHelp}
            shortcuts={shortcuts}
            pendingSequence={pendingSequence}
          />
          
          {/* Toast Container */}
          <ToastContainer />
        </div>
      </ToastProvider>
    </ThemeProvider>
  )
}