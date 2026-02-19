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
  Timer
} from "lucide-react"
import { loadTasks, loadContent, loadEvents, loadMemories } from "@/lib/data-persistence"
import { Task } from "@/components/tasks/task-card"
import { ContentItem } from "@/types/content"
import { MemoryEntry } from "@/components/memory/memory-entry"
import { CalendarEventData } from "@/lib/data-persistence"
import { cn } from "@/lib/utils"

// Agent avatars for quick reference
const agentAvatars = {
  "Hamza": "👤",
  "Manus": "🤘", 
  "Monica": "✈️",
  "Jarvis": "🔍",
  "Luna": "🌙"
}

const agentStatus = [
  { name: "Hamza", avatar: "👤", role: "Mission Commander", status: "online", efficiency: 94 },
  { name: "Manus", avatar: "🤘", role: "Chief of Staff", status: "active", efficiency: 97 },
  { name: "Monica", avatar: "✈️", role: "Creative Director", status: "active", efficiency: 91 },
  { name: "Jarvis", avatar: "🔍", role: "Intelligence Analyst", status: "online", efficiency: 96 },
  { name: "Luna", avatar: "🌙", role: "Versatility Specialist", status: "idle", efficiency: 89 }
]

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

export function DashboardView() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [content, setContent] = useState<ContentItem[]>([])
  const [events, setEvents] = useState<CalendarEventData[]>([])
  const [memories, setMemories] = useState<MemoryEntry[]>([])
  const [mounted, setMounted] = useState(false)

  // Load all data on mount
  useEffect(() => {
    setMounted(true)
    setTasks(loadTasks())
    setContent(loadContent())
    setEvents(loadEvents())
    setMemories(loadMemories())
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
      tasks: { total: totalTasks, completed: completedTasks },
      content: { total: totalContent, published: publishedContent },
      events: { upcoming: upcomingEvents, total: events.length },
      memories: { total: totalMemories }
    }
  }, [tasks, content, events, memories])

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

  // Team efficiency
  const teamEfficiency = Math.round(
    agentStatus.reduce((sum, agent) => sum + agent.efficiency, 0) / agentStatus.length
  )

  if (!mounted) return null

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
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[hsl(var(--command-accent))]/10 rounded-xl">
                      <CheckSquare className="h-6 w-6 text-[hsl(var(--command-accent))]" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold">{stats.tasks.total}</div>
                      <div className="text-sm text-[hsl(var(--command-text-muted))]">
                        Active Tasks
                      </div>
                      <div className="text-xs text-[hsl(var(--command-success))]">
                        {stats.tasks.completed} completed
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-xl">
                      <Film className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold">{stats.content.total}</div>
                      <div className="text-sm text-[hsl(var(--command-text-muted))]">
                        Content Items
                      </div>
                      <div className="text-xs text-[hsl(var(--command-success))]">
                        {stats.content.published} published
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                      <Calendar className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold">{stats.events.upcoming}</div>
                      <div className="text-sm text-[hsl(var(--command-text-muted))]">
                        Upcoming Events
                      </div>
                      <div className="text-xs text-[hsl(var(--command-success))]">
                        {stats.events.total} total scheduled
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 rounded-xl">
                      <Brain className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold">{stats.memories.total}</div>
                      <div className="text-sm text-[hsl(var(--command-text-muted))]">
                        Memory Entries
                      </div>
                      <div className="text-xs text-[hsl(var(--command-accent))]">
                        Knowledge base
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-[hsl(var(--command-accent))]" />
                      Recent Activity
                    </div>
                    <Badge variant="outline" className="bg-[hsl(var(--command-accent))]/10 text-[hsl(var(--command-accent))]">
                      Live Feed
                    </Badge>
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

              {/* Agent Status */}
              <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-[hsl(var(--command-accent))]" />
                    Agent Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {agentStatus.map((agent) => (
                    <div key={agent.name} className="flex items-center justify-between p-2 glass-morphism rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-lg">{agent.avatar}</div>
                        <div>
                          <div className="font-medium text-sm">{agent.name}</div>
                          <div className="text-xs text-[hsl(var(--command-text-muted))]">
                            {agent.role}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs font-medium">{agent.efficiency}%</div>
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          agent.status === "online" ? "bg-[hsl(var(--command-success))]" :
                          agent.status === "active" ? "bg-[hsl(var(--command-accent))]" :
                          "bg-yellow-400"
                        )} />
                      </div>
                    </div>
                  ))}
                  
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
          </div>

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
        </div>
      </motion.div>
    </div>
  )
}