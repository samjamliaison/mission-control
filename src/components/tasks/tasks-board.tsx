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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Filter, Command, Activity, Users, Target, CheckSquare, FileText, Sparkles, Square, CheckSquare as CheckedSquare, ArrowUpDown, Download, Settings, Printer } from "lucide-react"
import { TaskColumn } from "./task-column"
import { AddTaskDialog } from "./add-task-dialog"
import { TaskTemplatePicker } from "./task-template-picker"
import { BulkActionBar } from "./bulk-action-bar"
import { ColumnCustomizationDialog } from "./column-customization-dialog"
import { PrintButton } from "@/components/ui/print-button"
import { SectionErrorBoundary } from "@/components/ui/error-boundary"
import { Task } from "./task-card"
import { TaskTemplate, createTaskFromTemplate } from "@/lib/task-templates"
import { PageHeader } from "@/components/ui/page-header"
import { StatsCard } from "@/components/ui/stats-card"
import { EmptyState } from "@/components/ui/empty-state"
// import { loadTasks, saveTasks } from "@/lib/data-persistence" - Replaced with API calls
import { useToastActions } from "@/components/ui/toast"
import { logTaskAction, logNavigationAction } from "@/lib/activity-logger"
import { exportTasksAsCSV, exportTasksAsJSON, downloadFile, generateFilename } from "@/lib/export-utils"
import { useUndoSystem } from "@/lib/undo-system"
import { useKanbanColumns } from "@/hooks/use-kanban-columns"

// API functions for task management
async function fetchTasks(): Promise<Task[]> {
  try {
    const response = await fetch('/api/tasks')
    if (!response.ok) throw new Error('Failed to fetch tasks')
    const data = await response.json()
    return data.tasks || []
  } catch (error) {
    console.error('Error fetching tasks:', error)
    // Fallback to localStorage
    const stored = localStorage.getItem('mission-control-tasks')
    return stored ? JSON.parse(stored) : []
  }
}

async function createTask(taskData: Partial<Task>): Promise<Task | null> {
  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    })
    if (!response.ok) throw new Error('Failed to create task')
    const data = await response.json()
    return data.task
  } catch (error) {
    console.error('Error creating task:', error)
    return null
  }
}

async function updateTask(taskId: string, taskData: Partial<Task>): Promise<Task | null> {
  try {
    const response = await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...taskData, id: taskId })
    })
    if (!response.ok) throw new Error('Failed to update task')
    const data = await response.json()
    return data.task
  } catch (error) {
    console.error('Error updating task:', error)
    return null
  }
}

