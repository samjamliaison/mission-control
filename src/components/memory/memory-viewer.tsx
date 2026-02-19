"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  X
} from "lucide-react"
import { MemoryEntry } from "./memory-entry"
import { MemoryCard } from "./memory-card"
import { cn } from "@/lib/utils"

// Mock memory data
const mockMemories: MemoryEntry[] = [
  {
    _id: "1",
    title: "Mission Control UI Design Decisions",
    content: `# Mission Control UI Design Decisions

## Font Choices
- **Body**: Geist - Clean, readable, modern sans-serif
- **Headings**: Plus Jakarta Sans - Friendly but professional
- **Display**: Clash Display - Bold, commanding presence

## Color Palette
- **Background**: #09090b (deep dark)
- **Accents**: #06b6d4 (cyan-400), #0ea5e9 (blue-500)
- **Glass morphism with backdrop-blur for premium feel

## Key Insights
The Bloomberg Terminal aesthetic works perfectly for a command center. Users respond positively to the "luxury dark" theme that feels both professional and futuristic.

## Lessons Learned
- Avoid generic shadcn defaults
- Glass morphism > flat cards
- Micro-animations make huge difference in perceived quality`,
    category: "lessons",
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
    tags: ["design", "ui", "lessons", "mission-control"],
    author: "Claude",
    wordCount: 145
  },
  {
    _id: "2",
    title: "Daily Notes - Feb 19, 2024",
    content: `# Daily Notes - February 19, 2024

## Tasks Completed
- ✅ Redesigned Tasks Board with premium command center UI
- ✅ Built Content Pipeline with 5-stage kanban workflow  
- ✅ Implemented Calendar view with monthly/weekly modes
- ✅ Started Memory viewer component

## Key Decisions
- Switched to Geist + Plus Jakarta Sans fonts
- Updated color scheme to deep dark (#09090b) with cyan accents
- Added glassmorphism effects throughout
- Implemented smooth Framer Motion animations

## Agent Interactions
- **Monica**: Working on content pipeline ideation stage
- **Jarvis**: Focused on research sprint planning
- **Luna**: Managing multiple platform content creation
- **Manus**: Handling system health monitoring
- **Hamza**: Overseeing mission critical reviews

## Tomorrow's Priorities
- Complete Memory viewer
- Build Team status dashboard
- Implement Office visualization
- Add comprehensive testing suite`,
    category: "daily",
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
    tags: ["daily", "progress", "agents", "development"],
    author: "Claude", 
    wordCount: 186
  },
  {
    _id: "3",
    title: "OpenClaw Agent Coordination Patterns",
    content: `# OpenClaw Agent Coordination Patterns

## Core Principles
The multi-agent system works best when each agent has:
1. **Clear domain expertise** - Distinct skills and responsibilities
2. **Overlapping capabilities** - Can cover for each other when needed  
3. **Consistent communication protocols** - Standard formats for handoffs

## Agent Personalities & Strengths

### Hamza 👤 (Mission Commander)
- Strategic oversight and decision making
- Final authority on priority changes
- Excellent at stakeholder communication

### Manus 🤘 (Systems Engineer) 
- Infrastructure and automation
- Monitoring and performance optimization
- Technical problem solving

### Monica ✈️ (Creative Lead)
- Content strategy and creation
- Brand voice consistency  
- Multi-platform coordination

### Jarvis 🔍 (Intelligence Analytics)
- Research and data analysis
- Market intelligence gathering
- Technical documentation

### Luna 🌙 (Multi-Platform Specialist)
- Cross-platform content adaptation
- Workflow optimization
- Quality assurance

## Coordination Mechanisms
- **Daily sync**: Status updates and priority alignment
- **Handoff protocols**: Clear deliverable specifications
- **Escalation paths**: When to involve Hamza for decisions
- **Resource sharing**: Collaborative access to tools and data`,
    category: "knowledge", 
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 3,
    tags: ["agents", "coordination", "workflow", "teamwork"],
    author: "Claude",
    wordCount: 234
  },
  {
    _id: "4",
    title: "React + Next.js Best Practices",
    content: `# React + Next.js Best Practices

## Component Architecture
- Use \`"use client"\` directive for interactive components
- Separate data fetching from UI components
- Implement proper loading and error states

## Performance Optimizations
- Dynamic imports for large components
- Image optimization with Next.js Image component
- Proper memoization with useMemo and useCallback

## Type Safety
- Strict TypeScript configuration
- Interface definitions for all props
- Proper error handling with try/catch

## State Management
- useState for local state
- useContext for shared state
- Consider Zustand for complex global state

## Animation Best Practices
- Framer Motion for complex animations
- CSS transforms over position changes
- Respect user's motion preferences

## Common Pitfalls to Avoid
- Don't use useEffect for data fetching in components
- Avoid prop drilling - use context when needed
- Don't forget to cleanup event listeners
- Always handle loading and error states`,
    category: "knowledge",
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 1,
    tags: ["react", "nextjs", "typescript", "development", "best-practices"],
    author: "Claude",
    wordCount: 178
  },
  {
    _id: "5", 
    title: "Content Creation Workflow Insights",
    content: `# Content Creation Workflow Insights

## Pipeline Stages Analysis
Based on implementing the content pipeline, the 5-stage workflow proves optimal:

1. **Ideation** - Raw concept generation
2. **Scripting** - Structured content development  
3. **Design** - Visual asset creation
4. **Production** - Final content assembly
5. **Published** - Live content deployment

## Platform-Specific Considerations

### YouTube
- Thumbnails critical for click-through rates
- Script should include hooks every 15-30 seconds
- SEO optimization for title and description

### Blog Posts  
- Header hierarchy important for readability
- Code snippets need syntax highlighting
- Internal linking strategy for SEO

### X/Twitter
- Thread structure with numbered tweets
- Visual breaks with images/GIFs
- Engagement hooks and CTAs

## Automation Opportunities
- Template generation for each platform
- Automated cross-posting with format adaptation
- Performance tracking and optimization suggestions

## Quality Control
Each stage needs specific review criteria and handoff requirements to maintain consistency across all content.`,
    category: "lessons",
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 86400000 * 1,
    tags: ["content", "workflow", "platforms", "optimization"],
    author: "Claude", 
    wordCount: 198
  }
]

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
      ease: "easeOut"
    }
  }
}

