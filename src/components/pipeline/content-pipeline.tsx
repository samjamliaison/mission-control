"use client"

import { useState, useMemo, useEffect } from "react"
import { DragDropContext, DropResult } from "@hello-pangea/dnd"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Filter, Video, Activity, Users, Target, Film } from "lucide-react"
import { ContentColumn } from "./content-column"
import { AddContentDialog } from "./add-content-dialog"
import { ContentItem } from "@/types/content"
import { PageHeader } from "@/components/ui/page-header"
import { StatsCard } from "@/components/ui/stats-card"

// Mock data for content pipeline
const mockContent: ContentItem[] = [
  {
    _id: "1",
    title: "OpenClaw Agent Orchestra Tutorial",
    description: "Complete guide on orchestrating multiple AI agents for complex workflows",
    platform: "YouTube",
    scriptText: "Welcome to the future of AI automation...",
    thumbnailUrl: "",
    status: "idea",
    assignee: "Monica",
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    _id: "2", 
    title: "Mission Control Deep Dive",
    description: "Behind the scenes of building the command center interface",
    platform: "Blog",
    scriptText: "The Mission Control dashboard represents a new paradigm...",
    thumbnailUrl: "",
    status: "script",
    assignee: "Jarvis",
    createdAt: Date.now() - 43200000,
    updatedAt: Date.now() - 3600000,
  },
  {
    _id: "3",
    title: "AI Agent Team Dynamics",
    description: "How our agent personalities complement each other in production",
    platform: "X",
    scriptText: "Thread: 1/12 - Let's talk about how AI agents work together...",
    thumbnailUrl: "https://example.com/thumbnail1.jpg",
    status: "thumbnail",
    assignee: "Luna",
    createdAt: Date.now() - 21600000,
    updatedAt: Date.now() - 21600000,
  },
  {
    _id: "4",
    title: "Building the Future of Work",
    description: "10-minute documentary on autonomous task management",
    platform: "YouTube",
    scriptText: "In a world where AI is reshaping how we work...",
    thumbnailUrl: "https://example.com/thumbnail2.jpg", 
    status: "filming",
    assignee: "Hamza",
    createdAt: Date.now() - 10800000,
    updatedAt: Date.now() - 10800000,
  },
  {
    _id: "5",
    title: "Week in AI: OpenClaw Highlights",
    description: "Weekly recap of major developments and achievements",
    platform: "X",
    scriptText: "This week in AI automation: Major breakthroughs in agent coordination...",
    thumbnailUrl: "https://example.com/thumbnail3.jpg",
    status: "published", 
    assignee: "Manus",
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 7200000,
  }
]

const platformOptions = ["All", "YouTube", "Blog", "X"]

