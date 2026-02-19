"use client"

import { Droppable } from "@hello-pangea/dnd"
import { motion } from "framer-motion"
import { TaskCard, Task } from "./task-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Zap, CheckCircle, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { StaggeredList } from "@/components/ui/staggered-list"

interface TaskColumnProps {
  title: string
  status: "todo" | "in-progress" | "done"
  tasks: Task[]
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  selectedTasks?: Set<string>
  onTaskSelect?: (taskId: string, selected: boolean) => void
  showSelection?: boolean
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
      ease: [0.04, 0.62, 0.23, 0.98] as any
    }
  }
}

export function TaskColumn({ title, status, tasks, onEditTask, onDeleteTask, selectedTasks, onTaskSelect, showSelection }: TaskColumnProps) {
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
                  "min-h-[420px] transition-all duration-300 rounded-xl p-3 relative overflow-hidden",
                  snapshot.isDraggingOver && "ring-2 ring-dashed animate-pulse"
                )}
                style={{
                  background: snapshot.isDraggingOver 
                    ? `radial-gradient(circle at center, ${config.accent}12 0%, ${config.accent}04 50%, transparent 70%)`
                    : undefined,
                  borderColor: snapshot.isDraggingOver ? config.accent : undefined,
                  boxShadow: snapshot.isDraggingOver 
                    ? `0 0 0 2px ${config.accent}30, 0 0 20px ${config.accent}20, inset 0 0 20px ${config.accent}08`
                    : undefined
                }}
                animate={{
                  scale: snapshot.isDraggingOver ? 1.02 : 1,
                  borderRadius: snapshot.isDraggingOver ? "16px" : "12px"
                }}
                transition={{ 
                  duration: 0.2, 
                  ease: "easeOut" 
                }}
              >
                {/* Enhanced Drop zone indicator */}
                {snapshot.isDraggingOver && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      y: 0,
                    }}
                    exit={{ opacity: 0, scale: 0.5, y: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                  >
                    <motion.div 
                      className="glass-morphism p-6 rounded-2xl border-2 border-dashed"
                      style={{ 
                        borderColor: config.accent,
                        background: `${config.accent}15`,
                        boxShadow: `0 0 32px ${config.accent}30`
                      }}
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 1, -1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div
                        animate={{ 
                          rotate: 360,
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="relative"
                      >
                        <IconComponent 
                          className={cn("h-12 w-12", config.color)} 
                          strokeWidth={1.5}
                        />
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-dashed"
                          style={{ borderColor: config.accent }}
                          animate={{
                            rotate: -360,
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                          }}
                        />
                      </motion.div>
                      <motion.p 
                        className={cn("text-sm font-semibold mt-2 text-center", config.color)}
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        Drop here
                      </motion.p>
                    </motion.div>
                  </motion.div>
                )}
                
                {tasks.length > 0 && (
                  <StaggeredList staggerDelay={0.05}>
                    {tasks.map((task, index) => (
                      <motion.div
                        key={task._id}
                        layout
                        layoutId={`task-${task._id}`}
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0, 
                          scale: 1,
                        }}
                        exit={{ 
                          opacity: 0, 
                          y: -20, 
                          scale: 0.8,
                          transition: { duration: 0.2 }
                        }}
                        transition={{
                          layout: { 
                            duration: 0.4, 
                            ease: [0.4, 0, 0.2, 1],
                            type: "spring",
                            stiffness: 350,
                            damping: 25
                          },
                          opacity: { duration: 0.3 },
                          scale: { duration: 0.3 }
                        }}
                        style={{
                          zIndex: index
                        }}
                      >
                        <TaskCard
                          task={task}
                          index={index}
                          onEdit={onEditTask}
                          onDelete={onDeleteTask}
                          isSelected={selectedTasks?.has(task._id) || false}
                          onSelect={onTaskSelect}
                          showSelection={showSelection}
                        />
                      </motion.div>
                    ))}
                  </StaggeredList>
                )}
                
                {provided.placeholder}
                
                {tasks.length === 0 && !snapshot.isDraggingOver && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Loading skeleton cards */}
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="glass-morphism rounded-xl p-4 loading-skeleton h-24" />
                      ))}
                    </div>
                    
                    {/* Empty state message */}
                    <div className="text-center py-8">
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