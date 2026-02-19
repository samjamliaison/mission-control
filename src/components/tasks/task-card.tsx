"use client"

import { Draggable } from "@hello-pangea/dnd"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, User, Calendar, Clock, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Task {
  _id: string
  title: string
  description: string
  assignee: string
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  createdAt: number
  updatedAt: number
}

interface TaskCardProps {
  task: Task
  index: number
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
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

const priorityConfig = {
  low: {
    color: "hsl(var(--command-success))",
    bg: "bg-[hsl(var(--command-success))]/10",
    text: "text-[hsl(var(--command-success))]",
    border: "border-[hsl(var(--command-success))]/20",
    glow: "0 0 10px hsl(var(--command-success) / 0.3)"
  },
  medium: {
    color: "hsl(var(--command-warning))",
    bg: "bg-[hsl(var(--command-warning))]/10",
    text: "text-[hsl(var(--command-warning))]",
    border: "border-[hsl(var(--command-warning))]/20",
    glow: "0 0 10px hsl(var(--command-warning) / 0.3)"
  },
  high: {
    color: "hsl(var(--command-danger))",
    bg: "bg-[hsl(var(--command-danger))]/10",
    text: "text-[hsl(var(--command-danger))]",
    border: "border-[hsl(var(--command-danger))]/20",
    glow: "0 0 10px hsl(var(--command-danger) / 0.3)"
  }
}

export function TaskCard({ task, index, onEdit, onDelete }: TaskCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    })
  }

  const agentColor = agentColors[task.assignee as keyof typeof agentColors] || agentColors["Hamza"]
  const priorityStyle = priorityConfig[task.priority]
  const isCompleted = task.status === "done"
  const isActive = task.status === "in-progress"

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
    <Draggable draggableId={task._id} index={index}>
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
            snapshot.isDragging && "z-50 rotate-3"
          )}
        >
          <Card
            className={cn(
              "glass-morphism border-[hsl(var(--command-border-bright))] relative overflow-hidden transition-all duration-300",
              "priority-bar",
              `priority-${task.priority}`,
              snapshot.isDragging && "shadow-2xl shadow-[hsl(var(--command-accent))]/20 ring-2 ring-[hsl(var(--command-accent))]/40",
              isCompleted && "opacity-75",
              isActive && "ring-1 ring-[hsl(var(--command-accent))]/20"
            )}
            style={{
              boxShadow: snapshot.isDragging 
                ? `0 20px 40px rgba(0,0,0,0.4), ${priorityStyle.glow}`
                : isActive 
                  ? `0 4px 20px rgba(0,0,0,0.1), ${priorityStyle.glow}`
                  : "0 4px 20px rgba(0,0,0,0.1)"
            }}
          >
            {/* Priority glow overlay */}
            <div 
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 0% 50%, ${priorityStyle.color} 0%, transparent 50%)`
              }}
            />

            {/* Active pulse for in-progress tasks */}
            {isActive && (
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
                  isCompleted && "line-through text-[hsl(var(--command-text-muted))]"
                )}>
                  {task.title}
                </h3>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-[hsl(var(--command-accent))]/20 hover:text-[hsl(var(--command-accent))]"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(task)
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
                      onDelete(task._id)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 space-y-4">
              {task.description && (
                <p className={cn(
                  "text-xs text-[hsl(var(--command-text-muted))] line-clamp-3",
                  isCompleted && "line-through opacity-60"
                )}>
                  {task.description}
                </p>
              )}
              
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
                    {agentAvatars[task.assignee as keyof typeof agentAvatars]}
                  </span>
                  <span className={cn("text-xs font-medium", agentColor.text)}>
                    {task.assignee}
                  </span>
                </div>
                
                {isActive && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="p-1"
                  >
                    <Zap className="h-3 w-3 text-[hsl(var(--command-accent))]" />
                  </motion.div>
                )}
              </div>
              
              {/* Priority & Metadata */}
              <div className="flex items-center justify-between text-xs">
                <Badge 
                  variant="outline"
                  className={cn(
                    "text-xs font-bold",
                    priorityStyle.bg,
                    priorityStyle.text,
                    priorityStyle.border
                  )}
                  style={{
                    boxShadow: priorityStyle.glow
                  }}
                >
                  {task.priority.toUpperCase()}
                </Badge>
                
                <div className="flex items-center gap-1 text-[hsl(var(--command-text-dim))]">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(task.createdAt)}</span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[hsl(var(--command-text-dim))]">
                  <Clock className="h-3 w-3" />
                  <span>Updated {formatDate(task.updatedAt)}</span>
                </div>
                
                {isCompleted && (
                  <div className="flex items-center gap-1 text-[hsl(var(--command-success))]">
                    <div className="w-2 h-2 bg-[hsl(var(--command-success))] rounded-full animate-pulse" />
                    <span className="text-xs font-medium">Complete</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Draggable>
  )
}