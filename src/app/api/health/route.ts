import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

interface SystemHealth {
  system: {
    uptime: number
    uptimeFormatted: string
    platform: string
    arch: string
    nodeVersion: string
    nextVersion: string
    openclawVersion?: string
    hostname?: string
    loadAverage?: number[]
  }
  disk: {
    total: number
    used: number
    available: number
    usagePercent: number
    formatted: {
      total: string
      used: string
      available: string
    }
  }
  memory: {
    total: number
    used: number
    free: number
    usagePercent: number
    formatted: {
      total: string
      used: string
      free: string
    }
  }
  agents: {
    total: number
    online: number
    active: number
  }
  tasks: {
    active: number
    completed: number
  }
  cron: {
    jobs: number
  }
  timestamp: string
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  
  return parts.length > 0 ? parts.join(' ') : '< 1m'
}

async function getDiskUsage(): Promise<SystemHealth['disk']> {
  try {
    const { stdout } = await execAsync('df -h /')
    const lines = stdout.split('\n')
    const diskLine = lines[1]
    const parts = diskLine.split(/\s+/)
    
    // Parse df output: Filesystem Size Used Avail Use% Mounted
    const totalStr = parts[1]
    const usedStr = parts[2] 
    const availStr = parts[3]
    const usePercent = parseInt(parts[4].replace('%', ''))
    
    // Convert to bytes (approximate)
    const parseSize = (str: string) => {
      const num = parseFloat(str)
      if (str.includes('G')) return num * 1024 * 1024 * 1024
      if (str.includes('M')) return num * 1024 * 1024
      if (str.includes('K')) return num * 1024
      return num
    }
    
    const total = parseSize(totalStr)
    const used = parseSize(usedStr)
    const available = parseSize(availStr)
    
    return {
      total,
      used,
      available,
      usagePercent: usePercent,
      formatted: {
        total: formatBytes(total),
        used: formatBytes(used),
        available: formatBytes(available)
      }
    }
  } catch (error) {
    console.error('Error getting disk usage:', error)
    return {
      total: 0,
      used: 0,
      available: 0,
      usagePercent: 0,
      formatted: {
        total: 'Unknown',
        used: 'Unknown', 
        available: 'Unknown'
      }
    }
  }
}

async function getMemoryUsage(): Promise<SystemHealth['memory']> {
  try {
    const { stdout } = await execAsync('free -b')
    const lines = stdout.split('\n')
    const memLine = lines[1]
    const parts = memLine.split(/\s+/)
    
    const total = parseInt(parts[1])
    const used = parseInt(parts[2])
    const free = parseInt(parts[3])
    const usagePercent = Math.round((used / total) * 100)
    
    return {
      total,
      used,
      free,
      usagePercent,
      formatted: {
        total: formatBytes(total),
        used: formatBytes(used),
        free: formatBytes(free)
      }
    }
  } catch (error) {
    console.error('Error getting memory usage:', error)
    return {
      total: 0,
      used: 0,
      free: 0,
      usagePercent: 0,
      formatted: {
        total: 'Unknown',
        used: 'Unknown',
        free: 'Unknown'
      }
    }
  }
}

async function getOpenClawVersion(): Promise<string | undefined> {
  try {
    // Try to read version from package.json or config files
    const possiblePaths = [
      '/root/.openclaw/package.json',
      '/root/package.json',
      '/package.json'
    ]
    
    for (const pkgPath of possiblePaths) {
      try {
        const content = await fs.readFile(pkgPath, 'utf-8')
        const pkg = JSON.parse(content)
        if (pkg.name === 'openclaw' || pkg.name?.includes('openclaw')) {
          return pkg.version
        }
      } catch {
        // Try next path
      }
    }
    
    // Try to get version from openclaw command
    try {
      const { stdout } = await execAsync('openclaw --version')
      return stdout.trim()
    } catch {
      // Fallback to unknown
    }
    
    return undefined
  } catch (error) {
    console.error('Error getting OpenClaw version:', error)
    return undefined
  }
}

async function getAgentStats(): Promise<SystemHealth['agents']> {
  try {
    const response = await fetch('http://localhost:3000/api/agents')
    if (response.ok) {
      const data = await response.json()
      return {
        total: data.meta?.total || 0,
        online: data.meta?.online || 0,
        active: data.meta?.active || 0
      }
    }
  } catch (error) {
    console.error('Error fetching agent stats:', error)
  }
  
  return { total: 0, online: 0, active: 0 }
}

async function getTaskStats(): Promise<SystemHealth['tasks']> {
  try {
    const response = await fetch('http://localhost:3000/api/tasks')
    if (response.ok) {
      const data = await response.json()
      const active = data.tasks?.filter((t: any) => t.status === 'active').length || 0
      const completed = data.tasks?.filter((t: any) => t.status === 'completed').length || 0
      return { active, completed }
    }
  } catch (error) {
    console.error('Error fetching task stats:', error)
  }
  
  return { active: 0, completed: 0 }
}

async function getCronStats(): Promise<SystemHealth['cron']> {
  try {
    const response = await fetch('http://localhost:3000/api/cron')
    if (response.ok) {
      const data = await response.json()
      return { jobs: data.jobs?.length || 0 }
    }
  } catch (error) {
    console.error('Error fetching cron stats:', error)
  }
  
  return { jobs: 0 }
}

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Get all system health data in parallel
    const [
      diskUsage,
      memoryUsage,
      openclawVersion,
      agentStats,
      taskStats,
      cronStats
    ] = await Promise.all([
      getDiskUsage(),
      getMemoryUsage(),
      getOpenClawVersion(),
      getAgentStats(),
      getTaskStats(),
      getCronStats()
    ])
    
    // Get system info
    let loadAverage: number[] | undefined
    let hostname: string | undefined
    
    try {
      const { stdout: loadOutput } = await execAsync('cat /proc/loadavg')
      loadAverage = loadOutput.split(' ').slice(0, 3).map(parseFloat)
    } catch {
      // Load average not available
    }
    
    try {
      const { stdout: hostnameOutput } = await execAsync('hostname')
      hostname = hostnameOutput.trim()
    } catch {
      // Hostname not available
    }
    
    const health: SystemHealth = {
      system: {
        uptime: process.uptime(),
        uptimeFormatted: formatUptime(process.uptime()),
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        nextVersion: process.env.npm_package_dependencies_next || 'unknown',
        openclawVersion,
        hostname,
        loadAverage
      },
      disk: diskUsage,
      memory: memoryUsage,
      agents: agentStats,
      tasks: taskStats,
      cron: cronStats,
      timestamp: new Date().toISOString()
    }
    
    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      ...health,
      meta: {
        responseTime,
        healthy: diskUsage.usagePercent < 90 && memoryUsage.usagePercent < 90
      }
    })
    
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      { 
        error: 'Health check failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}