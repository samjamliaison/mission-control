"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Building2, Monitor, User, Clock, Activity, Zap } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Agent {
  id: string
  name: string
  avatar: string
  role: string
  status: 'working' | 'idle' | 'away'
  currentTask: string
  position: { row: number; col: number }
  color: string
  timeOnTask: number
}

const agents: Agent[] = [
  {
    id: '1',
    name: 'Claude',
    avatar: '🤖',
    role: 'AI Assistant',
    status: 'working',
    currentTask: 'Processing natural language queries and generating responses',
    position: { row: 0, col: 0 },
    color: '#06b6d4',
    timeOnTask: 45
  },
  {
    id: '2', 
    name: 'GPT-4',
    avatar: '🧠',
    role: 'Language Model',
    status: 'working',
    currentTask: 'Creative writing and complex reasoning tasks',
    position: { row: 0, col: 1 },
    color: '#22c55e',
    timeOnTask: 32
  },
  {
    id: '3',
    name: 'Perplexity',
    avatar: '🔍',
    role: 'Research Agent',
    status: 'working',
    currentTask: 'Conducting web research and fact-checking',
    position: { row: 0, col: 2 },
    color: '#a855f7',
    timeOnTask: 28
  },
  {
    id: '4',
    name: 'Gemini',
    avatar: '💎',
    role: 'Multimodal AI',
    status: 'idle',
    currentTask: 'Available for image and text processing',
    position: { row: 1, col: 0 },
    color: '#f59e0b',
    timeOnTask: 5
  },
  {
    id: '5',
    name: 'DALL-E',
    avatar: '🎨',
    role: 'Image Generator',
    status: 'working',
    currentTask: 'Creating digital artwork and visual concepts',
    position: { row: 1, col: 1 },
    color: '#ef4444',
    timeOnTask: 67
  },
  {
    id: '6',
    name: 'Whisper',
    avatar: '🎤',
    role: 'Speech AI',
    status: 'away',
    currentTask: 'Transcribing audio recordings',
    position: { row: 1, col: 2 },
    color: '#8b5cf6',
    timeOnTask: 12
  }
]

const statusConfig = {
  working: { color: '#22c55e', pulse: true, label: 'Working' },
  idle: { color: '#6b7280', pulse: false, label: 'Idle' },
  away: { color: '#f59e0b', pulse: false, label: 'Away' }
}

