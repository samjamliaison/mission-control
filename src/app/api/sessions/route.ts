import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import { exec as execSync } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execSync);

interface SessionInfo {
  id: string
  agentId: string
  agentName: string
  type: 'main' | 'subagent' | 'tool' | 'background'
  status: 'active' | 'idle' | 'paused' | 'ended'
  startTime: number
  lastActivity: number
  duration: number
  channel?: string
  requester?: string
  currentTask?: string
  messageCount: number
  toolCalls: number
  memoryUsage?: number
  priority: 'low' | 'normal' | 'high' | 'critical'
  tags: string[]
}

interface ProcessInfo {
  pid: number
  command: string
  startTime: number
  cpuUsage: number
  memoryUsage: number
}

async function getOpenClawProcesses(): Promise<ProcessInfo[]> {
  try {
    // Get OpenClaw-related processes
    const { stdout } = await exec('ps aux | grep -E "(openclaw|agent|claude)" | grep -v grep')
    const processes: ProcessInfo[] = []
    
    const lines = stdout.trim().split('\n')
    for (const line of lines) {
      const parts = line.trim().split(/\s+/)
      if (parts.length >= 11) {
        const pid = parseInt(parts[1])
        const cpuUsage = parseFloat(parts[2])
        const memoryUsage = parseFloat(parts[3])
        const command = parts.slice(10).join(' ')
        
        if (!isNaN(pid)) {
          processes.push({
            pid,
            command,
            startTime: Date.now() - (Math.random() * 24 * 60 * 60 * 1000), // Simulated start time
            cpuUsage,
            memoryUsage
          })
        }
      }
    }
    
    return processes
  } catch (error) {
    console.warn('Failed to get process info:', error)
    return []
  }
}

function generateSessionFromProcess(process: ProcessInfo, index: number): SessionInfo {
  const agentIds = ['main', 'monica', 'jarvis', 'luna', 'system']
  const agentNames = ['Main Agent', 'Monica (Travel)', 'Jarvis (Research)', 'Luna (Content)', 'System']
  const channels = ['telegram', 'discord', 'cli', 'api', 'internal']
  const tasks = [
    'Processing user request',
    'Analyzing data',
    'Generating report',
    'Managing workspace',
    'Coordinating tasks',
    'System monitoring',
    'File operations',
    'Web research',
    'Content creation',
    'Background processing'
  ]
  
  const agentIndex = index % agentIds.length
  const isMainSession = process.command.includes('main') || index === 0
  
  return {
    id: `session-${process.pid}-${Date.now().toString(36)}`,
    agentId: isMainSession ? 'main' : agentIds[agentIndex],
    agentName: isMainSession ? 'Main Agent' : agentNames[agentIndex],
    type: isMainSession ? 'main' : (Math.random() > 0.7 ? 'subagent' : 'background'),
    status: Math.random() > 0.1 ? 'active' : 'idle',
    startTime: process.startTime,
    lastActivity: Date.now() - (Math.random() * 30 * 60 * 1000), // Last 30 minutes
    duration: Date.now() - process.startTime,
    channel: channels[Math.floor(Math.random() * channels.length)],
    requester: Math.random() > 0.3 ? 'user' : 'system',
    currentTask: tasks[Math.floor(Math.random() * tasks.length)],
    messageCount: Math.floor(Math.random() * 100) + 10,
    toolCalls: Math.floor(Math.random() * 50) + 5,
    memoryUsage: process.memoryUsage,
    priority: Math.random() > 0.7 ? 'high' : (Math.random() > 0.3 ? 'normal' : 'low'),
    tags: generateSessionTags(process.command, isMainSession)
  }
}

function generateSessionTags(command: string, isMainSession: boolean): string[] {
  const tags: string[] = []
  
  if (isMainSession) tags.push('primary')
  if (command.includes('telegram')) tags.push('telegram')
  if (command.includes('discord')) tags.push('discord')
  if (command.includes('research')) tags.push('research')
  if (command.includes('travel')) tags.push('travel')
  if (command.includes('content')) tags.push('content')
  if (command.includes('background')) tags.push('background')
  if (command.includes('cron')) tags.push('scheduled')
  if (Math.random() > 0.5) tags.push('interactive')
  
  return tags.length > 0 ? tags : ['general']
}

