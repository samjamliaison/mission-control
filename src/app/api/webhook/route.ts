// TODO: Add rate limiting - consider 50 requests/minute per IP for webhook endpoints  
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface OpenClawEvent {
  id: string
  type: 'task_complete' | 'agent_start' | 'cron_run' | 'error' | 'agent_message' | 'system_alert'
  timestamp: string
  agent?: string
  message: string
  data?: Record<string, any>
  severity?: 'info' | 'warning' | 'error' | 'success'
  source?: string
  duration?: number
  metadata?: Record<string, any>
}

interface EventStore {
  events: OpenClawEvent[]
  meta: {
    totalEvents: number
    lastUpdated: string
    eventTypes: Record<string, number>
  }
}

const DATA_DIR = path.join(process.cwd(), 'data')
const EVENTS_FILE = path.join(DATA_DIR, 'events.json')
const MAX_EVENTS = 1000 // Keep only the most recent 1000 events

async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    console.error('Failed to create data directory:', error)
  }
}

async function loadEvents(): Promise<EventStore> {
  try {
    const content = await fs.readFile(EVENTS_FILE, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    // File doesn't exist or is invalid, return empty store
    return {
      events: [],
      meta: {
        totalEvents: 0,
        lastUpdated: new Date().toISOString(),
        eventTypes: {}
      }
    }
  }
}

async function saveEvents(store: EventStore): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(EVENTS_FILE, JSON.stringify(store, null, 2))
}

function validateEvent(data: any): OpenClawEvent | null {
  // Generate ID if not provided
  if (!data.id) {
    data.id = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  // Validate required fields
  if (!data.type || !data.message) {
    return null
  }
  
  // Ensure timestamp
  if (!data.timestamp) {
    data.timestamp = new Date().toISOString()
  }
  
  // Validate event type
  const validTypes = ['task_complete', 'agent_start', 'cron_run', 'error', 'agent_message', 'system_alert']
  if (!validTypes.includes(data.type)) {
    return null
  }
  
  // Set default severity
  if (!data.severity) {
    switch (data.type) {
      case 'error':
        data.severity = 'error'
        break
      case 'task_complete':
        data.severity = 'success'
        break
      case 'system_alert':
        data.severity = 'warning'
        break
      default:
        data.severity = 'info'
        break
    }
  }
  
  return {
    id: data.id,
    type: data.type,
    timestamp: data.timestamp,
    agent: data.agent,
    message: data.message,
    data: data.data,
    severity: data.severity,
    source: data.source || 'openclaw',
    duration: data.duration,
    metadata: data.metadata
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle single event or array of events
    const events = Array.isArray(body) ? body : [body]
    
    const validEvents: OpenClawEvent[] = []
    
    for (const eventData of events) {
      const validatedEvent = validateEvent(eventData)
      if (validatedEvent) {
        validEvents.push(validatedEvent)
      }
    }
    
    if (validEvents.length === 0) {
      return NextResponse.json(
        { error: 'No valid events provided' },
        { status: 400 }
      )
    }
    
    // Load existing events
    const store = await loadEvents()
    
    // Add new events
    store.events.push(...validEvents)
    
    // Sort by timestamp (most recent first)
    store.events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    // Trim to max events
    if (store.events.length > MAX_EVENTS) {
      store.events = store.events.slice(0, MAX_EVENTS)
    }
    
    // Update metadata
    store.meta.totalEvents = store.events.length
    store.meta.lastUpdated = new Date().toISOString()
    
    // Count event types
    store.meta.eventTypes = store.events.reduce((counts, event) => {
      counts[event.type] = (counts[event.type] || 0) + 1
      return counts
    }, {} as Record<string, number>)
    
    // Save events
    await saveEvents(store)
    
    return NextResponse.json({
      success: true,
      message: `Successfully stored ${validEvents.length} event(s)`,
      eventsReceived: validEvents.length,
      totalEvents: store.events.length,
      eventIds: validEvents.map(e => e.id)
    })
    
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process webhook', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const type = url.searchParams.get('type')
    const agent = url.searchParams.get('agent')
    const severity = url.searchParams.get('severity')
    
    const store = await loadEvents()
    
    let filteredEvents = store.events
    
    // Apply filters
    if (type) {
      filteredEvents = filteredEvents.filter(e => e.type === type)
    }
    
    if (agent) {
      filteredEvents = filteredEvents.filter(e => e.agent === agent)
    }
    
    if (severity) {
      filteredEvents = filteredEvents.filter(e => e.severity === severity)
    }
    
    // Limit results
    if (limit > 0) {
      filteredEvents = filteredEvents.slice(0, limit)
    }
    
    return NextResponse.json({
      events: filteredEvents,
      meta: {
        ...store.meta,
        filtered: filteredEvents.length,
        filters: { type, agent, severity, limit }
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch events', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}