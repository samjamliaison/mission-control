"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Command, CheckSquare, Film, Calendar, Brain, Users, Building, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    name: "Tasks",
    href: "/",
    icon: CheckSquare,
    emoji: "✅",
    description: "Mission Control"
  },
  {
    name: "Pipeline",
    href: "/pipeline",
    icon: Film,
    emoji: "🎬",
    description: "Content Creation"
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: Calendar,
    emoji: "📅",
    description: "Schedule View"
  },
  {
    name: "Memory",
    href: "/memory",
    icon: Brain,
    emoji: "🧠",
    description: "Knowledge Base"
  },
  {
    name: "Team",
    href: "/team",
    icon: Users,
    emoji: "👥",
    description: "Agent Status"
  },
  {
    name: "Office",
    href: "/office",
    icon: Building,
    emoji: "🏢",
    description: "Virtual HQ"
  }
]

export function Navigation() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <motion.aside
      className="relative h-screen z-50"
      initial={{ x: -20, opacity: 0 }}
      animate={{ 
        x: 0, 
        opacity: 1,
        width: isCollapsed ? "80px" : "280px"
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="h-full p-4">
        <motion.nav 
          className="h-full glass-morphism-premium rounded-2xl p-4 border border-[hsl(var(--command-border-bright))] flex flex-col"
          layout
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-2 rounded-lg glass-morphism">
                    <Command className="h-5 w-5 text-[hsl(var(--command-accent))]" />
                  </div>
                  <div>
                    <h1 className="font-display font-bold text-lg text-premium">
                      Mission Control
                    </h1>
                    <p className="text-xs text-[hsl(var(--command-text-muted))]">OpenClaw Command Center</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Collapse Button */}
            <motion.button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:glass-morphism transition-all duration-200 text-[hsl(var(--command-text-muted))] hover:text-[hsl(var(--command-accent))]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </motion.button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 space-y-2">
            {navigationItems.map((item, index) => {
              const isActive = pathname === item.href
              const IconComponent = item.icon
              
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "relative w-full p-3 rounded-xl transition-all duration-300 group flex items-center",
                      isCollapsed ? "justify-center" : "gap-3",
                      isActive 
                        ? "glass-morphism text-[hsl(var(--command-accent))] shadow-lg" 
                        : "text-[hsl(var(--command-text-muted))] hover:text-[hsl(var(--command-text))] hover:glass-morphism"
                    )}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[hsl(var(--command-accent))] to-[hsl(199 89% 38%)] rounded-full"
                        layoutId="activeIndicator"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    <div className="flex items-center gap-3 relative">
                      {/* Icon with emoji overlay */}
                      <div className="relative">
                        <IconComponent className={cn(
                          "h-5 w-5 transition-colors",
                          isActive ? "text-[hsl(var(--command-accent))]" : "text-current"
                        )} />
                        <span className="absolute -top-1 -right-1 text-xs opacity-60">
                          {item.emoji}
                        </span>
                      </div>
                      
                      <AnimatePresence mode="wait">
                        {!isCollapsed && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <span className="font-medium text-sm whitespace-nowrap">
                              {item.name}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                          <div className="glass-morphism px-3 py-2 rounded-lg shadow-lg border border-[hsl(var(--command-border-bright))]">
                            <div className="text-sm font-medium text-[hsl(var(--command-text))]">{item.name}</div>
                            <div className="text-xs text-[hsl(var(--command-text-muted))]">{item.description}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* Status Footer */}
          <motion.div 
            className={cn(
              "flex items-center gap-3 mt-8 p-3 rounded-xl glass-morphism",
              isCollapsed && "justify-center"
            )}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            <div className="w-2 h-2 bg-[hsl(var(--command-success))] rounded-full animate-pulse status-pulse" />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs text-[hsl(var(--command-text-muted))] font-medium whitespace-nowrap overflow-hidden"
                >
                  System Online
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.nav>
      </div>
    </motion.aside>
  )
}