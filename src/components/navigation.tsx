"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Command, CheckSquare, Film, Calendar, Brain, Users, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    name: "Tasks",
    href: "/",
    icon: CheckSquare,
    description: "Mission Control"
  },
  {
    name: "Pipeline",
    href: "/pipeline",
    icon: Film,
    description: "Content Creation"
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: Calendar,
    description: "Schedule View"
  },
  {
    name: "Memory",
    href: "/memory",
    icon: Brain,
    description: "Knowledge Base"
  },
  {
    name: "Team",
    href: "/team",
    icon: Users,
    description: "Agent Status"
  },
  {
    name: "Office",
    href: "/office",
    icon: Monitor,
    description: "Virtual HQ"
  }
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-7xl mx-auto">
        <motion.nav 
          className="glass-morphism rounded-2xl p-4 border border-[hsl(var(--command-border-bright))]"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-2 rounded-lg glass-morphism">
                <Command className="h-5 w-5 text-[hsl(var(--command-accent))]" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg bg-gradient-to-r from-[hsl(var(--command-text))] to-[hsl(var(--command-accent))] bg-clip-text text-transparent">
                  Mission Control
                </h1>
                <p className="text-xs text-[hsl(var(--command-text-muted))]">OpenClaw Command Center</p>
              </div>
            </motion.div>

            {/* Navigation Links */}
            <div className="flex items-center gap-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                const IconComponent = item.icon
                
                return (
                  <motion.div
                    key={item.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "relative px-4 py-2 rounded-xl transition-all duration-300 group",
                        "flex items-center gap-2 text-sm font-medium",
                        isActive 
                          ? "glass-morphism text-[hsl(var(--command-accent))] shadow-lg" 
                          : "text-[hsl(var(--command-text-muted))] hover:text-[hsl(var(--command-text))] hover:bg-[hsl(var(--command-surface))]/50"
                      )}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-[hsl(var(--command-accent))]/10 to-transparent border border-[hsl(var(--command-accent))]/20"
                          layoutId="activeTab"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      
                      <div className="relative flex items-center gap-2">
                        <IconComponent className={cn(
                          "h-4 w-4 transition-colors",
                          isActive ? "text-[hsl(var(--command-accent))]" : "text-current"
                        )} />
                        <span className="hidden lg:inline">{item.name}</span>
                        
                        {/* Hover tooltip for mobile */}
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none lg:hidden">
                          <div className="glass-morphism px-2 py-1 rounded text-xs whitespace-nowrap">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* Status Indicator */}
            <motion.div 
              className="flex items-center gap-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <div className="w-2 h-2 bg-[hsl(var(--command-success))] rounded-full animate-pulse" />
              <span className="text-xs text-[hsl(var(--command-text-muted))] font-medium">Online</span>
            </motion.div>
          </div>
        </motion.nav>
      </div>
    </div>
  )
}