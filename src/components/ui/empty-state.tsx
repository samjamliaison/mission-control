"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon | string // Can be a Lucide icon or emoji
  title: string
  description: string
  actionLabel: string
  onAction: () => void
  illustration?: React.ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  illustration
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98] }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 p-8"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-radial from-[hsl(var(--command-accent))]/5 via-transparent to-transparent opacity-50 pointer-events-none" />

      {/* Icon or Illustration */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative"
      >
        {illustration ? (
          illustration
        ) : typeof Icon === "string" ? (
          <div className="text-8xl mb-4 opacity-80">
            {Icon}
          </div>
        ) : (
          <div className="glass-morphism p-6 rounded-2xl">
            <Icon className="h-12 w-12 text-[hsl(var(--command-accent))]" />
          </div>
        )}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="space-y-4 max-w-md"
      >
        <h3 className="text-2xl font-bold text-[hsl(var(--command-text))]">
          {title}
        </h3>
        <p className="text-[hsl(var(--command-text-muted))] text-base leading-relaxed">
          {description}
        </p>
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <Button
          onClick={onAction}
          className="btn-premium font-semibold px-8 py-3 text-base"
          size="lg"
        >
          {actionLabel}
        </Button>
      </motion.div>

      {/* Subtle animation elements */}
      <div className="absolute top-20 left-1/4 w-2 h-2 bg-[hsl(var(--command-accent))]/30 rounded-full animate-pulse"
           style={{ animationDelay: "0s", animationDuration: "3s" }} />
      <div className="absolute bottom-32 right-1/3 w-1.5 h-1.5 bg-[hsl(var(--command-accent))]/20 rounded-full animate-pulse"
           style={{ animationDelay: "1.5s", animationDuration: "3s" }} />
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-[hsl(var(--command-accent))]/40 rounded-full animate-pulse"
           style={{ animationDelay: "0.8s", animationDuration: "3s" }} />
    </motion.div>
  )
}