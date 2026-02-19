"use client"

import { Navigation } from "@/components/navigation"
import { PageTransitionProvider } from "@/components/ui/page-transition"
import { CommandPalette } from "@/components/command-palette/command-palette"
import { ToastProvider } from "@/contexts/toast-context"
import { ToastContainer } from "@/components/ui/toast"
import { useCommandPalette } from "@/hooks/use-command-palette"
import { ThemeProvider } from "@/lib/theme-context"

interface RootLayoutClientProps {
  children: React.ReactNode
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  const { open, setOpen } = useCommandPalette()

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-[hsl(var(--command-background))] flex">
          <Navigation />
          <main className="flex-1 min-h-screen">
            <PageTransitionProvider>
              <div className="p-4 sm:p-6 lg:p-8">
                {children}
              </div>
            </PageTransitionProvider>
          </main>
          
          {/* Command Palette */}
          <CommandPalette open={open} onOpenChange={setOpen} />
          
          {/* Toast Container */}
          <ToastContainer />
        </div>
      </ToastProvider>
    </ThemeProvider>
  )
}