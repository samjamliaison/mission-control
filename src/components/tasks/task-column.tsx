"use client"

import { Droppable } from "@hello-pangea/dnd"
import { motion } from "framer-motion"
import { TaskCard, Task } from "./task-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Zap, CheckCircle, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaskColumnProps {
  title: string
  status: "todo" | "in-progress" | "done"
  tasks: Task[]
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
}

const statusConfig = {
  "todo": {
    title: "Awaiting Deployment",
    icon: Clock,
    color: "text-[hsl(var(--command-text-muted))]",
    badgeColor: "bg-[hsl(var(--muted))]/20 text-[hsl(var(--command-text-muted))] border-[hsl(var(--command-border))]",
    glowColor: "hsl(var(--command-text-muted))",
    accent: "hsl(215, 20%, 65%)"
  },
  "in-progress": {
    title: "Active Operations",
    icon: Zap,
    color: "text-[hsl(var(--command-accent))]",
    badgeColor: "bg-[hsl(var(--command-accent))]/10 text-[hsl(var(--command-accent))] border-[hsl(var(--command-accent))]/20",
    glowColor: "hsl(var(--command-accent))",
    accent: "hsl(var(--command-accent))"
  },
  "done": {
    title: "Mission Complete",
    icon: CheckCircle,
    color: "text-[hsl(var(--command-success))]",
    badgeColor: "bg-[hsl(var(--command-success))]/10 text-[hsl(var(--command-success))] border-[hsl(var(--command-success))]/20",
    glowColor: "hsl(var(--command-success))",
    accent: "hsl(var(--command-success))"
  }
}

const columnVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
}

const taskVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

export function TaskColumn({ title, status, tasks, onEditTask, onDeleteTask }: TaskColumnProps) {
  const config = statusConfig[status]
  const IconComponent = config.icon
  
  return (
    <motion.div
      variants={columnVariants}
      initial="hidden"
      animate="visible"
      className="w-full min-w-[320px]"
    >
      <Card className="glass-morphism border-[hsl(var(--command-border-bright))] min-h-[500px] relative overflow-hidden">
        {/* Column glow effect */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${config.accent} 0%, transparent 50%)`
          }}
        />
        
        <CardHeader className="pb-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 glass-morphism rounded-lg">
                <IconComponent className={cn("h-4 w-4", config.color)} />
              </div>
              <CardTitle className={cn("text-body-large font-semibold status-indicator", `status-${status}`)}>
                {config.title}
              </CardTitle>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Badge 
                variant="outline" 
                className={cn("text-xs font-bold", config.badgeColor)}
                style={{
                  boxShadow: tasks.length > 0 ? `0 0 10px ${config.glowColor}20` : undefined
                }}
              >
                {tasks.length}
              </Badge>
            </motion.div>
          </div>
          
          {/* Progress indicator for in-progress column */}
          {status === "in-progress" && tasks.length > 0 && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-1 bg-gradient-to-r from-[hsl(var(--command-accent))] to-transparent rounded-full mt-2"
            />
          )}
        </CardHeader>
        
        <CardContent className="pt-0 relative">
          <Droppable droppableId={status}>
            {(provided, snapshot) => (
              <motion.div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "min-h-[420px] transition-all duration-300 rounded-xl p-3 relative",
                  snapshot.isDraggingOver && "bg-[hsl(var(--command-accent))]/5 ring-2 ring-[hsl(var(--command-accent))]/20 ring-dashed"
                )}
                style={{
                  background: snapshot.isDraggingOver 
                    ? `radial-gradient(circle at center, ${config.accent}08 0%, transparent 70%)`
                    : undefined
                }}
              >
                {/* Drop zone indicator */}
                {snapshot.isDraggingOver && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                  >
                    <div className="glass-morphism p-4 rounded-xl">
                      <Circle className={cn("h-8 w-8", config.color)} strokeDasharray="4 4">
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          values="0;360"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </Circle>
                    </div>
                  </motion.div>
                )}
                
                {tasks.map((task, index) => (
                  <motion.div
                    key={task._id}
                    variants={taskVariants}
                    layout
                    layoutId={task._id}
                    transition={{
                      layout: { duration: 0.3, ease: "easeInOut" }
                    }}
                  >
                    <TaskCard
                      task={task}
                      index={index}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                    />
                  </motion.div>
                ))}
                
                {provided.placeholder}
                
                {tasks.length === 0 && !snapshot.isDraggingOver && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center py-12"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 mx-auto glass-morphism rounded-full flex items-center justify-center">
                        <IconComponent className={cn("h-5 w-5", config.color)} />
                      </div>
                      <p className="text-muted text-body">
                        {status === "todo" && "Ready for new missions"}
                        {status === "in-progress" && "No active operations"}
                        {status === "done" && "No completed missions"}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </Droppable>
        </CardContent>
      </Card>
    </motion.div>
  )
}