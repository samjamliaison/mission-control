"use client"

import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2 } from "lucide-react"
import { useFocusMode } from "@/hooks/use-focus-mode"
import { cn } from "@/lib/utils"

interface FocusModeToggleProps {
  className?: string
  variant?: "default" | "ghost" | "outline"
  size?: "sm" | "default" | "lg" | "icon"
}

export function FocusModeToggle({ 
  className, 
  variant = "ghost", 
  size = "icon" 
}: FocusModeToggleProps) {
  const { isFocusMode, toggleFocusMode } = useFocusMode()

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleFocusMode}
      className={cn(
        "transition-all duration-200",
        isFocusMode 
          ? "bg-[hsl(var(--command-accent))]/20 text-[hsl(var(--command-accent))] hover:bg-[hsl(var(--command-accent))]/30" 
          : "hover:bg-[hsl(var(--command-surface))]/80",
        className
      )}
      title={isFocusMode ? "Exit Focus Mode (F)" : "Enter Focus Mode (F)"}
      aria-label={isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
    >
      {isFocusMode ? (
        <Minimize2 className="h-4 w-4" />
      ) : (
        <Maximize2 className="h-4 w-4" />
      )}
      {size !== "icon" && (
        <span className="ml-2">
          {isFocusMode ? "Exit Focus" : "Focus Mode"}
        </span>
      )}
    </Button>
  )
}