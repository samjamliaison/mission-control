"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"
import { ParallaxHeader } from "./parallax-header"

interface PageHeaderProps {
  icon: LucideIcon
  title: string
  subtitle: string
  children?: ReactNode
  className?: string
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.04, 0.62, 0.23, 0.98] as any
    }
  }
}

export function PageHeader({ icon: Icon, title, subtitle, children, className = "" }: PageHeaderProps) {
  const backgroundElement = (
    <div className="absolute inset-0 opacity-20">
      <div className="h-full w-full bg-gradient-to-br from-[#06b6d4]/10 via-transparent to-purple-500/5 rounded-2xl" />
      <div className="absolute top-0 left-1/4 w-64 h-32 bg-[#06b6d4]/5 rounded-full blur-3xl" />
    </div>
  )

  return (
    <ParallaxHeader 
      className={`space-y-6 mb-8 ${className}`}
      parallaxStrength={0.2}
      backgroundElement={backgroundElement}
    >
      <motion.div variants={itemVariants}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-xl backdrop-blur-xl bg-white/[0.03] border border-white/[0.06]">
                <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-[#06b6d4]" />
              </div>
              <h1 className="text-xl sm:text-display font-semibold bg-gradient-to-br from-white/90 via-[#06b6d4] to-white/70 bg-clip-text text-transparent">
                {title}
              </h1>
            </div>
            <p className="text-secondary text-body sm:text-body-large max-w-2xl sm:pl-[4.75rem]">
              {subtitle}
            </p>
          </div>
          
          {/* Stats Card */}
          {children && (
            <div className="flex items-center gap-4">
              {children}
            </div>
          )}
        </div>
      </motion.div>
    </ParallaxHeader>
  )
}