export function MemoryViewer() {
  const [memories] = useState<MemoryEntry[]>(mockMemories)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedMemory, setSelectedMemory] = useState<MemoryEntry | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Filter and search memories
  const filteredMemories = useMemo(() => {
    let filtered = memories

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(memory => memory.category === selectedCategory)
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

    // Sort by most recent
    return filtered.sort((a, b) => b.updatedAt - a.updatedAt)
  }, [memories, searchQuery, selectedCategory])

  // Memory statistics
  const totalMemories = memories.length
  const totalWords = memories.reduce((sum, memory) => sum + memory.wordCount, 0)
  const categoryCounts = memories.reduce((acc, memory) => {
    acc[memory.category] = (acc[memory.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (!mounted) return null

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
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg glass-morphism glow-border">
                    <Brain className="h-6 w-6 text-[hsl(var(--command-accent))]" />
                  </div>
                  <h1 className="text-4xl font-display font-bold text-premium">
                    Memory Vault
                  </h1>
                </div>
                <p className="text-[hsl(var(--command-text-muted))] text-lg max-w-2xl">
                  Centralized knowledge repository and learning archive. Searchable insights, daily notes, and accumulated wisdom.
                </p>
              </div>
              
              {/* Knowledge Stats */}
              <div className="flex items-center gap-4">
                <motion.div 
                  className="glass-morphism p-4 rounded-xl space-y-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2">
                    <Archive className="h-4 w-4 text-[hsl(var(--command-success))]" />
                    <span className="text-sm font-medium">Knowledge Base</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-display font-bold text-[hsl(var(--command-success))]">
                      {totalMemories}
                    </div>
                    <div className="text-xs text-[hsl(var(--command-text-muted))] space-y-1">
                      <div>{totalWords.toLocaleString()} words</div>
                      <div>{filteredMemories.length} shown</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

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
                            {category === "All" && <span>All Categories</span>}
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

          {/* Memory Grid */}
          <motion.div variants={itemVariants}>
            {filteredMemories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredMemories.map((memory) => (
                    <MemoryCard
                      key={memory._id}
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

// Memory Detail Modal Component
function MemoryDetailModal({ memory, onClose }: { memory: MemoryEntry, onClose: () => void }) {
  const categoryConfig = {
    "daily": { icon: Calendar, color: "text-blue-400" },
    "knowledge": { icon: BookOpen, color: "text-green-400" },
    "lessons": { icon: Lightbulb, color: "text-yellow-400" }
  }
  
  const config = categoryConfig[memory.category as keyof typeof categoryConfig]
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
                    {new Date(memory.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {memory.wordCount} words
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    {memory.tags.length} tags
                  </div>
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
            <div className="flex items-center gap-2">
              {memory.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="text-xs text-[hsl(var(--command-text-muted))]">
              Created by {memory.author}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}