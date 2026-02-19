"use client"

import { Navigation } from "@/components/navigation"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { GlobalSearch } from "@/components/search/global-search"
import { PageTransitionProvider } from "@/components/ui/page-transition"
import { CommandPalette } from "@/components/command-palette/command-palette"
import { ToastProvider } from "@/contexts/toast-context"
import { ToastContainer } from "@/components/ui/toast"
import { useCommandPalette } from "@/hooks/use-command-palette"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { ShortcutsHelpModal } from "@/components/keyboard-shortcuts/shortcuts-help-modal"
import { ThemeProvider } from "@/lib/theme-context"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { FocusModeProvider, useFocusMode } from "@/hooks/use-focus-mode"
import { FocusModeToggle } from "@/components/ui/focus-mode-toggle"
import { PWARegistration } from "@/components/pwa/pwa-registration"

interface RootLayoutClientProps {
  children: React.ReactNode
}

function LayoutContent({ children }: RootLayoutClientProps) {
  const { open, setOpen } = useCommandPalette()
  const { shortcuts, showHelp, setShowHelp, pendingSequence } = useKeyboardShortcuts()
  const { isFocusMode } = useFocusMode()

  return (
    <>
        {/* Skip to content link for screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] bg-white text-black px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          aria-label="Skip to main content"
        >
          Skip to content
        </a>

        <div className="min-h-screen bg-[hsl(var(--command-background))] flex">
          {/* Navigation - hidden in focus mode */}
          {!isFocusMode && <Navigation />}
          
          <main 
            id="main-content" 
            className={`flex-1 min-h-screen ${isFocusMode ? 'w-full' : ''}`} 
            role="main" 
            aria-label="Main content area"
          >
            <PageTransitionProvider>
              <div className={`${isFocusMode ? 'p-2' : 'p-4 sm:p-6 lg:p-8'}`}>
                {/* Header with Breadcrumbs and Search - hidden in focus mode */}
                {!isFocusMode && (
                  <div className="flex items-center justify-between mb-6">
                    <Breadcrumbs />
                    <div className="flex items-center gap-3">
                      <GlobalSearch />
                      <FocusModeToggle />
                      <ThemeToggle />
                    </div>
                  </div>
                )}
                
                {/* Focus mode toggle button - shown in focus mode */}
                {isFocusMode && (
                  <div className="fixed top-4 right-4 z-50">
                    <FocusModeToggle variant="default" size="default" />
                  </div>
                )}
                
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
          
          {/* PWA Registration */}
          <PWARegistration />
        </div>
    </>
  )
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  return (
    <ThemeProvider>
      <FocusModeProvider>
        <ToastProvider>
          <LayoutContent>{children}</LayoutContent>
        </ToastProvider>
      </FocusModeProvider>
    </ThemeProvider>
  )
}