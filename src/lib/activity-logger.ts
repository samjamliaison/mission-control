export interface ActivityEntry {
  id: string
  timestamp: number
  actionType: 
    | 'task_created' 
    | 'task_updated' 
    | 'task_completed' 
    | 'task_deleted'
    | 'content_created' 
    | 'content_updated' 
    | 'content_published' 
    | 'content_deleted'
    | 'event_created' 
    | 'event_updated' 
    | 'event_deleted'
    | 'memory_created' 
    | 'memory_updated' 
    | 'memory_deleted'
    | 'navigation' 
    | 'search' 
    | 'filter_applied'
    | 'export_data'
    | 'import_data'
    | 'settings_changed'
    | 'agent_action'
    | 'system_event'
    | 'user_login'
    | 'session_start'
    | 'command_executed'
  details: string
  agent: string
  entityType?: 'task' | 'content' | 'event' | 'memory' | 'system'
  entityId?: string
  metadata?: Record<string, any>
  importance: 'low' | 'medium' | 'high' | 'critical'
  tags: string[]
}

const ACTIVITY_LOG_KEY = 'mission-control-activity-log'
const MAX_ENTRIES = 10000 // Keep last 10k entries

export class ActivityLogger {
  private static instance: ActivityLogger
  private entries: ActivityEntry[] = []

  private constructor() {
    this.loadFromStorage()
  }

