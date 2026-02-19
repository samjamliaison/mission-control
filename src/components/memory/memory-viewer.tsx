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
  FileText,
  Clock,
  Tag,
  Eye,
  Archive,
  Zap,
  X,
  RefreshCw,
  Database
} from "lucide-react"
import { MemoryCard } from "./memory-card"
import { EmptyState } from "@/components/ui/empty-state"
import { cn } from "@/lib/utils"

// Real memory entry from OpenClaw API
interface ApiMemoryEntry {
  id: string
  title: string
  content: string
  date: string
  type: 'daily' | 'longterm' | 'section'
  tags: string[]
  wordCount: number
}

// API response structure
interface MemoryApiResponse {
  memories: ApiMemoryEntry[]
  meta: {
    total: number
    byType: {
      longterm: number
      daily: number
      section: number
    }
    totalWords: number
    latestDaily: string | null
    allTags: string[]
  }
  timestamp: string
}

const categoryOptions = ["All", "daily", "longterm", "section"]
const categoryConfig = {
  "daily": {
    icon: Calendar,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    label: "Daily Notes"
  },
  "longterm": {
    icon: BookOpen,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    label: "Long-term Memory"
  },
  "section": {
    icon: Lightbulb,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    label: "Knowledge Sections"
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0.0, 0.2, 1] as any
    }
  }
}

