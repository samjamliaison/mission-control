"use client"

import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle,
  Clock,
  Zap,
  Star,
  Activity,
  Calendar,
  Award,
  Target,
  TrendingUp,
  X
} from "lucide-react"
import { Agent } from "./agent"
import { cn } from "@/lib/utils"

interface AgentProfileProps {
  agent: Agent
  onClose: () => void
}

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

export function AgentProfile({ agent, onClose }: AgentProfileProps) {
  const statusStyle = statusConfig[agent.status]
  const StatusIcon = statusStyle.icon

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTimeSince = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)

    if (months > 0) return `${months} month${months > 1 ? 's' : ''}`
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`
    return `${minutes} minute${minutes > 1 ? 's' : ''}`
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] glass-morphism border-[hsl(var(--command-border-bright))] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header with gradient */}
        <div className="relative p-6 pb-4">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: `linear-gradient(135deg, ${statusStyle.color.replace('text-', 'hsl(var(--command-')} 0%, transparent 50%)`
            }}
          />
          
          <DialogHeader className="relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="text-5xl"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {agent.avatar}
                </motion.div>
                <div>
                  <DialogTitle className="text-2xl font-display font-bold">
                    {agent.name}
                  </DialogTitle>
                  <p className="text-[hsl(var(--command-text-muted))] text-lg">
                    {agent.role}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant="outline"
                      className={cn(
                        "flex items-center gap-1 text-xs font-bold",
                        statusStyle.bg,
                        statusStyle.color,
                        statusStyle.border
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusStyle.label}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon" 
                onClick={onClose}
                className="hover:bg-[hsl(var(--command-danger))]/10 hover:text-[hsl(var(--command-danger))]"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
        </div>
        
        <div className="px-6 pb-6 space-y-6">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-sm text-[hsl(var(--command-text-muted))] leading-relaxed">
              {agent.description}
            </p>
          </motion.div>

          {/* Current Activity */}
          <motion.div 
            className="glass-morphism p-4 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-4 w-4 text-[hsl(var(--command-accent))]" />
              <span className="font-heading font-semibold">Current Activity</span>
            </div>
            <p className="text-sm text-[hsl(var(--command-text-muted))] pl-6">
              {agent.currentActivity}
            </p>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div 
            className="glass-morphism p-4 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-[hsl(var(--command-accent))]" />
              <span className="font-heading font-semibold">Performance Metrics</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 glass-morphism rounded-lg">
                <div className="text-2xl font-display font-bold text-[hsl(var(--command-accent))]">
                  {agent.activeTasks}
                </div>
                <div className="text-xs text-[hsl(var(--command-text-muted))] mt-1">Active Tasks</div>
              </div>
              <div className="text-center p-3 glass-morphism rounded-lg">
                <div className="text-2xl font-display font-bold text-[hsl(var(--command-success))]">
                  {agent.completedTasks}
                </div>
                <div className="text-xs text-[hsl(var(--command-text-muted))] mt-1">Completed</div>
              </div>
              <div className="text-center p-3 glass-morphism rounded-lg">
                <div className="text-2xl font-display font-bold text-yellow-400">
                  {agent.efficiency}%
                </div>
                <div className="text-xs text-[hsl(var(--command-text-muted))] mt-1">Efficiency</div>
              </div>
            </div>
          </motion.div>

          {/* Skills & Expertise */}
          <motion.div 
            className="glass-morphism p-4 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-4 w-4 text-[hsl(var(--command-accent))]" />
              <span className="font-heading font-semibold">Skills & Expertise</span>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-[hsl(var(--command-text))] mb-2">Core Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {agent.expertise.map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="outline" 
                      className="bg-[hsl(var(--command-accent))]/10 text-[hsl(var(--command-accent))] border-[hsl(var(--command-accent))]/20 text-sm px-3 py-1"
                    >
                      <Star className="h-3 w-3 mr-1" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[hsl(var(--command-text))] mb-2">All Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {agent.skills.map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="outline" 
                      className="text-xs px-2 py-1 bg-[hsl(var(--command-surface))]/50 border-[hsl(var(--command-border))]"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Achievements */}
          <motion.div 
            className="glass-morphism p-4 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-4 w-4 text-[hsl(var(--command-accent))]" />
              <span className="font-heading font-semibold">Recent Achievements</span>
            </div>
            <div className="space-y-2">
              {agent.recentAchievements.map((achievement, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start gap-3 p-2 glass-morphism rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (index * 0.1) }}
                >
                  <div className="w-2 h-2 bg-[hsl(var(--command-success))] rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-[hsl(var(--command-text-muted))]">
                    {achievement}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Agent Timeline */}
          <motion.div 
            className="glass-morphism p-4 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-[hsl(var(--command-accent))]" />
              <span className="font-heading font-semibold">Timeline</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[hsl(var(--command-text-muted))]">Joined Team</span>
                <span className="font-medium">{formatDate(agent.joinedAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[hsl(var(--command-text-muted))]">Time with Team</span>
                <span className="font-medium">{formatTimeSince(agent.joinedAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[hsl(var(--command-text-muted))]">Last Activity</span>
                <span className="font-medium">{formatTimeSince(agent.lastSeen)} ago</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[hsl(var(--command-surface))]/50 backdrop-blur border-t border-[hsl(var(--command-border))]">
          <div className="flex justify-end gap-3">
            <Button variant="outline" className="hover:bg-[hsl(var(--command-accent))]/10">
              <Activity className="h-4 w-4 mr-2" />
              View Tasks
            </Button>
            <Button 
              variant="ghost"
              onClick={onClose}
              className="hover:bg-[hsl(var(--command-text-muted))]/10"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}