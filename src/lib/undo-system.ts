/**
 * Undo system for Mission Control
 * Tracks and reverses user actions
 */

import { Task } from "@/components/tasks/task-card"
import { ContentItem } from "@/types/content"

export interface UndoAction {
  id: string
  timestamp: number
  type: 'task' | 'content'
  action: 'create' | 'update' | 'delete' | 'status_change'
  description: string
  revertData: {
    // For task actions
    taskId?: string
    previousTask?: Task
    currentTask?: Task
    
    // For content actions
    contentId?: string
    previousContent?: ContentItem
    currentContent?: ContentItem
    
    // For bulk actions
    items?: Array<{ id: string, before: any, after: any }>
  }
}

class UndoSystemManager {
  private maxActions = 10
  private actions: UndoAction[] = []
  private storageKey = 'mission-control-undo-history'

  constructor() {
    this.loadHistory()
  }

  private loadHistory() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        this.actions = JSON.parse(stored)
      }
    } catch (error) {
      console.warn('Failed to load undo history:', error)
      this.actions = []
    }
  }

  private saveHistory() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.actions))
    } catch (error) {
      console.warn('Failed to save undo history:', error)
    }
  }

  addAction(action: Omit<UndoAction, 'id' | 'timestamp'>) {
    const undoAction: UndoAction = {
      ...action,
      id: `undo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    }

    this.actions.unshift(undoAction)
    
    // Keep only the last N actions
    if (this.actions.length > this.maxActions) {
      this.actions = this.actions.slice(0, this.maxActions)
    }

    this.saveHistory()
  }

  getLastAction(): UndoAction | null {
    return this.actions.length > 0 ? this.actions[0] : null
  }

  popLastAction(): UndoAction | null {
    const action = this.actions.shift()
    if (action) {
      this.saveHistory()
    }
    return action || null
  }

  canUndo(): boolean {
    return this.actions.length > 0
  }

  getActionCount(): number {
    return this.actions.length
  }

  clear() {
    this.actions = []
    this.saveHistory()
  }

  // Helper methods for specific action types
  addTaskCreate(task: Task) {
    this.addAction({
      type: 'task',
      action: 'create',
      description: `Created task: ${task.title}`,
      revertData: {
        taskId: task._id,
        currentTask: task
      }
    })
  }

  addTaskDelete(task: Task) {
    this.addAction({
      type: 'task',
      action: 'delete',
      description: `Deleted task: ${task.title}`,
      revertData: {
        taskId: task._id,
        previousTask: task
      }
    })
  }

  addTaskUpdate(previousTask: Task, currentTask: Task) {
    this.addAction({
      type: 'task',
      action: 'update',
      description: `Updated task: ${currentTask.title}`,
      revertData: {
        taskId: currentTask._id,
        previousTask,
        currentTask
      }
    })
  }

  addTaskStatusChange(previousTask: Task, currentTask: Task) {
    this.addAction({
      type: 'task',
      action: 'status_change',
      description: `Moved task "${currentTask.title}" from ${previousTask.status} to ${currentTask.status}`,
      revertData: {
        taskId: currentTask._id,
        previousTask,
        currentTask
      }
    })
  }

  addContentCreate(content: ContentItem) {
    this.addAction({
      type: 'content',
      action: 'create',
      description: `Created content: ${content.title}`,
      revertData: {
        contentId: content._id,
        currentContent: content
      }
    })
  }

  addContentDelete(content: ContentItem) {
    this.addAction({
      type: 'content',
      action: 'delete',
      description: `Deleted content: ${content.title}`,
      revertData: {
        contentId: content._id,
        previousContent: content
      }
    })
  }

  addContentUpdate(previousContent: ContentItem, currentContent: ContentItem) {
    this.addAction({
      type: 'content',
      action: 'update',
      description: `Updated content: ${currentContent.title}`,
      revertData: {
        contentId: currentContent._id,
        previousContent,
        currentContent
      }
    })
  }
}

// Global instance
export const undoSystem = new UndoSystemManager()

// Hook for React components
export function useUndoSystem() {
  const canUndo = undoSystem.canUndo()
  const actionCount = undoSystem.getActionCount()
  const lastAction = undoSystem.getLastAction()

  return {
    canUndo,
    actionCount,
    lastAction,
    addAction: undoSystem.addAction.bind(undoSystem),
    popLastAction: undoSystem.popLastAction.bind(undoSystem),
    clear: undoSystem.clear.bind(undoSystem),
    // Helper methods
    addTaskCreate: undoSystem.addTaskCreate.bind(undoSystem),
    addTaskDelete: undoSystem.addTaskDelete.bind(undoSystem),
    addTaskUpdate: undoSystem.addTaskUpdate.bind(undoSystem),
    addTaskStatusChange: undoSystem.addTaskStatusChange.bind(undoSystem),
    addContentCreate: undoSystem.addContentCreate.bind(undoSystem),
    addContentDelete: undoSystem.addContentDelete.bind(undoSystem),
    addContentUpdate: undoSystem.addContentUpdate.bind(undoSystem)
  }
}