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
import { Plus, Filter, Command, Activity, Users, Target, CheckSquare } from "lucide-react"
import { TaskColumn } from "./task-column"
import { AddTaskDialog } from "./add-task-dialog"
import { Task } from "./task-card"
import { PageHeader } from "@/components/ui/page-header"
import { StatsCard } from "@/components/ui/stats-card"
import { EmptyState } from "@/components/ui/empty-state"

// Mock data with agent assignments - empty initially to show empty state
const mockTasks: Task[] = []

const assigneeOptions = ["All", "Hamza", "Manus", "Monica", "Jarvis", "Luna"]

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
      ease: [0.04, 0.62, 0.23, 0.98] as any
    }
  }
}

export function TasksBoard() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [selectedAssignee, setSelectedAssignee] = useState("All")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Keyboard shortcut: N to add new task
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'n' || e.key === 'N') {
        // Don't trigger if user is typing in an input/textarea
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          return
        }
        e.preventDefault()
        handleAddNewTask()
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [])

  // Filter tasks by assignee
  const filteredTasks = useMemo(() => {
    if (selectedAssignee === "All") return tasks
    return tasks.filter(task => task.assignee === selectedAssignee)
  }, [tasks, selectedAssignee])

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    return {
      todo: filteredTasks.filter(task => task.status === "todo"),
      "in-progress": filteredTasks.filter(task => task.status === "in-progress"),
      done: filteredTasks.filter(task => task.status === "done"),
    }
  }, [filteredTasks])

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const newStatus = destination.droppableId as "todo" | "in-progress" | "done"
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task._id === draggableId 
          ? { ...task, status: newStatus, updatedAt: Date.now() }
          : task
      )
    )
  }

  const handleAddTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === editingTask._id
            ? { ...task, ...taskData, updatedAt: Date.now() }
            : task
        )
      )
    } else {
      const newTask: Task = {
        _id: `task-${Date.now()}`,
        title: taskData.title!,
        description: taskData.description || "",
        assignee: taskData.assignee!,
        status: "todo",
        priority: taskData.priority!,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      setTasks(prevTasks => [newTask, ...prevTasks])
    }
    setEditingTask(null)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setDialogOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId))
  }

  const handleAddNewTask = () => {
    setEditingTask(null)
    setDialogOpen(true)
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.status === "done").length
  const inProgressTasks = tasks.filter(task => task.status === "in-progress").length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  if (!mounted) return null

  return (
    <div className="min-h-[calc(100vh-5rem)] relative">
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
            icon={CheckSquare}
            title="Mission Control"
            subtitle="Advanced task orchestration system for OpenClaw operations. Real-time coordination across all agents and systems."
          >
            <StatsCard
              icon={Target}
              label="Mission Progress"
              value={`${completionRate}%`}
              subLabel="Complete"
              subValue={`${completedTasks}/${totalTasks}`}
            />
          </PageHeader>

          <motion.div variants={itemVariants} className="space-y-4">
            {/* Command Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 glass-morphism p-2 rounded-lg">
                    <Filter className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                    <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                      <SelectTrigger className="w-44 border-0 bg-transparent focus:ring-1 focus:ring-[hsl(var(--command-accent))] font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-morphism border-[hsl(var(--command-border-bright))]">
                        {assigneeOptions.map((assignee) => (
                          <SelectItem key={assignee} value={assignee} className="focus:bg-[hsl(var(--command-accent))]/10">
                            <div className="flex items-center gap-2">
                              {assignee !== "All" && (
                                <span className="text-base">
                                  {agentAvatars[assignee as keyof typeof agentAvatars]}
                                </span>
                              )}
                              <span>{assignee}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedAssignee !== "All" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass-morphism px-3 py-1 rounded-full"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <Activity className="h-3 w-3 text-[hsl(var(--command-accent))]" />
                        <span className="text-secondary">
                          {filteredTasks.length} tasks
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Agent Status Indicators */}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[hsl(var(--command-text-muted))]" />
                  <div className="flex items-center gap-1">
                    {Object.entries(agentAvatars).map(([agent, avatar]) => {
                      const agentTasks = tasks.filter(t => t.assignee === agent)
                      const activeTasks = agentTasks.filter(t => t.status !== "done").length
                      return (
                        <motion.div
                          key={agent}
                          className="relative group"
                          whileHover={{ scale: 1.1 }}
                        >
                          <div className="glass-morphism p-1.5 rounded-lg cursor-pointer">
                            <span className="text-sm">{avatar}</span>
                          </div>
                          {activeTasks > 0 && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[hsl(var(--command-accent))] rounded-full flex items-center justify-center text-[10px] font-bold text-black">
                              {activeTasks}
                            </div>
                          )}
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            <div className="glass-morphism px-2 py-1 rounded text-xs whitespace-nowrap">
                              {agent}: {activeTasks} active
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
                  onClick={handleAddNewTask} 
                  className="btn-premium text-body font-semibold px-6 relative group min-h-[44px]"
                  title="Press 'N' to quickly add a new task"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Deploy Task
                  <kbd className="hidden group-hover:block absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-black/80 text-white rounded border border-white/20 pointer-events-none">
                    N
                  </kbd>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Task Board or Empty State */}
          <motion.div variants={itemVariants}>
            {tasks.length === 0 ? (
              <EmptyState
                icon="🚀"
                title="Mission Control Awaiting Orders"
                description="No active tasks detected. Initialize your first mission to begin coordinating operations across all agents and systems. The command center is ready for deployment."
                actionLabel="Deploy First Task"
                onAction={handleAddNewTask}
              />
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto pb-4">
                  <TaskColumn
                    title="Awaiting Deployment"
                    status="todo"
                    tasks={tasksByStatus.todo}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                  />
                  <TaskColumn
                    title="Active Operations"
                    status="in-progress"
                    tasks={tasksByStatus["in-progress"]}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                  />
                  <TaskColumn
                    title="Mission Complete"
                    status="done"
                    tasks={tasksByStatus.done}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                  />
                </div>
              </DragDropContext>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Add/Edit Task Dialog */}
      <AddTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleAddTask}
        editingTask={editingTask}
      />
    </div>
  )
}