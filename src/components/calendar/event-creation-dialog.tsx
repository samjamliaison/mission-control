"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  User,
  Repeat,
  X,
  CalendarDays,
  Timer,
  Target,
  Users,
  Zap,
  CheckCircle,
  AlertTriangle,
  Flag
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CalendarEventData } from "@/lib/data-persistence"

interface EventCreationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: Date | null
  onSave: (event: Partial<CalendarEventData>) => void
}

const agentOptions = ["Hamza", "Manus", "Monica", "Jarvis", "Luna"]
const eventTypes = [
  { value: "meeting", label: "Meeting", icon: Users, color: "text-blue-400", emoji: "👥" },
  { value: "deadline", label: "Deadline", icon: AlertTriangle, color: "text-red-400", emoji: "⏰" },
  { value: "event", label: "Event", icon: CalendarDays, color: "text-green-400", emoji: "🎉" },
  { value: "reminder", label: "Reminder", icon: Clock, color: "text-yellow-400", emoji: "📌" },
  { value: "task", label: "Task", icon: Target, color: "text-purple-400", emoji: "✅" },
  { value: "cron", label: "Automated", icon: Zap, color: "text-cyan-400", emoji: "⚡" }
] as const

const recurrenceOptions = [
  { value: "none", label: "No Repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" }
] as const

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
    color: "#3b82f6"
  },
  "Manus": {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    color: "#8b5cf6"
  },
  "Monica": {
    bg: "bg-pink-500/10",
    text: "text-pink-400",
    border: "border-pink-500/20",
    color: "#ec4899"
  },
  "Jarvis": {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/20",
    color: "#6366f1"
  },
  "Luna": {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
    color: "#06b6d4"
  }
}

