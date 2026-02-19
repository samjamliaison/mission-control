"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { cn } from "@/lib/utils"

interface PrintButtonProps {
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
  title?: string
  onBeforePrint?: () => void
  onAfterPrint?: () => void
}

export function PrintButton({ 
  className, 
  size = "default", 
  variant = "outline",
  title = "Print this page",
  onBeforePrint,
  onAfterPrint
}: PrintButtonProps) {
  
  const handlePrint = () => {
    // Call before print callback
    onBeforePrint?.()
    
    // Add print-specific classes to body
    document.body.classList.add('printing')
    
    // Small delay to allow any layout changes
    setTimeout(() => {
      window.print()
      
      // Cleanup after print dialog closes
      const cleanup = () => {
        document.body.classList.remove('printing')
        onAfterPrint?.()
      }
      
      // Listen for both afterprint and focus events
      // (focus covers cases where user cancels print dialog)
      window.addEventListener('afterprint', cleanup, { once: true })
      
      // Fallback cleanup after 1 second
      setTimeout(cleanup, 1000)
    }, 100)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="print-hide" // Hide the button itself when printing
    >
      <Button
        variant={variant}
        size={size}
        onClick={handlePrint}
        className={cn(
          "glass-morphism border-[hsl(var(--command-accent))]/30 text-[hsl(var(--command-accent))] hover:bg-[hsl(var(--command-accent))]/10 font-semibold",
          size === "sm" && "min-h-[36px] px-3",
          size === "default" && "min-h-[44px] px-4",
          size === "lg" && "min-h-[48px] px-6",
          className
        )}
        title={title}
      >
        <Printer className={cn(
          "mr-2",
          size === "sm" && "h-3 w-3",
          size === "default" && "h-4 w-4", 
          size === "lg" && "h-5 w-5"
        )} />
        Print
      </Button>
    </motion.div>
  )
}