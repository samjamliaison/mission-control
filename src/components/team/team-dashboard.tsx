"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  Eye
} from "lucide-react"
import { AgentCard } from "./agent-card"
import { AgentProfile } from "./agent-profile"
import { Agent } from "./agent"
import { cn } from "@/lib/utils"

// Mock agent data
const mockAgents: Agent[] = [
  {
    _id: "1",
    name: "Hamza",
    avatar: "👤", 
    role: "Mission Commander",
    status: "online",
    currentActivity: "Strategic Planning Session",
    activeTasks: 3,
    completedTasks: 47,
    skills: [
      "Strategic Planning",
      "Decision Making", 
      "Team Leadership",
      "Stakeholder Communication",
      "Resource Allocation",
      "Risk Assessment"
    ],
    expertise: ["Leadership", "Strategy", "Communication"],
    lastSeen: Date.now() - 1800000, // 30 minutes ago
    joinedAt: Date.now() - 86400000 * 180, // 6 months ago
    efficiency: 94,
    description: "Strategic oversight and final decision authority. Coordinates high-level operations and ensures mission alignment across all agents.",
    recentAchievements: [
      "Launched Mission Control v1.0",
      "Streamlined agent coordination protocols", 
      "Achieved 94% task completion rate"
    ]
  },
  {
    _id: "2",
    name: "Manus",
    avatar: "🤘",
    role: "Chief of Staff", 
    status: "active",
    currentActivity: "System Health Monitoring",
    activeTasks: 5,
    completedTasks: 123,
    skills: [
      "System Administration",
      "Process Automation",
      "Infrastructure Management",
      "Performance Optimization",
      "Technical Documentation",
      "Incident Response"
    ],
    expertise: ["Infrastructure", "Automation", "Operations"],
    lastSeen: Date.now() - 300000, // 5 minutes ago
    joinedAt: Date.now() - 86400000 * 150, // 5 months ago
    efficiency: 97,
    description: "Technical operations and infrastructure management. Ensures all systems run smoothly and efficiently with proactive monitoring.",
    recentAchievements: [
      "99.9% system uptime achieved",
      "Automated 15+ recurring processes",
      "Reduced response time by 60%" 
    ]
  },
  {
    _id: "3", 
    name: "Monica",
    avatar: "✈️",
    role: "Creative Director",
    status: "active",
    currentActivity: "Content Pipeline Review",
    activeTasks: 4,
    completedTasks: 89,
    skills: [
      "Content Strategy",
      "Brand Management",
      "Creative Direction", 
      "Multi-Platform Coordination",
      "Visual Design",
      "Campaign Planning"
    ],
    expertise: ["Content", "Design", "Branding"],
    lastSeen: Date.now() - 600000, // 10 minutes ago
    joinedAt: Date.now() - 86400000 * 120, // 4 months ago
    efficiency: 91,
    description: "Content creation and brand strategy lead. Manages the full content pipeline from ideation to publication across all platforms.",
    recentAchievements: [
      "Launched 5-stage content pipeline",
      "Increased engagement by 150%",
      "Coordinated 12 successful campaigns"
    ]
  },
  {
    _id: "4",
    name: "Jarvis", 
    avatar: "🔍",
    role: "Intelligence Analyst",
    status: "online",
    currentActivity: "Market Research Analysis",
    activeTasks: 7,
    completedTasks: 156,
    skills: [
      "Data Analysis",
      "Market Research",
      "Technical Documentation",
      "Competitive Intelligence",
      "Report Generation", 
      "Trend Analysis"
    ],
    expertise: ["Research", "Analytics", "Intelligence"],
    lastSeen: Date.now() - 120000, // 2 minutes ago
    joinedAt: Date.now() - 86400000 * 200, // 6.5 months ago
    efficiency: 96,
    description: "Research and intelligence gathering specialist. Provides data-driven insights and comprehensive analysis for strategic decision making.",
    recentAchievements: [
      "Generated 25+ detailed research reports",
      "Identified 8 major market opportunities", 
      "Built comprehensive competitive analysis framework"
    ]
  },
  {
    _id: "5",
    name: "Luna",
    avatar: "🌙",
    role: "Versatility Specialist",
    status: "idle",
    currentActivity: "Available for Assignment",
    activeTasks: 2,
    completedTasks: 78,
    skills: [
      "Cross-Platform Adaptation",
      "Quality Assurance",
      "Workflow Optimization", 
      "Multi-Domain Knowledge",
      "Problem Solving",
      "Knowledge Synthesis"
    ],
    expertise: ["Adaptation", "QA", "Optimization"],
    lastSeen: Date.now() - 900000, // 15 minutes ago
    joinedAt: Date.now() - 86400000 * 90, // 3 months ago
    efficiency: 89,
    description: "Multi-platform specialist and generalist. Adapts to various domains and ensures quality across all operations with flexible skill application.",
    recentAchievements: [
      "Successfully adapted to 10+ different domains",
      "Maintained 95% quality score across projects",
      "Optimized 8 major workflows"
    ]
  }
]

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

export function TeamDashboard() {
  const [agents] = useState<Agent[]>(mockAgents)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Team statistics
  const totalAgents = agents.length
  const onlineAgents = agents.filter(a => a.status === "online" || a.status === "active").length
  const totalActiveTasks = agents.reduce((sum, agent) => sum + agent.activeTasks, 0)
  const totalCompletedTasks = agents.reduce((sum, agent) => sum + agent.completedTasks, 0)
  const averageEfficiency = Math.round(
    agents.reduce((sum, agent) => sum + agent.efficiency, 0) / agents.length
  )

  if (!mounted) return null

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
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg glass-morphism glow-border">
                    <Users className="h-6 w-6 text-[hsl(var(--command-accent))]" />
                  </div>
                  <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-[hsl(var(--command-text))] to-[hsl(var(--command-accent))] bg-clip-text text-transparent">
                    Team Command
                  </h1>
                </div>
                <p className="text-[hsl(var(--command-text-muted))] text-lg max-w-2xl">
                  Agent status dashboard and team coordination center. Real-time visibility into all operational personnel and their current activities.
                </p>
              </div>
              
              {/* Team Stats */}
              <div className="flex items-center gap-4">
                <motion.div 
                  className="glass-morphism p-4 rounded-xl space-y-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-[hsl(var(--command-success))]" />
                    <span className="text-sm font-medium">Team Performance</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-display font-bold text-[hsl(var(--command-success))]">
                      {averageEfficiency}%
                    </div>
                    <div className="text-xs text-[hsl(var(--command-text-muted))] space-y-1">
                      <div>{onlineAgents}/{totalAgents} Active</div>
                      <div>{totalActiveTasks} Current Tasks</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

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
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <AgentCard
                  key={agent._id}
                  agent={agent}
                  onClick={() => setSelectedAgent(agent)}
                />
              ))}
            </div>
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
                {agents.filter(a => a.status !== "idle").map((agent) => (
                  <motion.div 
                    key={agent._id}
                    className="flex items-center gap-4 p-3 glass-morphism rounded-lg"
                    whileHover={{ scale: 1.01 }}
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