export function EventCreationDialog({ open, onOpenChange, selectedDate, onSave }: EventCreationDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [agent, setAgent] = useState("")
  const [eventType, setEventType] = useState<string>("event")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [duration, setDuration] = useState("60")
  const [recurrence, setRecurrence] = useState<string>("none")

  // Initialize form when dialog opens
  useEffect(() => {
    if (open && selectedDate) {
      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
      const day = String(selectedDate.getDate()).padStart(2, '0')
      setDate(`${year}-${month}-${day}`)

      // Default to 9 AM if no time set
      if (!time) {
        setTime("09:00")
      }
    }
  }, [open, selectedDate])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setTitle("")
      setDescription("")
      setAgent("")
      setEventType("event")
      setDate("")
      setTime("")
      setDuration("60")
      setRecurrence("none")
    }
  }, [open])

  const handleSave = () => {
    if (!title.trim() || !date || !time || !agent) return

    // Combine date and time
    const eventDateTime = new Date(`${date}T${time}:00`)
    const scheduledTime = eventDateTime.getTime()

    const eventData: Partial<CalendarEventData> = {
      title: title.trim(),
      description: description.trim(),
      scheduledTime,
      type: eventType as CalendarEventData["type"],
      agent,
      duration: parseInt(duration, 10),
      recurrence: recurrence as CalendarEventData["recurrence"]
    }

    onSave(eventData)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const isFormValid = title.trim() && date && time && agent
  const selectedEventType = eventTypes.find(t => t.value === eventType)
  const selectedAgent = agent
  const agentStyle = agentColors[agent as keyof typeof agentColors]
  const selectedRecurrence = recurrenceOptions.find(r => r.value === recurrence)

  // Format selected date for display
  const formatSelectedDate = () => {
    if (!selectedDate) return ""
    return selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] glass-morphism border-[hsl(var(--command-border-bright))] p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="relative p-6 pb-4">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: selectedEventType
                ? `linear-gradient(135deg, ${selectedEventType.color.replace('text-', 'hsl(var(--command-')} 0%, transparent 50%)`
                : "linear-gradient(135deg, hsl(var(--command-accent)) 0%, transparent 50%)"
            }}
          />

          <DialogHeader className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 glass-morphism rounded-lg">
                <CalendarDays className="h-5 w-5 text-[hsl(var(--command-accent))]" />
              </div>
              <DialogTitle className="text-xl font-display font-bold">
                Schedule New Event
              </DialogTitle>
            </div>
            <DialogDescription className="text-[hsl(var(--command-text-muted))]">
              {selectedDate
                ? `Creating event for ${formatSelectedDate()}`
                : "Configure a new calendar event with agent assignments and scheduling options."
              }
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 space-y-6">
          {/* Event Title */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label htmlFor="title" className="text-sm font-heading font-semibold flex items-center gap-2">
              <Flag className="h-4 w-4 text-[hsl(var(--command-accent))]" />
              Event Title *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title..."
              className="glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))] font-medium"
            />
          </motion.div>

          {/* Event Description */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label htmlFor="description" className="text-sm font-heading font-semibold text-[hsl(var(--command-text))]">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event details and objectives..."
              rows={3}
              className="glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))] resize-none"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Type */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="text-sm font-heading font-semibold flex items-center gap-2">
                {selectedEventType && <selectedEventType.icon className={cn("h-4 w-4", selectedEventType.color)} />}
                Event Type
              </label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger className="glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))]">
                  <SelectValue>
                    {selectedEventType && (
                      <div className="flex items-center gap-2">
                        <span>{selectedEventType.emoji}</span>
                        <span>{selectedEventType.label}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="glass-morphism border-[hsl(var(--command-border-bright))]">
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="focus:bg-[hsl(var(--command-accent))]/10">
                      <div className="flex items-center gap-2 py-1">
                        <span>{type.emoji}</span>
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Agent Assignment */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="text-sm font-heading font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                Assigned Agent *
              </label>
              <Select value={agent} onValueChange={setAgent}>
                <SelectTrigger className="glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))]">
                  <SelectValue placeholder="Select agent">
                    {selectedAgent && (
                      <div className="flex items-center gap-2">
                        <span>{agentAvatars[selectedAgent as keyof typeof agentAvatars]}</span>
                        <span>{selectedAgent}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="glass-morphism border-[hsl(var(--command-border-bright))]">
                  {agentOptions.map((agentOption) => (
                    <SelectItem key={agentOption} value={agentOption} className="focus:bg-[hsl(var(--command-accent))]/10">
                      <div className="flex items-center gap-3 py-1">
                        <span className="text-lg">{agentAvatars[agentOption as keyof typeof agentAvatars]}</span>
                        <div>
                          <div className="font-medium">{agentOption}</div>
                          <div className="text-xs text-[hsl(var(--command-text-muted))]">
                            Command Agent
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="text-sm font-heading font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                Date *
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))]"
              />
            </motion.div>

            {/* Time */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="text-sm font-heading font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                Time *
              </label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))]"
              />
            </motion.div>

            {/* Duration */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="text-sm font-heading font-semibold flex items-center gap-2">
                <Timer className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                Duration (min)
              </label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="15"
                max="480"
                step="15"
                className="glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))]"
              />
            </motion.div>
          </div>

          {/* Recurrence */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <label className="text-sm font-heading font-semibold flex items-center gap-2">
              <Repeat className="h-4 w-4 text-[hsl(var(--command-accent))]" />
              Repeat Schedule
            </label>
            <Select value={recurrence} onValueChange={setRecurrence}>
              <SelectTrigger className="glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))]">
                <SelectValue>
                  {selectedRecurrence && (
                    <div className="flex items-center gap-2">
                      <Repeat className="h-4 w-4" />
                      <span>{selectedRecurrence.label}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="glass-morphism border-[hsl(var(--command-border-bright))]">
                {recurrenceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="focus:bg-[hsl(var(--command-accent))]/10">
                    <div className="flex items-center gap-2 py-1">
                      <Repeat className="h-4 w-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {recurrence !== "none" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-xs text-[hsl(var(--command-text-muted))] p-2 glass-morphism rounded-lg"
              >
                This will create recurring events for the next year based on the selected schedule.
              </motion.div>
            )}
          </motion.div>

          {/* Preview */}
          {agent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
              className="flex items-center justify-center p-4 glass-morphism rounded-xl"
            >
              <div className="text-center space-y-2">
                <div className="text-xs text-[hsl(var(--command-text-muted))] font-medium">Event Preview</div>
                <div className="flex items-center gap-2">
                  {agentStyle && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-sm px-3 py-1 border",
                        agentStyle.bg,
                        agentStyle.border
                      )}
                      style={{
                        boxShadow: `0 0 8px ${agentStyle.color}20`
                      }}
                    >
                      <span className="mr-1">{agentAvatars[agent as keyof typeof agentAvatars]}</span>
                      {agent}
                    </Badge>
                  )}

                  {selectedEventType && (
                    <Badge
                      variant="outline"
                      className={cn("text-sm px-3 py-1", selectedEventType.color, "border-current/20")}
                    >
                      <span className="mr-1">{selectedEventType.emoji}</span>
                      {selectedEventType.label}
                    </Badge>
                  )}

                  {selectedRecurrence && recurrence !== "none" && (
                    <Badge variant="outline" className="text-xs px-2 py-1 border-[hsl(var(--command-accent))]/20 text-[hsl(var(--command-accent))]">
                      <Repeat className="h-3 w-3 mr-1" />
                      {selectedRecurrence.label}
                    </Badge>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-[hsl(var(--command-surface))]/50 backdrop-blur border-t border-[hsl(var(--command-border))]">
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="hover:bg-[hsl(var(--command-text-muted))]/10"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <motion.div
              whileHover={{ scale: isFormValid ? 1.02 : 1 }}
              whileTap={{ scale: isFormValid ? 0.98 : 1 }}
            >
              <Button
                onClick={handleSave}
                disabled={!isFormValid}
                className={cn(
                  "font-semibold px-6",
                  isFormValid
                    ? "bg-gradient-to-r from-[hsl(var(--command-accent))] to-[hsl(199_89%_38%)] hover:from-[hsl(199_89%_58%)] hover:to-[hsl(var(--command-accent))] shadow-lg shadow-[hsl(var(--command-accent))]/20"
                    : "opacity-50 cursor-not-allowed"
                )}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Schedule Event
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}