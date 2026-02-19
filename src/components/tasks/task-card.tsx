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
            "mb-3 cursor-grab active:cursor-grabbing group relative",
            snapshot.isDragging && "z-50 rotate-3"
          )}
        >
          <Card
            className={cn(
              "backdrop-blur-xl bg-gradient-to-br from-[hsl(var(--command-surface-elevated))]/95 to-[hsl(var(--command-surface))]/90",
              "border border-white/5 rounded-xl relative overflow-hidden card-hover-premium",
              snapshot.isDragging && "shadow-2xl shadow-[hsl(var(--command-accent))]/30 ring-2 ring-[hsl(var(--command-accent))]/50 scale-[1.02]",
              isCompleted && "opacity-70",
              isActive && "ring-1 ring-[hsl(var(--command-accent))]/30"
            )}
            style={{
              boxShadow: snapshot.isDragging 
                ? `0 25px 50px rgba(0,0,0,0.5), 0 0 20px ${priorityStyle.color}40`
                : isActive 
                  ? `0 8px 32px rgba(0,0,0,0.2), 0 0 10px ${priorityStyle.color}30`
                  : "0 6px 24px rgba(0,0,0,0.15)"
            }}
          >
            {/* Priority left border indicator */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
              style={{
                background: `linear-gradient(180deg, ${priorityStyle.color}, ${priorityStyle.color}80)`
              }}
            />
            
            {/* Priority glow overlay */}
            <div 
              className="absolute inset-0 opacity-3 pointer-events-none rounded-xl"
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

            <CardHeader className="pb-3 pt-5 px-5 relative">
              <div className="flex items-start justify-between gap-3">
                <h3 className={cn(
                  "font-semibold text-body-large flex-1",
                  isCompleted && "line-through text-muted"
                )}>
                  {task.title}
                </h3>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-[hsl(var(--command-accent))]/20 hover:text-[hsl(var(--command-accent))] rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(task)
                    }}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-[hsl(var(--command-danger))]/20 hover:text-[hsl(var(--command-danger))] rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(task._id)
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 pb-5 px-5 space-y-3">
              {task.description && (
                <p className={cn(
                  "text-body-small text-secondary line-clamp-3",
                  isCompleted && "line-through opacity-60"
                )}>
                  {task.description}
                </p>
              )}
              
              {/* Agent Assignment */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {/* Agent Avatar Circle */}
                  <div 
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                      "backdrop-blur-md border",
                      agentColor.bg,
                      agentColor.border
                    )}
                    style={{
                      boxShadow: `0 0 12px ${agentColor.glow.match(/hsl\([^)]+\)/)?.[0]}40`
                    }}
                  >
                    <span>{agentAvatars[task.assignee as keyof typeof agentAvatars]}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className={cn("text-body-small font-semibold", agentColor.text)}>
                      {task.assignee}
                    </span>
                    <span className="text-body-small text-muted">
                      Agent
                    </span>
                  </div>
                </div>
                
                {isActive && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="p-1 bg-[hsl(var(--command-accent))]/10 rounded-full"
                  >
                    <Zap className="h-3 w-3 text-[hsl(var(--command-accent))]" />
                  </motion.div>
                )}
              </div>
              
              {/* Priority & Metadata */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {/* Priority dot indicator */}
                  <div className="flex items-center gap-1.5">
                    <motion.div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: priorityStyle.color }}
                      animate={{
                        boxShadow: isActive 
                          ? [`0 0 0px ${priorityStyle.color}`, `0 0 8px ${priorityStyle.color}`, `0 0 0px ${priorityStyle.color}`]
                          : `0 0 4px ${priorityStyle.color}`
                      }}
                      transition={{
                        boxShadow: {
                          duration: 2,
                          repeat: isActive ? Infinity : 0,
                          ease: "easeInOut"
                        }
                      }}
                    />
                    <span className={cn("text-body-small font-semibold", priorityStyle.text)}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-muted text-body-small">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(task.createdAt)}</span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-body-small text-muted">
                  <Clock className="h-3 w-3" />
                  <span>Updated {formatDate(task.updatedAt)}</span>
                </div>
                
                {isCompleted && (
                  <div className="flex items-center gap-1 text-[hsl(var(--command-success))]">
                    <div className="w-2 h-2 bg-[hsl(var(--command-success))] rounded-full animate-pulse" />
                    <span className="text-body-small font-semibold">Complete</span>
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