async function deleteTask(taskId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/tasks?id=${taskId}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete task')
    return true
  } catch (error) {
    console.error('Error deleting task:', error)
    return false
  }
}

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
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedAssignee, setSelectedAssignee] = useState("All")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [mounted, setMounted] = useState(false)
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  const [bulkSelectionMode, setBulkSelectionMode] = useState(false)
  const [sortBy, setSortBy] = useState<string>('dateCreated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const toast = useToastActions()
  const { canUndo, popLastAction, addTaskCreate, addTaskDelete, addTaskUpdate, addTaskStatusChange } = useUndoSystem()
  const { columns } = useKanbanColumns()

  // Load data from API on mount
  useEffect(() => {
    setMounted(true)
    fetchTasks().then(loadedTasks => {
      setTasks(loadedTasks)
    })

    // Load sort preferences
    const savedSort = localStorage.getItem('mission-control-sort')
    if (savedSort) {
      const { sortBy: savedSortBy, sortOrder: savedSortOrder } = JSON.parse(savedSort)
      setSortBy(savedSortBy)
      setSortOrder(savedSortOrder)
    }

    // Log navigation to tasks board
    logNavigationAction('Task Board')
  }, [])

  // Tasks are now saved via API calls (removed localStorage auto-save)

  // Keyboard shortcuts: N to add new task, T for template picker, Ctrl+Z for undo
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        handleAddNewTask()
      }

      if (e.key === 't' || e.key === 'T') {
        e.preventDefault()
        setShowTemplatePicker(true)
      }

      // Ctrl+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        handleUndo()
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [canUndo])

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = selectedAssignee === "All" ? [...tasks] : tasks.filter(task => task.assignee === selectedAssignee)

    // Sort tasks
    filtered.sort((a, b) => {
      let aVal, bVal

      switch (sortBy) {
        case 'dateCreated':
          aVal = a.createdAt
          bVal = b.createdAt
          break
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          aVal = priorityOrder[a.priority]
          bVal = priorityOrder[b.priority]
          break
        case 'assignee':
          aVal = a.assignee.toLowerCase()
          bVal = b.assignee.toLowerCase()
          break
        case 'title':
          aVal = a.title.toLowerCase()
          bVal = b.title.toLowerCase()
          break
        default:
          aVal = a.createdAt
          bVal = b.createdAt
      }

      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

    return filtered
  }, [tasks, selectedAssignee, sortBy, sortOrder])

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    const grouped: Record<string, Task[]> = {}
    
    columns.forEach(column => {
      grouped[column.id] = filteredTasks.filter(task => task.status === column.id)
    })
    
    // Handle tasks with status not matching any column (assign to first column)
    const orphanTasks = filteredTasks.filter(task => 
      !columns.some(col => col.id === task.status)
    )
    if (orphanTasks.length > 0 && columns.length > 0) {
      grouped[columns[0].id] = [...(grouped[columns[0].id] || []), ...orphanTasks]
    }
    
    return grouped
  }, [filteredTasks, columns])

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const newStatus = destination.droppableId
    const task = tasks.find(t => t._id === draggableId)

    if (task) {
      const oldStatus = task.status
      const updatedTask = { ...task, status: newStatus, updatedAt: Date.now() }

      // Add to undo history
      addTaskStatusChange(task, updatedTask)

      // Log the status change activity
      if (newStatus === 'done' && oldStatus !== 'done') {
        logTaskAction(
          'completed',
          task.title,
          task.assignee,
          draggableId,
          {
            fromStatus: oldStatus,
            toStatus: newStatus,
            priority: task.priority,
            viaDragDrop: true
          }
        )
      } else if (oldStatus === 'done' && newStatus !== 'done') {
        logTaskAction(
          'updated',
          task.title,
          task.assignee,
          draggableId,
          {
            fromStatus: oldStatus,
            toStatus: newStatus,
            priority: task.priority,
            action: 'reopened',
            viaDragDrop: true
          }
        )
      } else {
        logTaskAction(
          'updated',
          task.title,
          task.assignee,
          draggableId,
          {
            fromStatus: oldStatus,
            toStatus: newStatus,
            priority: task.priority,
            action: 'status_changed',
            viaDragDrop: true
          }
        )
      }
    }

    // Update task via API
    updateTask(draggableId, { status: newStatus }).then(updatedTask => {
      if (updatedTask) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task._id === draggableId
              ? { ...task, status: newStatus, updatedAt: Date.now() }
              : task
          )
        )
      }
    })
  }

  const handleAddTask = async (taskData: Partial<Task>) => {
    if (editingTask) {
      const updatedTaskData = { ...taskData, updatedAt: Date.now() }
      const updatedTask = await updateTask(editingTask._id, updatedTaskData)
      
      if (updatedTask) {
        const fullUpdatedTask = { ...editingTask, ...updatedTaskData }
        addTaskUpdate(editingTask, fullUpdatedTask)
        
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task._id === editingTask._id
              ? fullUpdatedTask
              : task
          )
        )
        toast.success('Task Updated', `"${taskData.title}" has been successfully updated.`)
      } else {
        toast.error('Update Failed', 'Could not update task. Please try again.')
      }
    } else {
      const newTaskData = {
        title: taskData.title!,
        description: taskData.description || "",
        assignee: taskData.assignee!,
        status: "todo",
        priority: taskData.priority!,
        ...(taskData.dueDate && { dueDate: taskData.dueDate }),
      }

      const newTask = await createTask(newTaskData)
      if (newTask) {
        addTaskCreate(newTask)
        setTasks(prevTasks => [newTask, ...prevTasks])
        toast.success('Task Created', `"${taskData.title}" assigned to ${taskData.assignee}.`)
      } else {
        toast.error('Creation Failed', 'Could not create task. Please try again.')
      }
    }
    setEditingTask(null)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setDialogOpen(true)
  }

  const handleDeleteTask = async (taskId: string) => {
    const taskToDelete = tasks.find(task => task._id === taskId)
    if (taskToDelete) {
      const success = await deleteTask(taskId)
      
      if (success) {
        addTaskDelete(taskToDelete)
        setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId))

        // Log the deletion activity
        logTaskAction(
          'deleted',
          taskToDelete.title,
          taskToDelete.assignee,
          taskId,
          {
            status: taskToDelete.status,
            priority: taskToDelete.priority,
            wasCompleted: taskToDelete.status === 'done'
          }
        )
        toast.success('Task Deleted', `"${taskToDelete.title}" has been removed.`)
      } else {
        toast.error('Delete Failed', 'Could not delete task. Please try again.')
      }
    }
  }

  const handleAddNewTask = () => {
    setEditingTask(null)
    setDialogOpen(true)
  }

  const handleTemplateSelect = (template: TaskTemplate) => {
    const taskData = createTaskFromTemplate(template)

    // Create task directly from template
    const newTask: Task = {
      _id: `task-${Date.now()}`,
      title: taskData.title!,
      description: taskData.description || "",
      assignee: taskData.assignee || "",
      status: taskData.status || "todo",
      priority: taskData.priority || "medium",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    addTaskCreate(newTask)
    setTasks(prevTasks => [...prevTasks, newTask])
    setShowTemplatePicker(false)

    // Log the activity
    logTaskAction(
      'created',
      newTask.title,
      newTask.assignee,
      newTask._id,
      {
        priority: newTask.priority,
        fromTemplate: template.name,
        templateId: template.id,
        hasDescription: !!newTask.description
      }
    )

    toast.success('Task Created from Template', `"${newTask.title}" has been deployed using the ${template.name} template.`)
  }

  // Bulk action handlers
  const handleTaskSelect = (taskId: string, selected: boolean) => {
    const newSelection = new Set(selectedTasks)
    if (selected) {
      newSelection.add(taskId)
    } else {
      newSelection.delete(taskId)
    }
    setSelectedTasks(newSelection)
    if (newSelection.size === 0) {
      setBulkSelectionMode(false)
    }
  }

  const handleBulkStatusChange = (status: "todo" | "in-progress" | "done") => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        selectedTasks.has(task._id)
          ? { ...task, status, updatedAt: Date.now() }
          : task
      )
    )
    toast.success('Bulk Update', `${selectedTasks.size} task${selectedTasks.size > 1 ? 's' : ''} moved to ${status}.`)
    setSelectedTasks(new Set())
    setBulkSelectionMode(false)
  }

  const handleBulkPriorityChange = (priority: "low" | "medium" | "high") => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        selectedTasks.has(task._id)
          ? { ...task, priority, updatedAt: Date.now() }
          : task
      )
    )
    toast.success('Bulk Update', `${selectedTasks.size} task${selectedTasks.size > 1 ? 's' : ''} priority updated to ${priority}.`)
    setSelectedTasks(new Set())
    setBulkSelectionMode(false)
  }

  const handleBulkDelete = () => {
    const deletedCount = selectedTasks.size
    setTasks(prevTasks => prevTasks.filter(task => !selectedTasks.has(task._id)))
    toast.success('Bulk Delete', `${deletedCount} task${deletedCount > 1 ? 's' : ''} deleted.`)
    setSelectedTasks(new Set())
    setBulkSelectionMode(false)
  }

  const handleClearSelection = () => {
    setSelectedTasks(new Set())
    setBulkSelectionMode(false)
  }

  const handleToggleBulkMode = () => {
    setBulkSelectionMode(!bulkSelectionMode)
    if (bulkSelectionMode) {
      setSelectedTasks(new Set())
    }
  }

  const handleSortChange = (newSortBy: string) => {
    const newSortOrder = sortBy === newSortBy && sortOrder === 'desc' ? 'asc' : 'desc'
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)

    // Save to localStorage
    localStorage.setItem('mission-control-sort', JSON.stringify({
      sortBy: newSortBy,
      sortOrder: newSortOrder
    }))
  }

  const handleExportTasksCSV = () => {
    const csvContent = exportTasksAsCSV(tasks)
    downloadFile(csvContent, generateFilename('mission-control-tasks', 'csv'), 'text/csv')
    toast.success('Export Complete', `Tasks exported as CSV (${tasks.length} items)`)
  }

  const handleExportTasksJSON = () => {
    const jsonContent = exportTasksAsJSON(tasks)
    downloadFile(jsonContent, generateFilename('mission-control-tasks', 'json'), 'application/json')
    toast.success('Export Complete', `Tasks exported as JSON (${tasks.length} items)`)
  }

  const handleUndo = () => {
    if (!canUndo) return

    const lastAction = popLastAction()
    if (!lastAction) return

    const { revertData } = lastAction

    switch (lastAction.action) {
      case 'create':
        // Remove the created task
        if (revertData.taskId) {
          setTasks(prevTasks => prevTasks.filter(task => task._id !== revertData.taskId))
          toast.success('Action Undone', `Removed task: ${revertData.currentTask?.title}`)
        }
        break

      case 'delete':
        // Restore the deleted task
        if (revertData.previousTask) {
          setTasks(prevTasks => [...prevTasks, revertData.previousTask!])
          toast.success('Action Undone', `Restored task: ${revertData.previousTask.title}`)
        }
        break

      case 'update':
      case 'status_change':
        // Revert to previous state
        if (revertData.taskId && revertData.previousTask) {
          setTasks(prevTasks =>
            prevTasks.map(task =>
              task._id === revertData.taskId ? revertData.previousTask! : task
            )
          )
          toast.success('Action Undone', `Reverted changes to: ${revertData.previousTask.title}`)
        }
        break
    }
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.status === "done").length
  const inProgressTasks = tasks.filter(task => task.status === "in-progress").length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  if (!mounted) return null

  return (
    <div className="min-h-[calc(100vh-5rem)] relative" data-testid="tasks-board">
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

                  <div className="flex items-center gap-2 glass-morphism p-2 rounded-lg">
                    <ArrowUpDown className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                    <Select value={sortBy} onValueChange={handleSortChange}>
                      <SelectTrigger className="w-36 border-0 bg-transparent focus:ring-1 focus:ring-[hsl(var(--command-accent))] font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-morphism border-[hsl(var(--command-border-bright))]">
                        <SelectItem value="dateCreated" className="focus:bg-[hsl(var(--command-accent))]/10">
                          Date Created {sortBy === 'dateCreated' && (sortOrder === 'desc' ? '↓' : '↑')}
                        </SelectItem>
                        <SelectItem value="priority" className="focus:bg-[hsl(var(--command-accent))]/10">
                          Priority {sortBy === 'priority' && (sortOrder === 'desc' ? '↓' : '↑')}
                        </SelectItem>
                        <SelectItem value="assignee" className="focus:bg-[hsl(var(--command-accent))]/10">
                          Assignee {sortBy === 'assignee' && (sortOrder === 'desc' ? '↓' : '↑')}
                        </SelectItem>
                        <SelectItem value="title" className="focus:bg-[hsl(var(--command-accent))]/10">
                          Title {sortBy === 'title' && (sortOrder === 'desc' ? '↓' : '↑')}
                        </SelectItem>
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

              <div className="flex items-center gap-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    onClick={handleToggleBulkMode}
                    className={`glass-morphism border-[hsl(var(--command-accent))]/30 hover:bg-[hsl(var(--command-accent))]/10 font-semibold px-4 min-h-[44px] ${
                      bulkSelectionMode ? 'bg-[hsl(var(--command-accent))]/20 text-[hsl(var(--command-accent))]' : 'text-[hsl(var(--command-accent))]'
                    }`}
                    title="Toggle bulk selection mode"
                  >
                    {bulkSelectionMode ? <CheckedSquare className="h-4 w-4 mr-2" /> : <Square className="h-4 w-4 mr-2" />}
                    Select
                  </Button>
                </motion.div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className="glass-morphism border-[hsl(var(--command-accent))]/30 text-[hsl(var(--command-accent))] hover:bg-[hsl(var(--command-accent))]/10 font-semibold px-4 min-h-[44px]"
                        title="Export tasks data"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-morphism border-[hsl(var(--command-border-bright))]">
                    <DropdownMenuItem onClick={handleExportTasksCSV} className="cursor-pointer focus:bg-[hsl(var(--command-accent))]/10">
                      <FileText className="h-4 w-4 mr-2" />
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportTasksJSON} className="cursor-pointer focus:bg-[hsl(var(--command-accent))]/10">
                      <FileText className="h-4 w-4 mr-2" />
                      Export as JSON
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <PrintButton 
                  title="Print tasks for offline reference"
                  onBeforePrint={() => {
                    // Add print-specific data attributes for styling
                    document.body.setAttribute('data-print-page', 'tasks')
                  }}
                />

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    onClick={() => setShowTemplatePicker(true)}
                    className="glass-morphism border-[hsl(var(--command-accent))]/30 text-[hsl(var(--command-accent))] hover:bg-[hsl(var(--command-accent))]/10 font-semibold px-4 min-h-[44px] relative group"
                    title="Quick create from template"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Template
                    <kbd className="hidden group-hover:block absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-black/80 text-white rounded border border-white/20 pointer-events-none">
                      T
                    </kbd>
                  </Button>
                </motion.div>

                <ColumnCustomizationDialog 
                  trigger={
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className="glass-morphism border-[hsl(var(--command-accent))]/30 text-[hsl(var(--command-accent))] hover:bg-[hsl(var(--command-accent))]/10 font-semibold px-4 min-h-[44px]"
                        title="Customize kanban columns"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Columns
                      </Button>
                    </motion.div>
                  }
                />

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
            </div>
          </motion.div>

          {/* Task Board or Empty State */}
          <SectionErrorBoundary sectionName="Task Board">
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
                  <div className="grid gap-4 overflow-x-auto pb-4 print-content" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(300px, 1fr))` }}>
                    {columns.map((column) => (
                      <TaskColumn
                        key={column.id}
                        title={column.title}
                        status={column.id}
                        tasks={tasksByStatus[column.id] || []}
                        onEditTask={handleEditTask}
                        onDeleteTask={handleDeleteTask}
                        selectedTasks={selectedTasks}
                        onTaskSelect={handleTaskSelect}
                        showSelection={bulkSelectionMode}
                        color={column.color}
                      />
                    ))}
                  </div>
              </DragDropContext>
            )}
          </motion.div>
          </SectionErrorBoundary>
        </div>
      </motion.div>

      {/* Add/Edit Task Dialog */}
      <AddTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleAddTask}
        editingTask={editingTask}
        allTasks={tasks}
      />

      {/* Template Picker */}
      <TaskTemplatePicker
        open={showTemplatePicker}
        onOpenChange={setShowTemplatePicker}
        onSelectTemplate={handleTemplateSelect}
      />

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedTasks.size}
        onStatusChange={handleBulkStatusChange}
        onPriorityChange={handleBulkPriorityChange}
        onDelete={handleBulkDelete}
        onClear={handleClearSelection}
      />
    </div>
  )
}