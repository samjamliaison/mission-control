"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { StatsCard } from "@/components/ui/stats-card"
import { 
  Building2,
  Monitor,
  Coffee,
  Activity,
  MapPin,
  Users,
  Clock,
  Zap,
  CheckCircle,
  Eye,
  Wifi,
  Volume2,
  X
} from "lucide-react"
import { AgentWorkstation } from "./agent-workstation"
import { OfficeAgent } from "./office-agent"
import { cn } from "@/lib/utils"

// Mock office data
const mockOfficeAgents: OfficeAgent[] = [
  {
    _id: "1",
    name: "Hamza",
    avatar: "👤",
    role: "Mission Commander", 
    status: "online",
    currentTask: "Strategic Planning Session - Q1 2024 Roadmap",
    position: { x: 50, y: 30 },
    workstation: "Command Bridge",
    activityLevel: 85,
    lastAction: "Reviewing quarterly objectives",
    timeInCurrentTask: 45 // minutes
  },
  {
    _id: "2", 
    name: "Manus",
    avatar: "🤘",
    role: "Chief of Staff",
    status: "active", 
    currentTask: "System Health Monitoring - Infrastructure Check",
    position: { x: 20, y: 60 },
    workstation: "Operations Center",
    activityLevel: 95,
    lastAction: "Optimizing server performance",
    timeInCurrentTask: 23
  },
  {
    _id: "3",
    name: "Monica", 
    avatar: "✈️",
    role: "Creative Director",
    status: "active",
    currentTask: "Content Pipeline Review - YouTube Strategy",
    position: { x: 75, y: 70 },
    workstation: "Creative Studio",
    activityLevel: 78,
    lastAction: "Designing video thumbnails", 
    timeInCurrentTask: 67
  },
  {
    _id: "4",
    name: "Jarvis",
    avatar: "🔍", 
    role: "Intelligence Analyst",
    status: "online",
    currentTask: "Market Research Analysis - Competitive Intelligence",
    position: { x: 25, y: 25 },
    workstation: "Research Lab",
    activityLevel: 92,
    lastAction: "Analyzing market trends",
    timeInCurrentTask: 12
  },
  {
    _id: "5",
    name: "Luna",
    avatar: "🌙",
    role: "Versatility Specialist", 
    status: "idle",
    currentTask: "Available for Assignment",
    position: { x: 70, y: 40 },
    workstation: "Flex Desk",
    activityLevel: 15,
    lastAction: "Reviewing project queue",
    timeInCurrentTask: 8
  }
]

const statusConfig = {
  "online": {
    color: "#10b981", // green-500
    bg: "bg-green-500/20",
    pulse: true,
    label: "Online"
  },
  "active": { 
    color: "#06b6d4", // cyan-400
    bg: "bg-cyan-500/20",
    pulse: true,
    label: "Active"
  },
  "idle": {
    color: "#f59e0b", // amber-500
    bg: "bg-amber-500/20", 
    pulse: false,
    label: "Idle"
  }
}