export async function GET(request: NextRequest) {
  try {
    const processes = await getOpenClawProcesses()
    
    // Generate session info from processes
    let sessions: SessionInfo[] = processes.map(generateSessionFromProcess)
    
    // Add some example sessions if no processes found
    if (sessions.length === 0) {
      const exampleSessions: SessionInfo[] = [
        {
          id: 'main-session-001',
          agentId: 'main',
          agentName: 'Main Agent',
          type: 'main',
          status: 'active',
          startTime: Date.now() - (2 * 60 * 60 * 1000), // 2 hours ago
          lastActivity: Date.now() - (5 * 60 * 1000), // 5 minutes ago
          duration: 2 * 60 * 60 * 1000,
          channel: 'telegram',
          requester: 'user',
          currentTask: 'Mission Control development',
          messageCount: 45,
          toolCalls: 23,
          memoryUsage: 2.5,
          priority: 'high',
          tags: ['primary', 'telegram', 'interactive']
        },
        {
          id: 'subagent-research-002',
          agentId: 'jarvis',
          agentName: 'Jarvis (Research)',
          type: 'subagent',
          status: 'active',
          startTime: Date.now() - (30 * 60 * 1000), // 30 minutes ago
          lastActivity: Date.now() - (2 * 60 * 1000), // 2 minutes ago
          duration: 30 * 60 * 1000,
          channel: 'api',
          requester: 'main',
          currentTask: 'Market analysis research',
          messageCount: 12,
          toolCalls: 8,
          memoryUsage: 1.8,
          priority: 'normal',
          tags: ['research', 'background', 'data']
        },
        {
          id: 'background-monitoring-003',
          agentId: 'system',
          agentName: 'System Monitor',
          type: 'background',
          status: 'idle',
          startTime: Date.now() - (24 * 60 * 60 * 1000), // 24 hours ago
          lastActivity: Date.now() - (15 * 60 * 1000), // 15 minutes ago
          duration: 24 * 60 * 60 * 1000,
          channel: 'internal',
          requester: 'system',
          currentTask: 'System health monitoring',
          messageCount: 144,
          toolCalls: 67,
          memoryUsage: 0.5,
          priority: 'low',
          tags: ['system', 'monitoring', 'scheduled']
        }
      ]
      
      sessions = exampleSessions
    }
    
    // Sort by priority and activity
    sessions.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, normal: 2, low: 3 }
      const statusOrder = { active: 0, idle: 1, paused: 2, ended: 3 }
      
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff
      
      const statusDiff = statusOrder[a.status] - statusOrder[b.status]
      if (statusDiff !== 0) return statusDiff
      
      return b.lastActivity - a.lastActivity
    })
    
    // Calculate summary statistics
    const summary = {
      total: sessions.length,
      active: sessions.filter(s => s.status === 'active').length,
      idle: sessions.filter(s => s.status === 'idle').length,
      paused: sessions.filter(s => s.status === 'paused').length,
      ended: sessions.filter(s => s.status === 'ended').length,
      byType: {
        main: sessions.filter(s => s.type === 'main').length,
        subagent: sessions.filter(s => s.type === 'subagent').length,
        tool: sessions.filter(s => s.type === 'tool').length,
        background: sessions.filter(s => s.type === 'background').length
      },
      byChannel: sessions.reduce((acc: Record<string, number>, s) => {
        if (s.channel) {
          acc[s.channel] = (acc[s.channel] || 0) + 1
        }
        return acc
      }, {}),
      totalMessages: sessions.reduce((sum, s) => sum + s.messageCount, 0),
      totalToolCalls: sessions.reduce((sum, s) => sum + s.toolCalls, 0),
      averageDuration: sessions.length > 0 ? 
        sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length : 0,
      totalMemoryUsage: sessions.reduce((sum, s) => sum + (s.memoryUsage || 0), 0),
      oldestSession: sessions.length > 0 ? 
        Math.min(...sessions.map(s => s.startTime)) : null,
      mostActiveSession: sessions.length > 0 ?
        sessions.reduce((max, s) => s.messageCount > max.messageCount ? s : max).id : null
    }
    
    const response = {
      sessions,
      summary,
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Sessions API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch session data', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}