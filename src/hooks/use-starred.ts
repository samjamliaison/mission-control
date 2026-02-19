import { useState, useEffect } from 'react'

export interface StarredItem {
  id: string
  type: 'task' | 'content' | 'memory' | 'pipeline' | 'agent'
  title: string
  url?: string
  timestamp: number
}

export function useStarred() {
  const [starredItems, setStarredItems] = useState<StarredItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('mission-control-starred')
    if (saved) {
      try {
        setStarredItems(JSON.parse(saved))
      } catch {
        // Invalid data, start fresh
        setStarredItems([])
      }
    }
  }, [])

  const saveToStorage = (items: StarredItem[]) => {
    localStorage.setItem('mission-control-starred', JSON.stringify(items))
    setStarredItems(items)
  }

  const toggleStar = (item: Omit<StarredItem, 'timestamp'>) => {
    const exists = starredItems.find(s => s.id === item.id && s.type === item.type)
    if (exists) {
      // Remove from starred
      const updated = starredItems.filter(s => s.id !== item.id || s.type !== item.type)
      saveToStorage(updated)
    } else {
      // Add to starred
      const newItem: StarredItem = { ...item, timestamp: Date.now() }
      const updated = [newItem, ...starredItems]
      saveToStorage(updated)
    }
  }

  const isStarred = (id: string, type: string) => {
    return starredItems.some(s => s.id === id && s.type === type)
  }

  const clearAll = () => {
    saveToStorage([])
  }

  return {
    starredItems,
    toggleStar,
    isStarred,
    clearAll,
  }
}