  static getInstance(): ActivityLogger {
    if (!ActivityLogger.instance) {
      ActivityLogger.instance = new ActivityLogger()
    }
    return ActivityLogger.instance
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return
    
    try {
      const stored = localStorage.getItem(ACTIVITY_LOG_KEY)
      if (stored) {
        this.entries = JSON.parse(stored)
        // Sort by timestamp descending (most recent first)
        this.entries.sort((a, b) => b.timestamp - a.timestamp)
        
        // Trim to max entries if needed
        if (this.entries.length > MAX_ENTRIES) {
          this.entries = this.entries.slice(0, MAX_ENTRIES)
          this.saveToStorage()
        }
      }
    } catch (error) {
      console.error('Failed to load activity log from storage:', error)
      this.entries = []
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(this.entries))
    } catch (error) {
      console.error('Failed to save activity log to storage:', error)
    }
  }

  private generateId(): string {
    return `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  log(entry: Omit<ActivityEntry, 'id' | 'timestamp'>): void {
    const newEntry: ActivityEntry = {
      ...entry,
      id: this.generateId(),
      timestamp: Date.now()
    }

    // Add to beginning of array (most recent first)
    this.entries.unshift(newEntry)
    
    // Trim if needed
    if (this.entries.length > MAX_ENTRIES) {
      this.entries = this.entries.slice(0, MAX_ENTRIES)
    }
    
    this.saveToStorage()
    
    // Dispatch event for real-time updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('activityLogUpdated', {
        detail: newEntry
      }))
    }
  }

  getEntries(
    limit?: number,
    filters?: {
      actionType?: ActivityEntry['actionType'][]
      agent?: string[]
      entityType?: string[]
      importance?: ActivityEntry['importance'][]
      dateRange?: { start: number, end: number }
      tags?: string[]
      search?: string
    }
  ): ActivityEntry[] {
    let filtered = [...this.entries]

    if (filters) {
      if (filters.actionType?.length) {
        filtered = filtered.filter(entry => filters.actionType!.includes(entry.actionType))
      }
      
      if (filters.agent?.length) {
        filtered = filtered.filter(entry => filters.agent!.includes(entry.agent))
      }
      
      if (filters.entityType?.length) {
        filtered = filtered.filter(entry => 
          entry.entityType && filters.entityType!.includes(entry.entityType)
        )
      }
      
      if (filters.importance?.length) {
        filtered = filtered.filter(entry => filters.importance!.includes(entry.importance))
      }
      
      if (filters.dateRange) {
        filtered = filtered.filter(entry => 
          entry.timestamp >= filters.dateRange!.start && 
          entry.timestamp <= filters.dateRange!.end
        )
      }
      
      if (filters.tags?.length) {
        filtered = filtered.filter(entry => 
          filters.tags!.some(tag => entry.tags.includes(tag))
        )
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filtered = filtered.filter(entry =>
          entry.details.toLowerCase().includes(searchLower) ||
          entry.agent.toLowerCase().includes(searchLower) ||
          entry.tags.some(tag => tag.toLowerCase().includes(searchLower))
        )
      }
    }

    return limit ? filtered.slice(0, limit) : filtered
  }

  getStats(): {
    total: number
    today: number
    thisWeek: number
    byActionType: Record<string, number>
    byAgent: Record<string, number>
    byImportance: Record<string, number>
    recentActivity: ActivityEntry[]
  } {
    const now = Date.now()
    const todayStart = new Date(now).setHours(0, 0, 0, 0)
    const weekStart = now - (7 * 24 * 60 * 60 * 1000)

    const stats = {
      total: this.entries.length,
      today: this.entries.filter(e => e.timestamp >= todayStart).length,
      thisWeek: this.entries.filter(e => e.timestamp >= weekStart).length,
      byActionType: {} as Record<string, number>,
      byAgent: {} as Record<string, number>,
      byImportance: {} as Record<string, number>,
      recentActivity: this.entries.slice(0, 10)
    }

    // Count by categories
    this.entries.forEach(entry => {
      stats.byActionType[entry.actionType] = (stats.byActionType[entry.actionType] || 0) + 1
      stats.byAgent[entry.agent] = (stats.byAgent[entry.agent] || 0) + 1
      stats.byImportance[entry.importance] = (stats.byImportance[entry.importance] || 0) + 1
    })

    return stats
  }

  clear(): void {
    this.entries = []
    this.saveToStorage()
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('activityLogCleared'))
    }
  }

  exportData(): string {
    return JSON.stringify({
      exported: new Date().toISOString(),
      totalEntries: this.entries.length,
      entries: this.entries
    }, null, 2)
  }

  importData(jsonData: string): { success: boolean, imported: number, error?: string } {
    try {
      const data = JSON.parse(jsonData)
      
      if (!data.entries || !Array.isArray(data.entries)) {
        throw new Error('Invalid data format')
      }
      
      // Validate entries
      const validEntries = data.entries.filter((entry: any) => 
        entry.id && 
        entry.timestamp && 
        entry.actionType && 
        entry.details && 
        entry.agent
      )
      
      // Merge with existing entries, avoiding duplicates
      const existingIds = new Set(this.entries.map(e => e.id))
      const newEntries = validEntries.filter((entry: ActivityEntry) => !existingIds.has(entry.id))
      
      this.entries = [...this.entries, ...newEntries]
      this.entries.sort((a, b) => b.timestamp - a.timestamp)
      
      // Trim to max entries
      if (this.entries.length > MAX_ENTRIES) {
        this.entries = this.entries.slice(0, MAX_ENTRIES)
      }
      
      this.saveToStorage()
      
      return {
        success: true,
        imported: newEntries.length
      }
    } catch (error) {
      return {
        success: false,
        imported: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Convenience functions
export const activityLogger = ActivityLogger.getInstance()

export const logActivity = (entry: Omit<ActivityEntry, 'id' | 'timestamp'>) => {
  activityLogger.log(entry)
}

// Common activity loggers
export const logTaskAction = (
  action: 'created' | 'updated' | 'completed' | 'deleted',
  taskTitle: string,
  agent: string,
  taskId?: string,
  metadata?: Record<string, any>
) => {
  logActivity({
    actionType: `task_${action}` as ActivityEntry['actionType'],
    details: `Task "${taskTitle}" ${action}`,
    agent,
    entityType: 'task',
    entityId: taskId,
    metadata,
    importance: action === 'completed' ? 'medium' : 'low',
    tags: ['task', action]
  })
}

export const logContentAction = (
  action: 'created' | 'updated' | 'published' | 'deleted',
  contentTitle: string,
  agent: string,
  contentId?: string,
  metadata?: Record<string, any>
) => {
  logActivity({
    actionType: `content_${action}` as ActivityEntry['actionType'],
    details: `Content "${contentTitle}" ${action}`,
    agent,
    entityType: 'content',
    entityId: contentId,
    metadata,
    importance: action === 'published' ? 'medium' : 'low',
    tags: ['content', action]
  })
}

export const logNavigationAction = (
  page: string,
  agent: string = 'User',
  metadata?: Record<string, any>
) => {
  logActivity({
    actionType: 'navigation',
    details: `Navigated to ${page}`,
    agent,
    metadata,
    importance: 'low',
    tags: ['navigation', 'ui']
  })
}

export const logSearchAction = (
  query: string,
  results: number,
  agent: string = 'User'
) => {
  logActivity({
    actionType: 'search',
    details: `Searched for "${query}" (${results} results)`,
    agent,
    metadata: { query, results },
    importance: 'low',
    tags: ['search', 'ui']
  })
}