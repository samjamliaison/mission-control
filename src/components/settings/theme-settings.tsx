"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/lib/theme-context"
import { logActivity } from "@/lib/activity-logger"
import { Palette, Monitor, Moon, Terminal, CheckCircle, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0.0, 0.2, 1] as any
    }
  }
}

const themeIcons = {
  dark: Monitor,
  midnight: Moon,
  terminal: Terminal
}

export function ThemeSettings() {
  const { theme, setTheme, themes } = useTheme()
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleThemeChange = (newTheme: typeof theme) => {
    if (newTheme === theme) return
    
    const previousTheme = theme
    const newThemeName = themes.find(t => t.id === newTheme)?.name || newTheme
    const previousThemeName = themes.find(t => t.id === previousTheme)?.name || previousTheme
    
    setIsTransitioning(true)
    
    // Log the theme change activity
    logActivity({
      actionType: 'settings_changed',
      details: `Changed theme from ${previousThemeName} to ${newThemeName}`,
      agent: 'User',
      metadata: {
        previousTheme,
        newTheme,
        category: 'appearance'
      },
      importance: 'low',
      tags: ['theme', 'settings', 'ui']
    })
    
    // Add transition overlay
    const overlay = document.createElement('div')
    overlay.className = 'theme-transition-overlay active'
    document.body.appendChild(overlay)
    
    // Change theme after short delay
    setTimeout(() => {
      setTheme(newTheme)
    }, 150)
    
    // Remove overlay after transition
    setTimeout(() => {
      document.body.removeChild(overlay)
      setIsTransitioning(false)
    }, 450)
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 glass-morphism rounded-lg">
                <Palette className="h-5 w-5 text-[hsl(var(--command-accent))]" />
              </div>
              <div>
                <h3 className="font-display font-bold">Visual Theme</h3>
                <p className="text-sm text-[hsl(var(--command-text-muted))] font-normal">
                  Customize your command center's appearance
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Theme Status */}
            <div className="flex items-center justify-between p-4 glass-morphism rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[hsl(var(--command-accent))]/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-[hsl(var(--command-accent))]" />
                </div>
                <div>
                  <div className="font-semibold">
                    {themes.find(t => t.id === theme)?.name}
                  </div>
                  <div className="text-sm text-[hsl(var(--command-text-muted))]">
                    Currently active theme
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="bg-[hsl(var(--command-accent))]/10 text-[hsl(var(--command-accent))]">
                Active
              </Badge>
            </div>

            {/* Theme Selection Grid */}
            <div className="space-y-4">
              <h4 className="font-semibold text-[hsl(var(--command-text))]">
                Available Themes
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {themes.map((themeOption) => {
                  const Icon = themeIcons[themeOption.id]
                  const isActive = theme === themeOption.id
                  
                  return (
                    <motion.div
                      key={themeOption.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "relative group cursor-pointer",
                        isTransitioning && "pointer-events-none"
                      )}
                      onClick={() => handleThemeChange(themeOption.id)}
                    >
                      <Card
                        className={cn(
                          "glass-morphism border-2 transition-all duration-300",
                          isActive
                            ? "border-[hsl(var(--command-accent))]/40 bg-[hsl(var(--command-accent))]/5"
                            : "border-[hsl(var(--command-border))] hover:border-[hsl(var(--command-border-bright))]"
                        )}
                        style={{
                          boxShadow: isActive
                            ? `0 0 20px hsl(var(--command-accent) / 0.2)`
                            : undefined
                        }}
                      >
                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            className="absolute -top-2 -right-2 p-1 bg-[hsl(var(--command-accent))] rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <CheckCircle className="h-4 w-4 text-white" />
                          </motion.div>
                        )}
                        
                        <CardContent className="p-6">
                          <div className="text-center space-y-4">
                            {/* Theme Preview */}
                            <div 
                              className="w-full h-16 rounded-lg border-2 border-dashed border-[hsl(var(--command-border))] relative overflow-hidden"
                              style={{
                                background: `linear-gradient(135deg, ${themeOption.preview.background} 0%, ${themeOption.preview.primary} 100%)`
                              }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex gap-1">
                                  <div 
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: themeOption.preview.accent }}
                                  />
                                  <div 
                                    className="w-2 h-2 rounded-full mt-0.5"
                                    style={{ backgroundColor: `${themeOption.preview.accent}80` }}
                                  />
                                  <div 
                                    className="w-1 h-1 rounded-full mt-1"
                                    style={{ backgroundColor: `${themeOption.preview.accent}60` }}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {/* Theme Icon */}
                            <div className="flex justify-center">
                              <div className="p-3 glass-morphism rounded-xl">
                                <Icon 
                                  className="h-6 w-6"
                                  style={{
                                    color: isActive 
                                      ? 'hsl(var(--command-accent))' 
                                      : 'hsl(var(--command-text-muted))'
                                  }}
                                />
                              </div>
                            </div>
                            
                            {/* Theme Info */}
                            <div>
                              <h5 className="font-semibold text-[hsl(var(--command-text))]">
                                {themeOption.name}
                              </h5>
                              <p className="text-sm text-[hsl(var(--command-text-muted))] mt-1">
                                {themeOption.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Theme Info */}
            <div className="p-4 bg-[hsl(var(--command-accent))]/5 border border-[hsl(var(--command-accent))]/20 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-[hsl(var(--command-accent))]/20 rounded">
                  <Circle className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-[hsl(var(--command-text))]">
                    Theme Preferences
                  </p>
                  <p className="text-[hsl(var(--command-text-muted))] mt-1">
                    Your theme preference is automatically saved and will persist across browser sessions. 
                    Theme changes apply instantly with smooth transitions.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleThemeChange('dark')}
                disabled={theme === 'dark' || isTransitioning}
                className={cn(
                  theme === 'dark' && "bg-[hsl(var(--command-accent))]/10 text-[hsl(var(--command-accent))] border-[hsl(var(--command-accent))]/20"
                )}
              >
                <Monitor className="h-4 w-4 mr-2" />
                Dark
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleThemeChange('midnight')}
                disabled={theme === 'midnight' || isTransitioning}
                className={cn(
                  theme === 'midnight' && "bg-[hsl(var(--command-accent))]/10 text-[hsl(var(--command-accent))] border-[hsl(var(--command-accent))]/20"
                )}
              >
                <Moon className="h-4 w-4 mr-2" />
                Midnight
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleThemeChange('terminal')}
                disabled={theme === 'terminal' || isTransitioning}
                className={cn(
                  theme === 'terminal' && "bg-[hsl(var(--command-accent))]/10 text-[hsl(var(--command-accent))] border-[hsl(var(--command-accent))]/20"
                )}
              >
                <Terminal className="h-4 w-4 mr-2" />
                Terminal
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}