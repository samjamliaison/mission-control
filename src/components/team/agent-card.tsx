"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle,
  Clock,
  Zap,
  Star,
  Activity,
  Eye,
  Calendar
} from "lucide-react"
import { Agent } from "./agent"
import { cn } from "@/lib/utils"

interface AgentCardProps {
  agent: Agent
  onClick: () => void
}

const statusConfig = {
  "online": {
    color: "text-[hsl(var(--command-success))]",
    bg: "bg-[hsl(var(--command-success))]/10",
    border: "border-[hsl(var(--command-success))]/20", 
    icon: CheckCircle,
    label: "Online",
    glow: "0 0 15px hsl(var(--command-success) / 0.3)"
  },
  "active": {
    color: "text-[hsl(var(--command-accent))]",
    bg: "bg-[hsl(var(--command-accent))]/10",
    border: "border-[hsl(var(--command-accent))]/20",
    icon: Zap,
    label: "Active",
    glow: "0 0 15px hsl(var(--command-accent) / 0.3)"
  },
  "idle": {
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    icon: Clock,
    label: "Idle",
    glow: "0 0 15px hsl(45 100% 50% / 0.3)"
  }
}

export function AgentCard({ agent, onClick }: AgentCardProps) {
  const statusStyle = statusConfig[agent.status]
  const StatusIcon = statusStyle.icon

  const formatTimeSince = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return `${minutes}m ago`
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1] as any
      }
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card
        className="glass-morphism border-[hsl(var(--command-border-bright))] relative overflow-hidden transition-all duration-300 group h-full"
        style={{
          boxShadow: `0 4px 20px rgba(0,0,0,0.1), ${statusStyle.glow}`
        }}
      >
        {/* Status glow overlay */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 0% 50%, ${statusStyle.color.replace('text-', 'hsl(var(--command-')} 0%, transparent 50%)`
          }}
        />

        {/* Active pulse animation */}
        {agent.status !== "idle" && (
          <motion.div
            animate={{
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-2 right-2 w-3 h-3 bg-current rounded-full"
            style={{ color: statusStyle.color.replace('text-', '') }}
          />
        )}

        <CardHeader className="pb-4 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <motion.div 
                className="text-4xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                {agent.avatar}
              </motion.div>
              
              <div>
                <h3 className="text-xl font-display font-bold group-hover:text-[hsl(var(--command-accent))] transition-colors">
                  {agent.name}
                </h3>
                <p className="text-sm text-[hsl(var(--command-text-muted))]">
                  {agent.role}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <Badge 
              variant="outline"
              className={cn(
                "flex items-center gap-1 text-xs font-bold",
                statusStyle.bg,
                statusStyle.color,
                statusStyle.border
              )}
              style={{ boxShadow: statusStyle.glow }}
            >
              <StatusIcon className="h-3 w-3" />
              {statusStyle.label}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 relative">
          {/* Current Activity */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-[hsl(var(--command-accent))]" />
              <span className="text-sm font-medium">Current Activity</span>
            </div>
            <p className="text-xs text-[hsl(var(--command-text-muted))] pl-6">
              {agent.currentActivity}
            </p>
          </div>

          {/* Task Statistics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 glass-morphism rounded-lg">
              <div className="text-lg font-display font-bold text-[hsl(var(--command-accent))]">
                {agent.activeTasks}
              </div>
              <div className="text-xs text-[hsl(var(--command-text-muted))]">Active</div>
            </div>
            <div className="text-center p-2 glass-morphism rounded-lg">
              <div className="text-lg font-display font-bold text-[hsl(var(--command-success))]">
                {agent.completedTasks}
              </div>
              <div className="text-xs text-[hsl(var(--command-text-muted))]">Done</div>
            </div>
            <div className="text-center p-2 glass-morphism rounded-lg">
              <div className="text-lg font-display font-bold text-yellow-400">
                {agent.efficiency}%
              </div>
              <div className="text-xs text-[hsl(var(--command-text-muted))]">Rate</div>
            </div>
          </div>

          {/* Top Skills */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-[hsl(var(--command-accent))]" />
              <span className="text-sm font-medium">Core Expertise</span>
            </div>
            <div className="flex flex-wrap gap-1 pl-6">
              {agent.expertise.slice(0, 3).map((skill) => (
                <Badge 
                  key={skill} 
                  variant="outline" 
                  className="text-xs px-2 py-0.5 bg-[hsl(var(--command-surface))]/50 border-[hsl(var(--command-border))]"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Last Activity */}
          <div className="flex items-center justify-between text-xs text-[hsl(var(--command-text-dim))]">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Last seen {formatTimeSince(agent.lastSeen)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Joined {formatTimeSince(agent.joinedAt)}</span>
            </div>
          </div>

          {/* View Details Indicator */}
          <motion.div
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1 }}
          >
            <div className="glass-morphism p-1.5 rounded-lg">
              <Eye className="h-3 w-3 text-[hsl(var(--command-accent))]" />
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}