"use client"

import { Draggable } from "@hello-pangea/dnd"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, User, Calendar, Clock, Video, ExternalLink, FileText, Users, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ContentItem {
  _id: string
  title: string
  description: string
  platform: "YouTube" | "Blog" | "X"
  scriptText: string
  thumbnailUrl: string
  status: "idea" | "script" | "thumbnail" | "filming" | "published"
  assignee: string
  createdAt: number
  updatedAt: number
}

interface ContentItemCardProps {
  content: ContentItem
  index: number
  onEdit: (content: ContentItem) => void
  onDelete: (contentId: string) => void
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
    border: "border-blue-500/20",
    glow: "0 0 15px hsl(199 89% 48% / 0.3)"
  },
  "Manus": {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    glow: "0 0 15px hsl(270 70% 50% / 0.3)"
  },
  "Monica": {
    bg: "bg-pink-500/10",
    text: "text-pink-400",
    border: "border-pink-500/20",
    glow: "0 0 15px hsl(320 70% 60% / 0.3)"
  },
  "Jarvis": {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/20",
    glow: "0 0 15px hsl(240 70% 60% / 0.3)"
  },
  "Luna": {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
    glow: "0 0 15px hsl(180 70% 60% / 0.3)"
  }
}

const platformConfig = {
  "YouTube": {
    icon: Video,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    glow: "0 0 10px hsl(0 70% 50% / 0.3)"
  },
  "Blog": {
    icon: FileText,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20", 
    glow: "0 0 10px hsl(120 70% 50% / 0.3)"
  },
  "X": {
    icon: Users,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    glow: "0 0 10px hsl(210 70% 50% / 0.3)"
  }
}

export function ContentItemCard({ content, index, onEdit, onDelete }: ContentItemCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    })
  }

  const agentColor = agentColors[content.assignee as keyof typeof agentColors] || agentColors["Hamza"]
  const platformStyle = platformConfig[content.platform]
  const isPublished = content.status === "published"
  const isInProduction = content.status === "filming" || content.status === "thumbnail"

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <Draggable draggableId={content._id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={cn(
            "mb-4 cursor-grab active:cursor-grabbing group relative",
            snapshot.isDragging && "z-50 rotate-2"
          )}
        >
          <Card
            className={cn(
              "glass-morphism border-[hsl(var(--command-border-bright))] relative overflow-hidden transition-all duration-300",
              snapshot.isDragging && "shadow-2xl shadow-[hsl(var(--command-accent))]/20 ring-2 ring-[hsl(var(--command-accent))]/40",
              isPublished && "opacity-75",
              isInProduction && "ring-1 ring-[hsl(var(--command-accent))]/20"
            )}
            style={{
              boxShadow: snapshot.isDragging 
                ? `0 20px 40px rgba(0,0,0,0.4), ${platformStyle.glow}`
                : isInProduction 
                  ? `0 4px 20px rgba(0,0,0,0.1), ${platformStyle.glow}`
                  : "0 4px 20px rgba(0,0,0,0.1)"
            }}
          >
            {/* Platform glow overlay */}
            <div 
              className="absolute inset-0 opacity-3 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 0% 50%, ${platformStyle.color.replace('text-', 'hsl(var(--')} 0%, transparent 50%)`
              }}
            />

            {/* Active pulse for in-production content */}
            {isInProduction && (
              <motion.div
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-0 right-0 w-3 h-3 bg-[hsl(var(--command-accent))] rounded-full m-2"
              />
            )}

            <CardHeader className="pb-3 relative">
              <div className="flex items-start justify-between gap-2">
                <h3 className={cn(
                  "font-heading font-semibold text-sm leading-tight pr-2",
                  isPublished && "line-through text-[hsl(var(--command-text-muted))]"
                )}>
                  {content.title}
                </h3>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-[hsl(var(--command-accent))]/20 hover:text-[hsl(var(--command-accent))]"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(content)
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-[hsl(var(--command-danger))]/20 hover:text-[hsl(var(--command-danger))]"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(content._id)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 space-y-4">
              {content.description && (
                <p className={cn(
                  "text-xs text-[hsl(var(--command-text-muted))] line-clamp-3",
                  isPublished && "line-through opacity-60"
                )}>
                  {content.description}
                </p>
              )}

              {/* Platform & Script Preview */}
              <div className="space-y-2">
                <div 
                  className={cn(
                    "flex items-center gap-2 px-2 py-1 rounded-lg glass-morphism",
                    platformStyle.bg,
                    platformStyle.border
                  )}
                  style={{
                    boxShadow: platformStyle.glow
                  }}
                >
                  <platformStyle.icon className={cn("h-4 w-4", platformStyle.color)} />
                  <span className={cn("text-xs font-medium", platformStyle.color)}>
                    {content.platform}
                  </span>
                </div>

                {content.scriptText && (
                  <div className="glass-morphism p-2 rounded-lg">
                    <p className="text-xs text-[hsl(var(--command-text-dim))] line-clamp-2 font-mono">
                      {content.scriptText}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Agent Assignment */}
              <div className="flex items-center gap-2">
                <div 
                  className={cn(
                    "flex items-center gap-2 px-2 py-1 rounded-lg glass-morphism",
                    agentColor.bg,
                    agentColor.border
                  )}
                  style={{
                    boxShadow: agentColor.glow
                  }}
                >
                  <span className="text-base">
                    {agentAvatars[content.assignee as keyof typeof agentAvatars]}
                  </span>
                  <span className={cn("text-xs font-medium", agentColor.text)}>
                    {content.assignee}
                  </span>
                </div>
                
                {isInProduction && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="p-1"
                  >
                    <Zap className="h-3 w-3 text-[hsl(var(--command-accent))]" />
                  </motion.div>
                )}

                {content.thumbnailUrl && (
                  <Badge variant="outline" className="text-xs bg-[hsl(var(--command-accent))]/10 text-[hsl(var(--command-accent))] border-[hsl(var(--command-accent))]/20">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Asset
                  </Badge>
                )}
              </div>
              
              {/* Metadata */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-[hsl(var(--command-text-dim))]">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(content.createdAt)}</span>
                </div>
                
                {isPublished && (
                  <div className="flex items-center gap-1 text-[hsl(var(--command-success))]">
                    <div className="w-2 h-2 bg-[hsl(var(--command-success))] rounded-full animate-pulse" />
                    <span className="text-xs font-medium">Live</span>
                  </div>
                )}
              </div>

              {/* Updated timestamp */}
              <div className="flex items-center gap-1 text-xs text-[hsl(var(--command-text-dim))]">
                <Clock className="h-3 w-3" />
                <span>Updated {formatDate(content.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Draggable>
  )
}