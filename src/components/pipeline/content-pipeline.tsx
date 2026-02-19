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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Filter, Video, Activity, Users, Target, Film, Download, FileText } from "lucide-react"
import { ContentColumn } from "./content-column"
import { AddContentDialog } from "./add-content-dialog"
import { ContentDetailPanel } from "./content-detail-panel"
import { ContentItem } from "@/types/content"
import { PageHeader } from "@/components/ui/page-header"
import { StatsCard } from "@/components/ui/stats-card"
import { EmptyState } from "@/components/ui/empty-state"
import { loadContent, saveContent } from "@/lib/data-persistence"
import { useToastActions } from "@/components/ui/toast"
import { exportPipelineAsJSON, downloadFile, generateFilename } from "@/lib/export-utils"

// Note: Content is now loaded from localStorage via loadContent()

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
      duration: 0.2,
      ease: [0.04, 0.62, 0.23, 0.98] as any
    }
  }
}

export function ContentPipeline() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [selectedPlatform, setSelectedPlatform] = useState("All")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null)
  const [detailPanelOpen, setDetailPanelOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [mounted, setMounted] = useState(false)
  const toast = useToastActions()

  // Load data from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const loadedContent = loadContent()
    setContent(loadedContent)
  }, [])

  // Save content whenever it changes
  useEffect(() => {
    if (mounted) {
      saveContent(content)
    }
  }, [content, mounted])

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
    
    setContent(prevContent => {
      // Create a new array of content
      const newContent = [...prevContent]
      
      // Find the dragged item
      const draggedItemIndex = newContent.findIndex(item => item._id === draggableId)
      const draggedItem = newContent[draggedItemIndex]
      
      if (!draggedItem) return prevContent
      
      // Remove the item from its original position
      newContent.splice(draggedItemIndex, 1)
      
      // Update the item's status
      const updatedItem = { ...draggedItem, status: newStatus, updatedAt: Date.now() }
      
      // If moving to a different column, add at the specified index within that column
      if (source.droppableId !== destination.droppableId) {
        // Find all items in the destination column
        const destColumnItems = newContent.filter(item => item.status === newStatus)
        
        // Calculate the correct insertion position in the overall array
        const insertIndex = destination.index === 0 
          ? newContent.findIndex(item => item.status === newStatus)
          : Math.min(
              newContent.findIndex(item => item.status === newStatus) + destination.index,
              newContent.length
            )
        
        // Insert the item at the calculated position
        newContent.splice(Math.max(0, insertIndex), 0, updatedItem)
      } else {
        // Moving within the same column - handle reordering
        const sourceColumnItems = newContent.filter(item => item.status === newStatus)
        const firstColumnIndex = newContent.findIndex(item => item.status === newStatus)
        
        // Insert at the new position within the same column
        const insertIndex = firstColumnIndex + destination.index
        newContent.splice(insertIndex, 0, updatedItem)
      }
      
      return newContent
    })
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
      toast.success('Content Updated', `"${contentData.title}" has been successfully updated.`)
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
      toast.success('Content Added', `"${contentData.title}" added to ${contentData.platform} pipeline.`)
    }
    setEditingContent(null)
  }

  const handleViewContent = (item: ContentItem) => {
    setSelectedContent(item)
    setDetailPanelOpen(true)
  }

  const handleEditContent = (item: ContentItem) => {
    setEditingContent(item)
    setDialogOpen(true)
    // Close detail panel if it's open
    if (detailPanelOpen) {
      setDetailPanelOpen(false)
    }
  }

  const handleDeleteContent = (itemId: string) => {
    setContent(prevContent => prevContent.filter(item => item._id !== itemId))
    // Close detail panel if the deleted item was selected
    if (selectedContent?._id === itemId) {
      setDetailPanelOpen(false)
      setSelectedContent(null)
    }
  }

  const handleAddNewContent = () => {
    setEditingContent(null)
    setDialogOpen(true)
  }

  const handleExportPipeline = () => {
    const jsonContent = exportPipelineAsJSON(content)
    downloadFile(jsonContent, generateFilename('mission-control-pipeline', 'json'), 'application/json')
    toast.success('Export Complete', `Pipeline exported as JSON (${content.length} items)`)
  }

  const totalContent = content.length
  const publishedContent = content.filter(item => item.status === "published").length
  const inProductionContent = content.filter(item => item.status === "filming" || item.status === "thumbnail").length
  const completionRate = totalContent > 0 ? Math.round((publishedContent / totalContent) * 100) : 0

  if (!mounted) return null

  return (
    <div className="min-h-[calc(100vh-5rem)] relative" data-testid="content-pipeline">
      {/* Command Center Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-[hsl(var(--command-background))] via-[hsl(220_13%_3%)] to-[hsl(var(--command-background))] pointer-events-none" />
      
      <motion.div 
        className="relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-none space-y-6">
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

          <motion.div variants={itemVariants} className="space-y-4">
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

              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        variant="outline"
                        className="glass-morphism border-[hsl(var(--command-accent))]/30 text-[hsl(var(--command-accent))] hover:bg-[hsl(var(--command-accent))]/10 font-semibold px-4"
                        title="Export pipeline data"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-morphism border-[hsl(var(--command-border-bright))]">
                    <DropdownMenuItem onClick={handleExportPipeline} className="cursor-pointer focus:bg-[hsl(var(--command-accent))]/10">
                      <FileText className="h-4 w-4 mr-2" />
                      Export as JSON
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

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
            </div>
          </motion.div>

          {/* Content Pipeline or Empty State */}
          <motion.div variants={itemVariants}>
            {content.length === 0 ? (
              <EmptyState
                icon="🎬"
                title="Content Pipeline Ready for Launch"
                description="Your creative command center is empty. Begin building your content strategy from ideation to publication across all platforms. Time to create something extraordinary."
                actionLabel="Create First Content"
                onAction={handleAddNewContent}
              />
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto pb-4">
                  <ContentColumn
                    title="Ideation"
                    stage="idea"
                    content={contentByStatus.idea}
                    onViewContent={handleViewContent}
                    onEditContent={handleEditContent}
                    onDeleteContent={handleDeleteContent}
                  />
                  <ContentColumn
                    title="Scripting"
                    stage="script"
                    content={contentByStatus.script}
                    onViewContent={handleViewContent}
                    onEditContent={handleEditContent}
                    onDeleteContent={handleDeleteContent}
                  />
                  <ContentColumn
                    title="Design"
                    stage="thumbnail"
                    content={contentByStatus.thumbnail}
                    onViewContent={handleViewContent}
                    onEditContent={handleEditContent}
                    onDeleteContent={handleDeleteContent}
                  />
                  <ContentColumn
                    title="Production"
                    stage="filming"
                    content={contentByStatus.filming}
                    onViewContent={handleViewContent}
                    onEditContent={handleEditContent}
                    onDeleteContent={handleDeleteContent}
                  />
                  <ContentColumn
                    title="Published"
                    stage="published"
                    content={contentByStatus.published}
                    onViewContent={handleViewContent}
                    onEditContent={handleEditContent}
                    onDeleteContent={handleDeleteContent}
                  />
                </div>
              </DragDropContext>
            )}
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

      {/* Content Detail Panel */}
      <ContentDetailPanel
        open={detailPanelOpen}
        onOpenChange={setDetailPanelOpen}
        content={selectedContent}
        onEdit={handleEditContent}
      />
    </div>
  )
}