"use client"

import { Draggable } from "@hello-pangea/dnd"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, User, Calendar, Clock, Zap, ExternalLink, Timer, Ban, Repeat } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { StarButton } from "@/components/ui/star-button"
import { TimeTracker } from "./time-tracker"
import { useTimeTracking } from "@/hooks/use-time-tracking"
import { cn } from "@/lib/utils"

export interface Task {
  _id: string
  title: string
  description: string
  assignee: string
  status: string
  priority: "low" | "medium" | "high"
  createdAt: number
  updatedAt: number
  dueDate?: number
  blockedBy?: string[]
  repeat?: "daily" | "weekly" | "monthly"
}

interface TaskCardProps {
  task: Task
  index: number
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  isSelected?: boolean
  onSelect?: (taskId: string, selected: boolean) => void
  showSelection?: boolean
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

export function TaskCard({ task, index, onEdit, onDelete, isSelected = false, onSelect, showSelection = false }: TaskCardProps) {
  const { getTotalTime, formatTime, getTaskTimeData } = useTimeTracking()
  const totalTime = getTotalTime(task._id)
  const isTracking = getTaskTimeData(task._id)?.isTracking || false

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    })
  }

  const getDueDateStatus = (dueDate: number) => {
    const now = new Date()
    const due = new Date(dueDate)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate())

    if (dueDay < today) return 'overdue'
    if (dueDay.getTime() === today.getTime()) return 'due-today'
    return 'upcoming'
  }

  const dueDateStatus = task.dueDate ? getDueDateStatus(task.dueDate) : null

  const agentColor = agentColors[task.assignee as keyof typeof agentColors] || agentColors["Hamza"]
  const priorityStyle = priorityConfig[task.priority]
  const isCompleted = task.status === "done"
  const isActive = task.status === "in-progress"
  const isBlocked = task.blockedBy && task.blockedBy.length > 0
  const isRecurring = !!task.repeat

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.04, 0.62, 0.23, 0.98] as any
      }
    }
  }

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...{
            ...provided.draggableProps,
            ...provided.dragHandleProps,
            onDragStart: undefined
          }}
          variants={cardVariants}
          initial="hidden"
          animate={{
            ...cardVariants.visible,
            scale: snapshot.isDragging ? 1.05 : 1,
            rotate: snapshot.isDragging ? 2 : 0,
            y: snapshot.isDragging ? -8 : 0,
          }}
          whileHover={!snapshot.isDragging ? { y: -2, scale: 1.01 } : {}}
          whileTap={!snapshot.isDragging ? { scale: 0.98 } : {}}
          layout="position"
          transition={{
            duration: snapshot.isDragging ? 0.15 : 0.4,
            ease: snapshot.isDragging ? [0.2, 0, 0.2, 1] : [0.23, 1, 0.32, 1],
            type: snapshot.isDragging ? "tween" : "spring",
            stiffness: snapshot.isDragging ? undefined : 120,
            damping: snapshot.isDragging ? undefined : 14
          }}
          className={cn(
            "mb-3 cursor-grab active:cursor-grabbing group relative select-none",
            snapshot.isDragging && "z-50"
          )}
          style={{
            transformOrigin: "center"
          }}
        >
          <Card
            className={cn(
              "backdrop-blur-xl bg-gradient-to-br from-[hsl(var(--command-surface-elevated))]/95 to-[hsl(var(--command-surface))]/90",
              "border border-white/5 rounded-xl relative overflow-hidden card-hover-premium transition-all duration-200",
              "task-card-print", // Print-friendly class
              snapshot.isDragging && "border-[hsl(var(--command-accent))]/40 bg-gradient-to-br from-[hsl(var(--command-surface-elevated))]/98 to-[hsl(var(--command-surface))]/95",
              isCompleted && !snapshot.isDragging && "opacity-70",
              isActive && !snapshot.isDragging && "ring-1 ring-[hsl(var(--command-accent))]/30"
            )}
            style={{
              boxShadow: snapshot.isDragging
                ? `0 32px 64px rgba(0,0,0,0.6), 0 16px 32px rgba(0,0,0,0.4), 0 0 32px ${priorityStyle.color}60, 0 0 16px ${priorityStyle.color}40`
                : isActive
                  ? `0 8px 32px rgba(0,0,0,0.2), 0 0 10px ${priorityStyle.color}30`
                  : "0 6px 24px rgba(0,0,0,0.15)",
              filter: snapshot.isDragging ? "brightness(1.1) contrast(1.05)" : undefined,
              backdropFilter: snapshot.isDragging ? "blur(20px)" : "blur(16px)"
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

            {/* Selection checkbox */}
            {showSelection && (
              <div className="absolute top-2 right-2 z-10">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => onSelect?.(task._id, !!checked)}
                  className="h-4 w-4 bg-white/90 border-white/50"
                />
              </div>
            )}

            {/* Active pulse for in-progress tasks */}
            {isActive && !showSelection && (
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
                <Link
                  href={`/tasks/${task._id}`}
                  className="flex-1 group/title"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className={cn(
                    "font-semibold text-body-large transition-colors duration-200 group-hover/title:text-[#06b6d4] cursor-pointer flex items-center gap-2",
                    isCompleted && "line-through text-muted"
                  )}>
                    {task.title}
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover/title:opacity-100 transition-opacity duration-200 print-hide" />
                  </h3>
                </Link>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 print-hide">
                  <TimeTracker 
                    taskId={task._id} 
                    compact 
                    className="h-9 w-auto sm:h-7"
                  />
                  <StarButton
                    item={{
                      id: task._id,
                      type: 'task',
                      title: task.title,
                      url: `/tasks/${task._id}`
                    }}
                    className="h-9 w-9 sm:h-7 sm:w-7 rounded-lg transition-all duration-200 hover:scale-105"
                    size={16}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 sm:h-7 sm:w-7 hover:bg-[hsl(var(--command-accent))]/20 hover:text-[hsl(var(--command-accent))] rounded-lg transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] focus-visible:ring-opacity-60"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(task)
                    }}
                  >
                    <Edit className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 sm:h-7 sm:w-7 hover:bg-[hsl(var(--command-danger))]/20 hover:text-[hsl(var(--command-danger))] rounded-lg transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] focus-visible:ring-opacity-60"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(task._id)
                    }}
                  >
                    <Trash2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 pb-5 px-5 space-y-3">
              {task.description && (
                <p className={cn(
                  "text-body-small text-secondary line-clamp-3 task-description",
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
                    <span className={cn("text-body-small font-semibold task-assignee", agentColor.text)}>
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
                  
                  {/* Blocked indicator */}
                  {isBlocked && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded text-orange-400">
                      <Ban className="h-3 w-3" />
                      <span className="text-xs font-semibold">Blocked</span>
                    </div>
                  )}
                  
                  {/* Recurring indicator */}
                  {isRecurring && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-purple-400">
                      <Repeat className="h-3 w-3" />
                      <span className="text-xs font-semibold">{task.repeat}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between task-meta">
                  <div className="flex items-center gap-3 text-muted text-body-small">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(task.createdAt)}</span>
                    </div>
                    
                    {totalTime > 0 && (
                      <div className={cn(
                        "flex items-center gap-1",
                        isTracking && "text-[hsl(var(--command-accent))]"
                      )}>
                        <Timer className="h-3 w-3" />
                        <span className="font-mono">{formatTime(totalTime)}</span>
                        {isTracking && (
                          <motion.div
                            animate={{
                              opacity: [0.5, 1, 0.5],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="w-1.5 h-1.5 bg-[hsl(var(--command-accent))] rounded-full print-hide"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Print-visible status badge */}
                  <div className={cn(
                    "task-status hidden",
                    `status-${task.status}`
                  )}>
                    {task.status === 'todo' ? 'To Do' : task.status === 'in-progress' ? 'In Progress' : 'Done'}
                  </div>
                </div>
              </div>

              {/* Due Date Indicator */}
              {task.dueDate && (
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "flex items-center gap-2 px-2 py-1 rounded-lg text-body-small font-semibold",
                    dueDateStatus === 'overdue' && "bg-red-500/20 text-red-400 border border-red-500/30",
                    dueDateStatus === 'due-today' && "bg-amber-500/20 text-amber-400 border border-amber-500/30",
                    dueDateStatus === 'upcoming' && "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  )}>
                    <Calendar className="h-3 w-3" />
                    <span>
                      {dueDateStatus === 'overdue' && 'Overdue '}
                      {dueDateStatus === 'due-today' && 'Due Today'}
                      {dueDateStatus === 'upcoming' && `Due ${formatDate(task.dueDate)}`}
                    </span>
                  </div>
                </div>
              )}

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