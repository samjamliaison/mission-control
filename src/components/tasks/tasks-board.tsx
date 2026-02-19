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

// Mock data with agent assignments
const mockTasks: Task[] = [
  {
    _id: "1",
    title: "Set up project structure",
    description: "Initialize the NextJS project with all required dependencies and establish the foundation for the command center interface",
    assignee: "Hamza",
    status: "done",
    priority: "high",
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    _id: "2",
    title: "Design database schema",
    description: "Create Convex schema for tasks and user management with real-time synchronization capabilities",
    assignee: "Jarvis",
    status: "in-progress",
    priority: "high",
    createdAt: Date.now() - 43200000,
    updatedAt: Date.now() - 3600000,
  },
  {
    _id: "3",
    title: "Implement drag and drop",
    description: "Add beautiful drag and drop functionality using react-beautiful-dnd with smooth animations",
    assignee: "Monica",
    status: "done",
    priority: "medium",
    createdAt: Date.now() - 21600000,
    updatedAt: Date.now() - 21600000,
  },
  {
    _id: "4",
    title: "Add real-time updates",
    description: "Implement Convex real-time subscriptions for live task updates across all connected clients",
    assignee: "Luna",
    status: "in-progress",
    priority: "high",
    createdAt: Date.now() - 10800000,
    updatedAt: Date.now() - 10800000,
  },
  {
    _id: "5",
    title: "Mobile responsiveness",
    description: "Ensure the command center works flawlessly on mobile devices with touch-optimized interactions",
    assignee: "Manus",
    status: "todo",
    priority: "medium",
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 7200000,
  },
  {
    _id: "6",
    title: "Performance optimization",
    description: "Optimize rendering performance and implement virtualization for large task datasets",
    assignee: "Jarvis",
    status: "todo",
    priority: "low",
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
  }
]

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
      ease: "easeOut"
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
        className="relative z-10 p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto space-y-8">
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

          <motion.div variants={itemVariants} className="space-y-6">
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
                  className="btn-premium text-body font-semibold px-6"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Deploy Task
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Task Board */}
          <motion.div variants={itemVariants}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-x-auto pb-4">
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