export function MemoryViewer() {
  const [memories, setMemories] = useState<ApiMemoryEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedMemory, setSelectedMemory] = useState<ApiMemoryEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  // Load data from OpenClaw API
  const loadMemoriesFromApi = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/memory')
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data: MemoryApiResponse = await response.json()
      setMemories(data.memories)
      setLastUpdated(data.timestamp)
    } catch (err) {
      console.error('Failed to load memories:', err)
      setError(err instanceof Error ? err.message : 'Failed to load memories')
    } finally {
      setLoading(false)
    }
  }

  // Load memories on component mount
  useEffect(() => {
    loadMemoriesFromApi()
  }, [])

  // Filter and search memories
  const filteredMemories = useMemo(() => {
    let filtered = memories

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(memory => memory.type === selectedCategory)
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(memory =>
        memory.title.toLowerCase().includes(query) ||
        memory.content.toLowerCase().includes(query) ||
        memory.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Sort by date (most recent first)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [memories, searchQuery, selectedCategory])

  // Memory statistics
  const totalMemories = memories.length
  const totalWords = memories.reduce((sum, memory) => sum + memory.wordCount, 0)
  const categoryCounts = memories.reduce((acc, memory) => {
    acc[memory.type] = (acc[memory.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] relative">
        <div className="fixed inset-0 bg-gradient-to-br from-[hsl(var(--command-background))] via-[hsl(220_13%_3%)] to-[hsl(var(--command-background))] pointer-events-none" />
        <div className="relative z-10 p-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto glass-morphism rounded-full flex items-center justify-center">
              <RefreshCw className="h-6 w-6 text-[hsl(var(--command-accent))] animate-spin" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg mb-2">Loading Memory Vault</h3>
              <p className="text-[hsl(var(--command-text-muted))]">
                Retrieving memories from OpenClaw workspace...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-5rem)] relative">
        <div className="fixed inset-0 bg-gradient-to-br from-[hsl(var(--command-background))] via-[hsl(220_13%_3%)] to-[hsl(var(--command-background))] pointer-events-none" />
        <div className="relative z-10 p-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto glass-morphism rounded-full flex items-center justify-center">
              <Database className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg mb-2 text-red-400">Memory Access Error</h3>
              <p className="text-[hsl(var(--command-text-muted))] mb-4">
                {error}
              </p>
              <Button onClick={loadMemoriesFromApi} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] relative">
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
            title="Memory Vault"
            subtitle="Real-time OpenClaw memory repository. Daily notes, long-term knowledge, and accumulated wisdom from the workspace."
          >
            <div className="flex items-center gap-4">
              <StatsCard
                icon={Archive}
                label="Live Memories"
                value={totalMemories}
                subLabel="words"
                subValue={totalWords.toLocaleString()}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={loadMemoriesFromApi}
                disabled={loading}
                className="glass-morphism"
                title="Refresh from OpenClaw"
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              </Button>
            </div>
          </PageHeader>

          <motion.div variants={itemVariants} className="space-y-6">
            {/* Search and Filters */}
            <div className="flex items-center gap-6">
              {/* Search */}
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[hsl(var(--command-text-muted))]" />
                  <Input
                    placeholder="Search memories, tags, or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))]"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-3">
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
                            {category === "All" && <span>All Types</span>}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category indicators */}
                <div className="flex items-center gap-2">
                  {Object.entries(categoryCounts).map(([category, count]) => {
                    const config = categoryConfig[category as keyof typeof categoryConfig]
                    if (!config) return null

                    return (
                      <motion.div
                        key={category}
                        className={cn(
                          "flex items-center gap-1 px-2 py-1 rounded-lg glass-morphism cursor-pointer",
                          config.bg,
                          config.border,
                          selectedCategory === category && "ring-1 ring-current"
                        )}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedCategory(selectedCategory === category ? "All" : category)}
                      >
                        <config.icon className={cn("h-3 w-3", config.color)} />
                        <span className={cn("text-xs font-medium", config.color)}>{count}</span>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Memory Grid or Empty State */}
          <motion.div variants={itemVariants}>
            {memories.length === 0 ? (
              <EmptyState
                icon="🧠"
                title="No Memories Found"
                description="The OpenClaw workspace memory files are empty or not accessible. Check that MEMORY.md and memory/*.md files exist in the workspace."
                actionLabel="Refresh Data"
                onAction={loadMemoriesFromApi}
              />
            ) : filteredMemories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredMemories.map((memory) => (
                    <RealMemoryCard
                      key={memory.id}
                      memory={memory}
                      onClick={() => setSelectedMemory(memory)}
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
                      Try adjusting your search query or category filter.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Memory Detail Modal */}
      <AnimatePresence>
        {selectedMemory && (
          <MemoryDetailModal
            memory={selectedMemory}
            onClose={() => setSelectedMemory(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Real Memory Card Component for API data
function RealMemoryCard({ memory, onClick }: { memory: ApiMemoryEntry, onClick: () => void }) {
  const config = categoryConfig[memory.type as keyof typeof categoryConfig]
  const IconComponent = config?.icon || FileText

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="glass-morphism p-6 border-[hsl(var(--command-border))] hover:border-[hsl(var(--command-accent))]/50 cursor-pointer group transition-all duration-300"
      onClick={onClick}
    >
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
                {new Date(memory.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {memory.wordCount} words
              </div>
            </div>
            <Badge variant="outline" className={cn("text-xs", config?.color)}>
              {config?.label || memory.type}
            </Badge>
          </div>

          {memory.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {memory.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">
                  {tag}
                </Badge>
              ))}
              {memory.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  +{memory.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Memory Detail Modal Component
function MemoryDetailModal({ memory, onClose }: { memory: ApiMemoryEntry, onClose: () => void }) {
  const config = categoryConfig[memory.type as keyof typeof categoryConfig]
  const IconComponent = config?.icon || FileText

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
              <div className={cn("p-2 glass-morphism rounded-lg")}>
                <IconComponent className={cn("h-5 w-5", config?.color || "text-[hsl(var(--command-accent))]")} />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold">{memory.title}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-[hsl(var(--command-text-muted))]">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(memory.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {memory.wordCount} words
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    {memory.tags.length} tags
                  </div>
                  <Badge variant="outline" className={cn("text-xs ml-2", config?.color)}>
                    {config?.label || memory.type}
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
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
              {memory.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="text-xs text-[hsl(var(--command-text-muted))]">
              OpenClaw Memory • {memory.type}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}