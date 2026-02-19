"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string

  // Get task details from localStorage (if available)
  const getTaskDetails = () => {
    try {
      const tasks = JSON.parse(localStorage.getItem('mission-control-tasks') || '[]')
      return tasks.find((t: any) => t.id === taskId)
    } catch {
      return null
    }
  }

  const task = getTaskDetails()

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

      {/* Comments Section Placeholder */}
      <motion.div
        className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-heading-3 text-premium mb-4">Comments</h2>
        <p className="text-body text-white/60">
          Comments functionality coming soon...
        </p>
      </motion.div>

      {/* Subtasks Section Placeholder */}
      <motion.div
        className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-heading-3 text-premium mb-4">Subtasks</h2>
        <p className="text-body text-white/60">
          Subtasks functionality coming soon...
        </p>
      </motion.div>
    </div>
  )
}