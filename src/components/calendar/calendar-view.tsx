"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { StatsCard } from "@/components/ui/stats-card"
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Grid3x3, 
  List, 
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Activity,
  Target,
  Zap,
  X
} from "lucide-react"
import { CalendarEvent } from "./calendar-event"
import { EmptyState } from "@/components/ui/empty-state"

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
import { EventDetails } from "./event-details"
import { cn } from "@/lib/utils"

// Mock calendar events - empty initially to show empty state
const mockEvents: CalendarEventData[] = []

const agentAvatars = {
  "Hamza": "👤",
  "Manus": "🤘",
  "Monica": "✈️", 
  "Jarvis": "🔍",
  "Luna": "🌙"
}

const statusConfig = {
  "pending": {
    color: "text-yellow-400",
    bg: "bg-yellow-500/10", 
    border: "border-yellow-500/20",
    icon: Clock,
    glow: "0 0 10px hsl(45 100% 50% / 0.3)"
  },
  "completed": {
    color: "text-[hsl(var(--command-success))]",
    bg: "bg-[hsl(var(--command-success))]/10",
    border: "border-[hsl(var(--command-success))]/20", 
    icon: CheckCircle,
    glow: "0 0 10px hsl(var(--command-success) / 0.3)"
  },
  "failed": {
    color: "text-[hsl(var(--command-danger))]",
    bg: "bg-[hsl(var(--command-danger))]/10",
    border: "border-[hsl(var(--command-danger))]/20",
    icon: XCircle,
    glow: "0 0 10px hsl(var(--command-danger) / 0.3)"
  },
  "scheduled": {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: Clock,
    glow: "0 0 10px hsl(210 100% 50% / 0.3)"
  },
  "cancelled": {
    color: "text-gray-400",
    bg: "bg-gray-500/10",
    border: "border-gray-500/20",
    icon: XCircle,
    glow: "0 0 10px hsl(0 0% 50% / 0.3)"
  }
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
      ease: [0.4, 0.0, 0.2, 1] as any
    }
  }
}

