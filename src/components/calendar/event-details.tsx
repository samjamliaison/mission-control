"use client"

import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  User,
  Repeat,
  CheckCircle,
  AlertCircle,
  XCircle,
  Play,
  RefreshCw,
  X,
  Zap
} from "lucide-react"
import { CalendarEvent } from "./calendar-event"
import { cn } from "@/lib/utils"

interface CalendarEventData {
  _id: string
  title: string
  description: string
  scheduledTime: number
  type: "meeting" | "deadline" | "event" | "reminder" | "cron" | "task"
  agent?: string
  status?: "scheduled" | "completed" | "cancelled" | "pending" | "failed"
  duration?: number
  recurrence?: "daily" | "weekly" | "monthly" | "none" | null
  attendees?: string[]
  location?: string
  priority?: "low" | "medium" | "high"
  createdAt?: number
  updatedAt?: number
}

interface EventDetailsProps {
  event: CalendarEventData
  onClose: () => void
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

const statusConfig = {
  "pending": {
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    icon: Clock,
    label: "Scheduled",
    description: "Waiting for execution time"
  },
  "completed": {
    color: "text-[hsl(var(--command-success))]",
    bg: "bg-[hsl(var(--command-success))]/10",
    border: "border-[hsl(var(--command-success))]/20",
    icon: CheckCircle,
    label: "Completed",
    description: "Successfully executed"
  },
  "failed": {
    color: "text-[hsl(var(--command-danger))]",
    bg: "bg-[hsl(var(--command-danger))]/10",
    border: "border-[hsl(var(--command-danger))]/20",
    icon: XCircle,
    label: "Failed",
    description: "Execution encountered errors"
  },
  "scheduled": {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: Clock,
    label: "Scheduled",
    description: "Upcoming event"
  },
  "cancelled": {
    color: "text-gray-400",
    bg: "bg-gray-500/10",
    border: "border-gray-500/20",
    icon: XCircle,
    label: "Cancelled",
    description: "Event has been cancelled"
  }
}

const typeConfig = {
  "task": {
    icon: Play,
    label: "Manual Task",
    color: "text-[hsl(var(--command-accent))]",
    bg: "bg-[hsl(var(--command-accent))]/10"
  },
  "cron": {
    icon: RefreshCw,
    label: "Automated Job",
    color: "text-purple-400",
    bg: "bg-purple-500/10"
  },
  "meeting": {
    icon: User,
    label: "Meeting",
    color: "text-green-400",
    bg: "bg-green-500/10"
  },
  "deadline": {
    icon: AlertCircle,
    label: "Deadline",
    color: "text-red-400",
    bg: "bg-red-500/10"
  },
  "event": {
    icon: Calendar,
    label: "Event",
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  "reminder": {
    icon: Clock,
    label: "Reminder",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10"
  }
}

export function EventDetails({ event, onClose }: EventDetailsProps) {
  const eventDate = new Date(event.scheduledTime)
  const agentStyle = agentColors[event.agent as keyof typeof agentColors] || agentColors["Hamza"]
  const statusStyle = statusConfig[event.status || "pending"]
  const typeStyle = typeConfig[event.type] || typeConfig["task"]
  const StatusIcon = statusStyle.icon
  const TypeIcon = typeStyle.icon

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    }
  }

  const { date, time } = formatDateTime(event.scheduledTime)

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] glass-morphism border-[hsl(var(--command-border-bright))] p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="relative p-6 pb-4">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: `linear-gradient(135deg, ${statusStyle.color.replace('text-', 'hsl(var(--command-')} 0%, transparent 50%)`
            }}
          />

          <DialogHeader className="relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 glass-morphism rounded-lg", statusStyle.bg)}>
                  <StatusIcon className={cn("h-5 w-5", statusStyle.color)} />
                </div>
                <div>
                  <DialogTitle className="text-xl font-display font-bold">
                    {event.title}
                  </DialogTitle>
                  <p className="text-[hsl(var(--command-text-muted))] text-sm mt-1">
                    {event.description}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-[hsl(var(--command-danger))]/10 hover:text-[hsl(var(--command-danger))]"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 space-y-6">
          {/* Status & Type */}
          <div className="flex items-center gap-4">
            <motion.div
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-xl glass-morphism",
                statusStyle.bg,
                statusStyle.border
              )}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <StatusIcon className={cn("h-4 w-4", statusStyle.color)} />
              <div>
                <div className={cn("font-semibold text-sm", statusStyle.color)}>
                  {statusStyle.label}
                </div>
                <div className="text-xs text-[hsl(var(--command-text-muted))]">
                  {statusStyle.description}
                </div>
              </div>
            </motion.div>

            <motion.div
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg glass-morphism",
                typeStyle.bg
              )}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <TypeIcon className={cn("h-4 w-4", typeStyle.color)} />
              <span className={cn("text-sm font-medium", typeStyle.color)}>
                {typeStyle.label}
              </span>
            </motion.div>
          </div>

          {/* Event Details */}
          <motion.div
            className="space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Schedule */}
            <div className="glass-morphism p-4 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                <span className="font-heading font-semibold">Schedule</span>
              </div>
              <div className="pl-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[hsl(var(--command-text-muted))]">Date</span>
                  <span className="font-medium">{date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[hsl(var(--command-text-muted))]">Time</span>
                  <span className="font-medium">{time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[hsl(var(--command-text-muted))]">Duration</span>
                  <span className="font-medium">{event.duration} minutes</span>
                </div>
              </div>
            </div>

            {/* Agent Assignment */}
            <div className="glass-morphism p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                <span className="font-heading font-semibold">Assigned Agent</span>
              </div>
              <div className="pl-6">
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg glass-morphism w-fit",
                    agentStyle.bg,
                    agentStyle.border
                  )}
                  style={{ boxShadow: agentStyle.glow }}
                >
                  <span className="text-lg">
                    {agentAvatars[event.agent as keyof typeof agentAvatars]}
                  </span>
                  <div>
                    <div className={cn("font-medium", agentStyle.text)}>{event.agent}</div>
                    <div className="text-xs text-[hsl(var(--command-text-muted))]">
                      Command Agent
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recurrence */}
            {event.recurrence && (
              <div className="glass-morphism p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Repeat className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                  <span className="font-heading font-semibold">Recurrence</span>
                </div>
                <div className="pl-6">
                  <Badge variant="outline" className="bg-[hsl(var(--command-accent))]/10 text-[hsl(var(--command-accent))] border-[hsl(var(--command-accent))]/20">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    {event.recurrence.charAt(0).toUpperCase() + event.recurrence.slice(1)}
                  </Badge>
                </div>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex justify-end gap-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {event.status === "pending" && (
              <>
                <Button variant="outline" className="hover:bg-[hsl(var(--command-accent))]/10">
                  <Zap className="h-4 w-4 mr-2" />
                  Run Now
                </Button>
                <Button variant="outline" className="hover:bg-yellow-500/10">
                  <Clock className="h-4 w-4 mr-2" />
                  Reschedule
                </Button>
              </>
            )}

            {event.status === "failed" && (
              <Button variant="outline" className="hover:bg-[hsl(var(--command-accent))]/10">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={onClose}
              className="hover:bg-[hsl(var(--command-text-muted))]/10"
            >
              Close
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}