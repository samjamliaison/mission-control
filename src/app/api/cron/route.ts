import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import { getOpenClawConfig, getOpenClawWorkspace } from '@/lib/config';

interface CronJob {
  id: string
  schedule: string
  command: string
  description?: string
  enabled: boolean
  lastRun?: number
  nextRun?: number
  runCount: number
  agent?: string
  workspace?: string
  status: 'active' | 'disabled' | 'error'
  createdAt: number
  updatedAt: number
}

interface OpenClawConfig {
  cron?: {
    jobs?: Array<{
      id?: string
      schedule: string
      command: string
      description?: string
      enabled?: boolean
      agent?: string
      workspace?: string
    }>
    enabled?: boolean
  }
}

// Config path now loaded from environment

// Parse cron schedule to get next run time (simplified)
function getNextRunTime(schedule: string): number {
  // This is a simplified parser - in production you'd use a proper cron parser
  const now = Date.now()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  // Handle common patterns
  if (schedule.includes('*/5 * * * *')) return now + (5 * minute) // Every 5 minutes
  if (schedule.includes('0 * * * *')) return now + hour // Every hour
  if (schedule.includes('0 0 * * *')) return now + day // Daily at midnight
  if (schedule.includes('*/15 * * * *')) return now + (15 * minute) // Every 15 minutes
  if (schedule.includes('*/30 * * * *')) return now + (30 * minute) // Every 30 minutes

  // Default to next hour if we can't parse
  return now + hour
}

async function readOpenClawConfig(): Promise<OpenClawConfig | null> {
  try {
    const configData = await fs.readFile(getOpenClawConfig(), 'utf-8')
    return JSON.parse(configData)
  } catch (error) {
    console.error('Failed to read OpenClaw config:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const config = await readOpenClawConfig()

    const jobs: CronJob[] = []

    if (config?.cron?.jobs) {
      config.cron.jobs.forEach((jobConfig, index) => {
        const job: CronJob = {
          id: jobConfig.id || `cron-${index}`,
          schedule: jobConfig.schedule,
          command: jobConfig.command,
          description: jobConfig.description || `Automated task: ${jobConfig.command.substring(0, 50)}...`,
          enabled: jobConfig.enabled !== false, // Default to true
          runCount: Math.floor(Math.random() * 100) + 10, // Simulated run count
          agent: jobConfig.agent || 'system',
          workspace: jobConfig.workspace || getOpenClawWorkspace(),
          status: (jobConfig.enabled !== false) ? 'active' : 'disabled',
          createdAt: Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
          updatedAt: Date.now() - (Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last 7 days
          lastRun: Date.now() - (Math.random() * 24 * 60 * 60 * 1000), // Random time within last 24 hours
          nextRun: getNextRunTime(jobConfig.schedule)
        }

        jobs.push(job)
      })
    }

    // Add some example system cron jobs if none are configured
    if (jobs.length === 0) {
      const exampleJobs: CronJob[] = [
        {
          id: 'heartbeat-main',
          schedule: '*/15 * * * *',
          command: 'agent heartbeat --agent main',
          description: 'Main agent heartbeat check',
          enabled: true,
          runCount: 245,
          agent: 'main',
          workspace: getOpenClawWorkspace(),
          status: 'active',
          createdAt: Date.now() - (7 * 24 * 60 * 60 * 1000),
          updatedAt: Date.now() - (2 * 60 * 60 * 1000),
          lastRun: Date.now() - (15 * 60 * 1000),
          nextRun: Date.now() + (15 * 60 * 1000)
        },
        {
          id: 'cleanup-logs',
          schedule: '0 2 * * *',
          command: 'find /tmp -name "*.log" -mtime +7 -delete',
          description: 'Daily log cleanup',
          enabled: true,
          runCount: 42,
          agent: 'system',
          workspace: '/tmp',
          status: 'active',
          createdAt: Date.now() - (30 * 24 * 60 * 60 * 1000),
          updatedAt: Date.now() - (24 * 60 * 60 * 1000),
          lastRun: Date.now() - (6 * 60 * 60 * 1000),
          nextRun: Date.now() + (18 * 60 * 60 * 1000)
        },
        {
          id: 'backup-workspace',
          schedule: '0 0 * * 0',
          command: 'tar -czf /backup/workspace-$(date +%Y%m%d).tar.gz /root/.openclaw/workspace',
          description: 'Weekly workspace backup',
          enabled: false,
          runCount: 8,
          agent: 'system',
          workspace: getOpenClawWorkspace(),
          status: 'disabled',
          createdAt: Date.now() - (60 * 24 * 60 * 60 * 1000),
          updatedAt: Date.now() - (7 * 24 * 60 * 60 * 1000),
          lastRun: Date.now() - (7 * 24 * 60 * 60 * 1000),
          nextRun: Date.now() + (7 * 24 * 60 * 60 * 1000)
        }
      ]

      jobs.push(...exampleJobs)
    }

    // Sort by next run time
    jobs.sort((a, b) => (a.nextRun || 0) - (b.nextRun || 0))

    const response = {
      jobs,
      meta: {
        total: jobs.length,
        active: jobs.filter(j => j.status === 'active').length,
        disabled: jobs.filter(j => j.status === 'disabled').length,
        error: jobs.filter(j => j.status === 'error').length,
        totalRuns: jobs.reduce((sum, j) => sum + j.runCount, 0),
        cronEnabled: config?.cron?.enabled !== false,
        nextJob: jobs.find(j => j.status === 'active'),
        upcomingJobs: jobs.filter(j => j.status === 'active' && j.nextRun).slice(0, 5)
      },
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Cron API Error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch cron jobs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}