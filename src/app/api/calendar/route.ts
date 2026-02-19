import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end?: string;
  type: 'cron' | 'scheduled' | 'reminder';
  status: 'active' | 'inactive' | 'completed';
  recurrence?: string;
  priority: 'low' | 'medium' | 'high';
  agent?: string;
}

interface OpenClawConfig {
  cron?: {
    jobs?: Array<{
      id?: string;
      name?: string;
      description?: string;
      schedule?: string;
      command?: string;
      enabled?: boolean;
      agent?: string;
      timeout?: number;
    }>;
  };
}

const OPENCLAW_CONFIG = '/root/.openclaw/openclaw.json';

// Parse cron expression to next run time (simplified)
function parseNextRun(cronExpression: string): Date {
  // This is a simplified parser for demonstration
  // In production, you'd want to use a proper cron parser library
  const now = new Date();
  const nextRun = new Date(now.getTime() + 60 * 60 * 1000); // Default to 1 hour from now
  
  try {
    const parts = cronExpression.split(' ');
    if (parts.length >= 5) {
      const [minute, hour, day, month, weekday] = parts;
      
      // Handle specific hour/minute combinations
      if (hour !== '*' && minute !== '*') {
        const targetHour = parseInt(hour);
        const targetMinute = parseInt(minute);
        
        const target = new Date();
        target.setHours(targetHour, targetMinute, 0, 0);
        
        // If time has passed today, schedule for tomorrow
        if (target <= now) {
          target.setDate(target.getDate() + 1);
        }
        
        return target;
      }
    }
  } catch (error) {
    console.warn('Failed to parse cron expression:', cronExpression);
  }
  
  return nextRun;
}

// Convert cron expression to human readable
function cronToHuman(cronExpression: string): string {
  try {
    const parts = cronExpression.split(' ');
    if (parts.length >= 5) {
      const [minute, hour, day, month, weekday] = parts;
      
      if (minute === '*' && hour === '*') return 'Every minute';
      if (minute !== '*' && hour !== '*' && day === '*' && month === '*' && weekday === '*') {
        return `Daily at ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
      }
      if (minute !== '*' && hour !== '*' && weekday !== '*') {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName = days[parseInt(weekday)] || `Day ${weekday}`;
        return `${dayName} at ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
      }
      if (hour !== '*' && minute !== '*') {
        return `At ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
      }
    }
  } catch (error) {
    console.warn('Failed to convert cron to human readable:', cronExpression);
  }
  
  return cronExpression; // Fallback to raw expression
}

async function readOpenClawConfig(): Promise<OpenClawConfig | null> {
  try {
    const configData = await fs.readFile(OPENCLAW_CONFIG, 'utf-8');
    return JSON.parse(configData);
  } catch (error) {
    console.error('Failed to read OpenClaw config:', error);
    return null;
  }
}

async function getCronEvents(): Promise<CalendarEvent[]> {
  const events: CalendarEvent[] = [];
  
  try {
    const config = await readOpenClawConfig();
    
    if (config?.cron?.jobs) {
      config.cron.jobs.forEach((job, index) => {
        const jobId = job.id || `job-${index}`;
        const schedule = job.schedule || '0 * * * *'; // Default hourly
        const nextRun = parseNextRun(schedule);
        const humanSchedule = cronToHuman(schedule);
        
        events.push({
          id: `cron-${jobId}`,
          title: job.name || `Cron Job ${index + 1}`,
          description: `${job.description || job.command || 'No description'}\nSchedule: ${humanSchedule}`,
          start: nextRun.toISOString(),
          type: 'cron',
          status: job.enabled === false ? 'inactive' : 'active',
          recurrence: humanSchedule,
          priority: job.name?.toLowerCase().includes('urgent') ? 'high' : 'medium',
          agent: job.agent || 'system'
        });
      });
    }
    
    // Add some known system events based on the MEMORY.md content
    const now = new Date();
    
    // Daily email cron (from MEMORY.md: Daily cron: Email adam@bereceptive.ai re: Hamza's agreement, 9am Oslo, job ID ef307e3e)
    const dailyEmail = new Date();
    dailyEmail.setHours(9, 0, 0, 0); // 9 AM
    if (dailyEmail <= now) {
      dailyEmail.setDate(dailyEmail.getDate() + 1);
    }
    
    events.push({
      id: 'daily-email-ef307e3e',
      title: 'Daily Agreement Email',
      description: 'Email adam@bereceptive.ai regarding Hamza\'s agreement',
      start: dailyEmail.toISOString(),
      type: 'cron',
      status: 'active',
      recurrence: 'Daily at 09:00',
      priority: 'high',
      agent: 'main'
    });
    
    // X/Twitter engagement tracking (from MEMORY.md: hourly browser check on tweets, job ID 7fdec22d)
    const nextTwitterCheck = new Date();
    nextTwitterCheck.setMinutes(0, 0, 0); // Top of the hour
    nextTwitterCheck.setHours(nextTwitterCheck.getHours() + 1);
    
    events.push({
      id: 'twitter-engagement-7fdec22d',
      title: 'Twitter Engagement Check',
      description: 'Hourly browser check on @ihamzafer tweets for engagement tracking',
      start: nextTwitterCheck.toISOString(),
      type: 'cron',
      status: 'active',
      recurrence: 'Hourly',
      priority: 'medium',
      agent: 'main'
    });
    
  } catch (error) {
    console.error('Failed to read cron jobs:', error);
  }
  
  return events;
}

// Generate some upcoming scheduled events for the next week
function generateUpcomingEvents(): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const now = new Date();
  
  // Weekly mission review
  const weeklyReview = new Date();
  weeklyReview.setDate(now.getDate() + (7 - now.getDay())); // Next Sunday
  weeklyReview.setHours(20, 0, 0, 0);
  
  events.push({
    id: 'weekly-review',
    title: 'Weekly Mission Review',
    description: 'Review completed tasks, assess progress, and plan for next week',
    start: weeklyReview.toISOString(),
    type: 'scheduled',
    status: 'active',
    priority: 'high',
    agent: 'main'
  });
  
  // System maintenance reminder
  const maintenance = new Date();
  maintenance.setDate(now.getDate() + 3);
  maintenance.setHours(2, 0, 0, 0); // 2 AM for low impact
  
  events.push({
    id: 'system-maintenance',
    title: 'System Maintenance Window',
    description: 'Check logs, update dependencies, clean up old files',
    start: maintenance.toISOString(),
    type: 'reminder',
    status: 'active',
    priority: 'medium',
    agent: 'main'
  });
  
  return events;
}

export async function GET(request: NextRequest) {
  try {
    const [cronEvents, upcomingEvents] = await Promise.all([
      getCronEvents(),
      Promise.resolve(generateUpcomingEvents())
    ]);
    
    const allEvents = [...cronEvents, ...upcomingEvents];
    
    // Sort by start time
    allEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    
    const response = {
      events: allEvents,
      meta: {
        total: allEvents.length,
        byType: {
          cron: cronEvents.length,
          scheduled: upcomingEvents.filter(e => e.type === 'scheduled').length,
          reminder: upcomingEvents.filter(e => e.type === 'reminder').length
        },
        byStatus: {
          active: allEvents.filter(e => e.status === 'active').length,
          inactive: allEvents.filter(e => e.status === 'inactive').length,
          completed: allEvents.filter(e => e.status === 'completed').length
        },
        nextEvent: allEvents.find(e => new Date(e.start) > new Date())?.start || null
      },
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Calendar API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calendar events', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}