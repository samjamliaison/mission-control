"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { 
  X,
  Edit,
  Eye,
  TrendingUp,
  Calendar,
  Clock,
  User,
  FileText,
  Video,
  Twitter,
  Mic,
  Target,
  Zap,
  Tag,
  BarChart3,
  Share,
  Link,
  MessageSquare,
  ThumbsUp,
  Play,
  Download,
  Globe,
  Hash,
  Type,
  AlignLeft,
  Timer,
  Flag
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ContentItem } from "@/types/content"

interface ContentDetailPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: ContentItem | null
  onEdit: (content: ContentItem) => void
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

const contentTypeConfig = {
  "video": {
    icon: Video,
    emoji: "🎥",
    color: "#ef4444",
    label: "Video Content"
  },
  "article": {
    icon: FileText,
    emoji: "📝", 
    color: "#10b981",
    label: "Article/Blog"
  },
  "social": {
    icon: Twitter,
    emoji: "🐦",
    color: "#3b82f6",
    label: "Social Media"
  },
  "podcast": {
    icon: Mic,
    emoji: "🎙️",
    color: "#8b5cf6",
    label: "Podcast"
  }
}

const statusConfig = {
  "idea": {
    label: "Ideation",
    color: "#6b7280",
    bg: "bg-gray-500/10",
    description: "Initial concept and brainstorming phase"
  },
  "script": {
    label: "Scripting", 
    color: "#f59e0b",
    bg: "bg-amber-500/10",
    description: "Content writing and script development"
  },
  "thumbnail": {
    label: "Design",
    color: "#8b5cf6", 
    bg: "bg-purple-500/10",
    description: "Visual design and thumbnail creation"
  },
  "filming": {
    label: "Production",
    color: "#ef4444",
    bg: "bg-red-500/10", 
    description: "Active filming or content creation"
  },
  "published": {
    label: "Published",
    color: "#10b981",
    bg: "bg-green-500/10",
    description: "Live and available to audience"
  }
}

const priorityConfig = {
  low: {
    color: "#10b981",
    bg: "bg-green-500/10",
    label: "Low Priority"
  },
  medium: {
    color: "#f59e0b",
    bg: "bg-amber-500/10",
    label: "Medium Priority"
  },
  high: {
    color: "#ef4444",
    bg: "bg-red-500/10",
    label: "High Priority"
  }
}

