"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'dark' | 'midnight' | 'terminal'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  themes: readonly {
    id: Theme
    name: string
    description: string
    preview: {
      primary: string
      background: string
      accent: string
    }
  }[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const themes = [
  {
    id: 'dark' as Theme,
    name: 'Dark Command',
    description: 'Professional dark theme with blue accents',
    preview: {
      primary: '#1e1e2e',
      background: '#0a0a0f',
      accent: '#06b6d4'
    }
  },
  {
    id: 'midnight' as Theme,
    name: 'Midnight Black',
    description: 'Deeper black theme for focused work',
    preview: {
      primary: '#000000',
      background: '#050505',
      accent: '#8b5cf6'
    }
  },
  {
    id: 'terminal' as Theme,
    name: 'Matrix Terminal',
    description: 'Green-on-black hacker aesthetic',
    preview: {
      primary: '#001100',
      background: '#000000',
      accent: '#00ff00'
    }
  }
] as const

const THEME_STORAGE_KEY = 'mission-control-theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme
    if (saved && themes.find(t => t.id === saved)) {
      setThemeState(saved)
    }
  }, [])

  // Apply theme to document and save to localStorage
  useEffect(() => {
    if (!mounted) return

    // Remove all theme classes
    document.documentElement.classList.remove('theme-dark', 'theme-midnight', 'theme-terminal')
    
    // Add current theme class
    document.documentElement.classList.add(`theme-${theme}`)
    
    // Save to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme)
    
    // Apply theme-specific CSS variables
    applyThemeVariables(theme)
    
    // Dispatch theme change event for other components
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme, themeName: themes.find(t => t.id === theme)?.name }
    }))
  }, [theme, mounted])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const value = {
    theme,
    setTheme,
    themes
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

function applyThemeVariables(theme: Theme) {
  const root = document.documentElement
  
  // Base theme variables
  const themeVars = {
    dark: {
      // Background colors
      '--command-background': '220 13% 4%',          // #0a0a0f
      '--command-surface': '220 13% 8%',             // #16161f  
      '--command-surface-elevated': '220 13% 12%',   // #1e1e2e
      '--command-surface-overlay': '220 13% 16%',    // #27273a
      
      // Border colors
      '--command-border': '220 13% 18%',             // #2d2d40
      '--command-border-bright': '220 13% 25%',      // #3e3e5c
      
      // Text colors
      '--command-text': '210 40% 98%',               // #f8fafc
      '--command-text-muted': '215 25% 65%',         // #94a3b8
      '--command-text-dim': '215 20% 45%',           // #64748b
      
      // Accent colors
      '--command-accent': '199 89% 48%',             // #06b6d4
      '--command-success': '142 71% 45%',            // #22c55e
      '--command-warning': '38 92% 50%',             // #f59e0b
      '--command-danger': '0 84% 60%',               // #ef4444
      
      // Glass morphism
      '--command-glass-bg': 'rgba(255, 255, 255, 0.03)',
      '--command-glass-border': 'rgba(255, 255, 255, 0.06)',
    },
    
    midnight: {
      // Background colors - Pure blacks
      '--command-background': '0 0% 2%',            // #050505
      '--command-surface': '0 0% 4%',               // #0a0a0a
      '--command-surface-elevated': '0 0% 8%',      // #141414
      '--command-surface-overlay': '0 0% 12%',      // #1f1f1f
      
      // Border colors - Subtle grays
      '--command-border': '0 0% 16%',               // #292929
      '--command-border-bright': '0 0% 22%',        // #383838
      
      // Text colors - Cool whites
      '--command-text': '0 0% 98%',                 // #fafafa
      '--command-text-muted': '0 0% 70%',           // #b3b3b3
      '--command-text-dim': '0 0% 50%',             // #808080
      
      // Accent colors - Purple theme
      '--command-accent': '262 83% 58%',            // #8b5cf6
      '--command-success': '134 61% 41%',           // #16a34a
      '--command-warning': '32 95% 44%',            // #ea580c
      '--command-danger': '0 91% 71%',              // #f87171
      
      // Glass morphism - Darker
      '--command-glass-bg': 'rgba(255, 255, 255, 0.02)',
      '--command-glass-border': 'rgba(255, 255, 255, 0.04)',
    },
    
    terminal: {
      // Background colors - Matrix style
      '--command-background': '120 100% 2%',        // #000a00 
      '--command-surface': '120 100% 4%',           // #001400
      '--command-surface-elevated': '120 50% 8%',   // #0a1f0a
      '--command-surface-overlay': '120 40% 12%',   // #0f290f
      
      // Border colors - Green tints
      '--command-border': '120 30% 15%',            // #1a3d1a
      '--command-border-bright': '120 25% 20%',     // #266626
      
      // Text colors - Matrix green
      '--command-text': '120 100% 80%',             // #66ff66
      '--command-text-muted': '120 80% 60%',        // #4dcc4d
      '--command-text-dim': '120 60% 40%',          // #339933
      
      // Accent colors - Bright green theme
      '--command-accent': '120 100% 50%',           // #00ff00
      '--command-success': '120 100% 40%',          // #00cc00
      '--command-warning': '60 100% 50%',           // #ffff00
      '--command-danger': '0 100% 50%',             // #ff0000
      
      // Glass morphism - Green tinted
      '--command-glass-bg': 'rgba(0, 255, 0, 0.02)',
      '--command-glass-border': 'rgba(0, 255, 0, 0.04)',
    }
  }
  
  const vars = themeVars[theme]
  
  // Apply all CSS custom properties
  Object.entries(vars).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })
  
  // Add theme-specific body classes for additional styling
  document.body.className = document.body.className.replace(/theme-\w+/g, '')
  document.body.classList.add(`theme-${theme}`)
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}