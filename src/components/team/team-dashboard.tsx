"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { StatsCard } from "@/components/ui/stats-card"
import { StaggeredList } from "@/components/ui/staggered-list"
import { 
  Users,
  Activity,
  CheckCircle,
  Clock,
  Zap,
  Star,
  Target,
  Brain,
  Code,
  Palette,
  Search,
  Plane,
  Settings,
  Eye,
  RefreshCw,
  Database
} from "lucide-react"
import { AgentCard } from "./agent-card"
import { AgentProfile } from "./agent-profile"
import { cn } from "@/lib/utils"

// Real agent data from OpenClaw API
interface RealAgent {
  id: string
  name: string
  avatar: string
  role: string
  status: 'online' | 'active' | 'idle' | 'offline'
  workspace: string
  soul?: string
  currentActivity?: string
  activeTasks: number
  completedTasks: number
  skills: string[]
  expertise: string[]
  lastSeen: number
  joinedAt: number
  efficiency: number
  description: string
  recentAchievements: string[]
  model?: string
  identity?: {
    name?: string
    emoji?: string
  }
}

// API response structure
interface AgentsApiResponse {
  agents: RealAgent[]
  meta: {
    total: number
    online: number
    active: number
    idle: number
    offline: number
    totalActiveTasks: number
    totalCompletedTasks: number
    averageEfficiency: number
    primaryModel: string
  }
  timestamp: string
}

// Status configuration for real agent statuses

const statusConfig = {
  "online": {
    color: "text-[hsl(var(--command-success))]",
    bg: "bg-[hsl(var(--command-success))]/10",
    border: "border-[hsl(var(--command-success))]/20", 
    icon: CheckCircle,
    label: "Online"
  },
  "active": {
    color: "text-[hsl(var(--command-accent))]",
    bg: "bg-[hsl(var(--command-accent))]/10",
    border: "border-[hsl(var(--command-accent))]/20",
    icon: Zap,
    label: "Active"
  },
  "idle": {
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    icon: Clock,
    label: "Idle"
  },
  "offline": {
    color: "text-gray-400",
    bg: "bg-gray-500/10",
    border: "border-gray-500/20",
    icon: Clock,
    label: "Offline"
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

export function TeamDashboard() {
  const [agents, setAgents] = useState<RealAgent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<RealAgent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  // Load data from OpenClaw API
  const loadAgentsFromApi = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/agents')
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      
      const data: AgentsApiResponse = await response.json()
      setAgents(data.agents)
      setLastUpdated(data.timestamp)
    } catch (err) {
      console.error('Failed to load agents:', err)
      setError(err instanceof Error ? err.message : 'Failed to load agents')
    } finally {
      setLoading(false)
    }
  }

  // Load agents on component mount
  useEffect(() => {
    loadAgentsFromApi()
  }, [])

  // Team statistics  
  const totalAgents = agents.length
  const onlineAgents = agents.filter(a => a.status === "online" || a.status === "active").length
  const totalActiveTasks = agents.reduce((sum, agent) => sum + agent.activeTasks, 0)
  const totalCompletedTasks = agents.reduce((sum, agent) => sum + agent.completedTasks, 0)
  const averageEfficiency = totalAgents > 0 ? Math.round(
    agents.reduce((sum, agent) => sum + agent.efficiency, 0) / agents.length
  ) : 0

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] relative">
        <div className="fixed inset-0 bg-gradient-to-br from-[hsl(var(--command-background))] via-[hsl(220_13%_3%)] to-[hsl(var(--command-background))] pointer-events-none" />
        <div className="relative z-10 p-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto glass-morphism rounded-full flex items-center justify-center">
              <RefreshCw className="h-6 w-6 text-[hsl(var(--command-accent))] animate-spin" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg mb-2">Loading Team Command</h3>
              <p className="text-[hsl(var(--command-text-muted))]">
                Retrieving agent data from OpenClaw...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-5rem)] relative">
        <div className="fixed inset-0 bg-gradient-to-br from-[hsl(var(--command-background))] via-[hsl(220_13%_3%)] to-[hsl(var(--command-background))] pointer-events-none" />
        <div className="relative z-10 p-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto glass-morphism rounded-full flex items-center justify-center">
              <Database className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg mb-2 text-red-400">Team Access Error</h3>
              <p className="text-[hsl(var(--command-text-muted))] mb-4">
                {error}
              </p>
              <Button onClick={loadAgentsFromApi} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] relative">
      {/* Background */}
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
            icon={Users}
            title="Team Command"
            subtitle="Real-time OpenClaw agent dashboard. Live status, SOUL.md content, and workspace analysis from actual agent configurations."
          >
            <div className="flex items-center gap-4">
              <StatsCard
                icon={Target}
                label="Team Performance"
                value={`${averageEfficiency}%`}
                subLabel="Active"
                subValue={`${onlineAgents}/${totalAgents}`}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={loadAgentsFromApi}
                disabled={loading}
                className="glass-morphism"
                title="Refresh from OpenClaw"
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              </Button>
            </div>
          </PageHeader>

          <motion.div variants={itemVariants} className="space-y-6">
            {/* Team Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[hsl(var(--command-accent))]/10 rounded-lg">
                      <Users className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold">{totalAgents}</div>
                      <div className="text-xs text-[hsl(var(--command-text-muted))]">Total Agents</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[hsl(var(--command-success))]/10 rounded-lg">
                      <Activity className="h-4 w-4 text-[hsl(var(--command-success))]" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold">{onlineAgents}</div>
                      <div className="text-xs text-[hsl(var(--command-text-muted))]">Online Now</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <Clock className="h-4 w-4 text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold">{totalActiveTasks}</div>
                      <div className="text-xs text-[hsl(var(--command-text-muted))]">Active Tasks</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[hsl(var(--command-success))]/10 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--command-success))]" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold">{totalCompletedTasks}</div>
                      <div className="text-xs text-[hsl(var(--command-text-muted))]">Completed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Agent Grid */}
          <motion.div variants={itemVariants}>
            <StaggeredList 
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              staggerDelay={0.08}
              direction="up"
            >
              {agents.map((agent) => (
                <AgentCard
                  key={agent._id}
                  agent={agent}
                  onClick={() => setSelectedAgent(agent)}
                />
              ))}
            </StaggeredList>
          </motion.div>

          {/* Team Activity Feed */}
          <motion.div variants={itemVariants}>
            <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[hsl(var(--command-accent))]" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {agents.filter(a => a.status !== "idle" && a.status !== "offline").map((agent) => (
                  <motion.div 
                    key={agent.id}
                    className="flex items-center gap-4 p-3 glass-morphism rounded-lg cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <div className="text-2xl">{agent.avatar}</div>
                    <div className="flex-1">
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-sm text-[hsl(var(--command-text-muted))]">
                        {agent.currentActivity}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline"
                        className={cn(
                          "text-xs",
                          statusConfig[agent.status].bg,
                          statusConfig[agent.status].color,
                          statusConfig[agent.status].border
                        )}
                      >
                        {agent.activeTasks} tasks
                      </Badge>
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className={cn(
                          "w-2 h-2 rounded-full",
                          agent.status === "online" ? "bg-[hsl(var(--command-success))]" :
                          agent.status === "active" ? "bg-[hsl(var(--command-accent))]" :
                          "bg-yellow-400"
                        )}
                      />
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Agent Profile Modal */}
      <AnimatePresence>
        {selectedAgent && (
          <AgentProfile
            agent={selectedAgent}
            onClose={() => setSelectedAgent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}