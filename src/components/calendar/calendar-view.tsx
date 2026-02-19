"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { StatsCard } from "@/components/ui/stats-card"
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Users,
  Target,
  Zap
} from "lucide-react"
import { CalendarEventData } from "@/lib/data-persistence"
import { loadEvents, saveEvents } from "@/lib/data-persistence"
import { EventCreationDialog } from "./event-creation-dialog"
import { EventDetails } from "./event-details"
import { useToastActions } from "@/components/ui/toast"
import { PrintButton } from "@/components/ui/print-button"
import { cn } from "@/lib/utils"

const agentColors = {
  "Hamza": {
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    border: "border-blue-500/30",
    color: "#3b82f6"
  },
  "Manus": {
    bg: "bg-purple-500/15",
    text: "text-purple-400",
    border: "border-purple-500/30",
    color: "#8b5cf6"
  },
  "Monica": {
    bg: "bg-pink-500/15",
    text: "text-pink-400",
    border: "border-pink-500/30",
    color: "#ec4899"
  },
  "Jarvis": {
    bg: "bg-indigo-500/15",
    text: "text-indigo-400",
    border: "border-indigo-500/30",
    color: "#6366f1"
  },
  "Luna": {
    bg: "bg-cyan-500/15",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
    color: "#06b6d4"
  }
}

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
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0.0, 0.2, 1] as any
    }
  }
}

const dayVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut" as any
    }
  }
}

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [events, setEvents] = useState<CalendarEventData[]>([])
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventData | null>(null)
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const toast = useToastActions()

  // Load events on mount
  useEffect(() => {
    setMounted(true)
    const loadedEvents = loadEvents()
    setEvents(loadedEvents)
  }, [])

  // Save events when they change
  useEffect(() => {
    if (mounted) {
      saveEvents(events)
    }
  }, [events, mounted])

  // Get calendar grid data
  const calendarData = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    // First day of the month
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // Start from Monday (1) to Sunday (0)
    const startDate = new Date(firstDay)
    const startDayOfWeek = (firstDay.getDay() + 6) % 7 // Convert to Monday = 0
    startDate.setDate(startDate.getDate() - startDayOfWeek)

    // Generate 6 weeks (42 days)
    const days = []
    const current = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.scheduledTime)
        return (
          eventDate.getDate() === current.getDate() &&
          eventDate.getMonth() === current.getMonth() &&
          eventDate.getFullYear() === current.getFullYear()
        )
      })

      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        isToday:
          current.getDate() === new Date().getDate() &&
          current.getMonth() === new Date().getMonth() &&
          current.getFullYear() === new Date().getFullYear(),
        events: dayEvents
      })

      current.setDate(current.getDate() + 1)
    }

    return days
  }, [currentMonth, events])

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  // Event handlers
  const handleDayClick = (date: Date) => {
    if (!date) return
    setSelectedDate(date)
    setCreateDialogOpen(true)
  }

  const handleEventClick = (event: CalendarEventData) => {
    setSelectedEvent(event)
    setEventDetailsOpen(true)
  }

  const handleEventCreate = (eventData: Partial<CalendarEventData>) => {
    const newEvent: CalendarEventData = {
      _id: `event-${Date.now()}`,
      title: eventData.title!,
      description: eventData.description || "",
      scheduledTime: eventData.scheduledTime!,
      type: eventData.type || "event",
      agent: eventData.agent,
      status: "scheduled",
      duration: eventData.duration || 60,
      recurrence: eventData.recurrence || "none",
      attendees: eventData.attendees || [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    // Handle recurring events
    const eventsToAdd = [newEvent]

    if (newEvent.recurrence && newEvent.recurrence !== "none") {
      const baseDate = new Date(newEvent.scheduledTime)
      const endDate = new Date(baseDate.getFullYear() + 1, baseDate.getMonth(), baseDate.getDate()) // One year ahead

      let nextDate = new Date(baseDate)
      let count = 1

      while (nextDate < endDate && count < 52) { // Max 52 recurrences
        switch (newEvent.recurrence) {
          case "daily":
            nextDate.setDate(nextDate.getDate() + 1)
            break
          case "weekly":
            nextDate.setDate(nextDate.getDate() + 7)
            break
          case "monthly":
            nextDate.setMonth(nextDate.getMonth() + 1)
            break
        }

        const recurringEvent: CalendarEventData = {
          ...newEvent,
          _id: `event-${Date.now()}-${count}`,
          scheduledTime: nextDate.getTime()
        }

        eventsToAdd.push(recurringEvent)
        count++
      }
    }

    setEvents(prev => [...prev, ...eventsToAdd])
    toast.success('Event Created', `"${newEvent.title}" ${eventsToAdd.length > 1 ? `and ${eventsToAdd.length - 1} recurring events` : ''} added to calendar.`)
  }

  // Statistics
  const stats = useMemo(() => {
    const now = Date.now()
    const thisMonth = currentMonth.getMonth()
    const thisYear = currentMonth.getFullYear()

    const monthEvents = events.filter(event => {
      const eventDate = new Date(event.scheduledTime)
      return eventDate.getMonth() === thisMonth && eventDate.getFullYear() === thisYear
    })

    const upcomingEvents = events.filter(event => event.scheduledTime > now && event.status === "scheduled").length
    const completedEvents = events.filter(event => event.status === "completed").length

    return {
      thisMonth: monthEvents.length,
      upcoming: upcomingEvents,
      completed: completedEvents,
      total: events.length
    }
  }, [events, currentMonth])

  // Month/year display
  const monthYearDisplay = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  })

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  if (!mounted) return null

  return (
    <div className="min-h-[calc(100vh-5rem)] relative" data-testid="calendar-view">
      {/* Command Center Background */}
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
            icon={CalendarIcon}
            title="Mission Calendar"
            subtitle="Strategic scheduling and event coordination across all agents and operations."
          >
            <StatsCard
              icon={Target}
              label="This Month"
              value={`${stats.thisMonth}`}
              subLabel="Upcoming"
              subValue={`${stats.upcoming}`}
            />
          </PageHeader>

          {/* Calendar Controls */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToPreviousMonth}
                    className="h-10 w-10 glass-morphism hover:bg-[hsl(var(--command-surface))]/60"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>

                  <h2 className="text-2xl font-display font-bold min-w-[200px] text-center">
                    {monthYearDisplay}
                  </h2>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToNextMonth}
                    className="h-10 w-10 glass-morphism hover:bg-[hsl(var(--command-surface))]/60"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={goToToday}
                  className="glass-morphism hover:bg-[hsl(var(--command-accent))]/10"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Today
                </Button>
              </div>

              <div className="flex items-center gap-4">
                {/* Agent Legend */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[hsl(var(--command-text-muted))]">Agents:</span>
                  {Object.entries(agentColors).map(([agent, colors]) => (
                    <div key={agent} className="flex items-center gap-1">
                      <div
                        className="w-3 h-3 rounded-full border"
                        style={{
                          backgroundColor: colors.color + "40",
                          borderColor: colors.color + "60"
                        }}
                      />
                      <span className="text-xs">{agentAvatars[agent as keyof typeof agentAvatars]}</span>
                    </div>
                  ))}
                </div>

                <PrintButton 
                  title="Print calendar for offline planning"
                  onBeforePrint={() => {
                    document.body.setAttribute('data-print-page', 'calendar')
                  }}
                />

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => {
                      setSelectedDate(new Date())
                      setCreateDialogOpen(true)
                    }}
                    className="btn-premium font-semibold px-6"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Event
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Calendar Grid */}
          <motion.div variants={itemVariants}>
            <Card className="glass-morphism border-[hsl(var(--command-border-bright))] overflow-hidden">
              <CardContent className="p-0">
                {/* Week Day Headers */}
                <div className="grid grid-cols-7 bg-[hsl(var(--command-surface))]/30">
                  {weekDays.map((day) => (
                    <div key={day} className="p-4 text-center font-semibold text-[hsl(var(--command-text-muted))] text-sm border-b border-[hsl(var(--command-border))]">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                  <AnimatePresence>
                    {calendarData.map((day, index) => (
                      <motion.div
                        key={`${day.date.getTime()}-${currentMonth.getMonth()}`}
                        variants={dayVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.01 }}
                        onClick={() => handleDayClick(day.date)}
                        className={cn(
                          "min-h-[120px] p-3 border-b border-r border-[hsl(var(--command-border))] cursor-pointer",
                          "hover:bg-[hsl(var(--command-surface))]/20 transition-colors duration-200",
                          !day.isCurrentMonth && "opacity-40",
                          day.isToday && "bg-[hsl(var(--command-accent))]/10 border-[hsl(var(--command-accent))]/30",
                          "relative group"
                        )}
                      >
                        {/* Day Number */}
                        <div className={cn(
                          "text-sm font-medium mb-1",
                          day.isToday ? "text-[hsl(var(--command-accent))] font-bold" :
                          day.isCurrentMonth ? "text-[hsl(var(--command-text))]" :
                          "text-[hsl(var(--command-text-muted))]"
                        )}>
                          {day.date.getDate()}
                        </div>

                        {/* Events */}
                        <div className="space-y-1">
                          {day.events.slice(0, 3).map((event, eventIndex) => {
                            const agentStyle = agentColors[event.agent as keyof typeof agentColors] || agentColors["Hamza"]

                            return (
                              <motion.div
                                key={event._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: (index * 0.01) + (eventIndex * 0.1) }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEventClick(event)
                                }}
                                className={cn(
                                  "text-xs px-2 py-1 rounded-md truncate cursor-pointer",
                                  "hover:scale-105 transition-transform duration-150",
                                  agentStyle.bg,
                                  agentStyle.border,
                                  "border backdrop-blur-sm"
                                )}
                                style={{
                                  boxShadow: `0 0 8px ${agentStyle.color}20`
                                }}
                              >
                                <div className="flex items-center gap-1">
                                  <span>{agentAvatars[event.agent as keyof typeof agentAvatars]}</span>
                                  <span className="font-medium truncate" title={event.title}>
                                    {event.title}
                                  </span>
                                </div>
                              </motion.div>
                            )
                          })}

                          {day.events.length > 3 && (
                            <div className="text-xs text-[hsl(var(--command-text-muted))] px-2">
                              +{day.events.length - 3} more
                            </div>
                          )}
                        </div>

                        {/* Hover Add Button */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 glass-morphism hover:bg-[hsl(var(--command-accent))]/20"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDayClick(day.date)
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Statistics */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="stats-glass stats-mesh-bg border-[hsl(var(--command-border-bright))]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[hsl(var(--command-accent))]/10 rounded-xl">
                      <CalendarIcon className="h-6 w-6 text-[hsl(var(--command-accent))]" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold text-contrast-high">{stats.thisMonth}</div>
                      <div className="text-sm text-contrast-medium">This Month</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="stats-glass stats-mesh-bg border-[hsl(var(--command-border-bright))]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 rounded-xl">
                      <Zap className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold text-green-400">{stats.upcoming}</div>
                      <div className="text-sm text-contrast-medium">Upcoming</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="stats-glass stats-mesh-bg border-[hsl(var(--command-border-bright))]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                      <Clock className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold text-blue-400">{stats.completed}</div>
                      <div className="text-sm text-contrast-medium">Completed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="stats-glass stats-mesh-bg border-[hsl(var(--command-border-bright))]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-xl">
                      <Users className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold text-purple-400">{stats.total}</div>
                      <div className="text-sm text-contrast-medium">Total Events</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Event Creation Dialog */}
      <EventCreationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        selectedDate={selectedDate}
        onSave={handleEventCreate}
      />

      {/* Event Details Dialog */}
      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          onClose={() => {
            setEventDetailsOpen(false)
            setSelectedEvent(null)
          }}
        />
      )}
    </div>
  )
}