const agentAvatars = {
  "Hamza": "👤",
  "Manus": "🤘", 
  "Monica": "✈️",
  "Jarvis": "🔍",
  "Luna": "🌙"
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

export function ContentPipeline() {
  const [content, setContent] = useState<ContentItem[]>(mockContent)
  const [selectedPlatform, setSelectedPlatform] = useState("All")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Filter content by platform
  const filteredContent = useMemo(() => {
    if (selectedPlatform === "All") return content
    return content.filter(item => item.platform === selectedPlatform)
  }, [content, selectedPlatform])

  // Group content by status
  const contentByStatus = useMemo(() => {
    return {
      idea: filteredContent.filter(item => item.status === "idea"),
      script: filteredContent.filter(item => item.status === "script"),
      thumbnail: filteredContent.filter(item => item.status === "thumbnail"),
      filming: filteredContent.filter(item => item.status === "filming"),
      published: filteredContent.filter(item => item.status === "published"),
    }
  }, [filteredContent])

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const newStatus = destination.droppableId as "idea" | "script" | "thumbnail" | "filming" | "published"
    
    setContent(prevContent => 
      prevContent.map(item => 
        item._id === draggableId 
          ? { ...item, status: newStatus, updatedAt: Date.now() }
          : item
      )
    )
  }

  const handleAddContent = (contentData: Partial<ContentItem>) => {
    if (editingContent) {
      setContent(prevContent =>
        prevContent.map(item =>
          item._id === editingContent._id
            ? { ...item, ...contentData, updatedAt: Date.now() }
            : item
        )
      )
    } else {
      const newContent: ContentItem = {
        _id: `content-${Date.now()}`,
        title: contentData.title!,
        description: contentData.description || "",
        platform: contentData.platform!,
        scriptText: contentData.scriptText || "",
        thumbnailUrl: contentData.thumbnailUrl || "",
        assignee: contentData.assignee!,
        status: "idea",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      setContent(prevContent => [newContent, ...prevContent])
    }
    setEditingContent(null)
  }

  const handleEditContent = (item: ContentItem) => {
    setEditingContent(item)
    setDialogOpen(true)
  }

  const handleDeleteContent = (itemId: string) => {
    setContent(prevContent => prevContent.filter(item => item._id !== itemId))
  }

  const handleAddNewContent = () => {
    setEditingContent(null)
    setDialogOpen(true)
  }

  const totalContent = content.length
  const publishedContent = content.filter(item => item.status === "published").length
  const inProductionContent = content.filter(item => item.status === "filming" || item.status === "thumbnail").length
  const completionRate = totalContent > 0 ? Math.round((publishedContent / totalContent) * 100) : 0

  if (!mounted) return null

  return (
    <div className="min-h-[calc(100vh-5rem)] relative">
      {/* Command Center Background Effects */}
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
            icon={Film}
            title="Content Pipeline"
            subtitle="Strategic content creation workflow. From ideation to publication across all platforms and channels."
          >
            <StatsCard
              icon={Target}
              label="Publication Rate"
              value={`${completionRate}%`}
              subLabel="Published"
              subValue={`${publishedContent}/${totalContent}`}
            />
          </PageHeader>

            {/* Command Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 glass-morphism p-2 rounded-lg">
                    <Filter className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                    <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                      <SelectTrigger className="w-44 border-0 bg-transparent focus:ring-1 focus:ring-[hsl(var(--command-accent))] font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-morphism border-[hsl(var(--command-border-bright))]">
                        {platformOptions.map((platform) => (
                          <SelectItem key={platform} value={platform} className="focus:bg-[hsl(var(--command-accent))]/10">
                            <div className="flex items-center gap-2">
                              {platform === "YouTube" && <Video className="h-4 w-4" />}
                              {platform === "X" && <span className="font-bold">𝕏</span>}
                              {platform === "Blog" && <span className="text-base">📝</span>}
                              <span>{platform}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedPlatform !== "All" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass-morphism px-3 py-1 rounded-full"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <Activity className="h-3 w-3 text-[hsl(var(--command-accent))]" />
                        <span className="text-[hsl(var(--command-text-muted))]">
                          {filteredContent.length} items
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Content Creator Status */}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[hsl(var(--command-text-muted))]" />
                  <div className="flex items-center gap-1">
                    {Object.entries(agentAvatars).map(([agent, avatar]) => {
                      const agentContent = content.filter(c => c.assignee === agent)
                      const activeContent = agentContent.filter(c => c.status !== "published").length
                      return (
                        <motion.div
                          key={agent}
                          className="relative group"
                          whileHover={{ scale: 1.1 }}
                        >
                          <div className="glass-morphism p-1.5 rounded-lg cursor-pointer">
                            <span className="text-sm">{avatar}</span>
                          </div>
                          {activeContent > 0 && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[hsl(var(--command-accent))] rounded-full flex items-center justify-center text-[10px] font-bold text-black">
                              {activeContent}
                            </div>
                          )}
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            <div className="glass-morphism px-2 py-1 rounded text-xs whitespace-nowrap">
                              {agent}: {activeContent} active
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={handleAddNewContent} 
                  className="btn-premium font-semibold px-6"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Content
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Pipeline */}
          <motion.div variants={itemVariants}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 overflow-x-auto pb-4">
                <ContentColumn
                  title="Ideation"
                  stage="idea"
                  content={contentByStatus.idea}
                  onEditContent={handleEditContent}
                  onDeleteContent={handleDeleteContent}
                />
                <ContentColumn
                  title="Scripting"
                  stage="script"
                  content={contentByStatus.script}
                  onEditContent={handleEditContent}
                  onDeleteContent={handleDeleteContent}
                />
                <ContentColumn
                  title="Design"
                  stage="thumbnail"
                  content={contentByStatus.thumbnail}
                  onEditContent={handleEditContent}
                  onDeleteContent={handleDeleteContent}
                />
                <ContentColumn
                  title="Production"
                  stage="filming"
                  content={contentByStatus.filming}
                  onEditContent={handleEditContent}
                  onDeleteContent={handleDeleteContent}
                />
                <ContentColumn
                  title="Published"
                  stage="published"
                  content={contentByStatus.published}
                  onEditContent={handleEditContent}
                  onDeleteContent={handleDeleteContent}
                />
              </div>
            </DragDropContext>
          </motion.div>
        </div>
      </motion.div>

      {/* Add/Edit Content Dialog */}
      <AddContentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleAddContent}
        editingContent={editingContent}
      />
    </div>
  )
}