"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Building2, Monitor, User, Clock, Activity, Zap, Coffee, Leaf, Lightbulb } from "lucide-react"
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
    currentTask: 'Web research and fact verification',
    position: { row: 1, col: 0 },
    color: '#a855f7',
    timeOnTask: 28
  },
  {
    id: '4',
    name: 'Gemini',
    avatar: '💎',
    role: 'Multi-modal AI',
    status: 'idle',
    currentTask: 'Standing by for multimodal tasks',
    position: { row: 1, col: 1 },
    color: '#f59e0b',
    timeOnTask: 15
  }
]

const statusConfig = {
  working: { color: '#22c55e', label: 'Working', pulse: true },
  idle: { color: '#f59e0b', label: 'Idle', pulse: false },
  away: { color: '#ef4444', label: 'Away', pulse: false }
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
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800" data-testid="office-view">
      {/* Enhanced Ambient Background */}
      <div 
        className="absolute inset-0 opacity-40" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      
      {/* Floating Ambient Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "absolute w-1 h-1 rounded-full",
              i % 3 === 0 ? "bg-cyan-400/30" : i % 3 === 1 ? "bg-green-400/20" : "bg-purple-400/25"
            )}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, -Math.random() * 100 - 50],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: Math.random() * 8 + 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
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
          title="Mission Control Office"
          subtitle={`Digital workspace • ${currentTime.toLocaleTimeString()} • ${workingAgents} agents active`}
          icon={Building2}
        />

        {/* Office Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="glass-morphism p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/15 rounded-lg">
                <Activity className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Active Agents</p>
                <p className="text-xl font-bold text-white">{workingAgents}/{totalAgents}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="glass-morphism p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/15 rounded-lg">
                <Clock className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Avg Task Time</p>
                <p className="text-xl font-bold text-white">{averageTime}m</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="glass-morphism p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/15 rounded-lg">
                <Zap className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Office Status</p>
                <p className="text-xl font-bold text-white">Online</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="glass-morphism p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/15 rounded-lg">
                <Monitor className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Environment</p>
                <p className="text-xl font-bold text-white">Optimal</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 3D Isometric Office */}
        <motion.div 
          className="relative mx-auto"
          style={{ 
            width: '800px', 
            height: '600px',
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          {/* Office Floor */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 opacity-90"
            style={{
              transform: 'rotateX(60deg) rotateY(0deg)',
              transformOrigin: 'bottom',
              boxShadow: '0 0 50px rgba(0,0,0,0.5)'
            }}
          >
            {/* Floor Grid Pattern */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="absolute h-full border-r border-gray-600" style={{ left: `${i * 10}%` }} />
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="absolute w-full border-b border-gray-600" style={{ top: `${i * 12.5}%` }} />
              ))}
            </div>
          </div>

          {/* Walls */}
          <div 
            className="absolute left-0 top-0 w-full h-40 bg-gradient-to-b from-gray-600 to-gray-700"
            style={{
              transform: 'rotateX(-30deg) rotateY(0deg)',
              transformOrigin: 'bottom',
            }}
          />
          
          <div 
            className="absolute right-0 top-0 w-20 h-40 bg-gradient-to-l from-gray-500 to-gray-600"
            style={{
              transform: 'rotateX(-30deg) rotateY(70deg)',
              transformOrigin: 'left bottom',
            }}
          />

          {/* Office Equipment */}
          
          {/* Coffee Machine */}
          <motion.div
            className="absolute"
            style={{ left: '50px', top: '100px', zIndex: 20 }}
            animate={{ 
              rotateY: [0, 2, 0],
              scale: [1, 1.02, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative">
              {/* Coffee Machine Base */}
              <div className="w-12 h-16 bg-gradient-to-b from-gray-300 to-gray-400 rounded-lg shadow-lg">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-gray-800 rounded-sm" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-2 bg-amber-500 rounded-full opacity-60" />
              </div>
              {/* Steam */}
              <motion.div
                className="absolute -top-4 left-1/2 -translate-x-1/2"
                animate={{ 
                  opacity: [0.4, 0.8, 0.4],
                  y: [0, -10, -20],
                  scale: [0.5, 1, 1.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ☁️
              </motion.div>
              <Coffee className="absolute -bottom-8 left-1/2 -translate-x-1/2 h-4 w-4 text-amber-600" />
            </div>
          </motion.div>

          {/* Office Plant */}
          <motion.div
            className="absolute"
            style={{ left: '700px', top: '120px', zIndex: 15 }}
            animate={{ 
              rotateZ: [0, 1, -1, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative">
              {/* Plant Pot */}
              <div className="w-10 h-8 bg-gradient-to-b from-amber-600 to-amber-700 rounded-lg shadow-md" />
              {/* Plant */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl">🌿</div>
              <Leaf className="absolute -bottom-6 left-1/2 -translate-x-1/2 h-4 w-4 text-green-500" />
            </div>
          </motion.div>

          {/* Whiteboard */}
          <motion.div
            className="absolute"
            style={{ left: '20px', top: '20px', zIndex: 10 }}
            initial={{ rotateY: -10 }}
            whileHover={{ rotateY: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-32 h-20 bg-white rounded-lg shadow-xl border-4 border-gray-300 p-2">
              {/* Whiteboard Content */}
              <div className="space-y-1">
                <div className="flex gap-1">
                  <div className="w-2 h-0.5 bg-blue-500 rounded" />
                  <div className="w-4 h-0.5 bg-green-500 rounded" />
                  <div className="w-3 h-0.5 bg-red-500 rounded" />
                </div>
                <div className="flex gap-1">
                  <div className="w-3 h-0.5 bg-purple-500 rounded" />
                  <div className="w-2 h-0.5 bg-orange-500 rounded" />
                </div>
                <div className="flex gap-1 mt-2">
                  <div className="w-1 h-1 bg-blue-600 rounded-full" />
                  <div className="w-8 h-0.5 bg-gray-400 rounded" />
                </div>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-green-600 rounded-full" />
                  <div className="w-6 h-0.5 bg-gray-400 rounded" />
                </div>
              </div>
              {/* Marker Tray */}
              <div className="absolute bottom-1 left-1 flex gap-0.5">
                <div className="w-0.5 h-2 bg-blue-500 rounded" />
                <div className="w-0.5 h-2 bg-red-500 rounded" />
                <div className="w-0.5 h-2 bg-green-500 rounded" />
              </div>
            </div>
          </motion.div>

          {/* Ceiling Light */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2"
            style={{ zIndex: 5 }}
            animate={{ 
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative">
              <div className="w-16 h-4 bg-gradient-to-b from-gray-200 to-gray-300 rounded-lg shadow-lg" />
              <motion.div
                className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-yellow-200 opacity-10"
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <Lightbulb className="absolute top-6 left-1/2 -translate-x-1/2 h-3 w-3 text-yellow-400" />
            </div>
          </motion.div>

          {/* Agent Workstations */}
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              className={cn(
                "absolute cursor-pointer transition-all duration-300 hover:z-30",
                selectedAgent?.id === agent.id && "z-40"
              )}
              style={{
                left: `${200 + agent.position.col * 180}px`,
                top: `${180 + agent.position.row * 140}px`,
                zIndex: 25
              }}
              initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
              animate={{ 
                opacity: 1, 
                scale: selectedAgent?.id === agent.id ? 1.1 : 1,
                rotateY: 0
              }}
              transition={{ 
                delay: index * 0.2 + 0.8, 
                duration: 0.8,
                type: "spring",
                stiffness: 100
              }}
              onClick={() => setSelectedAgent(agent)}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.2 }
              }}
            >
              {/* 3D Desk */}
              <div className="relative">
                {/* Desk Surface */}
                <div 
                  className="w-24 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-xl"
                  style={{
                    transform: 'rotateX(20deg)',
                    transformOrigin: 'bottom'
                  }}
                >
                  {/* Desk Edge */}
                  <div className="absolute -bottom-1 left-0 w-full h-2 bg-gradient-to-r from-amber-200 to-amber-300 rounded-b-lg" />
                </div>
                
                {/* Desk Legs */}
                <div className="absolute -bottom-6 left-2 w-1 h-6 bg-gray-600" />
                <div className="absolute -bottom-6 right-2 w-1 h-6 bg-gray-600" />
                <div className="absolute -bottom-6 left-2 -translate-y-2 w-1 h-6 bg-gray-500" />
                <div className="absolute -bottom-6 right-2 -translate-y-2 w-1 h-6 bg-gray-500" />

                {/* Enhanced Monitor */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-14">
                  {/* Monitor Stand */}
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-3 bg-gradient-to-b from-gray-600 to-gray-700 rounded-lg shadow-md" />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-2 h-4 bg-gradient-to-b from-gray-500 to-gray-600 rounded-sm" />

                  {/* Screen with Agent-Specific Content */}
                  <div
                    className="w-full h-12 rounded-lg shadow-2xl relative overflow-hidden border-2 border-gray-800"
                    style={{
                      backgroundColor: agent.status === 'working' ? '#0a0a0a' : '#2a2a2a',
                      boxShadow: `0 0 20px ${agent.color}40`
                    }}
                  >
                    {/* Screen Bezel */}
                    <div className="absolute inset-0 rounded-lg border border-gray-700" />
                    
                    {/* Agent-Specific Screen Content */}
                    <motion.div 
                      className="absolute inset-1 rounded-md overflow-hidden"
                      style={{ backgroundColor: agent.color + '10' }}
                    >
                      {agent.status === 'working' && (
                        <>
                          {/* Terminal/Code Interface */}
                          <div className="p-1 space-y-0.5 text-xs">
                            <div className="flex items-center gap-1">
                              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: agent.color }} />
                              <div className="w-8 h-0.5 bg-white/30 rounded" />
                              <div className="w-4 h-0.5 bg-white/20 rounded" />
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-6 h-0.5 bg-white/25 rounded" />
                              <div className="w-2 h-0.5" style={{ backgroundColor: agent.color + '80' }} />
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-0.5 bg-white/20 rounded" />
                              <div className="w-5 h-0.5 bg-white/15 rounded" />
                            </div>
                          </div>
                          
                          {/* Activity Indicator */}
                          <motion.div
                            className="absolute bottom-1 right-1 w-2 h-0.5 rounded"
                            style={{ backgroundColor: agent.color }}
                            animate={{ 
                              width: ['4px', '8px', '4px'],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />

                          {/* Blinking Cursor */}
                          <motion.div
                            className="absolute bottom-2 left-2 w-0.5 h-1 rounded"
                            style={{ backgroundColor: agent.color }}
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        </>
                      )}

                      {/* Screen Glow Effect */}
                      <motion.div
                        className="absolute inset-0 opacity-20 mix-blend-overlay"
                        style={{ backgroundColor: agent.color }}
                        animate={{ 
                          opacity: agent.status === 'working' ? [0.1, 0.3, 0.1] : [0.05, 0.1, 0.05]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </motion.div>

                    {/* Screen Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-lg pointer-events-none" />
                  </div>
                </div>

                {/* Ergonomic Chair */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                  {/* Chair Seat */}
                  <div className="w-10 h-8 bg-gradient-to-b from-gray-600 to-gray-700 rounded-lg shadow-md transform -skew-x-2" />
                  {/* Chair Back */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-b from-gray-500 to-gray-600 rounded-t-lg shadow-md" />
                  {/* Armrests */}
                  <div className="absolute top-0 -left-1 w-2 h-4 bg-gray-600 rounded-sm" />
                  <div className="absolute top-0 -right-1 w-2 h-4 bg-gray-600 rounded-sm" />
                  {/* Chair Base */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-gray-800 rounded-full" />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-2 bg-gray-700" />
                </div>

                {/* Enhanced Status Indicator */}
                <motion.div
                  className={cn(
                    "absolute -top-3 -right-3 w-5 h-5 rounded-full border-2 border-white/30 shadow-xl backdrop-blur-sm",
                    statusConfig[agent.status].pulse && "animate-pulse"
                  )}
                  style={{ 
                    backgroundColor: statusConfig[agent.status].color,
                    boxShadow: `0 0 15px ${statusConfig[agent.status].color}80`
                  }}
                  animate={statusConfig[agent.status].pulse ? {
                    scale: [1, 1.3, 1],
                    opacity: [0.8, 1, 0.8]
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Agent Avatar & Info */}
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center">
                  <motion.div 
                    className="text-3xl mb-2 filter drop-shadow-lg"
                    animate={{ 
                      rotateY: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    {agent.avatar}
                  </motion.div>
                  <div className="glass-morphism px-3 py-1 rounded-lg backdrop-blur-md">
                    <div className="text-sm font-bold text-white">{agent.name}</div>
                    <div className="text-xs text-white/60">{statusConfig[agent.status].label}</div>
                    {agent.status === 'working' && (
                      <motion.div 
                        className="text-xs mt-1"
                        style={{ color: agent.color }}
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {agent.timeOnTask}m
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Selection Glow */}
                <AnimatePresence>
                  {selectedAgent?.id === agent.id && (
                    <motion.div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: 0.4,
                        scale: 1.2
                      }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      style={{
                        boxShadow: `0 0 40px ${agent.color}, inset 0 0 40px ${agent.color}40`,
                        background: `radial-gradient(circle, ${agent.color}20 0%, transparent 70%)`
                      }}
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}

          {/* Clock Ticking Animation */}
          <motion.div
            className="absolute top-4 right-4"
            style={{ zIndex: 30 }}
          >
            <div className="glass-morphism p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                  <Clock className="h-5 w-5 text-cyan-400" />
                </motion.div>
                <div className="text-sm font-mono text-white/90">
                  {currentTime.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Agent Details Panel */}
        <AnimatePresence>
          {selectedAgent && (
            <motion.div
              className="fixed bottom-6 right-6 glass-morphism p-6 rounded-xl max-w-md z-50"
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{selectedAgent.avatar}</div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedAgent.name}</h3>
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ color: selectedAgent.color, borderColor: selectedAgent.color + '40' }}
                    >
                      {selectedAgent.role}
                    </Badge>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAgent(null)}
                  className="text-white/60 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-white/60 mb-1">Current Status</p>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: statusConfig[selectedAgent.status].color }}
                    />
                    <span className="text-sm text-white">{statusConfig[selectedAgent.status].label}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-white/60 mb-1">Current Task</p>
                  <p className="text-sm text-white/90">{selectedAgent.currentTask}</p>
                </div>
                
                <div>
                  <p className="text-sm text-white/60 mb-1">Time on Task</p>
                  <p className="text-sm text-white/90">{selectedAgent.timeOnTask} minutes</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}