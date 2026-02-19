"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Command, CheckSquare, Film, Calendar, Brain, Users, Building, ChevronLeft, ChevronRight, Settings, Activity, Keyboard, Bell, BarChart3 } from "lucide-react"
import { CommandHint } from "@/components/command-palette/command-hint"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Command,
    emoji: "⚡",
    description: "Mission Control"
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
    emoji: "✅",
    description: "Task Management"
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
    name: "Activity",
    href: "/activity",
    icon: Activity,
    emoji: "📊",
    description: "Audit Trail"
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    emoji: "📈",
    description: "Performance Insights"
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: Bell,
    emoji: "🔔",
    description: "Alerts & Updates",
    showBadge: true
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
  const [unreadCount, setUnreadCount] = useState(0)
  const pathname = usePathname()

  // Auto-collapse on mobile
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768
      setIsCollapsed(isMobile)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Check for unread notifications
  useEffect(() => {
    const updateUnreadCount = () => {
      try {
        const stored = localStorage.getItem('mission-control-notifications')
        if (stored) {
          const notifications = JSON.parse(stored)
          const unread = notifications.filter((n: any) => !n.read).length
          setUnreadCount(unread)
        }
      } catch (error) {
        console.error('Failed to parse notifications for badge:', error)
      }
    }

    // Initial count
    updateUnreadCount()

    // Listen for localStorage changes
    const interval = setInterval(updateUnreadCount, 5000) // Check every 5 seconds
    window.addEventListener('storage', updateUnreadCount)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('storage', updateUnreadCount)
    }
  }, [])

  return (
    <motion.aside
      className="relative h-screen z-50"
      initial={{ x: -20, opacity: 0 }}
      animate={{ 
        x: 0, 
        opacity: 1,
        width: isCollapsed ? "64px" : "240px"
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="h-full p-4">
        <motion.nav 
          className="h-full backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 flex flex-col"
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
                  <div className="p-2 rounded-lg backdrop-blur-xl bg-white/[0.03] border border-white/[0.06]">
                    <Command className="h-5 w-5 text-[#06b6d4]" />
                  </div>
                  <div>
                    <h1 className="font-semibold text-heading-3 text-premium">
                      Mission Control
                    </h1>
                    <p className="text-body-small text-secondary">OpenClaw Command Center</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Collapse Button */}
            <motion.button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:backdrop-blur-xl hover:bg-white/[0.03] hover:border hover:border-white/[0.06] transition-all duration-200 text-white/50 hover:text-[#06b6d4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] focus-visible:ring-opacity-60"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
              aria-expanded={!isCollapsed}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </motion.button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-3" role="navigation" aria-label="Main navigation">
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
                      "relative w-full py-3 px-4 rounded-xl transition-all duration-200 group flex items-center interactive-element focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] focus-visible:ring-opacity-60",
                      // Ensure minimum 44px touch target on mobile
                      "min-h-[44px]",
                      isCollapsed ? "justify-center" : "gap-3",
                      isActive 
                        ? "text-[#06b6d4] bg-white/[0.05] border-white/[0.08]" 
                        : "text-white/50 hover:text-white/90 hover:bg-white/[0.03]"
                    )}
                    aria-label={`Navigate to ${item.name} - ${item.description}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {/* Active indicator - Cyan left bar */}
                    {isActive && (
                      <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#06b6d4] rounded-r-full"
                        layoutId="activeIndicator"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    
                    <div className="flex items-center gap-3 relative z-10">
                      {/* Icon */}
                      <div className="relative">
                        <IconComponent className={cn(
                          "h-5 w-5 transition-colors",
                          isActive ? "text-[#06b6d4]" : "text-current"
                        )} />
                        {/* Notification Badge */}
                        {item.showBadge && unreadCount > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                          >
                            <span className="text-xs font-bold text-white leading-none">
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                          </motion.div>
                        )}
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
                            <span className="font-semibold text-body whitespace-nowrap">
                              {item.name}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] px-3 py-2 rounded-lg shadow-lg">
                            <div className="text-body font-semibold text-white/90">{item.name}</div>
                            <div className="text-body-small text-secondary">{item.description}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Bottom Section - Command Palette, System Status & Settings */}
          <div className="space-y-3 pt-4 border-t border-white/[0.06]">
            {/* Command Palette Hint */}
            {!isCollapsed && (
              <CommandHint 
                onClick={() => {
                  // This will be handled by the global keyboard listener
                  const event = new KeyboardEvent('keydown', {
                    key: 'k',
                    metaKey: true,
                    bubbles: true
                  })
                  document.dispatchEvent(event)
                }}
              />
            )}
            {/* System Status */}
            <motion.div 
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl backdrop-blur-xl bg-white/[0.02] border border-white/[0.04]",
                isCollapsed && "justify-center"
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
                <Activity className="h-4 w-4 text-white/40" />
              </div>
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 overflow-hidden"
                  >
                    <div className="text-body-small font-semibold text-white/70">System Online</div>
                    <div className="text-body-small text-muted">All services active</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Settings Link */}
            <Link
              href="/settings"
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] focus-visible:ring-opacity-60",
                isCollapsed && "justify-center",
                pathname === "/settings"
                  ? "text-[#06b6d4] bg-white/[0.05] border-white/[0.08]"
                  : "text-white/50 hover:text-white/90 hover:bg-white/[0.03]"
              )}
              aria-label="Open settings and configuration"
              aria-current={pathname === "/settings" ? "page" : undefined}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 w-full"
              >
                <Settings className="h-4 w-4" />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-body font-semibold whitespace-nowrap overflow-hidden"
                    >
                      Settings
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            {/* Keyboard Shortcuts Hint */}
            <motion.button 
              className={cn(
                "w-full flex items-center gap-3 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] cursor-pointer group transition-all duration-200 hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] focus-visible:ring-opacity-60",
                isCollapsed && "justify-center"
              )}
              onClick={() => {
                // Dispatch '?' key event to show shortcuts help
                const event = new KeyboardEvent('keydown', {
                  key: '?',
                  bubbles: true
                })
                document.dispatchEvent(event)
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
              aria-label="Show keyboard shortcuts help"
            >
              <div className="flex items-center gap-2">
                <Keyboard className="h-3 w-3 text-white/40 group-hover:text-[#06b6d4] transition-colors" />
                <div className="w-4 h-4 bg-white/10 rounded border border-white/20 flex items-center justify-center text-xs font-mono text-white/60 group-hover:text-[#06b6d4] group-hover:border-[#06b6d4]/40 transition-colors">
                  ?
                </div>
              </div>
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 overflow-hidden"
                  >
                    <div className="text-body-small font-semibold text-white/70 group-hover:text-[#06b6d4] transition-colors">
                      Shortcuts
                    </div>
                    <div className="text-body-small text-muted">Press ? for help</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.nav>
      </div>
    </motion.aside>
  )
}