"use client"

import { Navigation } from "@/components/navigation"
import { PageTransitionProvider } from "@/components/ui/page-transition"
import { CommandPalette } from "@/components/command-palette/command-palette"
import { useCommandPalette } from "@/hooks/use-command-palette"

interface RootLayoutClientProps {
  children: React.ReactNode
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  const { open, setOpen } = useCommandPalette()

  return (
    <div className="min-h-screen bg-[#09090b] flex">
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
    </div>
  )
}