type ViewMode = "month" | "week"

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 19)) // Feb 19, 2024
  const [viewMode, setViewMode] = useState<ViewMode>("month")
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventData | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [events] = useState<CalendarEventData[]>(mockEvents)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Get events for current view
  const viewEvents = useMemo(() => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    
    if (viewMode === "month") {
      return events.filter(event => {
        const eventDate = new Date(event.scheduledTime)
        return eventDate >= startOfMonth && eventDate <= endOfMonth
      })
    } else {
      // Week view - get current week
      const startOfWeek = new Date(currentDate)
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      
      return events.filter(event => {
        const eventDate = new Date(event.scheduledTime)
        return eventDate >= startOfWeek && eventDate <= endOfWeek
      })
    }
  }, [events, currentDate, viewMode])

  // Calendar statistics
  const totalEvents = viewEvents.length
  const completedEvents = viewEvents.filter(e => e.status === "completed").length
  const pendingEvents = viewEvents.filter(e => e.status === "pending").length
  const failedEvents = viewEvents.filter(e => e.status === "failed").length
  const completionRate = totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0

  // Navigation functions
  const goToPrevious = () => {
    if (viewMode === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))
    }
  }

  const goToNext = () => {
    if (viewMode === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    } else {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Generate calendar grid for month view
  const generateCalendarGrid = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const currentDateObj = new Date(startDate)
    
    for (let i = 0; i < 42; i++) { // 6 weeks × 7 days
      const dayEvents = viewEvents.filter(event => {
        const eventDate = new Date(event.scheduledTime)
        return eventDate.toDateString() === currentDateObj.toDateString()
      })
      
      days.push({
        date: new Date(currentDateObj),
        isCurrentMonth: currentDateObj.getMonth() === currentDate.getMonth(),
        isToday: currentDateObj.toDateString() === new Date().toDateString(),
        events: dayEvents
      })
      
      currentDateObj.setDate(currentDateObj.getDate() + 1)
    }
    
    return days
  }

  if (!mounted) return null

  const calendarGrid = viewMode === "month" ? generateCalendarGrid() : []
  const monthName = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  
  return (
    <div className="min-h-[calc(100vh-5rem)] relative">
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
            icon={Calendar}
            title="Mission Calendar"
            subtitle="Strategic scheduling and timeline coordination. Real-time tracking of all scheduled operations and automated processes."
          >
            <StatsCard
              icon={Target}
              label="Execution Rate"
              value={`${completionRate}%`}
              subLabel="Complete"
              subValue={`${completedEvents}/${totalEvents}`}
            />
          </PageHeader>

          <motion.div variants={itemVariants} className="space-y-6">
            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Navigation */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost" 
                    size="icon"
                    onClick={goToPrevious}
                    className="glass-morphism hover:bg-[hsl(var(--command-accent))]/10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="px-4 py-2 glass-morphism rounded-lg">
                    <span className="font-heading font-semibold text-lg">{monthName}</span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon" 
                    onClick={goToNext}
                    className="glass-morphism hover:bg-[hsl(var(--command-accent))]/10"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={goToToday}
                    className="glass-morphism hover:bg-[hsl(var(--command-accent))]/10 px-4"
                  >
                    Today
                  </Button>
                </div>

                {/* Event Type Indicators */}
                <div className="flex items-center gap-3">
                  {Object.entries(statusConfig).map(([status, config]) => {
                    const count = viewEvents.filter(e => e.status === status).length
                    if (count === 0) return null
                    
                    return (
                      <motion.div
                        key={status}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1 rounded-lg glass-morphism",
                          config.bg,
                          config.border
                        )}
                        style={{ boxShadow: config.glow }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <config.icon className={cn("h-3 w-3", config.color)} />
                        <span className={cn("text-xs font-medium", config.color)}>
                          {count} {status}
                        </span>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 glass-morphism p-1 rounded-lg">
                <Button
                  variant={viewMode === "month" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("month")}
                  className={cn(
                    "px-3",
                    viewMode === "month" && "bg-[hsl(var(--command-accent))] hover:bg-[hsl(var(--command-accent))]/80"
                  )}
                >
                  <Grid3x3 className="h-4 w-4 mr-1" />
                  Month
                </Button>
                <Button
                  variant={viewMode === "week" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("week")}
                  className={cn(
                    "px-3",
                    viewMode === "week" && "bg-[hsl(var(--command-accent))] hover:bg-[hsl(var(--command-accent))]/80"
                  )}
                >
                  <List className="h-4 w-4 mr-1" />
                  Week
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Calendar View or Empty State */}
          <motion.div variants={itemVariants}>
            {events.length === 0 ? (
              <EmptyState
                icon="📅"
                title="Mission Calendar Ready"
                description="Your strategic timeline is empty. Begin scheduling operations, deadlines, and automated processes. Command center awaiting your temporal coordination directives."
                actionLabel="Schedule First Event"
                onAction={() => {
                  // TODO: Add event creation functionality
                  console.log('Add event functionality to be implemented')
                }}
              />
            ) : (
            {viewMode === "month" ? (
              <Card className="glass-morphism border-[hsl(var(--command-border-bright))] overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, index) => (
                      <div 
                        key={day} 
                        className="text-center p-3 backdrop-blur-md bg-gradient-to-b from-white/5 to-white/0 border border-white/5 rounded-lg"
                      >
                        <div className="text-xs font-medium text-[hsl(var(--command-text-muted))] uppercase tracking-wider mb-1">
                          {day.slice(0, 3)}
                        </div>
                        <div className="text-sm font-bold text-[hsl(var(--command-text))]">
                          {day.charAt(0)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="grid grid-cols-7 gap-1">
                    {calendarGrid.map((day, index) => (
                      <motion.div
                        key={index}
                        className={cn(
                          "min-h-[80px] sm:min-h-[120px] p-2 sm:p-3 backdrop-blur-md bg-gradient-to-br from-white/3 to-white/0",
                          "border border-white/5 rounded-lg sm:rounded-xl relative group cursor-pointer",
                          "hover:from-white/8 hover:to-white/0 hover:border-white/10",
                          "transition-all duration-200",
                          !day.isCurrentMonth && "opacity-40",
                          day.isToday && "ring-2 ring-[hsl(var(--command-accent))]/50 bg-gradient-to-br from-[hsl(var(--command-accent))]/10 to-transparent",
                          selectedDate && selectedDate.toDateString() === day.date.toDateString() && "ring-2 ring-white/30 bg-gradient-to-br from-white/10 to-transparent"
                        )}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setSelectedDate(day.date)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={cn(
                            "flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold transition-colors",
                            day.isToday 
                              ? "bg-[hsl(var(--command-accent))] text-white shadow-lg" 
                              : "text-[hsl(var(--command-text))] hover:bg-white/10"
                          )}>
                            {day.date.getDate()}
                          </div>
                          {day.events.length > 0 && (
                            <div 
                              className="text-xs px-2 py-0.5 rounded-full backdrop-blur-md"
                              style={{
                                backgroundColor: `hsl(var(--command-accent))15`,
                                color: 'hsl(var(--command-accent))',
                                border: '1px solid hsl(var(--command-accent))30'
                              }}
                            >
                              {day.events.length}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-1.5">
                          {day.events.slice(0, 3).map((event) => {
                            const statusStyle = statusConfig[event.status || "pending"]
                            return (
                              <motion.div
                                key={event._id}
                                className={cn(
                                  "text-xs p-2 rounded-lg cursor-pointer backdrop-blur-md border",
                                  "hover:shadow-lg transition-all duration-200",
                                  statusStyle.bg,
                                  statusStyle.border
                                )}
                                style={{ 
                                  boxShadow: `0 0 8px ${statusStyle.glow}20`,
                                  backgroundColor: `${statusStyle.glow}15`
                                }}
                                whileHover={{ scale: 1.02, y: -1 }}
                                onClick={() => setSelectedEvent(event)}
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className="text-sm">
                                    {agentAvatars[event.agent as keyof typeof agentAvatars]}
                                  </span>
                                  <span className="truncate font-medium text-[hsl(var(--command-text))]">
                                    {event.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  <div 
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: statusStyle.glow }}
                                  />
                                  <span className="text-[10px] text-[hsl(var(--command-text-dim))] uppercase tracking-wider">
                                    {event.status}
                                  </span>
                                </div>
                              </motion.div>
                            )
                          })}
                          {day.events.length > 3 && (
                            <div className="text-xs text-[hsl(var(--command-text-muted))] font-medium pl-2 pt-1">
                              +{day.events.length - 3} more events
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Week View */
              <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {viewEvents
                      .sort((a, b) => a.scheduledTime - b.scheduledTime)
                      .map((event) => {
                        const eventDate = new Date(event.scheduledTime)
                        const statusStyle = statusConfig[event.status || "pending"]
                        const StatusIcon = statusStyle.icon
                        
                        return (
                          <motion.div
                            key={event._id}
                            className={cn(
                              "p-4 glass-morphism rounded-xl border cursor-pointer group",
                              statusStyle.border
                            )}
                            style={{ boxShadow: statusStyle.glow }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            onClick={() => setSelectedEvent(event)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={cn("p-2 rounded-lg", statusStyle.bg)}>
                                  <StatusIcon className={cn("h-4 w-4", statusStyle.color)} />
                                </div>
                                <div>
                                  <h3 className="font-heading font-semibold">{event.title}</h3>
                                  <p className="text-sm text-[hsl(var(--command-text-muted))]">
                                    {event.description}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div className="text-sm font-medium">
                                    {eventDate.toLocaleDateString()} {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                  <div className="text-xs text-[hsl(var(--command-text-muted))]">
                                    {event.duration} minutes • {event.type}
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">
                                    {agentAvatars[event.agent as keyof typeof agentAvatars]}
                                  </span>
                                  <Badge variant="outline" className={cn(statusStyle.bg, statusStyle.color)}>
                                    {event.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                      
                    {viewEvents.length === 0 && (
                      <div className="text-center py-12">
                        <div className="space-y-3">
                          <div className="w-12 h-12 mx-auto glass-morphism rounded-full flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-[hsl(var(--command-text-muted))]" />
                          </div>
                          <p className="text-[hsl(var(--command-text-dim))] text-sm">
                            No events scheduled for this week
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Selected Day Events */}
          {selectedDate && (
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="glass-morphism border-[hsl(var(--command-border-bright))] mt-6">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-heading font-semibold">
                      Events for {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDate(null)}
                      className="text-[hsl(var(--command-text-muted))] hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const dayEvents = events.filter(event => {
                      const eventDate = new Date(event.scheduledTime)
                      return eventDate.toDateString() === selectedDate.toDateString()
                    }).sort((a, b) => a.scheduledTime - b.scheduledTime)

                    if (dayEvents.length === 0) {
                      return (
                        <div className="text-center py-8">
                          <Clock className="h-12 w-12 mx-auto text-[hsl(var(--command-text-muted))] mb-4" />
                          <p className="text-[hsl(var(--command-text-muted))]">
                            No events scheduled for this day
                          </p>
                        </div>
                      )
                    }

                    return (
                      <div className="space-y-3">
                        {dayEvents.map((event) => {
                          const eventDate = new Date(event.scheduledTime)
                          const statusStyle = statusConfig[event.status || "pending"]
                          const StatusIcon = statusStyle.icon
                          
                          return (
                            <motion.div
                              key={event._id}
                              className={cn(
                                "p-4 glass-morphism rounded-xl border cursor-pointer group",
                                statusStyle.border
                              )}
                              style={{ boxShadow: statusStyle.glow }}
                              whileHover={{ scale: 1.02, y: -2 }}
                              onClick={() => setSelectedEvent(event)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className={cn("p-2 rounded-lg", statusStyle.bg)}>
                                    <StatusIcon className={cn("h-4 w-4", statusStyle.color)} />
                                  </div>
                                  <div>
                                    <h3 className="font-heading font-semibold">{event.title}</h3>
                                    <p className="text-body-small text-secondary">
                                      {event.description}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <div className="text-body font-semibold">
                                      {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="text-body-small text-secondary">
                                      {event.duration} minutes • {event.agent}
                                    </div>
                                  </div>
                                  
                                  <Badge variant="outline" className={cn(statusStyle.bg, statusStyle.color, "text-body-small")}>
                                    {event.status}
                                  </Badge>
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>
            </motion.div>
          )}
            )}
        </div>
      </motion.div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <EventDetails
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}