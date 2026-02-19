"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Zap
} from "lucide-react"
import { CalendarEvent } from "./calendar-event"
import { EventDetails } from "./event-details"
import { cn } from "@/lib/utils"

// Mock calendar events
const mockEvents: CalendarEvent[] = [
  {
    _id: "1",
    title: "Daily Status Sync",
    description: "Check all agent status and update mission boards",
    type: "cron",
    agent: "Manus",
    scheduledTime: new Date(2024, 1, 19, 9, 0, 0).getTime(),
    status: "completed",
    duration: 15,
    recurrence: "daily"
  },
  {
    _id: "2", 
    title: "Content Review Meeting",
    description: "Review pipeline progress and upcoming publications",
    type: "task",
    agent: "Monica",
    scheduledTime: new Date(2024, 1, 19, 14, 30, 0).getTime(),
    status: "pending",
    duration: 60,
    recurrence: null
  },
  {
    _id: "3",
    title: "System Health Check",
    description: "Automated monitoring and performance analysis",
    type: "cron", 
    agent: "Jarvis",
    scheduledTime: new Date(2024, 1, 20, 8, 0, 0).getTime(),
    status: "pending",
    duration: 30,
    recurrence: "weekly"
  },
  {
    _id: "4",
    title: "Research Sprint Planning",
    description: "Plan next quarter research objectives and resource allocation",
    type: "task",
    agent: "Luna",
    scheduledTime: new Date(2024, 1, 21, 10, 0, 0).getTime(),
    status: "pending", 
    duration: 120,
    recurrence: null
  },
  {
    _id: "5",
    title: "Weekly Team Sync",
    description: "Cross-agent coordination and priority alignment",
    type: "task",
    agent: "Hamza",
    scheduledTime: new Date(2024, 1, 22, 16, 0, 0).getTime(),
    status: "pending",
    duration: 90,
    recurrence: "weekly"
  },
  {
    _id: "6",
    title: "Content Publishing",
    description: "Automated content deployment across all platforms",
    type: "cron",
    agent: "Monica", 
    scheduledTime: new Date(2024, 1, 23, 12, 0, 0).getTime(),
    status: "failed",
    duration: 10,
    recurrence: "daily"
  },
  {
    _id: "7",
    title: "Mission Critical Review",
    description: "Quarterly assessment of all operational parameters",
    type: "task",
    agent: "Hamza",
    scheduledTime: new Date(2024, 1, 25, 15, 0, 0).getTime(),
    status: "completed",
    duration: 180,
    recurrence: null
  }
]

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
      ease: "easeOut"
    }
  }
}

type ViewMode = "month" | "week"

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 19)) // Feb 19, 2024
  const [viewMode, setViewMode] = useState<ViewMode>("month")
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [events] = useState<CalendarEvent[]>(mockEvents)
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
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg glass-morphism glow-border">
                    <Calendar className="h-6 w-6 text-[hsl(var(--command-accent))]" />
                  </div>
                  <h1 className="text-4xl font-display font-bold text-premium">
                    Mission Calendar
                  </h1>
                </div>
                <p className="text-[hsl(var(--command-text-muted))] text-lg max-w-2xl">
                  Strategic scheduling and timeline coordination. Real-time tracking of all scheduled operations and automated processes.
                </p>
              </div>
              
              {/* Statistics Dashboard */}
              <div className="flex items-center gap-4">
                <motion.div 
                  className="glass-morphism p-4 rounded-xl space-y-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-[hsl(var(--command-success))]" />
                    <span className="text-sm font-medium">Execution Rate</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-display font-bold text-[hsl(var(--command-success))]">
                      {completionRate}%
                    </div>
                    <div className="text-xs text-[hsl(var(--command-text-muted))] space-y-1">
                      <div>{completedEvents}/{totalEvents} Complete</div>
                      <div>{pendingEvents} Pending • {failedEvents} Failed</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

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

          {/* Calendar View */}
          <motion.div variants={itemVariants}>
            {viewMode === "month" ? (
              <Card className="glass-morphism border-[hsl(var(--command-border-bright))] overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="grid grid-cols-7 gap-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center py-2">
                        <span className="text-sm font-heading font-semibold text-[hsl(var(--command-text-muted))]">
                          {day}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-7">
                    {calendarGrid.map((day, index) => (
                      <motion.div
                        key={index}
                        className={cn(
                          "min-h-[120px] p-2 border-t border-[hsl(var(--command-border))] relative group",
                          !day.isCurrentMonth && "opacity-50",
                          day.isToday && "bg-[hsl(var(--command-accent))]/5 ring-1 ring-[hsl(var(--command-accent))]/20"
                        )}
                        whileHover={{ backgroundColor: "hsl(var(--command-surface))" }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn(
                            "text-sm font-medium",
                            day.isToday && "text-[hsl(var(--command-accent))] font-bold"
                          )}>
                            {day.date.getDate()}
                          </span>
                          {day.events.length > 0 && (
                            <Badge variant="outline" className="h-5 text-xs">
                              {day.events.length}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          {day.events.slice(0, 3).map((event) => {
                            const statusStyle = statusConfig[event.status]
                            return (
                              <motion.div
                                key={event._id}
                                className={cn(
                                  "text-xs p-1 rounded cursor-pointer glass-morphism",
                                  statusStyle.bg,
                                  statusStyle.border
                                )}
                                style={{ boxShadow: statusStyle.glow }}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedEvent(event)}
                              >
                                <div className="flex items-center gap-1">
                                  <span className="text-xs">
                                    {agentAvatars[event.agent as keyof typeof agentAvatars]}
                                  </span>
                                  <span className="truncate font-medium">{event.title}</span>
                                </div>
                              </motion.div>
                            )
                          })}
                          {day.events.length > 3 && (
                            <div className="text-xs text-[hsl(var(--command-text-muted))] pl-1">
                              +{day.events.length - 3} more
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
                        const statusStyle = statusConfig[event.status]
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