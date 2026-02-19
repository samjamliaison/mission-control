"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ArrowLeft, MessageCircle, CheckSquare, Plus, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface Comment {
  id: string
  text: string
  timestamp: number
}

interface Subtask {
  id: string
  text: string
  completed: boolean
}

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string

  const [comments, setComments] = useState<Comment[]>([])
  const [subtasks, setSubtasks] = useState<Subtask[]>([])
  const [newComment, setNewComment] = useState("")
  const [newSubtask, setNewSubtask] = useState("")

  // Get task details from localStorage (if available)
  const getTaskDetails = () => {
    try {
      const tasks = JSON.parse(localStorage.getItem('mission-control-tasks') || '[]')
      return tasks.find((t: any) => t._id === taskId)
    } catch {
      return null
    }
  }

  const task = getTaskDetails()

  // Load comments and subtasks from localStorage
  useEffect(() => {
    try {
      const storedComments = localStorage.getItem(`task-comments-${taskId}`)
      const storedSubtasks = localStorage.getItem(`task-subtasks-${taskId}`)

      if (storedComments) {
        setComments(JSON.parse(storedComments))
      }

      if (storedSubtasks) {
        setSubtasks(JSON.parse(storedSubtasks))
      }
    } catch (error) {
      console.error('Error loading task data:', error)
    }
  }, [taskId])

  // Save comments to localStorage
  const saveComments = (newComments: Comment[]) => {
    setComments(newComments)
    localStorage.setItem(`task-comments-${taskId}`, JSON.stringify(newComments))
  }

  // Save subtasks to localStorage
  const saveSubtasks = (newSubtasks: Subtask[]) => {
    setSubtasks(newSubtasks)
    localStorage.setItem(`task-subtasks-${taskId}`, JSON.stringify(newSubtasks))
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      text: newComment.trim(),
      timestamp: Date.now()
    }

    saveComments([...comments, comment])
    setNewComment("")
  }

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return

    const subtask: Subtask = {
      id: `subtask-${Date.now()}`,
      text: newSubtask.trim(),
      completed: false
    }

    saveSubtasks([...subtasks, subtask])
    setNewSubtask("")
  }

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    )
    saveSubtasks(updatedSubtasks)
  }

  const handleDeleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = subtasks.filter(st => st.id !== subtaskId)
    saveSubtasks(updatedSubtasks)
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <motion.button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-white/60 hover:text-[#06b6d4] transition-colors"
        whileHover={{ x: -4 }}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Tasks</span>
      </motion.button>

      {/* Task Details */}
      <motion.div
        className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="space-y-4">
          <div>
            <h1 className="text-heading-2 text-premium mb-2">
              {task?.title || `Task ${taskId.slice(0, 8)}`}
            </h1>
            <p className="text-body text-secondary">
              Task ID: {taskId}
            </p>
          </div>

          {task ? (
            <div className="space-y-4">
              <div>
                <label className="text-body-small font-semibold text-white/70">Description</label>
                <p className="text-body text-white/90 mt-1">
                  {task.description || 'No description provided.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-body-small font-semibold text-white/70">Status</label>
                  <p className="text-body text-white/90 mt-1 capitalize">
                    {task.status || 'Unknown'}
                  </p>
                </div>

                <div>
                  <label className="text-body-small font-semibold text-white/70">Priority</label>
                  <p className="text-body text-white/90 mt-1 capitalize">
                    {task.priority || 'Normal'}
                  </p>
                </div>

                <div>
                  <label className="text-body-small font-semibold text-white/70">Assignee</label>
                  <p className="text-body text-white/90 mt-1">
                    {task.assignee || 'Unassigned'}
                  </p>
                </div>
              </div>

              {task.dueDate && (
                <div>
                  <label className="text-body-small font-semibold text-white/70">Due Date</label>
                  <p className="text-body text-white/90 mt-1">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-body text-white/60">
                Task details not found. This task may not exist in your local data.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Comments Section */}
      <motion.div
        className="backdrop-blur-xl bg-[hsl(var(--command-surface-elevated))]/95 border border-white/10 rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="h-5 w-5 text-[hsl(var(--command-accent))]" />
          <h2 className="text-heading-3 text-premium">Comments</h2>
          <span className="text-sm text-muted bg-white/10 px-2 py-1 rounded-full">
            {comments.length}
          </span>
        </div>

        {/* Add Comment */}
        <div className="space-y-3 mb-6">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="bg-[hsl(var(--command-surface))]/50 border-white/20 text-white placeholder:text-white/60"
            rows={3}
          />
          <Button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="btn-premium"
          >
            Add Comment
          </Button>
        </div>

        {/* Comments List */}
        <div className="space-y-3">
          {comments.length === 0 ? (
            <p className="text-body text-white/60 text-center py-4">
              No comments yet. Be the first to add one!
            </p>
          ) : (
            comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[hsl(var(--command-surface))]/30 border border-white/10 rounded-lg p-4"
              >
                <p className="text-body text-white/90 mb-2">{comment.text}</p>
                <p className="text-body-small text-white/60">
                  {new Date(comment.timestamp).toLocaleString()}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Subtasks Section */}
      <motion.div
        className="backdrop-blur-xl bg-[hsl(var(--command-surface-elevated))]/95 border border-white/10 rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <CheckSquare className="h-5 w-5 text-[hsl(var(--command-accent))]" />
          <h2 className="text-heading-3 text-premium">Subtasks</h2>
          <span className="text-sm text-muted bg-white/10 px-2 py-1 rounded-full">
            {subtasks.filter(st => st.completed).length}/{subtasks.length}
          </span>
        </div>

        {/* Add Subtask */}
        <div className="flex gap-2 mb-6">
          <Input
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            placeholder="Add a subtask..."
            className="bg-[hsl(var(--command-surface))]/50 border-white/20 text-white placeholder:text-white/60"
            onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
          />
          <Button
            onClick={handleAddSubtask}
            disabled={!newSubtask.trim()}
            size="icon"
            className="btn-premium shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Subtasks List */}
        <div className="space-y-2">
          {subtasks.length === 0 ? (
            <p className="text-body text-white/60 text-center py-4">
              No subtasks yet. Break down this task into smaller pieces!
            </p>
          ) : (
            subtasks.map((subtask) => (
              <motion.div
                key={subtask.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 bg-[hsl(var(--command-surface))]/30 border border-white/10 rounded-lg p-3"
              >
                <Checkbox
                  checked={subtask.completed}
                  onCheckedChange={() => handleToggleSubtask(subtask.id)}
                  className="h-4 w-4"
                />
                <span className={`flex-1 text-body ${
                  subtask.completed
                    ? 'text-white/60 line-through'
                    : 'text-white/90'
                }`}>
                  {subtask.text}
                </span>
                <Button
                  onClick={() => handleDeleteSubtask(subtask.id)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/40 hover:text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </motion.div>
            ))
          )}
        </div>

        {/* Progress bar if there are subtasks */}
        {subtasks.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-white/60 mb-1">
              <span>Progress</span>
              <span>{Math.round((subtasks.filter(st => st.completed).length / subtasks.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[hsl(var(--command-accent))] to-[hsl(var(--command-success))]"
                initial={{ width: 0 }}
                animate={{
                  width: `${(subtasks.filter(st => st.completed).length / subtasks.length) * 100}%`
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}