const workstationIcons = {
  "Command Bridge": Monitor,
  "Operations Center": Activity,
  "Creative Studio": Zap,
  "Research Lab": Eye,
  "Flex Desk": Coffee
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
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

export function OfficeView() {
  const [agents] = useState<OfficeAgent[]>(mockOfficeAgents)
  const [selectedAgent, setSelectedAgent] = useState<OfficeAgent | null>(null)
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Office statistics
  const activeAgents = agents.filter(a => a.status !== "idle").length
  const totalActivity = Math.round(
    agents.reduce((sum, agent) => sum + agent.activityLevel, 0) / agents.length
  )
  const busyWorkstations = agents.filter(a => a.activityLevel > 50).length

  if (!mounted) return null

  return (
    <div className="min-h-[calc(100vh-5rem)] relative overflow-hidden">
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
            icon={Building2}
            title="Virtual Office"
            subtitle="Digital headquarters visualization. Real-time view of agent workstations and current activities across the virtual office space."
          >
            <StatsCard
              icon={Activity}
              label="Office Activity"
              value={`${totalActivity}%`}
              subLabel="Active"
              subValue={`${activeAgents}/5`}
            />
          </PageHeader>

          <motion.div variants={itemVariants} className="space-y-6">
            {/* Office Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Office Status */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 glass-morphism px-3 py-2 rounded-lg">
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-2 h-2 bg-green-500 rounded-full"
                    />
                    <span className="text-sm font-medium">Systems Online</span>
                  </div>
                  
                  <div className="flex items-center gap-2 glass-morphism px-3 py-2 rounded-lg">
                    <Wifi className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                    <span className="text-sm text-[hsl(var(--command-text-muted))]">
                      Connected
                    </span>
                  </div>

                  <div className="flex items-center gap-2 glass-morphism px-3 py-2 rounded-lg">
                    <Clock className="h-4 w-4 text-[hsl(var(--command-text-muted))]" />
                    <span className="text-sm text-[hsl(var(--command-text-muted))]">
                      {currentTime.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Office View Controls */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="glass-morphism">
                  <MapPin className="h-4 w-4 mr-2" />
                  Floor Plan
                </Button>
                <Button variant="outline" size="sm" className="glass-morphism">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Office Audio
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Virtual Office Layout */}
          <motion.div variants={itemVariants}>
            <Card className="glass-morphism border-[hsl(var(--command-border-bright))] overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-[hsl(var(--command-accent))]" />
                    OpenClaw Virtual Headquarters
                  </div>
                  <Badge variant="outline" className="bg-[hsl(var(--command-success))]/10 text-[hsl(var(--command-success))]">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Operational
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-0">
                {/* Office Map */}
                <div className="relative h-[600px] bg-gradient-to-br from-[hsl(var(--command-surface))] to-[hsl(var(--command-surface))/50] overflow-hidden">
                  {/* Grid Background */}
                  <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" className="absolute inset-0">
                      <defs>
                        <pattern
                          id="office-grid"
                          width="40"
                          height="40" 
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 40 0 L 0 0 0 40"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                          />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#office-grid)" />
                    </svg>
                  </div>

                  {/* Office Elements */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                  >
                    {/* Meeting Room */}
                    <div 
                      className="absolute glass-morphism border-2 border-[hsl(var(--command-border-bright))] rounded-lg"
                      style={{
                        left: "10%",
                        top: "10%", 
                        width: "25%",
                        height: "30%"
                      }}
                    >
                      <div className="p-2 text-center">
                        <div className="text-xs font-medium text-[hsl(var(--command-text-muted))]">
                          Command Center
                        </div>
                      </div>
                    </div>

                    {/* Kitchen/Break Area */}
                    <div 
                      className="absolute glass-morphism border-2 border-[hsl(var(--command-border-bright))] rounded-lg"
                      style={{
                        right: "10%",
                        top: "15%",
                        width: "15%", 
                        height: "20%"
                      }}
                    >
                      <div className="p-2 text-center">
                        <Coffee className="h-4 w-4 mx-auto mb-1 text-[hsl(var(--command-text-muted))]" />
                        <div className="text-xs font-medium text-[hsl(var(--command-text-muted))]">
                          Break Room
                        </div>
                      </div>
                    </div>

                    {/* Server Room */}
                    <div 
                      className="absolute glass-morphism border-2 border-[hsl(var(--command-accent))]/30 rounded-lg"
                      style={{
                        left: "5%",
                        bottom: "15%",
                        width: "20%",
                        height: "25%"
                      }}
                    >
                      <div className="p-2 text-center">
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Activity className="h-4 w-4 mx-auto mb-1 text-[hsl(var(--command-accent))]" />
                        </motion.div>
                        <div className="text-xs font-medium text-[hsl(var(--command-text-muted))]">
                          Server Room
                        </div>
                      </div>
                    </div>

                    {/* Agent Workstations */}
                    {agents.map((agent) => (
                      <AgentWorkstation
                        key={agent._id}
                        agent={agent}
                        onClick={() => setSelectedAgent(agent)}
                      />
                    ))}
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Office Activity Panel */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Activities */}
            <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[hsl(var(--command-accent))]" />
                  Live Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {agents.filter(a => a.status !== "idle").map((agent) => (
                  <motion.div 
                    key={agent._id}
                    className="flex items-center gap-4 p-3 glass-morphism rounded-lg cursor-pointer"
                    whileHover={{ scale: 1.01, x: 4 }}
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <div className="text-2xl">{agent.avatar}</div>
                    <div className="flex-1">
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-sm text-[hsl(var(--command-text-muted))] line-clamp-1">
                        {agent.currentTask}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {agent.timeInCurrentTask}m
                      </Badge>
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          backgroundColor: [
                            statusConfig[agent.status].color,
                            statusConfig[agent.status].color + "80",
                            statusConfig[agent.status].color
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: statusConfig[agent.status].color }}
                      />
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Workstation Status */}
            <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-[hsl(var(--command-accent))]" />
                  Workstation Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {agents.map((agent) => {
                  const WorkstationIcon = workstationIcons[agent.workstation as keyof typeof workstationIcons] || Monitor
                  return (
                    <motion.div 
                      key={agent._id}
                      className="flex items-center justify-between p-3 glass-morphism rounded-lg"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center gap-3">
                        <WorkstationIcon className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                        <div>
                          <div className="font-medium text-sm">{agent.workstation}</div>
                          <div className="text-xs text-[hsl(var(--command-text-muted))]">
                            {agent.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{agent.activityLevel}%</div>
                        <div className="w-12 h-2 bg-[hsl(var(--command-surface))] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-[hsl(var(--command-accent))] to-[hsl(var(--command-success))]"
                            initial={{ width: "0%" }}
                            animate={{ width: `${agent.activityLevel}%` }}
                            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Agent Detail Modal */}
      <AnimatePresence>
        {selectedAgent && (
          <AgentDetailModal
            agent={selectedAgent}
            onClose={() => setSelectedAgent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Agent Detail Modal
function AgentDetailModal({ agent, onClose }: { agent: OfficeAgent, onClose: () => void }) {
  const statusStyle = statusConfig[agent.status]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        className="w-full max-w-md glass-morphism border-[hsl(var(--command-border-bright))] rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{agent.avatar}</div>
              <div>
                <h3 className="text-xl font-display font-bold">{agent.name}</h3>
                <p className="text-sm text-[hsl(var(--command-text-muted))]">{agent.role}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="glass-morphism p-3 rounded-lg">
              <div className="text-xs text-[hsl(var(--command-text-muted))] mb-1">Current Task</div>
              <div className="text-sm font-medium">{agent.currentTask}</div>
            </div>

            <div className="glass-morphism p-3 rounded-lg">
              <div className="text-xs text-[hsl(var(--command-text-muted))] mb-1">Workstation</div>
              <div className="text-sm font-medium">{agent.workstation}</div>
            </div>

            <div className="glass-morphism p-3 rounded-lg">
              <div className="text-xs text-[hsl(var(--command-text-muted))] mb-1">Last Action</div>
              <div className="text-sm font-medium">{agent.lastAction}</div>
            </div>

            <div className="flex gap-3">
              <div className="glass-morphism p-3 rounded-lg flex-1 text-center">
                <div className="text-lg font-display font-bold text-[hsl(var(--command-accent))]">
                  {agent.timeInCurrentTask}m
                </div>
                <div className="text-xs text-[hsl(var(--command-text-muted))]">Time on Task</div>
              </div>
              <div className="glass-morphism p-3 rounded-lg flex-1 text-center">
                <div className="text-lg font-display font-bold" style={{ color: statusStyle.color }}>
                  {agent.activityLevel}%
                </div>
                <div className="text-xs text-[hsl(var(--command-text-muted))]">Activity</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}