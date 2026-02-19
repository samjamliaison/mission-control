"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface FocusModeContextValue {
  isFocusMode: boolean
  toggleFocusMode: () => void
  enterFocusMode: () => void
  exitFocusMode: () => void
}

const FocusModeContext = createContext<FocusModeContextValue | undefined>(undefined)

export function FocusModeProvider({ children }: { children: ReactNode }) {
  const [isFocusMode, setIsFocusMode] = useState(false)

  // Load focus mode state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('focus-mode')
      if (saved === 'true') {
        setIsFocusMode(true)
      }
    } catch (error) {
      console.error('Failed to load focus mode state:', error)
    }
  }, [])

  // Save focus mode state to localStorage
  const saveFocusMode = (enabled: boolean) => {
    try {
      localStorage.setItem('focus-mode', enabled.toString())
      setIsFocusMode(enabled)
    } catch (error) {
      console.error('Failed to save focus mode state:', error)
    }
  }

  const toggleFocusMode = () => {
    saveFocusMode(!isFocusMode)
  }

  const enterFocusMode = () => {
    saveFocusMode(true)
  }

  const exitFocusMode = () => {
    saveFocusMode(false)
  }

  // Handle keyboard shortcut (F key)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if F is pressed without modifiers and not in input fields
      if (
        event.key === 'f' &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        !event.altKey
      ) {
        const activeElement = document.activeElement
        const isInInputField = 
          activeElement instanceof HTMLInputElement ||
          activeElement instanceof HTMLTextAreaElement ||
          (activeElement instanceof HTMLElement && activeElement.isContentEditable)

        if (!isInInputField) {
          event.preventDefault()
          toggleFocusMode()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isFocusMode])

  const value: FocusModeContextValue = {
    isFocusMode,
    toggleFocusMode,
    enterFocusMode,
    exitFocusMode
  }

  return (
    <FocusModeContext.Provider value={value}>
      {children}
    </FocusModeContext.Provider>
  )
}

export function useFocusMode() {
  const context = useContext(FocusModeContext)
  if (context === undefined) {
    throw new Error('useFocusMode must be used within a FocusModeProvider')
  }
  return context
}