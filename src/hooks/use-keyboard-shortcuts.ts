"use client"

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { logActivity } from '@/lib/activity-logger'

export interface KeyboardShortcut {
  key: string | string[]
  description: string
  action: () => void
  category: 'navigation' | 'actions' | 'modals' | 'global'
  modifier?: 'ctrl' | 'cmd' | 'shift' | 'alt'
  sequence?: boolean // For multi-key sequences like 'g' then 't'
}

export function useKeyboardShortcuts() {
  const router = useRouter()
  const [showHelp, setShowHelp] = useState(false)
  const [pendingSequence, setPendingSequence] = useState<string | null>(null)
  const [sequenceTimeout, setSequenceTimeout] = useState<NodeJS.Timeout | null>(null)

  const navigateToPage = useCallback((path: string, pageName: string) => {
    router.push(path)
    logActivity({
      actionType: 'navigation',
      details: `Navigated to ${pageName} via keyboard shortcut`,
      agent: 'User',
      metadata: { path, method: 'keyboard' },
      importance: 'low',
      tags: ['navigation', 'keyboard', 'shortcut']
    })
  }, [router])

  const focusSearchInput = useCallback(() => {
    const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="search" i], input[placeholder*="Search" i]')
    const firstInput = searchInputs[0] as HTMLInputElement
    if (firstInput) {
      firstInput.focus()
      firstInput.select()
      logActivity({
        actionType: 'command_executed',
        details: 'Focused search input via keyboard shortcut',
        agent: 'User',
        metadata: { shortcut: '/' },
        importance: 'low',
        tags: ['search', 'keyboard', 'focus']
      })
    }
  }, [])

  const closeModals = useCallback(() => {
    // Close any open modals/dialogs
    const closeButtons = document.querySelectorAll('[data-radix-dialog-close], [role="dialog"] button[aria-label*="close" i]')
    const escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    })
    
    // Try to close via close buttons first
    if (closeButtons.length > 0) {
      ;(closeButtons[0] as HTMLElement).click()
    } else {
      // If no close buttons, dispatch escape event to document
      document.dispatchEvent(escapeEvent)
    }
    
    logActivity({
      actionType: 'command_executed',
      details: 'Closed modals via Escape key',
      agent: 'User',
      metadata: { shortcut: 'Escape' },
      importance: 'low',
      tags: ['modal', 'keyboard', 'close']
    })
  }, [])

  const showShortcutsHelp = useCallback(() => {
    setShowHelp(true)
    logActivity({
      actionType: 'command_executed',
      details: 'Opened keyboard shortcuts help',
      agent: 'User',
      metadata: { shortcut: '?' },
      importance: 'low',
      tags: ['help', 'keyboard', 'shortcuts']
    })
  }, [])

  const shortcuts: KeyboardShortcut[] = [
    // Global shortcuts
    {
      key: '?',
      description: 'Show keyboard shortcuts help',
      action: showShortcutsHelp,
      category: 'global'
    },
    {
      key: 'k',
      modifier: 'cmd',
      description: 'Open command palette',
      action: () => {
        const event = new KeyboardEvent('keydown', {
          key: 'k',
          metaKey: true,
          bubbles: true
        })
        document.dispatchEvent(event)
      },
      category: 'global'
    },
    {
      key: '/',
      description: 'Focus search input',
      action: focusSearchInput,
      category: 'actions'
    },
    {
      key: 'Escape',
      description: 'Close modals and dialogs',
      action: closeModals,
      category: 'modals'
    },
    {
      key: 'n',
      description: 'Create new task',
      action: () => {
        // This will be handled by existing task board logic
        const event = new KeyboardEvent('keydown', {
          key: 'n',
          bubbles: true
        })
        document.dispatchEvent(event)
      },
      category: 'actions'
    },
    // Direct navigation shortcuts
    {
      key: '1',
      description: 'Go to Dashboard',
      action: () => navigateToPage('/', 'Dashboard'),
      category: 'navigation'
    },
    {
      key: '2',
      description: 'Go to Tasks',
      action: () => navigateToPage('/tasks', 'Tasks'),
      category: 'navigation'
    },
    {
      key: '3',
      description: 'Go to Pipeline',
      action: () => navigateToPage('/pipeline', 'Pipeline'),
      category: 'navigation'
    },
    {
      key: '4',
      description: 'Go to Calendar',
      action: () => navigateToPage('/calendar', 'Calendar'),
      category: 'navigation'
    },
    {
      key: '5',
      description: 'Go to Memory',
      action: () => navigateToPage('/memory', 'Memory'),
      category: 'navigation'
    },
    {
      key: '6',
      description: 'Go to Activity',
      action: () => navigateToPage('/activity', 'Activity'),
      category: 'navigation'
    },
    {
      key: '7',
      description: 'Go to Team',
      action: () => navigateToPage('/team', 'Team'),
      category: 'navigation'
    },
    {
      key: '8',
      description: 'Go to Office',
      action: () => navigateToPage('/office', 'Office'),
      category: 'navigation'
    },
    {
      key: '0',
      description: 'Go to Settings',
      action: () => navigateToPage('/settings', 'Settings'),
      category: 'navigation'
    },
    // Sequential shortcuts (G then X)
    {
      key: ['g', 'd'],
      sequence: true,
      description: 'Go to Dashboard',
      action: () => navigateToPage('/', 'Dashboard'),
      category: 'navigation'
    },
    {
      key: ['g', 't'],
      sequence: true,
      description: 'Go to Tasks',
      action: () => navigateToPage('/tasks', 'Tasks'),
      category: 'navigation'
    },
    {
      key: ['g', 'p'],
      sequence: true,
      description: 'Go to Pipeline',
      action: () => navigateToPage('/pipeline', 'Pipeline'),
      category: 'navigation'
    },
    {
      key: ['g', 'c'],
      sequence: true,
      description: 'Go to Calendar',
      action: () => navigateToPage('/calendar', 'Calendar'),
      category: 'navigation'
    },
    {
      key: ['g', 'm'],
      sequence: true,
      description: 'Go to Memory',
      action: () => navigateToPage('/memory', 'Memory'),
      category: 'navigation'
    },
    {
      key: ['g', 'a'],
      sequence: true,
      description: 'Go to Activity',
      action: () => navigateToPage('/activity', 'Activity'),
      category: 'navigation'
    },
    {
      key: ['g', 'e'],
      sequence: true,
      description: 'Go to Team',
      action: () => navigateToPage('/team', 'Team'),
      category: 'navigation'
    },
    {
      key: ['g', 'o'],
      sequence: true,
      description: 'Go to Office',
      action: () => navigateToPage('/office', 'Office'),
      category: 'navigation'
    },
    {
      key: ['g', 's'],
      sequence: true,
      description: 'Go to Settings',
      action: () => navigateToPage('/settings', 'Settings'),
      category: 'navigation'
    }
  ]

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't handle shortcuts when typing in inputs
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement ||
      (event.target as HTMLElement)?.contentEditable === 'true'
    ) {
      // Exception: allow Escape to work in inputs
      if (event.key !== 'Escape') {
        return
      }
    }

    const key = event.key.toLowerCase()
    const isCmd = event.metaKey || event.ctrlKey
    const isShift = event.shiftKey
    const isAlt = event.altKey

    // Handle pending sequences
    if (pendingSequence) {
      // Clear timeout
      if (sequenceTimeout) {
        clearTimeout(sequenceTimeout)
      }

      // Find matching sequence
      const sequenceShortcut = shortcuts.find(s => 
        s.sequence && 
        Array.isArray(s.key) && 
        s.key[0] === pendingSequence && 
        s.key[1] === key
      )

      if (sequenceShortcut) {
        event.preventDefault()
        sequenceShortcut.action()
        setPendingSequence(null)
        return
      }

      // No match found, clear sequence
      setPendingSequence(null)
    }

    // Check for sequence starters (like 'g')
    if (key === 'g' && !isCmd && !isShift && !isAlt) {
      event.preventDefault()
      setPendingSequence('g')
      
      // Clear sequence after 2 seconds
      const timeout = setTimeout(() => {
        setPendingSequence(null)
      }, 2000)
      setSequenceTimeout(timeout)
      return
    }

    // Check for single-key shortcuts
    for (const shortcut of shortcuts) {
      if (shortcut.sequence) continue // Skip sequence shortcuts

      const shortcutKey = Array.isArray(shortcut.key) ? shortcut.key[0] : shortcut.key
      
      // Check key match
      if (shortcutKey !== key) continue

      // Check modifiers
      const needsCmd = shortcut.modifier === 'cmd' || shortcut.modifier === 'ctrl'
      const needsShift = shortcut.modifier === 'shift'
      const needsAlt = shortcut.modifier === 'alt'

      if (needsCmd && !isCmd) continue
      if (needsShift && !isShift) continue
      if (needsAlt && !isAlt) continue
      if (!needsCmd && isCmd && key !== 'k') continue // Allow Cmd+K for command palette
      if (!needsShift && isShift) continue
      if (!needsAlt && isAlt) continue

      // Execute shortcut
      event.preventDefault()
      shortcut.action()
      break
    }
  }, [shortcuts, pendingSequence, sequenceTimeout, navigateToPage, focusSearchInput, closeModals, showShortcutsHelp])

  // Set up keyboard event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (sequenceTimeout) {
        clearTimeout(sequenceTimeout)
      }
    }
  }, [handleKeyDown, sequenceTimeout])

  return {
    shortcuts,
    showHelp,
    setShowHelp,
    pendingSequence
  }
}