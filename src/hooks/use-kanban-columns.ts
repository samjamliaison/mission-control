import { useState, useEffect } from 'react'

export interface KanbanColumn {
  id: string
  title: string
  color: string
  position: number
}

const defaultColumns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', color: '#6b7280', position: 0 },
  { id: 'in-progress', title: 'In Progress', color: '#f59e0b', position: 1 },
  { id: 'done', title: 'Done', color: '#22c55e', position: 2 }
]

export function useKanbanColumns() {
  const [columns, setColumns] = useState<KanbanColumn[]>(defaultColumns)

  useEffect(() => {
    const saved = localStorage.getItem('mission-control-kanban-columns')
    if (saved) {
      try {
        const savedColumns = JSON.parse(saved)
        // Validate structure
        if (Array.isArray(savedColumns) && savedColumns.length > 0) {
          setColumns(savedColumns.sort((a, b) => a.position - b.position))
        }
      } catch {
        // Invalid data, use defaults
        setColumns(defaultColumns)
      }
    }
  }, [])

  const saveToStorage = (newColumns: KanbanColumn[]) => {
    localStorage.setItem('mission-control-kanban-columns', JSON.stringify(newColumns))
    setColumns(newColumns)
  }

  const updateColumn = (id: string, updates: Partial<KanbanColumn>) => {
    const updated = columns.map(col => 
      col.id === id ? { ...col, ...updates } : col
    )
    saveToStorage(updated)
  }

  const addColumn = (title: string, color: string) => {
    const newColumn: KanbanColumn = {
      id: `col-${Date.now()}`,
      title,
      color,
      position: columns.length
    }
    const updated = [...columns, newColumn]
    saveToStorage(updated)
  }

  const removeColumn = (id: string) => {
    // Don't allow removing all columns
    if (columns.length <= 1) return false
    
    const updated = columns
      .filter(col => col.id !== id)
      .map((col, index) => ({ ...col, position: index }))
    
    saveToStorage(updated)
    return true
  }

  const reorderColumns = (newOrder: KanbanColumn[]) => {
    const updated = newOrder.map((col, index) => ({ ...col, position: index }))
    saveToStorage(updated)
  }

  const resetToDefaults = () => {
    saveToStorage(defaultColumns)
  }

  return {
    columns,
    updateColumn,
    addColumn,
    removeColumn,
    reorderColumns,
    resetToDefaults
  }
}