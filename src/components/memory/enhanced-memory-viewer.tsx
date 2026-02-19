"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { StatsCard } from "@/components/ui/stats-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Brain,
  Search,
  Filter,
  Calendar,
  BookOpen,
  Lightbulb,
  Plus,
  Pin,
  Clock,
  Tag,
  Eye,
  Edit,
  Trash2,
  X,
  User,
  Hash,
  Archive,
  FileText,
  PinOff
} from "lucide-react"
import { MemoryCard } from "./memory-card"
import { MemoryCreationDialog } from "./memory-creation-dialog"
import { MemoryEmptyState } from "@/components/ui/empty-state"
import { useToastActions } from "@/components/ui/toast"
// import { loadMemories, saveMemories } from "@/lib/data-persistence" - Replaced with API calls
import { MemoryEntry } from "./memory-entry"
import { cn } from "@/lib/utils"

const categoryOptions = ["All", "daily", "knowledge", "lessons"]
const categoryConfig = {
  "daily": {
    icon: Calendar,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    label: "Daily Notes"
  },
  "knowledge": {
    icon: BookOpen,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    label: "Knowledge Base"
  },
  "lessons": {
    icon: Lightbulb,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    label: "Lessons Learned"
  }
}

// API functions for memory management
async function fetchMemories(): Promise<MemoryEntry[]> {
  try {
    const response = await fetch('/api/memory')
    if (!response.ok) throw new Error('Failed to fetch memories')
    const data = await response.json()
    return data.memories || []
  } catch (error) {
    console.error('Error fetching memories:', error)
    // Fallback to localStorage
    const stored = localStorage.getItem('mission-control-memories')
    return stored ? JSON.parse(stored) : []
  }
}

const agentAvatars = {
  "Hamza": "👤",
  "Manus": "🤘",
  "Monica": "✈️",
  "Jarvis": "🔍",
  "Luna": "🌙"
}

const agentColors = {
  "Hamza": {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20"
  },
  "Manus": {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20"
  },
  "Monica": {
    bg: "bg-pink-500/10",
    text: "text-pink-400",
    border: "border-pink-500/20"
  },
  "Jarvis": {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/20"
  },
  "Luna": {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20"
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0.0, 0.2, 1] as any
    }
  }
}

