"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Users, Zap, Clock, CheckCircle, AlertCircle, Calendar } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AnalyticsData {
  tasksPerDay: { date: string; count: number; label: string }[]
  tasksByAgent: { agent: string; count: number; color: string }[]
  pipelineStages: { stage: string; count: number; total: number; color: string }[]
  agentWorkload: { agent: string; percentage: number; color: string }[]
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    tasksPerDay: [],
    tasksByAgent: [],
    pipelineStages: [],
    agentWorkload: []
  })

  useEffect(() => {
    // Generate sample analytics data
    const now = new Date()
    const tasksPerDay = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (6 - i))
      return {
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 20) + 5,
        label: date.toLocaleDateString('en-US', { weekday: 'short' })
      }
    })

    const tasksByAgent = [
      { agent: "Claude", count: 45, color: "#06b6d4" },
      { agent: "GPT-4", count: 32, color: "#22c55e" },
      { agent: "Perplexity", count: 28, color: "#a855f7" },
      { agent: "Gemini", count: 21, color: "#f59e0b" },
      { agent: "Llama", count: 15, color: "#ef4444" }
    ]

    const pipelineStages = [
      { stage: "Ideas", count: 23, total: 50, color: "#06b6d4" },
      { stage: "Draft", count: 18, total: 50, color: "#22c55e" },
      { stage: "Review", count: 12, total: 50, color: "#f59e0b" },
      { stage: "Published", count: 35, total: 50, color: "#a855f7" }
    ]

    const agentWorkload = [
      { agent: "Claude", percentage: 35, color: "#06b6d4" },
      { agent: "GPT-4", percentage: 25, color: "#22c55e" },
      { agent: "Perplexity", percentage: 20, color: "#a855f7" },
      { agent: "Gemini", percentage: 12, color: "#f59e0b" },
      { agent: "Llama", percentage: 8, color: "#ef4444" }
    ]

    setData({
      tasksPerDay,
      tasksByAgent,
      pipelineStages,
      agentWorkload
    })
  }, [])

  const maxTasksPerDay = Math.max(...data.tasksPerDay.map(d => d.count))
  const maxTasksByAgent = Math.max(...data.tasksByAgent.map(d => d.count))

  // Create conic gradient for donut chart
  const createDonutGradient = (data: typeof data.agentWorkload) => {
    let cumulative = 0
    const stops = data.map(item => {
      const start = cumulative
      cumulative += item.percentage
      return `${item.color} ${start}% ${cumulative}%`
    }).join(', ')
    
    return `conic-gradient(${stops})`
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <PageHeader 
        title="Analytics"
        description="Performance insights and data visualization"
        icon={BarChart3}
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Total Tasks</p>
                <p className="text-2xl font-bold text-[#06b6d4]">141</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">+12%</span>
                </div>
              </div>
              <div className="p-3 bg-[#06b6d4]/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-[#06b6d4]" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Active Agents</p>
                <p className="text-2xl font-bold text-[#22c55e]">5</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-500">All Online</span>
                </div>
              </div>
              <div className="p-3 bg-[#22c55e]/10 rounded-lg">
                <Users className="h-6 w-6 text-[#22c55e]" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Avg Response</p>
                <p className="text-2xl font-bold text-[#a855f7]">1.2s</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">-0.3s</span>
                </div>
              </div>
              <div className="p-3 bg-[#a855f7]/10 rounded-lg">
                <Zap className="h-6 w-6 text-[#a855f7]" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Uptime</p>
                <p className="text-2xl font-bold text-[#f59e0b]">99.8%</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-500">Stable</span>
                </div>
              </div>
              <div className="p-3 bg-[#f59e0b]/10 rounded-lg">
                <Clock className="h-6 w-6 text-[#f59e0b]" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tasks Completed Per Day - Horizontal Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-5 w-5 text-[#06b6d4]" />
              <h3 className="text-lg font-semibold text-white/90">Tasks Completed (Last 7 Days)</h3>
            </div>
            <div className="space-y-4">
              {data.tasksPerDay.map((day, index) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 text-sm text-white/60 text-right">
                    {day.label}
                  </div>
                  <div className="flex-1 relative">
                    <div className="h-8 bg-white/[0.03] rounded-lg border border-white/[0.06] overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#06b6d4] to-[#22c55e] rounded-lg relative"
                        initial={{ width: 0 }}
                        animate={{ width: `${(day.count / maxTasksPerDay) * 100}%` }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                      >
                        <div className="absolute inset-0 bg-white/10 animate-pulse" />
                      </motion.div>
                    </div>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-semibold text-white/90">
                      {day.count}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Tasks by Agent - Vertical Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-5 w-5 text-[#22c55e]" />
              <h3 className="text-lg font-semibold text-white/90">Tasks by Agent</h3>
            </div>
            <div className="flex items-end justify-between gap-4 h-64">
              {data.tasksByAgent.map((agent, index) => (
                <motion.div
                  key={agent.agent}
                  className="flex flex-col items-center flex-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="text-sm font-semibold text-white/90 mb-2">
                    {agent.count}
                  </div>
                  <motion.div
                    className="w-full rounded-lg relative overflow-hidden"
                    style={{ backgroundColor: `${agent.color}20` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(agent.count / maxTasksByAgent) * 200}px` }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.8 }}
                  >
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 rounded-lg"
                      style={{ backgroundColor: agent.color }}
                      initial={{ height: 0 }}
                      animate={{ height: '100%' }}
                      transition={{ delay: 1.1 + index * 0.1, duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-white/10 animate-pulse" />
                  </motion.div>
                  <div className="text-xs text-white/60 mt-2 text-center">
                    {agent.agent}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Content Pipeline Stages - Progress Bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="h-5 w-5 text-[#f59e0b]" />
              <h3 className="text-lg font-semibold text-white/90">Content Pipeline Stages</h3>
            </div>
            <div className="space-y-6">
              {data.pipelineStages.map((stage, index) => (
                <motion.div
                  key={stage.stage}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/90">
                      {stage.stage}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/60">
                        {stage.count}/{stage.total}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {Math.round((stage.count / stage.total) * 100)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="h-3 bg-white/[0.03] rounded-full border border-white/[0.06] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full relative"
                        style={{ backgroundColor: stage.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(stage.count / stage.total) * 100}%` }}
                        transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Agent Workload Distribution - Donut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-5 w-5 text-[#a855f7]" />
              <h3 className="text-lg font-semibold text-white/90">Agent Workload Distribution</h3>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <motion.div
                  className="w-48 h-48 rounded-full relative"
                  style={{ 
                    background: createDonutGradient(data.agentWorkload),
                  }}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8, duration: 1, type: "spring" }}
                >
                  {/* Inner circle to create donut effect */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#0a0a0a] rounded-full border-4 border-white/[0.06] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white/90">100%</div>
                      <div className="text-xs text-white/60">Load</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="mt-6 space-y-3">
              {data.agentWorkload.map((agent, index) => (
                <motion.div
                  key={agent.agent}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: agent.color }}
                    />
                    <span className="text-sm text-white/90">{agent.agent}</span>
                  </div>
                  <span className="text-sm font-semibold text-white/60">
                    {agent.percentage}%
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}