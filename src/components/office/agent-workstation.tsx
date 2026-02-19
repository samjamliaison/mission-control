"use client"

import { motion } from "framer-motion"
import { Monitor, Wifi, Zap } from "lucide-react"
import { OfficeAgent } from "./office-agent"
import { cn } from "@/lib/utils"

interface AgentWorkstationProps {
  agent: OfficeAgent
  onClick: () => void
}

const statusConfig = {
  "online": {
    color: "#10b981", // green-500
    bg: "bg-green-500/20",
    pulse: true,
    glow: "0 0 20px rgba(16, 185, 129, 0.4)",
    label: "Online"
  },
  "active": {
    color: "#06b6d4", // cyan-400
    bg: "bg-cyan-500/20",
    pulse: true,
    glow: "0 0 20px rgba(6, 182, 212, 0.4)",
    label: "Active"
  },
  "idle": {
    color: "#f59e0b", // amber-500
    bg: "bg-amber-500/20",
    pulse: false,
    glow: "0 0 20px rgba(245, 158, 11, 0.2)",
    label: "Idle"
  }
}

export function AgentWorkstation({ agent, onClick }: AgentWorkstationProps) {
  const statusStyle = statusConfig[agent.status]

  return (
    <motion.div
      className="absolute cursor-pointer group"
      style={{
        left: `${agent.position.x}%`,
        top: `${agent.position.y}%`,
        transform: "translate(-50%, -50%)"
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay: Math.random() * 0.8,
        type: "spring",
        stiffness: 200,
        damping: 15
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Workstation Base */}
      <div
        className={cn(
          "relative p-4 glass-morphism rounded-xl border-2 min-w-[100px] transition-all duration-300",
          statusStyle.bg,
          "hover:shadow-2xl group-hover:border-current"
        )}
        style={{
          borderColor: statusStyle.color,
          boxShadow: statusStyle.glow
        }}
      >
        {/* Status Indicator */}
        <motion.div
          className="absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-[hsl(var(--command-background))]"
          style={{ backgroundColor: statusStyle.color }}
          animate={statusStyle.pulse ? {
            scale: [1, 1.3, 1],
            opacity: [0.8, 1, 0.8]
          } : {}}
          transition={statusStyle.pulse ? {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
        />

        {/* Activity Waves for Active Agents */}
        {agent.status !== "idle" && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2"
            style={{ borderColor: statusStyle.color }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        )}

        <div className="relative z-10 text-center space-y-2">
          {/* Agent Avatar */}
          <motion.div
            className="text-3xl"
            animate={agent.status === "active" ? {
              rotate: [-1, 1, -1]
            } : {}}
            transition={agent.status === "active" ? {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            } : {}}
          >
            {agent.avatar}
          </motion.div>

          {/* Agent Name */}
          <div className="space-y-1">
            <div className="font-heading font-semibold text-sm">{agent.name}</div>
            <div className="text-xs text-[hsl(var(--command-text-muted))]">
              {agent.workstation}
            </div>
          </div>

          {/* Workstation Icon */}
          <div className="flex justify-center">
            <Monitor className="h-4 w-4 text-[hsl(var(--command-text-muted))]" />
          </div>

          {/* Activity Level Bar */}
          <div className="w-full h-1.5 bg-[hsl(var(--command-surface))] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[hsl(var(--command-accent))] to-[hsl(var(--command-success))]"
              initial={{ width: "0%" }}
              animate={{ width: `${agent.activityLevel}%` }}
              transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
            />
          </div>

          {/* Activity Percentage */}
          <div className="text-xs font-medium" style={{ color: statusStyle.color }}>
            {agent.activityLevel}%
          </div>
        </div>

        {/* Hover Info Panel */}
        <motion.div
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20"
          initial={{ y: -10 }}
          whileHover={{ y: 0 }}
        >
          <div className="glass-morphism p-3 rounded-lg shadow-xl border border-[hsl(var(--command-border-bright))] min-w-[200px]">
            <div className="text-center space-y-1">
              <div className="font-medium text-sm">{agent.name}</div>
              <div className="text-xs text-[hsl(var(--command-text-muted))]">
                {agent.currentTask.length > 40
                  ? agent.currentTask.substring(0, 40) + "..."
                  : agent.currentTask
                }
              </div>
              <div className="flex items-center justify-center gap-2 text-xs">
                <motion.div
                  animate={statusStyle.pulse ? { opacity: [0.5, 1, 0.5] } : {}}
                  transition={statusStyle.pulse ? { duration: 1.5, repeat: Infinity } : {}}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: statusStyle.color }}
                />
                <span>{statusStyle.label}</span>
                <span>•</span>
                <span>{agent.timeInCurrentTask}m</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Connection Lines (subtle network effect) */}
        {agent.status !== "idle" && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="relative w-20 h-20">
              <motion.div
                className="absolute top-0 left-1/2 w-0.5 h-4 transform -translate-x-1/2"
                style={{ backgroundColor: statusStyle.color }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0
                }}
              />
              <motion.div
                className="absolute top-1/2 right-0 h-0.5 w-4 transform -translate-y-1/2"
                style={{ backgroundColor: statusStyle.color }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.5
                }}
              />
              <motion.div
                className="absolute bottom-0 left-1/2 w-0.5 h-4 transform -translate-x-1/2"
                style={{ backgroundColor: statusStyle.color }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 1
                }}
              />
              <motion.div
                className="absolute top-1/2 left-0 h-0.5 w-4 transform -translate-y-1/2"
                style={{ backgroundColor: statusStyle.color }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 1.5
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Keyboard Activity Indicator */}
        {agent.activityLevel > 70 && (
          <motion.div
            className="absolute bottom-1 right-1"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Zap className="h-3 w-3 text-[hsl(var(--command-warning))]" />
          </motion.div>
        )}

        {/* Network Connection Indicator */}
        <motion.div
          className="absolute top-1 right-1"
          animate={agent.status !== "idle" ? {
            opacity: [0.4, 1, 0.4]
          } : {}}
          transition={agent.status !== "idle" ? {
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
        >
          <Wifi className="h-3 w-3 text-[hsl(var(--command-accent))]" />
        </motion.div>
      </div>
    </motion.div>
  )
}