export function IsometricOffice() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const workingAgents = agents.filter(a => a.status === 'working').length
  const totalAgents = agents.length
  const averageTime = Math.round(agents.reduce((sum, a) => sum + a.timeOnTask, 0) / totalAgents)

  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        <PageHeader 
          title="Digital Office"
          description="Isometric view of our AI agent workspace - where the magic happens"
          icon={Building2}
        />

        {/* Office Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Activity className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-white/60">Active Agents</p>
                <p className="text-xl font-bold text-white">{workingAgents}/{totalAgents}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-cyan-500" />
              </div>
              <div>
                <p className="text-sm text-white/60">Avg Task Time</p>
                <p className="text-xl font-bold text-white">{averageTime}m</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Zap className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-white/60">Office Status</p>
                <p className="text-xl font-bold text-white">Online</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Monitor className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-white/60">Current Time</p>
                <p className="text-xl font-bold text-white">{currentTime.toLocaleTimeString().slice(0, -3)}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Isometric Office Grid */}
        <motion.div 
          className="flex justify-center items-center min-h-[600px] p-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div 
            className="grid grid-cols-3 gap-12"
            style={{
              transform: 'rotateX(60deg) rotateZ(-45deg)',
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                className="relative cursor-pointer group"
                style={{
                  transform: 'rotateZ(45deg) rotateX(-60deg)',
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                onHoverStart={() => setSelectedAgent(agent)}
                onHoverEnd={() => setSelectedAgent(null)}
              >
                {/* Desk */}
                <div className="relative w-32 h-24 bg-gradient-to-b from-amber-700 to-amber-800 rounded-lg shadow-2xl">
                  {/* Desk legs */}
                  <div className="absolute -bottom-6 left-2 w-2 h-6 bg-amber-900 rounded-sm" />
                  <div className="absolute -bottom-6 right-2 w-2 h-6 bg-amber-900 rounded-sm" />
                  <div className="absolute -bottom-6 left-2 -translate-x-1 -translate-y-1 w-2 h-6 bg-amber-800 rounded-sm" />
                  <div className="absolute -bottom-6 right-2 translate-x-1 -translate-y-1 w-2 h-6 bg-amber-800 rounded-sm" />

                  {/* Monitor */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-14">
                    {/* Monitor Stand */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-2 bg-gray-700 rounded-sm" />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-3 bg-gray-600" />
                    
                    {/* Screen */}
                    <div 
                      className="w-full h-12 rounded-sm shadow-lg relative overflow-hidden border-2"
                      style={{ 
                        backgroundColor: agent.status === 'working' ? '#1a1a1a' : '#404040',
                        borderColor: agent.color + '40'
                      }}
                    >
                      {/* Screen content */}
                      <div className="absolute inset-1 bg-gradient-to-br from-green-400/20 to-blue-400/20">
                        {agent.status === 'working' && (
                          <>
                            {/* Fake code lines */}
                            <div className="space-y-1 p-1">
                              {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex gap-1">
                                  <div className="w-1 h-1 bg-green-400/60 rounded-full" />
                                  <div className="w-8 h-1 bg-white/20 rounded-full" />
                                  <div className="w-4 h-1 bg-cyan-400/60 rounded-full" />
                                </div>
                              ))}
                            </div>
                            {/* Blinking cursor */}
                            <motion.div 
                              className="absolute bottom-1 left-1 w-0.5 h-1 bg-green-400"
                              animate={{ opacity: [1, 0, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                          </>
                        )}
                        
                        {/* Screen glow */}
                        <motion.div 
                          className="absolute inset-0 opacity-30"
                          style={{ backgroundColor: agent.color }}
                          animate={{ opacity: [0.1, 0.3, 0.1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Chair */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 translate-y-2">
                    {/* Chair seat */}
                    <div className="w-8 h-6 bg-gradient-to-b from-gray-600 to-gray-700 rounded-sm shadow-md" />
                    {/* Chair back */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-6 bg-gradient-to-b from-gray-500 to-gray-600 rounded-t-sm" />
                    {/* Chair legs */}
                    <div className="absolute -bottom-3 left-1 w-0.5 h-3 bg-gray-800" />
                    <div className="absolute -bottom-3 right-1 w-0.5 h-3 bg-gray-800" />
                    <div className="absolute -bottom-3 left-1 -translate-x-1 w-0.5 h-3 bg-gray-700" />
                    <div className="absolute -bottom-3 right-1 translate-x-1 w-0.5 h-3 bg-gray-700" />
                  </div>

                  {/* Status Indicator */}
                  <motion.div 
                    className={cn(
                      "absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-white/20 shadow-lg",
                      statusConfig[agent.status].pulse && "animate-pulse"
                    )}
                    style={{ backgroundColor: statusConfig[agent.status].color }}
                    animate={statusConfig[agent.status].pulse ? {
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1]
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />

                  {/* Agent Name Label */}
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center">
                    <div className="text-2xl mb-1">{agent.avatar}</div>
                    <div className="text-xs font-semibold text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                      {agent.name}
                    </div>
                    <div className="text-xs text-white/60 mt-1">
                      {statusConfig[agent.status].label}
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: selectedAgent?.id === agent.id ? 0.3 : 0,
                      scale: selectedAgent?.id === agent.id ? 1.1 : 1
                    }}
                    style={{ 
                      boxShadow: `0 0 30px ${agent.color}`,
                      backgroundColor: agent.color + '10'
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Tooltip */}
                <AnimatePresence>
                  {selectedAgent?.id === agent.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.9 }}
                      className="absolute -top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                      style={{
                        transform: 'rotateZ(-45deg) rotateX(60deg) translateX(-50%)',
                      }}
                    >
                      <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-4 shadow-2xl min-w-64 max-w-80">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xl">{agent.avatar}</span>
                          <div>
                            <h3 className="font-semibold text-white">{agent.name}</h3>
                            <p className="text-xs text-white/60">{agent.role}</p>
                          </div>
                          <Badge 
                            variant="outline" 
                            className="ml-auto text-xs"
                            style={{ borderColor: statusConfig[agent.status].color }}
                          >
                            {statusConfig[agent.status].label}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-white/60 mb-1">Current Task:</p>
                            <p className="text-sm text-white/90">{agent.currentTask}</p>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-white/60">Time on task:</span>
                            <span className="text-white/90 font-semibold">{agent.timeOnTask}m</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Office Legend */}
        <motion.div 
          className="flex justify-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-xl p-6">
            <h3 className="font-semibold text-white mb-4 text-center">Status Legend</h3>
            <div className="flex gap-6">
              {Object.entries(statusConfig).map(([status, config]) => (
                <div key={status} className="flex items-center gap-2">
                  <motion.div 
                    className={cn("w-3 h-3 rounded-full", config.pulse && "animate-pulse")}
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-sm text-white/80 capitalize">{config.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}