export function EnhancedMemoryViewer() {
  const [memories, setMemories] = useState<MemoryEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedMemory, setSelectedMemory] = useState<MemoryEntry | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingMemory, setEditingMemory] = useState<MemoryEntry | null>(null)
  const [mounted, setMounted] = useState(false)
  const toast = useToastActions()

  // Load memories from API on mount
  useEffect(() => {
    setMounted(true)
    fetchMemories().then(loadedMemories => {
      setMemories(loadedMemories)
    })
  }, [])

  // Memories from API are read-only (no auto-save to localStorage)

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    memories.forEach(memory => {
      memory.tags?.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [memories])

  // Filter and search memories
  const filteredMemories = useMemo(() => {
    let filtered = memories

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(memory => memory.category === selectedCategory)
    }

    // Tag filter
    if (selectedTag) {
      filtered = filtered.filter(memory => memory.tags?.includes(selectedTag))
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(memory =>
        memory.title.toLowerCase().includes(query) ||
        memory.content.toLowerCase().includes(query) ||
        memory.author.toLowerCase().includes(query) ||
        memory.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Sort: pinned first, then by date (most recent first)
    return filtered.sort((a, b) => {
      // Pinned items first
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1

      // Then by date
      return b.updatedAt - a.updatedAt
    })
  }, [memories, searchQuery, selectedCategory, selectedTag])

  // Memory statistics
  const stats = useMemo(() => {
    const totalMemories = memories.length
    const totalWords = memories.reduce((sum, memory) => sum + memory.wordCount, 0)
    const pinnedCount = memories.filter(memory => memory.pinned).length
    const categoryCounts = memories.reduce((acc, memory) => {
      acc[memory.category] = (acc[memory.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total: totalMemories,
      words: totalWords,
      pinned: pinnedCount,
      categories: categoryCounts,
      tags: allTags.length
    }
  }, [memories, allTags])

  // Event handlers
  const handleCreateMemory = async (memoryData: Partial<MemoryEntry>) => {
    if (editingMemory) {
      // For now, editing still uses local state (could be enhanced later to use PUT API)
      setMemories(prev =>
        prev.map(memory =>
          memory._id === editingMemory._id
            ? { ...memory, ...memoryData, updatedAt: Date.now() }
            : memory
        )
      )
      toast.success('Memory Updated', `"${memoryData.title}" has been successfully updated.`)
    } else {
      try {
        // Save to filesystem via API
        const response = await fetch('/api/memory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: memoryData.title,
            content: memoryData.content,
            type: memoryData.category === 'daily' ? 'daily' : 'longterm',
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to save memory')
        }

        const result = await response.json()
        
        // Also add to local state for immediate UI update
        const newMemory: MemoryEntry = {
          _id: `memory-${Date.now()}`,
          title: memoryData.title!,
          content: memoryData.content!,
          category: memoryData.category!,
          author: memoryData.author!,
          tags: memoryData.tags || [],
          wordCount: memoryData.wordCount!,
          pinned: memoryData.pinned || false,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
        setMemories(prev => [newMemory, ...prev])
        
        toast.success('Memory Saved to Filesystem', `"${memoryData.title}" has been written to ${result.file}.`)
      } catch (error) {
        console.error('Error saving memory:', error)
        toast.error('Failed to Save Memory', 'Could not write to filesystem. Check console for details.')
      }
    }
    setEditingMemory(null)
  }

  const handleEditMemory = (memory: MemoryEntry) => {
    setEditingMemory(memory)
    setCreateDialogOpen(true)
  }

  const handleDeleteMemory = (memoryId: string) => {
    const memoryToDelete = memories.find(m => m._id === memoryId)
    setMemories(prev => prev.filter(memory => memory._id !== memoryId))
    if (memoryToDelete) {
      toast.success('Memory Deleted', `"${memoryToDelete.title}" has been removed from the vault.`)
    }
  }

  const handleTogglePin = (memoryId: string) => {
    setMemories(prev =>
      prev.map(memory =>
        memory._id === memoryId
          ? { ...memory, pinned: !memory.pinned, updatedAt: Date.now() }
          : memory
      )
    )
    const memory = memories.find(m => m._id === memoryId)
    if (memory) {
      toast.success(
        memory.pinned ? 'Memory Unpinned' : 'Memory Pinned',
        `"${memory.title}" ${memory.pinned ? 'removed from' : 'added to'} pinned memories.`
      )
    }
  }

  const handleViewMemory = (memory: MemoryEntry) => {
    setSelectedMemory(memory)
    setDetailsOpen(true)
  }

  const handleAddNewMemory = () => {
    setEditingMemory(null)
    setCreateDialogOpen(true)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All")
    setSelectedTag(null)
  }

  if (!mounted) return null

  return (
    <div className="min-h-[calc(100vh-5rem)] relative" data-testid="memory-viewer">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[hsl(var(--command-background))] via-[hsl(220_13%_3%)] to-[hsl(var(--command-background))] pointer-events-none" />

      <motion.div
        className="relative z-10 p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <PageHeader
            icon={Brain}
            title="Enhanced Memory Vault"
            subtitle="Comprehensive knowledge management with tagging, pinning, and advanced search capabilities."
          >
            <StatsCard
              icon={Archive}
              label="Total Memories"
              value={stats.total}
              subLabel="Pinned"
              subValue={stats.pinned}
            />
          </PageHeader>

          <motion.div variants={itemVariants} className="space-y-6">
            {/* Search and Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 flex-1">
                {/* Search */}
                <div className="flex-1 max-w-lg">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[hsl(var(--command-text-muted))]" />
                    <Input
                      placeholder="Search memories, tags, authors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))]"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2 glass-morphism p-2 rounded-lg">
                  <Filter className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-44 border-0 bg-transparent focus:ring-1 focus:ring-[hsl(var(--command-accent))] font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-morphism border-[hsl(var(--command-border-bright))]">
                      {categoryOptions.map((category) => (
                        <SelectItem key={category} value={category} className="focus:bg-[hsl(var(--command-accent))]/10">
                          <div className="flex items-center gap-2">
                            {category !== "All" && category in categoryConfig && (
                              <>
                                {(() => {
                                  const config = categoryConfig[category as keyof typeof categoryConfig]
                                  const IconComponent = config.icon
                                  return (
                                    <>
                                      <IconComponent className="h-4 w-4" />
                                      <span>{config.label}</span>
                                    </>
                                  )
                                })()}
                              </>
                            )}
                            {category === "All" && <span>All Categories</span>}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                {(searchQuery || selectedCategory !== "All" || selectedTag) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="glass-morphism hover:bg-[hsl(var(--command-surface))]/60"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleAddNewMemory}
                  className="btn-premium font-semibold px-6"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Memory
                </Button>
              </motion.div>
            </div>

            {/* Tag Cloud */}
            {allTags.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-[hsl(var(--command-text-muted))] flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Filter by Tag ({allTags.length} available)
                  </h3>
                  {selectedTag && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTag(null)}
                      className="text-xs"
                    >
                      Clear Tag Filter
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 20).map((tag) => {
                    const tagCount = memories.filter(m => m.tags?.includes(tag)).length
                    const isSelected = selectedTag === tag

                    return (
                      <motion.div
                        key={tag}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge
                          variant={isSelected ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer transition-all duration-200",
                            isSelected
                              ? "bg-[hsl(var(--command-accent))] text-white"
                              : "hover:bg-[hsl(var(--command-surface))]/60"
                          )}
                          onClick={() => setSelectedTag(isSelected ? null : tag)}
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                          <span className="ml-1 opacity-60">({tagCount})</span>
                        </Badge>
                      </motion.div>
                    )
                  })}
                  {allTags.length > 20 && (
                    <Badge variant="outline" className="opacity-60">
                      +{allTags.length - 20} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Statistics Cards */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="stats-glass stats-mesh-bg border-[hsl(var(--command-border-bright))]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[hsl(var(--command-accent))]/10 rounded-xl">
                      <FileText className="h-6 w-6 text-[hsl(var(--command-accent))]" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold text-contrast-high">{stats.total}</div>
                      <div className="text-sm text-contrast-medium">Total Memories</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="stats-glass stats-mesh-bg border-[hsl(var(--command-border-bright))]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[hsl(var(--command-warning))]/10 rounded-xl">
                      <Pin className="h-6 w-6 text-[hsl(var(--command-warning))]" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold text-[hsl(var(--command-warning))]">{stats.pinned}</div>
                      <div className="text-sm text-contrast-medium">Pinned</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="stats-glass stats-mesh-bg border-[hsl(var(--command-border-bright))]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 rounded-xl">
                      <Hash className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold text-green-400">{stats.words.toLocaleString()}</div>
                      <div className="text-sm text-contrast-medium">Total Words</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="stats-glass stats-mesh-bg border-[hsl(var(--command-border-bright))]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-xl">
                      <Tag className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold text-purple-400">{stats.tags}</div>
                      <div className="text-sm text-contrast-medium">Unique Tags</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Memory Grid or Empty State */}
          <motion.div variants={itemVariants}>
            {memories.length === 0 ? (
              <MemoryEmptyState onAddMemory={handleAddNewMemory} />
            ) : filteredMemories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredMemories.map((memory) => (
                    <EnhancedMemoryCard
                      key={memory._id}
                      memory={memory}
                      onView={() => handleViewMemory(memory)}
                      onEdit={() => handleEditMemory(memory)}
                      onDelete={() => handleDeleteMemory(memory._id)}
                      onTogglePin={() => handleTogglePin(memory._id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto glass-morphism rounded-full flex items-center justify-center">
                    <Search className="h-6 w-6 text-[hsl(var(--command-text-muted))]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-2">No memories found</h3>
                    <p className="text-[hsl(var(--command-text-muted))]">
                      Try adjusting your search query, category, or tag filters.
                    </p>
                    <Button
                      variant="ghost"
                      onClick={clearFilters}
                      className="mt-4"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear all filters
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Memory Creation Dialog */}
      <MemoryCreationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSave={handleCreateMemory}
        editingMemory={editingMemory}
      />

      {/* Memory Detail Modal */}
      <AnimatePresence>
        {selectedMemory && detailsOpen && (
          <MemoryDetailModal
            memory={selectedMemory}
            onClose={() => {
              setDetailsOpen(false)
              setSelectedMemory(null)
            }}
            onEdit={() => {
              setDetailsOpen(false)
              handleEditMemory(selectedMemory)
            }}
            onDelete={() => {
              setDetailsOpen(false)
              handleDeleteMemory(selectedMemory._id)
            }}
            onTogglePin={() => {
              handleTogglePin(selectedMemory._id)
              // Update the selected memory to reflect the change
              const updatedMemory = memories.find(m => m._id === selectedMemory._id)
              if (updatedMemory) {
                setSelectedMemory(updatedMemory)
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Enhanced Memory Card Component
function EnhancedMemoryCard({
  memory,
  onView,
  onEdit,
  onDelete,
  onTogglePin
}: {
  memory: MemoryEntry
  onView: () => void
  onEdit: () => void
  onDelete: () => void
  onTogglePin: () => void
}) {
  const config = categoryConfig[memory.category as keyof typeof categoryConfig]
  const IconComponent = config?.icon || FileText
  const agentStyle = agentColors[memory.author as keyof typeof agentColors] || agentColors["Hamza"]

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "glass-morphism border-[hsl(var(--command-border))] hover:border-[hsl(var(--command-accent))]/50 cursor-pointer group transition-all duration-300 relative",
        memory.pinned && "ring-1 ring-[hsl(var(--command-warning))]/30"
      )}
    >
      {/* Pin Indicator */}
      {memory.pinned && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="p-1 bg-[hsl(var(--command-warning))] rounded-full">
            <Pin className="h-3 w-3 text-black" />
          </div>
        </div>
      )}

      <div className="p-6 relative" onClick={onView}>
        <div className="flex items-start gap-4">
          <div className={cn("p-2 glass-morphism rounded-lg group-hover:scale-110 transition-transform", config?.bg)}>
            <IconComponent className={cn("h-4 w-4", config?.color || "text-[hsl(var(--command-accent))]")} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-lg mb-2 line-clamp-2 group-hover:text-[hsl(var(--command-accent))] transition-colors">
              {memory.title}
            </h3>
            <p className="text-[hsl(var(--command-text-muted))] text-sm line-clamp-3 mb-4">
              {memory.content.substring(0, 150)}
              {memory.content.length > 150 && '...'}
            </p>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 text-xs text-[hsl(var(--command-text-muted))]">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(memory.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  {memory.wordCount} words
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className={cn("text-xs", agentStyle.text)}>
                  {agentAvatars[memory.author as keyof typeof agentAvatars]}
                </span>
                <Badge variant="outline" className={cn("text-xs", config?.color)}>
                  {config?.label || memory.category}
                </Badge>
              </div>
            </div>

            {memory.tags && memory.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {memory.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
                    {tag}
                  </Badge>
                ))}
                {memory.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-0">
                    +{memory.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 glass-morphism hover:bg-[hsl(var(--command-warning))]/20 hover:text-[hsl(var(--command-warning))]"
            onClick={(e) => {
              e.stopPropagation()
              onTogglePin()
            }}
          >
            {memory.pinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 glass-morphism hover:bg-[hsl(var(--command-accent))]/20 hover:text-[hsl(var(--command-accent))]"
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 glass-morphism hover:bg-[hsl(var(--command-danger))]/20 hover:text-[hsl(var(--command-danger))]"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

// Memory Detail Modal Component
function MemoryDetailModal({
  memory,
  onClose,
  onEdit,
  onDelete,
  onTogglePin
}: {
  memory: MemoryEntry
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  onTogglePin: () => void
}) {
  const config = categoryConfig[memory.category as keyof typeof categoryConfig]
  const IconComponent = config?.icon || FileText
  const agentStyle = agentColors[memory.author as keyof typeof agentColors] || agentColors["Hamza"]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        className="w-full max-w-4xl max-h-[90vh] glass-morphism border-[hsl(var(--command-border-bright))] rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[hsl(var(--command-border))]">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={cn("p-2 glass-morphism rounded-lg", config?.bg)}>
                <IconComponent className={cn("h-5 w-5", config?.color || "text-[hsl(var(--command-accent))]")} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-display font-bold">{memory.title}</h2>
                  {memory.pinned && (
                    <Pin className="h-5 w-5 text-[hsl(var(--command-warning))]" />
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-[hsl(var(--command-text-muted))]">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span className={agentStyle.text}>{agentAvatars[memory.author as keyof typeof agentAvatars]} {memory.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(memory.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Hash className="h-4 w-4" />
                    {memory.wordCount} words
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    {memory.tags?.length || 0} tags
                  </div>
                  <Badge variant="outline" className={cn("text-xs ml-2", config?.color)}>
                    {config?.label || memory.category}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onTogglePin}
                className={cn(
                  "hover:bg-[hsl(var(--command-warning))]/20",
                  memory.pinned && "text-[hsl(var(--command-warning))]"
                )}
              >
                {memory.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className="hover:bg-[hsl(var(--command-accent))]/20 hover:text-[hsl(var(--command-accent))]"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="hover:bg-[hsl(var(--command-danger))]/20 hover:text-[hsl(var(--command-danger))]"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed">{memory.content}</pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[hsl(var(--command-border))] bg-[hsl(var(--command-surface))]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              {memory.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="text-xs text-[hsl(var(--command-text-muted))]">
              Created: {new Date(memory.createdAt).toLocaleDateString()} •
              Updated: {new Date(memory.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}