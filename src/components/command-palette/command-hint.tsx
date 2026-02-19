"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Command, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface CommandHintProps {
  onClick?: () => void
  className?: string
}

export function CommandHint({ onClick, className }: CommandHintProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 glass-morphism rounded-lg transition-all duration-200",
        "hover:bg-[hsl(var(--command-accent))]/5 hover:border-[hsl(var(--command-accent))]/20",
        "text-[hsl(var(--command-text-muted))] hover:text-[hsl(var(--command-text))]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--command-accent))] focus-visible:ring-opacity-60",
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Search className="h-4 w-4" />
      <span className="text-sm font-medium">Search</span>
      <div className="flex items-center gap-1">
        <Badge variant="outline" className="text-xs bg-[hsl(var(--command-surface))]/30 px-1.5 py-0.5">
          <Command className="h-3 w-3 mr-0.5" />
          K
        </Badge>
      </div>
    </motion.button>
  )
}