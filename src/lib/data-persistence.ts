/**
 * Data persistence layer using localStorage
 * Handles saving/loading data for all Mission Control components
 */

import { Task } from "@/components/tasks/task-card"
import { ContentItem } from "@/types/content"
import { MemoryEntry } from "@/components/memory/memory-entry"

export interface CalendarEventData {
  _id: string
  title: string
  description: string
  scheduledTime: number
  type: "meeting" | "deadline" | "event" | "reminder" | "cron" | "task"
  agent?: string
  status?: "scheduled" | "completed" | "cancelled" | "pending" | "failed"
  duration?: number
  recurrence?: "daily" | "weekly" | "monthly" | "none" | null
  attendees?: string[]
  location?: string
  priority?: "low" | "medium" | "high"
  createdAt?: number
  updatedAt?: number
}

export interface PersistedData {
  tasks: Task[]
  content: ContentItem[]
  events: CalendarEventData[]
  memories: MemoryEntry[]
  lastUpdated: number
  version: string
}

// Storage keys
const STORAGE_KEYS = {
  TASKS: 'mission-control-tasks',
  CONTENT: 'mission-control-content',
  EVENTS: 'mission-control-events',
  MEMORIES: 'mission-control-memories',
  FULL_BACKUP: 'mission-control-backup'
} as const

// Default/mock data to fall back to
const DEFAULT_TASKS: Task[] = [
  {
    _id: "demo-1",
    title: "Welcome to Mission Control",
    description: "This is a sample task to demonstrate the interface. You can edit, delete, or drag it to different columns.",
    assignee: "Hamza",
    status: "todo",
    priority: "medium",
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
  },
  {
    _id: "demo-2",
    title: "Explore the Content Pipeline",
    description: "Check out the content creation workflow in the Pipeline section. Perfect for managing your creative projects.",
    assignee: "Monica",
    status: "in-progress",
    priority: "low",
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 1800000,
  }
]

const DEFAULT_CONTENT: ContentItem[] = [
  {
    _id: "demo-content-1",
    title: "Getting Started Video",
    description: "Introduction video for new Mission Control users",
    platform: "YouTube",
    scriptText: "Welcome to your new command center...",
    thumbnailUrl: "",
    status: "idea",
    assignee: "Monica",
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  }
]

const DEFAULT_EVENTS: CalendarEventData[] = [
  {
    _id: "demo-event-1",
    title: "Weekly Team Sync",
    description: "Coordinate activities across all agents",
    type: "meeting",
    agent: "Hamza",
    scheduledTime: Date.now() + 86400000, // Tomorrow
    status: "scheduled",
    duration: 60,
    recurrence: "weekly",
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
]

const DEFAULT_MEMORIES: MemoryEntry[] = [
  {
    _id: "demo-memory-1",
    title: "Mission Control Setup Notes",
    content: `# Mission Control Setup Complete

Welcome to your new command center! This is a demo memory entry showing how the knowledge vault works.

## Key Features
- Task management with drag & drop
- Content pipeline workflow
- Calendar for scheduling
- Memory vault for knowledge

Feel free to edit or delete this entry and start building your own knowledge base.`,
    category: "daily",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    tags: ["setup", "demo", "getting-started"],
    author: "System",
    wordCount: 85
  }
]

/**
 * Safely parse JSON from localStorage with error handling
 */
function safeParseJSON<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window === 'undefined') return defaultValue
    const stored = localStorage.getItem(key)
    if (!stored) return defaultValue
    return JSON.parse(stored) as T
  } catch (error) {
    console.warn(`Failed to parse localStorage data for ${key}:`, error)
    return defaultValue
  }
}

/**
 * Safely store data to localStorage with error handling
 */
function safeSetJSON<T>(key: string, data: T): boolean {
  try {
    if (typeof window === 'undefined') return false
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error(`Failed to save to localStorage for ${key}:`, error)
    return false
  }
}

/**
 * Load tasks from localStorage or return demo data
 */
export function loadTasks(): Task[] {
  const stored = safeParseJSON<Task[]>(STORAGE_KEYS.TASKS, [])
  return stored.length > 0 ? stored : DEFAULT_TASKS
}

/**
 * Save tasks to localStorage
 */
export function saveTasks(tasks: Task[]): boolean {
  return safeSetJSON(STORAGE_KEYS.TASKS, tasks)
}

/**
 * Load content from localStorage or return demo data
 */
export function loadContent(): ContentItem[] {
  const stored = safeParseJSON<ContentItem[]>(STORAGE_KEYS.CONTENT, [])
  return stored.length > 0 ? stored : DEFAULT_CONTENT
}

/**
 * Save content to localStorage
 */
export function saveContent(content: ContentItem[]): boolean {
  return safeSetJSON(STORAGE_KEYS.CONTENT, content)
}

/**
 * Load events from localStorage or return demo data
 */
export function loadEvents(): CalendarEventData[] {
  const stored = safeParseJSON<CalendarEventData[]>(STORAGE_KEYS.EVENTS, [])
  return stored.length > 0 ? stored : DEFAULT_EVENTS
}

/**
 * Save events to localStorage
 */
export function saveEvents(events: CalendarEventData[]): boolean {
  return safeSetJSON(STORAGE_KEYS.EVENTS, events)
}

/**
 * Load memories from localStorage or return demo data
 */
export function loadMemories(): MemoryEntry[] {
  const stored = safeParseJSON<MemoryEntry[]>(STORAGE_KEYS.MEMORIES, [])
  return stored.length > 0 ? stored : DEFAULT_MEMORIES
}

/**
 * Save memories to localStorage
 */
export function saveMemories(memories: MemoryEntry[]): boolean {
  return safeSetJSON(STORAGE_KEYS.MEMORIES, memories)
}

/**
 * Export all data as JSON
 */
export function exportAllData(): PersistedData {
  return {
    tasks: loadTasks(),
    content: loadContent(),
    events: loadEvents(),
    memories: loadMemories(),
    lastUpdated: Date.now(),
    version: "1.0"
  }
}

/**
 * Import all data from JSON
 */
export function importAllData(data: PersistedData): boolean {
  try {
    const success = [
      saveTasks(data.tasks || []),
      saveContent(data.content || []),
      saveEvents(data.events || []),
      saveMemories(data.memories || [])
    ]

    return success.every(Boolean)
  } catch (error) {
    console.error('Failed to import data:', error)
    return false
  }
}

/**
 * Clear all stored data
 */
export function clearAllData(): boolean {
  try {
    if (typeof window === 'undefined') return false

    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })

    return true
  } catch (error) {
    console.error('Failed to clear data:', error)
    return false
  }
}

/**
 * Get storage usage statistics
 */
export function getStorageStats() {
  if (typeof window === 'undefined') {
    return { used: 0, available: 0, total: 0 }
  }

  try {
    let used = 0
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key)
      if (item) {
        used += item.length
      }
    })

    // Rough estimate of localStorage limit (usually 5-10MB)
    const total = 5 * 1024 * 1024 // 5MB
    const available = total - used

    return {
      used,
      available,
      total,
      usedPercent: Math.round((used / total) * 100)
    }
  } catch (error) {
    return { used: 0, available: 0, total: 0, usedPercent: 0 }
  }
}