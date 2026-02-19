"use client"

import { motion } from "framer-motion"
import { Clock, Users, MapPin, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
// Interface for calendar event data
interface CalendarEventData {
  _id: string
  title: string
  description: string
  startTime: number
  endTime: number
  type: "meeting" | "deadline" | "event" | "reminder"
  attendees: string[]
  location?: string
  priority: "low" | "medium" | "high"
  createdAt: number
  updatedAt: number
}

interface CalendarEventProps {
  event: CalendarEventData
  onClick?: () => void
  compact?: boolean
}

const eventTypeConfig = {
  meeting: {
    color: "hsl(var(--command-accent))",
    bg: "bg-[hsl(var(--command-accent))]/15",
    text: "text-[hsl(var(--command-accent))]",
    border: "border-[hsl(var(--command-accent))]/30",
    emoji: "👥"
  },
  deadline: {
    color: "hsl(var(--command-danger))",
    bg: "bg-[hsl(var(--command-danger))]/15",
    text: "text-[hsl(var(--command-danger))]",
    border: "border-[hsl(var(--command-danger))]/30",
    emoji: "⏰"
  },
  event: {
    color: "hsl(var(--command-success))",
    bg: "bg-[hsl(var(--command-success))]/15",
    text: "text-[hsl(var(--command-success))]",
    border: "border-[hsl(var(--command-success))]/30",
    emoji: "🎉"
  },
  reminder: {
    color: "hsl(var(--command-warning))",
    bg: "bg-[hsl(var(--command-warning))]/15",
    text: "text-[hsl(var(--command-warning))]",
    border: "border-[hsl(var(--command-warning))]/30",
    emoji: "📌"
  }
}

export function CalendarEvent({ event, onClick, compact = false }: CalendarEventProps) {
  const typeStyle = eventTypeConfig[event.type]
  
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    })
  }

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "cursor-pointer rounded-lg border backdrop-blur-md transition-all duration-200",
        "hover:shadow-lg",
        typeStyle.bg,
        typeStyle.border,
        compact ? "p-1.5" : "p-2"
      )}
      style={{
        boxShadow: `0 0 8px ${typeStyle.color}20`
      }}
    >
      {compact ? (
        <div className="flex items-center gap-1.5">
          <span className="text-xs">{typeStyle.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className={cn("text-xs font-medium truncate", typeStyle.text)}>
              {event.title}
            </div>
            <div className="text-[10px] text-[hsl(var(--command-text-dim))]">
              {formatTime(event.startTime)}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-sm">{typeStyle.emoji}</span>
            <div className={cn("text-sm font-semibold", typeStyle.text)}>
              {event.title}
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--command-text-dim))]">
            <Clock className="h-3 w-3" />
            <span>
              {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </span>
          </div>
          
          {event.attendees?.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--command-text-dim))]">
              <Users className="h-3 w-3" />
              <span>{event.attendees.length} attendees</span>
            </div>
          )}
          
          {event.location && (
            <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--command-text-dim))]">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}