// Word count utility function
const countWords = (text: string): number => {
  if (!text || typeof text !== 'string') return 0
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

// Character count utility
const countCharacters = (text: string): number => {
  if (!text || typeof text !== 'string') return 0
  return text.length
}

// Reading time estimate (average 200 words per minute)
const estimateReadingTime = (wordCount: number): string => {
  if (wordCount === 0) return "0 min"
  const minutes = Math.ceil(wordCount / 200)
  return minutes === 1 ? "1 min" : `${minutes} mins`
}

// Video duration estimate (average 150 words per minute for narration)
const estimateVideoDuration = (wordCount: number): string => {
  if (wordCount === 0) return "0:00"
  const totalSeconds = Math.ceil(wordCount / 2.5) // 150 words per minute
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function ContentDetailPanel({ open, onOpenChange, content, onEdit }: ContentDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'script' | 'analytics' | 'timeline'>('overview')
  
  if (!content) return null

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric", 
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const platformToType: Record<string, keyof typeof contentTypeConfig> = {
    "YouTube": "video",
    "Blog": "article", 
    "X": "social",
    "Podcast": "podcast"
  }
  
  const contentType = (content.type as keyof typeof contentTypeConfig) || platformToType[content.platform] || "article"
  const typeConfig = contentTypeConfig[contentType]
  const agentColor = agentColors[content.assignee as keyof typeof agentColors] || agentColors["Hamza"]
  const statusData = statusConfig[content.status as keyof typeof statusConfig] || statusConfig["idea"]
  const priorityData = priorityConfig[content.priority as keyof typeof priorityConfig] || priorityConfig["medium"]
  
  // Content analytics
  const scriptWordCount = countWords(content.scriptText || "")
  const scriptCharCount = countCharacters(content.scriptText || "")
  const descriptionWordCount = countWords(content.description || "")
  const readingTime = estimateReadingTime(scriptWordCount)
  const videoDuration = estimateVideoDuration(scriptWordCount)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'script', label: 'Script & Content', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'timeline', label: 'Timeline', icon: Calendar }
  ]

  const panelVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring" as any,
        damping: 30,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      x: '100%',
      transition: {
        duration: 0.2
      }
    }
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent 
            className="sm:max-w-[90vw] lg:max-w-[70vw] max-h-[95vh] glass-morphism border-[hsl(var(--command-border-bright))] p-0 overflow-hidden"
            style={{ margin: "0", right: "0", top: "0", transform: "none", height: "100vh", maxHeight: "100vh", borderRadius: "0" }}
          >
            <motion.div
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="h-full flex flex-col"
            >
              {/* Header */}
              <div className="relative p-6 pb-4 border-b border-[hsl(var(--command-border))]">
                <div 
                  className="absolute inset-0 opacity-5"
                  style={{
                    background: `linear-gradient(135deg, ${typeConfig.color} 0%, transparent 70%)`
                  }}
                />
                
                <DialogHeader className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl backdrop-blur-sm border"
                          style={{
                            backgroundColor: `${typeConfig.color}15`,
                            borderColor: `${typeConfig.color}30`
                          }}
                        >
                          <span>{typeConfig.emoji}</span>
                        </div>
                        
                        <div className="flex-1">
                          <DialogTitle className="text-lg md:text-2xl font-semibold tracking-tight leading-tight">
                            {content.title}
                          </DialogTitle>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Badge 
                              variant="outline"
                              className="text-xs px-2 py-1"
                              style={{ 
                                backgroundColor: `${typeConfig.color}10`,
                                borderColor: `${typeConfig.color}30`,
                                color: typeConfig.color
                              }}
                            >
                              {typeConfig.label}
                            </Badge>
                            
                            <Badge 
                              variant="outline"
                              className="text-xs px-2 py-1"
                              style={{
                                backgroundColor: `${statusData.color}10`,
                                borderColor: `${statusData.color}30`,
                                color: statusData.color
                              }}
                            >
                              {statusData.label}
                            </Badge>
                            
                            <Badge 
                              variant="outline"
                              className="text-xs px-2 py-1"
                              style={{
                                backgroundColor: `${priorityData.color}10`,
                                borderColor: `${priorityData.color}30`,
                                color: priorityData.color
                              }}
                            >
                              {priorityData.label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <DialogDescription className="text-[hsl(var(--command-text-muted))] leading-relaxed">
                        {content.description || "No description provided for this content item."}
                      </DialogDescription>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(content)}
                        className="glass-morphism hover:bg-[hsl(var(--command-accent))]/20"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpenChange(false)}
                        className="glass-morphism hover:bg-[hsl(var(--command-danger))]/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </DialogHeader>
                
                {/* Tab Navigation */}
                <div className="flex items-center gap-1 mt-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    
                    return (
                      <Button
                        key={tab.id}
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                          "h-9 px-4 rounded-lg transition-all duration-200",
                          isActive 
                            ? "bg-[hsl(var(--command-accent))] text-white shadow-lg" 
                            : "glass-morphism hover:bg-[hsl(var(--command-surface))]/60"
                        )}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {tab.label}
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-6">
                <motion.div
                  key={activeTab}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Main Content Info */}
                      <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
                        {/* Status Card */}
                        <Card className="glass-morphism border-[hsl(var(--command-border))]">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Flag className="h-5 w-5 text-[hsl(var(--command-accent))]" />
                              Content Status
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: statusData.color }}
                              />
                              <div>
                                <div className="font-semibold">{statusData.label}</div>
                                <div className="text-sm text-[hsl(var(--command-text-muted))]">
                                  {statusData.description}
                                </div>
                              </div>
                            </div>
                            
                            {content.platform && (
                              <div className="flex items-center gap-3">
                                <Globe className="h-4 w-4 text-[hsl(var(--command-text-muted))]" />
                                <div>
                                  <div className="font-semibold">Platform</div>
                                  <div className="text-sm text-[hsl(var(--command-text-muted))]">
                                    {content.platform}
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Script Analytics */}
                        {content.scriptText && (
                          <Card className="glass-morphism border-[hsl(var(--command-border))]">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-lg">
                                <Type className="h-5 w-5 text-[hsl(var(--command-accent))]" />
                                Content Metrics
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-3 glass-morphism rounded-lg">
                                  <div className="text-2xl font-bold text-[hsl(var(--command-accent))]">
                                    {scriptWordCount.toLocaleString()}
                                  </div>
                                  <div className="text-xs text-[hsl(var(--command-text-muted))]">
                                    Words
                                  </div>
                                </div>
                                
                                <div className="text-center p-3 glass-morphism rounded-lg">
                                  <div className="text-2xl font-bold text-[hsl(var(--command-accent))]">
                                    {scriptCharCount.toLocaleString()}
                                  </div>
                                  <div className="text-xs text-[hsl(var(--command-text-muted))]">
                                    Characters
                                  </div>
                                </div>
                                
                                <div className="text-center p-3 glass-morphism rounded-lg">
                                  <div className="text-2xl font-bold text-green-400">
                                    {contentType === "video" ? videoDuration : readingTime}
                                  </div>
                                  <div className="text-xs text-[hsl(var(--command-text-muted))]">
                                    {contentType === "video" ? "Est. Duration" : "Read Time"}
                                  </div>
                                </div>
                                
                                <div className="text-center p-3 glass-morphism rounded-lg">
                                  <div className="text-2xl font-bold text-purple-400">
                                    {Math.ceil(scriptWordCount / 100)}
                                  </div>
                                  <div className="text-xs text-[hsl(var(--command-text-muted))]">
                                    Paragraphs
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </motion.div>

                      {/* Sidebar */}
                      <motion.div variants={itemVariants} className="space-y-6">
                        {/* Creator Info */}
                        <Card className="glass-morphism border-[hsl(var(--command-border))]">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <User className="h-5 w-5 text-[hsl(var(--command-accent))]" />
                              Creator
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-3">
                              <div 
                                className={cn(
                                  "w-12 h-12 rounded-full flex items-center justify-center text-lg",
                                  agentColor.bg,
                                  agentColor.border,
                                  "border backdrop-blur-sm"
                                )}
                              >
                                <span>{agentAvatars[content.assignee as keyof typeof agentAvatars]}</span>
                              </div>
                              <div>
                                <div className={cn("font-semibold", agentColor.text)}>
                                  {content.assignee}
                                </div>
                                <div className="text-sm text-[hsl(var(--command-text-muted))]">
                                  Content Creator
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Timestamps */}
                        <Card className="glass-morphism border-[hsl(var(--command-border))]">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Clock className="h-5 w-5 text-[hsl(var(--command-accent))]" />
                              Timeline
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Calendar className="h-4 w-4 text-[hsl(var(--command-text-muted))]" />
                              <div>
                                <div className="font-semibold text-sm">Created</div>
                                <div className="text-xs text-[hsl(var(--command-text-muted))]">
                                  {formatDate(content.createdAt)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <Timer className="h-4 w-4 text-[hsl(var(--command-text-muted))]" />
                              <div>
                                <div className="font-semibold text-sm">Last Updated</div>
                                <div className="text-xs text-[hsl(var(--command-text-muted))]">
                                  {formatDate(content.updatedAt)}
                                </div>
                              </div>
                            </div>

                            {content.deadline && (
                              <div className="flex items-center gap-3">
                                <Zap className="h-4 w-4 text-[hsl(var(--command-warning))]" />
                                <div>
                                  <div className="font-semibold text-sm">Deadline</div>
                                  <div className="text-xs text-[hsl(var(--command-text-muted))]">
                                    {formatDate(content.deadline)}
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Performance (if published) */}
                        {content.status === "published" && (
                          <Card className="glass-morphism border-[hsl(var(--command-border))]">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-lg">
                                <TrendingUp className="h-5 w-5 text-[hsl(var(--command-success))]" />
                                Performance
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {content.views && (
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-[hsl(var(--command-text-muted))]" />
                                    <span className="text-sm">Views</span>
                                  </div>
                                  <span className="font-semibold text-[hsl(var(--command-accent))]">
                                    {content.views.toLocaleString()}
                                  </span>
                                </div>
                              )}
                              
                              {content.engagement && (
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <ThumbsUp className="h-4 w-4 text-[hsl(var(--command-text-muted))]" />
                                    <span className="text-sm">Engagement</span>
                                  </div>
                                  <span className="font-semibold text-[hsl(var(--command-success))]">
                                    {content.engagement}%
                                  </span>
                                </div>
                              )}
                              
                              {/* Shares analytics would go here */}
                            </CardContent>
                          </Card>
                        )}
                      </motion.div>
                    </div>
                  )}

                  {activeTab === 'script' && (
                    <motion.div variants={itemVariants} className="space-y-6">
                      <Card className="glass-morphism border-[hsl(var(--command-border))]">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <AlignLeft className="h-5 w-5 text-[hsl(var(--command-accent))]" />
                              Script Content
                            </CardTitle>
                            
                            {content.scriptText && (
                              <div className="flex items-center gap-4 text-sm text-[hsl(var(--command-text-muted))]">
                                <div className="flex items-center gap-1">
                                  <Hash className="h-3 w-3" />
                                  <span>{scriptWordCount} words</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Timer className="h-3 w-3" />
                                  <span>{contentType === "video" ? videoDuration : readingTime}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          {content.scriptText ? (
                            <div className="space-y-4">
                              <div className="p-4 bg-[hsl(var(--command-surface))]/50 rounded-lg border border-[hsl(var(--command-border))]">
                                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-[hsl(var(--command-text))]">
                                  {content.scriptText}
                                </pre>
                              </div>
                              
                              {/* Content Analysis */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-3 glass-morphism rounded-lg text-center">
                                  <div className="text-xl font-bold text-[hsl(var(--command-accent))]">
                                    {scriptWordCount}
                                  </div>
                                  <div className="text-xs text-[hsl(var(--command-text-muted))]">Total Words</div>
                                </div>
                                
                                <div className="p-3 glass-morphism rounded-lg text-center">
                                  <div className="text-xl font-bold text-green-400">
                                    {scriptCharCount}
                                  </div>
                                  <div className="text-xs text-[hsl(var(--command-text-muted))]">Characters</div>
                                </div>
                                
                                <div className="p-3 glass-morphism rounded-lg text-center">
                                  <div className="text-xl font-bold text-purple-400">
                                    {content.scriptText.split('\n').filter(line => line.trim()).length}
                                  </div>
                                  <div className="text-xs text-[hsl(var(--command-text-muted))]">Lines</div>
                                </div>
                                
                                <div className="p-3 glass-morphism rounded-lg text-center">
                                  <div className="text-xl font-bold text-orange-400">
                                    {Math.ceil(scriptWordCount / 100)}
                                  </div>
                                  <div className="text-xs text-[hsl(var(--command-text-muted))]">Est. Sections</div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <FileText className="h-12 w-12 mx-auto text-[hsl(var(--command-text-muted))] opacity-50 mb-4" />
                              <p className="text-[hsl(var(--command-text-muted))]">No script content available</p>
                              <Button
                                variant="ghost"
                                className="mt-4"
                                onClick={() => onEdit(content)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Add Script Content
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {activeTab === 'analytics' && (
                    <motion.div variants={itemVariants} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {content.status === "published" ? (
                          <>
                            <Card className="glass-morphism border-[hsl(var(--command-border))]">
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                  <Eye className="h-5 w-5 text-[hsl(var(--command-accent))]" />
                                  Reach
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-3xl font-bold text-[hsl(var(--command-accent))] mb-2">
                                  {content.views?.toLocaleString() || "0"}
                                </div>
                                <p className="text-sm text-[hsl(var(--command-text-muted))]">Total Views</p>
                              </CardContent>
                            </Card>

                            <Card className="glass-morphism border-[hsl(var(--command-border))]">
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                  <TrendingUp className="h-5 w-5 text-[hsl(var(--command-success))]" />
                                  Engagement
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-3xl font-bold text-[hsl(var(--command-success))] mb-2">
                                  {content.engagement || "0"}%
                                </div>
                                <p className="text-sm text-[hsl(var(--command-text-muted))]">Engagement Rate</p>
                              </CardContent>
                            </Card>

                            <Card className="glass-morphism border-[hsl(var(--command-border))]">
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                  <Share className="h-5 w-5 text-purple-400" />
                                  Shares
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-3xl font-bold text-purple-400 mb-2">
                                  {content.engagement || "0"}
                                </div>
                                <p className="text-sm text-[hsl(var(--command-text-muted))]">Engagement</p>
                              </CardContent>
                            </Card>
                          </>
                        ) : (
                          <div className="md:col-span-2 lg:col-span-3">
                            <Card className="glass-morphism border-[hsl(var(--command-border))]">
                              <CardContent className="text-center py-12">
                                <BarChart3 className="h-12 w-12 mx-auto text-[hsl(var(--command-text-muted))] opacity-50 mb-4" />
                                <p className="text-[hsl(var(--command-text-muted))] mb-2">Analytics Available After Publication</p>
                                <p className="text-sm text-[hsl(var(--command-text-muted))]">
                                  Performance metrics will appear once this content is published.
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'timeline' && (
                    <motion.div variants={itemVariants} className="space-y-6">
                      <Card className="glass-morphism border-[hsl(var(--command-border))]">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Calendar className="h-5 w-5 text-[hsl(var(--command-accent))]" />
                            Content Timeline
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="w-3 h-3 bg-blue-400 rounded-full" />
                              <div>
                                <div className="font-semibold">Content Created</div>
                                <div className="text-sm text-[hsl(var(--command-text-muted))]">
                                  {formatDate(content.createdAt)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div className="w-3 h-3 bg-green-400 rounded-full" />
                              <div>
                                <div className="font-semibold">Last Updated</div>
                                <div className="text-sm text-[hsl(var(--command-text-muted))]">
                                  {formatDate(content.updatedAt)}
                                </div>
                              </div>
                            </div>

                            {content.status === "published" && (
                              <div className="flex items-center gap-4">
                                <div className="w-3 h-3 bg-[hsl(var(--command-success))] rounded-full animate-pulse" />
                                <div>
                                  <div className="font-semibold text-[hsl(var(--command-success))]">Published</div>
                                  <div className="text-sm text-[hsl(var(--command-text-muted))]">
                                    Live and available to audience
                                  </div>
                                </div>
                              </div>
                            )}

                            {content.deadline && (
                              <div className="flex items-center gap-4">
                                <div className="w-3 h-3 bg-[hsl(var(--command-warning))] rounded-full" />
                                <div>
                                  <div className="font-semibold text-[hsl(var(--command-warning))]">Deadline</div>
                                  <div className="text-sm text-[hsl(var(--command-text-muted))]">
                                    {formatDate(content.deadline)}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}