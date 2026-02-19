"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { StatsCard } from "@/components/ui/stats-card"
import { StaggeredList } from "@/components/ui/staggered-list"
import Link from "next/link"
import {
  Command,
  CheckSquare,
  Film,
  Calendar,
  Brain,
  Users,
  Building2,
  Plus,
  Activity,
  Target,
  TrendingUp,
  Clock,
  Zap,
  ArrowRight,
  BarChart3,
  PieChart,
  Timer,
  Server,
  Settings,
  PlayCircle,
  PauseCircle,
  RefreshCw
} from "lucide-react"
import { loadTasks, loadContent, loadEvents, loadMemories } from "@/lib/data-persistence"
import { Task } from "@/components/tasks/task-card"
import { ContentItem } from "@/types/content"
import { MemoryEntry } from "@/components/memory/memory-entry"
import { CalendarEventData } from "@/lib/data-persistence"
import { cn } from "@/lib/utils"
import { MiniSparkline, generateTrendData } from "@/components/ui/mini-sparkline"
import { SectionErrorBoundary } from "@/components/ui/error-boundary"

// OpenClaw API Types
interface AgentStatus {
  id: string
  name: string
  status: 'online' | 'active' | 'idle' | 'offline'
  lastSeen: number
  currentActivity?: string
  activeTasks: number
  workspace: string
  model?: string
  uptime: number
  avatar: string
}

interface CronJob {
  id: string
  schedule: string
  command: string
  description?: string
  enabled: boolean
  lastRun?: number
  nextRun?: number
  runCount: number
  agent?: string
  status: 'active' | 'disabled' | 'error'
}

interface SessionInfo {
  id: string
  agentId: string
  agentName: string
  type: 'main' | 'subagent' | 'tool' | 'background'
  status: 'active' | 'idle' | 'paused' | 'ended'
  startTime: number
  lastActivity: number
  duration: number
  channel?: string
  currentTask?: string
  messageCount: number
  priority: 'low' | 'normal' | 'high' | 'critical'
}

// Agent avatars for quick reference
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
      ease: [0.4, 0.0, 0.2, 1] as any
    }
  }
}

