"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Terminal } from "lucide-react"

const themes = [
  { name: 'dark', icon: Moon, label: 'Dark' },
  { name: 'midnight', icon: Terminal, label: 'Midnight' },
  { name: 'terminal', icon: Sun, label: 'Terminal' }
] as const

type ThemeName = typeof themes[number]['name']

export function ThemeToggle() {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('dark')
  
  // Load theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mission-control-theme') as ThemeName
    if (saved && themes.some(t => t.name === saved)) {
      setCurrentTheme(saved)
      applyTheme(saved)
    } else {
      applyTheme('dark')
    }
  }, [])
  
  const applyTheme = (theme: ThemeName) => {
    const root = document.documentElement
    
    // Remove all theme classes
    root.classList.remove('theme-dark', 'theme-midnight', 'theme-terminal')
    
    // Apply new theme class
    root.classList.add(`theme-${theme}`)
    
    // Set CSS custom properties based on theme
    switch (theme) {
      case 'dark':
        root.style.setProperty('--command-background', '217 17% 7%')
        root.style.setProperty('--command-surface', '217 19% 12%')
        root.style.setProperty('--command-border', '217 32% 17%')
        root.style.setProperty('--command-border-bright', '217 32% 22%')
        root.style.setProperty('--command-text', '217 11% 95%')
        root.style.setProperty('--command-text-muted', '217 11% 65%')
        root.style.setProperty('--command-accent', '199 89% 48%')
        break
        
      case 'midnight':
        root.style.setProperty('--command-background', '240 10% 3.9%')
        root.style.setProperty('--command-surface', '240 5.2% 6%')
        root.style.setProperty('--command-border', '240 5.9% 10%')
        root.style.setProperty('--command-border-bright', '240 5.9% 15%')
        root.style.setProperty('--command-text', '0 0% 95%')
        root.style.setProperty('--command-text-muted', '240 5% 65%')
        root.style.setProperty('--command-accent', '271 91% 65%')
        break
        
      case 'terminal':
        root.style.setProperty('--command-background', '120 100% 2%')
        root.style.setProperty('--command-surface', '120 20% 8%')
        root.style.setProperty('--command-border', '120 20% 15%')
        root.style.setProperty('--command-border-bright', '120 20% 20%')
        root.style.setProperty('--command-text', '120 100% 85%')
        root.style.setProperty('--command-text-muted', '120 20% 65%')
        root.style.setProperty('--command-accent', '120 100% 50%')
        break
    }
    
    // Save to localStorage
    localStorage.setItem('mission-control-theme', theme)
  }
  
  const cycleTheme = () => {
    const currentIndex = themes.findIndex(t => t.name === currentTheme)
    const nextIndex = (currentIndex + 1) % themes.length
    const nextTheme = themes[nextIndex].name
    
    setCurrentTheme(nextTheme)
    applyTheme(nextTheme)
  }
  
  const currentThemeConfig = themes.find(t => t.name === currentTheme) || themes[0]
  const IconComponent = currentThemeConfig.icon
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="glass-morphism hover:bg-[hsl(var(--command-surface))]/60 group relative"
      aria-label={`Switch theme (current: ${currentThemeConfig.label})`}
    >
      <motion.div
        key={currentTheme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center"
      >
        <IconComponent className="h-4 w-4" />
      </motion.div>
      
      {/* Tooltip */}
      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {currentThemeConfig.label} theme
        </div>
      </div>
    </Button>
  )
}