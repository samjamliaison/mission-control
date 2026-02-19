"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  subLabel?: string
  subValue?: string | number
  className?: string
}

export function StatsCard({ 
  icon: Icon, 
  label, 
  value, 
  subLabel, 
  subValue, 
  className = "" 
}: StatsCardProps) {
  return (
    <motion.div 
      className={`backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden p-5 transition-all duration-200 ease-out hover:scale-[1.01] hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/10 ${className}`}
      whileHover={{ 
        boxShadow: "0 8px 32px rgba(6, 182, 212, 0.05)",
      }}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-[#22c55e]" />
          <span className="text-sm font-medium text-white/70">{label}</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-3xl font-display font-bold text-[#22c55e]">
            {value}
          </div>
          {subLabel && subValue && (
            <div className="text-xs text-white/50 space-y-1">
              <div>{subValue} {subLabel}</div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}