// Helper function to format time since last update
const formatTimeSince = (timestamp: number, currentTime: number) => {
  const seconds = Math.floor((currentTime - timestamp) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

// Live update indicator component
const LiveUpdateIndicator = ({ lastUpdated, isLoading, hasNewData, currentTime }: {
  lastUpdated: number,
  isLoading: boolean,
  hasNewData: boolean,
  currentTime: number
}) => (
  <motion.div
    className="flex items-center gap-2 text-xs text-[hsl(var(--command-text-muted))]"
    animate={hasNewData ? { scale: [1, 1.05, 1] } : {}}
    transition={{ duration: 0.3 }}
  >
    <div className={cn(
      "w-2 h-2 rounded-full",
      isLoading ? "bg-orange-400 animate-pulse" :
      hasNewData ? "bg-green-400 animate-ping" :
      "bg-[hsl(var(--command-accent))]"
    )} />
    <span>
      {isLoading ? 'Updating...' : `Updated ${formatTimeSince(lastUpdated, currentTime)}`}
    </span>
  </motion.div>
)

export function DashboardView() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [content, setContent] = useState<ContentItem[]>([])
  const [events, setEvents] = useState<CalendarEventData[]>([])
  const [memories, setMemories] = useState<MemoryEntry[]>([])
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([])
  const [cronJobs, setCronJobs] = useState<CronJob[]>([])
  const [sessions, setSessions] = useState<SessionInfo[]>([])
  const [liveDataLoading, setLiveDataLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now())
  const [hasNewData, setHasNewData] = useState(false)
  const [updateCounter, setUpdateCounter] = useState(0)
  const [currentTime, setCurrentTime] = useState<number>(Date.now())

  // Fetch OpenClaw API data
  const fetchLiveData = async () => {
    try {
      setLiveDataLoading(true)
      const previousDataHash = JSON.stringify({ agents: agentStatuses, cron: cronJobs, sessions })

      // Add cache-busting timestamp to prevent stale data
      const cacheBuster = `?t=${Date.now()}`

      const [agentsRes, cronRes, sessionsRes] = await Promise.allSettled([
        fetch(`/api/agents/status${cacheBuster}`),
        fetch(`/api/cron${cacheBuster}`),
        fetch(`/api/sessions${cacheBuster}`)
      ])

      let newAgents = agentStatuses
      let newCron = cronJobs
      let newSessions = sessions

      if (agentsRes.status === 'fulfilled' && agentsRes.value.ok) {
        const agentsData = await agentsRes.value.json()
        newAgents = agentsData.agents || []
        setAgentStatuses(newAgents)
      }

      if (cronRes.status === 'fulfilled' && cronRes.value.ok) {
        const cronData = await cronRes.value.json()
        newCron = cronData.jobs || []
        setCronJobs(newCron)
      }

      if (sessionsRes.status === 'fulfilled' && sessionsRes.value.ok) {
        const sessionsData = await sessionsRes.value.json()
        newSessions = sessionsData.sessions || []
        setSessions(newSessions)
      }

      // Check if data changed to trigger pulse animation
      const newDataHash = JSON.stringify({ agents: newAgents, cron: newCron, sessions: newSessions })
      if (previousDataHash !== newDataHash && mounted) {
        setHasNewData(true)
        setUpdateCounter(prev => prev + 1)
        setTimeout(() => setHasNewData(false), 2000) // Clear pulse after 2 seconds
      }

      setLastUpdated(Date.now())
    } catch (error) {
      console.error('Failed to fetch live data:', error)
    } finally {
      setLiveDataLoading(false)
    }
  }

  // Refresh activity data
  const refreshActivityData = () => {
    setTasks(loadTasks())
    setContent(loadContent())
    setEvents(loadEvents())
    setMemories(loadMemories())
  }

  // Load all data on mount
  useEffect(() => {
    setMounted(true)
    refreshActivityData()

    // Fetch live data immediately
    fetchLiveData()

    // Set up auto-refresh for live data every 10 seconds
    const liveDataInterval = setInterval(fetchLiveData, 10000)

    // Set up auto-refresh for activity feed every 30 seconds
    const activityInterval = setInterval(refreshActivityData, 30000)

    return () => {
      clearInterval(liveDataInterval)
      clearInterval(activityInterval)
    }
  }, [])

  // Update current time every second for live time display
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(timeInterval)
  }, [])

  // Calculate stats
  const stats = useMemo(() => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.status === "done").length
    const totalContent = content.length
    const publishedContent = content.filter(c => c.status === "published").length
    const upcomingEvents = events.filter(e => e.scheduledTime > Date.now()).length
    const totalMemories = memories.length

    return {
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        trend: generateTrendData(totalTasks, 0.2)
      },
      content: {
        total: totalContent,
        published: publishedContent,
        trend: generateTrendData(totalContent, 0.3)
      },
      events: {
        upcoming: upcomingEvents,
        total: events.length,
        trend: generateTrendData(upcomingEvents, 0.4)
      },
      memories: {
        total: totalMemories,
        trend: generateTrendData(totalMemories, 0.1)
      }
    }
  }, [tasks, content, events, memories])

  // Live stats from OpenClaw APIs
  const liveStats = useMemo(() => {
    const activeSessions = sessions.filter(s => s.status === 'active').length
    const activeCronJobs = cronJobs.filter(j => j.status === 'active').length
    const onlineAgents = agentStatuses.filter(a => a.status === 'online').length

    return {
      sessions: { active: activeSessions, total: sessions.length },
      cronJobs: { active: activeCronJobs, total: cronJobs.length },
      agents: { online: onlineAgents, total: agentStatuses.length }
    }
  }, [sessions, cronJobs, agentStatuses])

  // Recent activity - last 5 items based on updated time
  const recentActivity = useMemo(() => {
    const allItems = [
      ...tasks.map(t => ({
        type: 'task',
        title: t.title,
        time: t.updatedAt,
        status: t.status,
        assignee: t.assignee,
        action: t.status === 'done' ? 'completed' : 'updated'
      })),
      ...content.map(c => ({
        type: 'content',
        title: c.title,
        time: c.updatedAt,
        status: c.status,
        assignee: c.assignee,
        action: c.status === 'published' ? 'published' : 'updated'
      })),
      ...events.map(e => ({
        type: 'event',
        title: e.title,
        time: e.updatedAt || e.createdAt || e.scheduledTime,
        status: e.status,
        assignee: e.agent,
        action: 'scheduled'
      })),
      ...memories.map(m => ({
        type: 'memory',
        title: m.title,
        time: m.updatedAt,
        status: 'active',
        assignee: m.author,
        action: 'saved'
      }))
    ]

    return allItems
      .sort((a, b) => b.time - a.time)
      .slice(0, 5)
  }, [tasks, content, events, memories])

  // Team efficiency based on live agent data
  const teamEfficiency = useMemo(() => {
    if (agentStatuses.length === 0) return 95 // Default

    // Calculate efficiency based on status and activity
    const statusWeights = { online: 100, active: 90, idle: 60, offline: 0 }
    const totalWeight = agentStatuses.reduce((sum, agent) =>
      sum + statusWeights[agent.status], 0
    )

    return Math.round(totalWeight / agentStatuses.length)
  }, [agentStatuses])

  if (!mounted) return null

  return (
    <div className="min-h-[calc(100vh-5rem)] relative" data-testid="dashboard-view">
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
            icon={Command}
            title="Mission Control Dashboard"
            subtitle="Command center overview and operational status. Real-time monitoring of all systems, agents, and mission-critical activities."
          >
            <StatsCard
              icon={Target}
              label="System Status"
              value="Operational"
              subLabel="Team Efficiency"
              subValue={`${teamEfficiency}%`}
            />
          </PageHeader>

          {/* Overview Stats */}
          <SectionErrorBoundary sectionName="Overview Stats">
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="stats-glass stats-mesh-bg border-[hsl(var(--command-border-bright))]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[hsl(var(--command-accent))]/10 rounded-xl">
                        <CheckSquare className="h-6 w-6 text-[hsl(var(--command-accent))]" />
                      </div>
                      <div>
                        <div className="text-2xl font-display font-bold text-contrast-high">{stats.tasks.total}</div>
                        <div className="text-sm text-contrast-medium">
                          Active Tasks
                        </div>
                        <div className="text-xs text-[hsl(var(--command-success))]">
                          {stats.tasks.completed} completed
                        </div>
                      </div>
                    </div>
                    <MiniSparkline
                      data={stats.tasks.trend}
                      color="hsl(var(--command-accent))"
                      className="w-16"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="stats-glass stats-mesh-bg border-[hsl(var(--command-border-bright))]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-500/10 rounded-xl">
                        <Film className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-display font-bold text-contrast-high">{stats.content.total}</div>
                        <div className="text-sm text-contrast-medium">
                          Content Items
                        </div>
                        <div className="text-xs text-[hsl(var(--command-success))]">
                          {stats.content.published} published
                        </div>
                      </div>
                    </div>
                    <MiniSparkline
                      data={stats.content.trend}
                      color="#a855f7"
                      className="w-16"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="stats-glass stats-mesh-bg border-[hsl(var(--command-border-bright))]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/10 rounded-xl">
                        <Calendar className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-display font-bold text-contrast-high">{stats.events.upcoming}</div>
                        <div className="text-sm text-contrast-medium">
                          Upcoming Events
                        </div>
                        <div className="text-xs text-[hsl(var(--command-success))]">
                          {stats.events.total} total scheduled
                        </div>
                      </div>
                    </div>
                    <MiniSparkline
                      data={stats.events.trend}
                      color="#60a5fa"
                      className="w-16"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="stats-glass stats-mesh-bg border-[hsl(var(--command-border-bright))]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500/10 rounded-xl">
                        <Brain className="h-6 w-6 text-green-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-display font-bold text-contrast-high">{stats.memories.total}</div>
                        <div className="text-sm text-contrast-medium">
                          Memory Entries
                        </div>
                        <div className="text-xs text-[hsl(var(--command-accent))]">
                          Knowledge base
                        </div>
                      </div>
                    </div>
                    <MiniSparkline
                      data={stats.memories.trend}
                      color="#4ade80"
                      className="w-16"
                    />
                  </div>
                </CardContent>
              </Card>
              </div>
            </motion.div>
          </SectionErrorBoundary>

          {/* Live OpenClaw Status */}
          <SectionErrorBoundary sectionName="Live System Status">
            <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-contrast-high flex items-center gap-2">
                <motion.div
                  animate={liveDataLoading ? { rotate: 360 } : {}}
                  transition={{ duration: 2, repeat: liveDataLoading ? Infinity : 0, ease: "linear" }}
                >
                  <Zap className="h-5 w-5 text-[hsl(var(--command-accent))]" />
                </motion.div>
                Live System Status
                <Badge variant="outline" className="bg-[hsl(var(--command-accent))]/10 text-[hsl(var(--command-accent))] text-xs ml-2">
                  Auto-refresh: 10s
                </Badge>
              </h2>
              <LiveUpdateIndicator
                lastUpdated={lastUpdated}
                isLoading={liveDataLoading}
                hasNewData={hasNewData}
                currentTime={currentTime}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                animate={hasNewData ? {
                  boxShadow: ["0 0 0 0 rgba(var(--command-accent-rgb), 0)", "0 0 0 10px rgba(var(--command-accent-rgb), 0.3)", "0 0 0 0 rgba(var(--command-accent-rgb), 0)"]
                } : {}}
                transition={{ duration: 1 }}
              >
                <Card className="glass-morphism border-[hsl(var(--command-border-bright))] relative">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                        Active Agents
                      </div>
                      {liveDataLoading && (
                        <RefreshCw className="h-3 w-3 animate-spin text-[hsl(var(--command-text-muted))]" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-display font-bold text-[hsl(var(--command-accent))]">
                      {liveStats.agents.online}
                    </div>
                    <p className="text-xs text-[hsl(var(--command-text-muted))] mt-1">
                      {liveStats.agents.total} total configured
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                animate={hasNewData ? {
                  boxShadow: ["0 0 0 0 rgba(34, 197, 94, 0)", "0 0 0 10px rgba(34, 197, 94, 0.3)", "0 0 0 0 rgba(34, 197, 94, 0)"]
                } : {}}
                transition={{ duration: 1 }}
              >
                <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <PlayCircle className="h-4 w-4 text-green-400" />
                      Active Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-display font-bold text-green-400">
                      {liveStats.sessions.active}
                    </div>
                    <p className="text-xs text-[hsl(var(--command-text-muted))] mt-1">
                      {liveStats.sessions.total} total sessions
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                animate={hasNewData ? {
                  boxShadow: ["0 0 0 0 rgba(251, 146, 60, 0)", "0 0 0 10px rgba(251, 146, 60, 0.3)", "0 0 0 0 rgba(251, 146, 60, 0)"]
                } : {}}
                transition={{ duration: 1 }}
              >
                <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Timer className="h-4 w-4 text-orange-400" />
                      Cron Jobs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-display font-bold text-orange-400">
                      {liveStats.cronJobs.active}
                    </div>
                    <p className="text-xs text-[hsl(var(--command-text-muted))] mt-1">
                      {liveStats.cronJobs.total} scheduled tasks
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
          </SectionErrorBoundary>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <SectionErrorBoundary sectionName="Recent Activity">
              <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={updateCounter > 0 ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <Activity className="h-5 w-5 text-[hsl(var(--command-accent))]" />
                      </motion.div>
                      Recent Activity
                    </div>
                    <div className="flex items-center gap-2">
                      <LiveUpdateIndicator
                        lastUpdated={lastUpdated}
                        isLoading={liveDataLoading}
                        hasNewData={hasNewData}
                        currentTime={currentTime}
                      />
                      <Badge variant="outline" className="bg-[hsl(var(--command-accent))]/10 text-[hsl(var(--command-accent))]">
                        Live Feed
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentActivity.length > 0 ? (
                    <StaggeredList className="space-y-4" staggerDelay={0.1}>
                      {recentActivity.map((item, index) => (
                        <motion.div
                          key={`${item.type}-${item.title}-${index}`}
                          className="flex items-center gap-4 p-3 glass-morphism rounded-lg"
                          whileHover={{ scale: 1.01, x: 4 }}
                        >
                          <div className="flex items-center gap-3">
                            {item.type === 'task' && <CheckSquare className="h-4 w-4 text-[hsl(var(--command-accent))]" />}
                            {item.type === 'content' && <Film className="h-4 w-4 text-purple-400" />}
                            {item.type === 'event' && <Calendar className="h-4 w-4 text-blue-400" />}
                            {item.type === 'memory' && <Brain className="h-4 w-4 text-green-400" />}

                            <div className="text-lg">
                              {agentAvatars[item.assignee as keyof typeof agentAvatars] || "👤"}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{item.title}</div>
                            <div className="text-sm text-[hsl(var(--command-text-muted))]">
                              {item.assignee} {item.action} • {new Date(item.time).toLocaleDateString()}
                            </div>
                          </div>

                          <Badge variant="outline" className="text-xs">
                            {item.status}
                          </Badge>
                        </motion.div>
                      ))}
                    </StaggeredList>
                  ) : (
                    <div className="text-center py-12">
                      <div className="space-y-3">
                        <div className="w-12 h-12 mx-auto glass-morphism rounded-full flex items-center justify-center">
                          <Activity className="h-5 w-5 text-[hsl(var(--command-text-muted))]" />
                        </div>
                        <p className="text-[hsl(var(--command-text-muted))]">
                          No recent activity to display
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions & Agent Status */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Quick Actions */}
              <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-[hsl(var(--command-accent))]" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/tasks">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </Button>
                  </Link>
                  <Link href="/pipeline">
                    <Button className="w-full justify-start" variant="outline">
                      <Film className="h-4 w-4 mr-2" />
                      Create Content
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </Button>
                  </Link>
                  <Link href="/calendar">
                    <Button className="w-full justify-start" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Event
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </Button>
                  </Link>
                  <Link href="/memory">
                    <Button className="w-full justify-start" variant="outline">
                      <Brain className="h-4 w-4 mr-2" />
                      Save Memory
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Live Agent Status */}
              <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={hasNewData ? { rotate: [0, 10, -10, 0] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <Users className="h-5 w-5 text-[hsl(var(--command-accent))]" />
                      </motion.div>
                      Agent Status
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-[hsl(var(--command-accent))]/10 text-[hsl(var(--command-accent))] text-xs">
                        Live
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {agentStatuses.length > 0 ? (
                    <>
                      {agentStatuses.slice(0, 5).map((agent) => (
                        <div key={agent.id} className="flex items-center justify-between p-2 glass-morphism rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="text-lg">{agent.avatar}</div>
                            <div>
                              <div className="font-medium text-sm">{agent.name}</div>
                              <div className="text-xs text-[hsl(var(--command-text-muted))]">
                                {agent.currentActivity || 'Standby'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-xs font-medium">{agent.activeTasks}</div>
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              agent.status === "online" ? "bg-[hsl(var(--command-success))]" :
                              agent.status === "active" ? "bg-[hsl(var(--command-accent))]" :
                              agent.status === "idle" ? "bg-yellow-400" :
                              "bg-gray-400"
                            )} />
                          </div>
                        </div>
                      ))}

                      {agentStatuses.length > 5 && (
                        <div className="text-xs text-[hsl(var(--command-text-muted))] text-center pt-2">
                          +{agentStatuses.length - 5} more agents
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-sm text-[hsl(var(--command-text-muted))]">
                        {liveDataLoading ? 'Loading agents...' : 'No agents found'}
                      </div>
                    </div>
                  )}

                  <Link href="/team">
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      <Building2 className="h-4 w-4 mr-2" />
                      View Team Dashboard
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
            </SectionErrorBoundary>
          </div>

          {/* Live System Activity */}
          <SectionErrorBoundary sectionName="Live System Activity">
            <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Sessions */}
              <motion.div
                animate={hasNewData ? {
                  scale: [1, 1.02, 1],
                  boxShadow: ["0 0 0 0 rgba(34, 197, 94, 0)", "0 0 0 5px rgba(34, 197, 94, 0.2)", "0 0 0 0 rgba(34, 197, 94, 0)"]
                } : {}}
                transition={{ duration: 0.8 }}
              >
                <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-green-400" />
                        Active Sessions
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-400 text-xs">
                        {liveStats.sessions.active} Live
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                <CardContent>
                  {sessions.filter(s => s.status === 'active').slice(0, 4).length > 0 ? (
                    <div className="space-y-3">
                      {sessions.filter(s => s.status === 'active').slice(0, 4).map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-2 glass-morphism rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              session.priority === 'critical' ? "bg-red-400" :
                              session.priority === 'high' ? "bg-orange-400" :
                              session.priority === 'normal' ? "bg-[hsl(var(--command-accent))]" :
                              "bg-gray-400"
                            )} />
                            <div>
                              <div className="font-medium text-sm">{session.agentName}</div>
                              <div className="text-xs text-[hsl(var(--command-text-muted))]">
                                {session.currentTask || `${session.type} session`}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-[hsl(var(--command-text-muted))]">
                            {Math.floor((Date.now() - session.startTime) / 1000 / 60)}m ago
                          </div>
                        </div>
                      ))}
                      {liveStats.sessions.active > 4 && (
                        <div className="text-xs text-[hsl(var(--command-text-muted))] text-center pt-1">
                          +{liveStats.sessions.active - 4} more sessions
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-sm text-[hsl(var(--command-text-muted))]">
                        No active sessions
                      </div>
                    </div>
                  )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Scheduled Tasks */}
              <motion.div
                animate={hasNewData ? {
                  scale: [1, 1.02, 1],
                  boxShadow: ["0 0 0 0 rgba(251, 146, 60, 0)", "0 0 0 5px rgba(251, 146, 60, 0.2)", "0 0 0 0 rgba(251, 146, 60, 0)"]
                } : {}}
                transition={{ duration: 0.8 }}
              >
                <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Timer className="h-5 w-5 text-orange-400" />
                        Scheduled Tasks
                      </div>
                      <Badge variant="outline" className="bg-orange-500/10 text-orange-400 text-xs">
                        {liveStats.cronJobs.active} Active
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                <CardContent>
                  {cronJobs.filter(j => j.status === 'active').slice(0, 4).length > 0 ? (
                    <div className="space-y-3">
                      {cronJobs.filter(j => j.status === 'active').slice(0, 4).map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-2 glass-morphism rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "p-1 rounded",
                              job.enabled ? "bg-green-500/10" : "bg-gray-500/10"
                            )}>
                              {job.enabled ?
                                <PlayCircle className="h-3 w-3 text-green-400" /> :
                                <PauseCircle className="h-3 w-3 text-gray-400" />
                              }
                            </div>
                            <div>
                              <div className="font-medium text-sm">{job.description?.substring(0, 30) || job.command.substring(0, 30)}</div>
                              <div className="text-xs text-[hsl(var(--command-text-muted))]">
                                {job.schedule} • {job.agent || 'system'}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-[hsl(var(--command-text-muted))]">
                            {job.nextRun ? new Date(job.nextRun).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                          </div>
                        </div>
                      ))}
                      {liveStats.cronJobs.active > 4 && (
                        <div className="text-xs text-[hsl(var(--command-text-muted))] text-center pt-1">
                          +{liveStats.cronJobs.active - 4} more scheduled
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-sm text-[hsl(var(--command-text-muted))]">
                        No active cron jobs
                      </div>
                    </div>
                  )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>

          {/* Performance Overview */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-[hsl(var(--command-success))]" />
                    Task Completion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-display font-bold text-[hsl(var(--command-success))]">
                    {stats.tasks.total > 0
                      ? Math.round((stats.tasks.completed / stats.tasks.total) * 100)
                      : 0}%
                  </div>
                  <p className="text-xs text-[hsl(var(--command-text-muted))] mt-1">
                    {stats.tasks.completed} of {stats.tasks.total} tasks complete
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <PieChart className="h-4 w-4 text-purple-400" />
                    Content Published
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-display font-bold text-purple-400">
                    {stats.content.total > 0
                      ? Math.round((stats.content.published / stats.content.total) * 100)
                      : 0}%
                  </div>
                  <p className="text-xs text-[hsl(var(--command-text-muted))] mt-1">
                    {stats.content.published} of {stats.content.total} items live
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <BarChart3 className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                    Team Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-display font-bold text-[hsl(var(--command-accent))]">
                    {teamEfficiency}%
                  </div>
                  <p className="text-xs text-[hsl(var(--command-text-muted))] mt-1">
                    Average efficiency across all agents
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
          </SectionErrorBoundary>
        </div>
      </motion.div>
    </div>
  )
}