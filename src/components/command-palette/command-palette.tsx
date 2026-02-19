"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  Search,
  CheckSquare,
  Film,
  Calendar,
  Brain,
  Users,
  Building2,
  Settings,
  Plus,
  ArrowRight,
  Hash,
  User,
  Clock
} from "lucide-react"
import { loadTasks, loadContent, loadEvents, loadMemories } from "@/lib/data-persistence"
import { Task } from "@/components/tasks/task-card"
import { ContentItem } from "@/types/content"
import { MemoryEntry } from "@/components/memory/memory-entry"
import { CalendarEventData } from "@/lib/data-persistence"
import { cn } from "@/lib/utils"

interface CommandPaletteItem {
  id: string
  title: string
  subtitle?: string
  type: "navigation" | "task" | "content" | "event" | "memory" | "action"
  icon: React.ElementType
  action: () => void
  keywords: string[]
  priority: number
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Fuzzy search function
function fuzzyMatch(query: string, text: string): number {
  query = query.toLowerCase()
  text = text.toLowerCase()

  if (text.includes(query)) return 100

  let score = 0
  let queryIndex = 0

  for (let i = 0; i < text.length && queryIndex < query.length; i++) {
    if (text[i] === query[queryIndex]) {
      score += (query.length - queryIndex) / query.length * 10
      queryIndex++
    }
  }

  if (queryIndex === query.length) {
    score += 50
  }

  return score
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [tasks, setTasks] = useState<Task[]>([])
  const [content, setContent] = useState<ContentItem[]>([])
  const [events, setEvents] = useState<CalendarEventData[]>([])
  const [memories, setMemories] = useState<MemoryEntry[]>([])
  const router = useRouter()

  // Load data when palette opens
  useEffect(() => {
    if (open) {
      setTasks(loadTasks())
      setContent(loadContent())
      setEvents(loadEvents())
      setMemories(loadMemories())
    }
  }, [open])

  // Reset state when closing
  useEffect(() => {
    if (!open) {
      setQuery("")
      setSelectedIndex(0)
    }
  }, [open])

  // Generate command items
  const commandItems = useMemo((): CommandPaletteItem[] => {
    const items: CommandPaletteItem[] = []

    // Navigation items
    const navigation = [
      {
        id: "nav-dashboard",
        title: "Dashboard",
        subtitle: "Mission Control overview",
        type: "navigation" as const,
        icon: Command,
        action: () => {
          router.push("/")
          onOpenChange(false)
        },
        keywords: ["dashboard", "home", "overview", "mission", "control"],
        priority: 10
      },
      {
        id: "nav-tasks",
        title: "Tasks",
        subtitle: "Task management",
        type: "navigation" as const,
        icon: CheckSquare,
        action: () => {
          router.push("/tasks")
          onOpenChange(false)
        },
        keywords: ["tasks", "todo", "work", "management"],
        priority: 10
      },
      {
        id: "nav-pipeline",
        title: "Content Pipeline",
        subtitle: "Content creation workflow",
        type: "navigation" as const,
        icon: Film,
        action: () => {
          router.push("/pipeline")
          onOpenChange(false)
        },
        keywords: ["pipeline", "content", "creation", "workflow", "film"],
        priority: 10
      },
      {
        id: "nav-calendar",
        title: "Calendar",
        subtitle: "Schedule and events",
        type: "navigation" as const,
        icon: Calendar,
        action: () => {
          router.push("/calendar")
          onOpenChange(false)
        },
        keywords: ["calendar", "schedule", "events", "time"],
        priority: 10
      },
      {
        id: "nav-memory",
        title: "Memory Vault",
        subtitle: "Knowledge base",
        type: "navigation" as const,
        icon: Brain,
        action: () => {
          router.push("/memory")
          onOpenChange(false)
        },
        keywords: ["memory", "knowledge", "notes", "vault", "brain"],
        priority: 10
      },
      {
        id: "nav-team",
        title: "Team Dashboard",
        subtitle: "Agent status",
        type: "navigation" as const,
        icon: Users,
        action: () => {
          router.push("/team")
          onOpenChange(false)
        },
        keywords: ["team", "agents", "users", "status"],
        priority: 10
      },
      {
        id: "nav-office",
        title: "Virtual Office",
        subtitle: "Office view",
        type: "navigation" as const,
        icon: Building2,
        action: () => {
          router.push("/office")
          onOpenChange(false)
        },
        keywords: ["office", "virtual", "building", "space"],
        priority: 10
      },
      {
        id: "nav-settings",
        title: "Settings",
        subtitle: "Configuration",
        type: "navigation" as const,
        icon: Settings,
        action: () => {
          router.push("/settings")
          onOpenChange(false)
        },
        keywords: ["settings", "config", "preferences"],
        priority: 10
      }
    ]

    items.push(...navigation)

    // Quick actions
    const actions = [
      {
        id: "action-add-task",
        title: "Add New Task",
        subtitle: "Create a new task",
        type: "action" as const,
        icon: Plus,
        action: () => {
          router.push("/tasks")
          onOpenChange(false)
          // TODO: Trigger add task dialog
        },
        keywords: ["add", "new", "task", "create"],
        priority: 8
      },
      {
        id: "action-add-content",
        title: "Create Content",
        subtitle: "Add to content pipeline",
        type: "action" as const,
        icon: Film,
        action: () => {
          router.push("/pipeline")
          onOpenChange(false)
          // TODO: Trigger add content dialog
        },
        keywords: ["add", "new", "content", "create", "pipeline"],
        priority: 8
      }
    ]

    items.push(...actions)

    // Tasks
    tasks.forEach((task) => {
      items.push({
        id: `task-${task._id}`,
        title: task.title,
        subtitle: `Task • ${task.assignee} • ${task.status}`,
        type: "task",
        icon: CheckSquare,
        action: () => {
          router.push("/tasks")
          onOpenChange(false)
          // TODO: Focus on specific task
        },
        keywords: [task.title, task.description, task.assignee, task.status, "task"],
        priority: task.status === "in-progress" ? 7 : 5
      })
    })

    // Content items
    content.forEach((item) => {
      items.push({
        id: `content-${item._id}`,
        title: item.title,
        subtitle: `Content • ${item.platform} • ${item.status}`,
        type: "content",
        icon: Film,
        action: () => {
          router.push("/pipeline")
          onOpenChange(false)
          // TODO: Focus on specific content item
        },
        keywords: [item.title, item.description, item.platform, item.status, "content"],
        priority: item.status === "filming" ? 7 : 5
      })
    })

    // Events
    events.forEach((event) => {
      items.push({
        id: `event-${event._id}`,
        title: event.title,
        subtitle: `Event • ${event.agent} • ${new Date(event.scheduledTime).toLocaleDateString()}`,
        type: "event",
        icon: Calendar,
        action: () => {
          router.push("/calendar")
          onOpenChange(false)
          // TODO: Focus on specific event
        },
        keywords: [event.title, event.description, event.agent || "", event.type, "event"],
        priority: event.scheduledTime > Date.now() ? 6 : 4
      })
    })

    // Memories
    memories.forEach((memory) => {
      items.push({
        id: `memory-${memory._id}`,
        title: memory.title,
        subtitle: `Memory • ${memory.category} • ${memory.author}`,
        type: "memory",
        icon: Brain,
        action: () => {
          router.push("/memory")
          onOpenChange(false)
          // TODO: Focus on specific memory
        },
        keywords: [memory.title, memory.content, memory.category, memory.author, "memory", ...memory.tags],
        priority: 4
      })
    })

    return items
  }, [tasks, content, events, memories, router, onOpenChange])

  // Filter and sort items based on search query
  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      // No query - show high priority items first
      return commandItems
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 10)
    }

    // Search with fuzzy matching
    const searchResults = commandItems
      .map((item) => {
        const searchText = [
          item.title,
          item.subtitle || "",
          ...item.keywords
        ].join(" ")

        const score = fuzzyMatch(query, searchText)

        return { item, score }
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => {
        // First by score, then by priority
        if (b.score !== a.score) return b.score - a.score
        return b.item.priority - a.item.priority
      })
      .slice(0, 8)
      .map(({ item }) => item)

    return searchResults
  }, [query, commandItems])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === "Enter") {
        e.preventDefault()
        const selectedItem = filteredItems[selectedIndex]
        if (selectedItem) {
          selectedItem.action()
        }
      }
    }

    document.addEventListener("keydown", handleKeydown)
    return () => document.removeEventListener("keydown", handleKeydown)
  }, [open, filteredItems, selectedIndex])

  // Reset selected index when filtered items change
  useEffect(() => {
    setSelectedIndex(0)
  }, [filteredItems])

  const getTypeColor = (type: string) => {
    switch (type) {
      case "navigation": return "bg-[hsl(var(--command-accent))]/10 text-[hsl(var(--command-accent))]"
      case "task": return "bg-blue-500/10 text-blue-400"
      case "content": return "bg-purple-500/10 text-purple-400"
      case "event": return "bg-green-500/10 text-green-400"
      case "memory": return "bg-yellow-500/10 text-yellow-400"
      case "action": return "bg-orange-500/10 text-orange-400"
      default: return "bg-gray-500/10 text-gray-400"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl top-[20%] glass-morphism border-[hsl(var(--command-border-bright))]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-[hsl(var(--command-border))]">
            <Search className="h-5 w-5 text-[hsl(var(--command-text-muted))]" />
            <Input
              placeholder="Search anything or type a command..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 bg-transparent text-lg placeholder:text-[hsl(var(--command-text-muted))] focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
              role="searchbox"
              aria-label="Search for commands, tasks, content, or navigate to pages"
              aria-expanded={filteredItems.length > 0}
              aria-haspopup="listbox"
              aria-activedescendant={filteredItems[selectedIndex]?.id}
            />
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs bg-[hsl(var(--command-surface))]/50">
                <Command className="h-3 w-3 mr-1" />
                K
              </Badge>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {filteredItems.length > 0 ? (
              <div className="p-2" role="listbox" aria-label="Search results">
                {filteredItems.map((item, index) => {
                  const IconComponent = item.icon
                  const isSelected = index === selectedIndex

                  return (
                    <motion.div
                      key={item.id}
                      id={item.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                        isSelected
                          ? "bg-[hsl(var(--command-accent))]/10 border border-[hsl(var(--command-accent))]/20"
                          : "hover:bg-[hsl(var(--command-surface))]/30"
                      )}
                      onClick={item.action}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      role="option"
                      aria-selected={isSelected}
                      aria-label={`${item.title} - ${item.subtitle || item.type}`}
                      tabIndex={isSelected ? 0 : -1}
                    >
                      <div className={cn(
                        "p-2 rounded-lg",
                        getTypeColor(item.type)
                      )}>
                        <IconComponent className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.title}</div>
                        {item.subtitle && (
                          <div className="text-sm text-[hsl(var(--command-text-muted))] truncate">
                            {item.subtitle}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {item.type}
                        </Badge>
                        {isSelected && (
                          <ArrowRight className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="space-y-3">
                  <div className="w-12 h-12 mx-auto glass-morphism rounded-full flex items-center justify-center">
                    <Search className="h-5 w-5 text-[hsl(var(--command-text-muted))]" />
                  </div>
                  <div>
                    <div className="font-medium">No results found</div>
                    <div className="text-sm text-[hsl(var(--command-text-muted))]">
                      Try a different search term
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-[hsl(var(--command-border))] bg-[hsl(var(--command-surface))]/30">
            <div className="flex items-center gap-4 text-xs text-[hsl(var(--command-text-muted))]">
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">↑↓</Badge>
                Navigate
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">↵</Badge>
                Select
              </div>
            </div>
            <div className="text-xs text-[hsl(var(--command-text-muted))]">
              {filteredItems.length} results
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}