import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Interface for OpenClaw config structure
interface OpenClawConfig {
  agents?: {
    list?: Array<{
      id: string;
      name?: string;
      workspace?: string;
      identity?: {
        name?: string;
        emoji?: string;
      };
    }>;
  };
  cron?: {
    jobs?: Array<{
      id?: string;
      name?: string;
      schedule?: string;
      command?: string;
      enabled?: boolean;
    }>;
  };
}

// Task interface
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  created: string;
  assignee?: string;
  tags: string[];
  source: 'memory' | 'cron' | 'agent';
}

const OPENCLAW_WORKSPACE = '/root/.openclaw/workspace';
const OPENCLAW_CONFIG = '/root/.openclaw/openclaw.json';

async function readOpenClawConfig(): Promise<OpenClawConfig | null> {
  try {
    const configData = await fs.readFile(OPENCLAW_CONFIG, 'utf-8');
    return JSON.parse(configData);
  } catch (error) {
    console.error('Failed to read OpenClaw config:', error);
    return null;
  }
}

async function readMemoryFiles(): Promise<Task[]> {
  const tasks: Task[] = [];
  const memoryDir = path.join(OPENCLAW_WORKSPACE, 'memory');

  try {
    // Read MEMORY.md
    const memoryPath = path.join(OPENCLAW_WORKSPACE, 'MEMORY.md');
    try {
      const memoryContent = await fs.readFile(memoryPath, 'utf-8');

      // Extract key information as tasks
      const sections = memoryContent.split('\n## ').slice(1); // Skip title
      sections.forEach((section, index) => {
        const lines = section.split('\n');
        const sectionTitle = lines[0];
        const content = lines.slice(1).join('\n').trim();

        if (content.length > 50) { // Only create tasks for substantial sections
          tasks.push({
            id: `memory-main-${index}`,
            title: `Memory: ${sectionTitle}`,
            description: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
            status: 'done',
            priority: 'medium',
            created: new Date().toISOString(),
            tags: ['memory', 'knowledge'],
            source: 'memory'
          });
        }
      });
    } catch (error) {
      console.warn('MEMORY.md not found or readable');
    }

    // Read daily memory files
    const files = await fs.readdir(memoryDir);
    const mdFiles = files.filter(f => f.endsWith('.md')).sort();

    for (const file of mdFiles.slice(-3)) { // Last 3 files only
      const filePath = path.join(memoryDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const date = file.replace('.md', '');

      // Parse content for action items or important notes
      const lines = content.split('\n');
      let currentTask = '';
      let taskLines: string[] = [];

      lines.forEach(line => {
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          if (currentTask && taskLines.length > 0) {
            // Create task from previous item
            tasks.push({
              id: `memory-${date}-${tasks.length}`,
              title: currentTask,
              description: taskLines.join('\n').trim(),
              status: line.toLowerCase().includes('done') ? 'done' : 'todo',
              priority: line.toLowerCase().includes('urgent') ? 'high' : 'low',
              created: new Date(date + 'T12:00:00Z').toISOString(),
              tags: ['daily', 'memory'],
              source: 'memory'
            });
          }
          currentTask = line.replace(/^[-*]\s*/, '').trim();
          taskLines = [];
        } else if (line.trim() && currentTask) {
          taskLines.push(line.trim());
        }
      });

      // Don't forget the last task
      if (currentTask && taskLines.length > 0) {
        tasks.push({
          id: `memory-${date}-final`,
          title: currentTask,
          description: taskLines.join('\n').trim(),
          status: 'todo',
          priority: 'low',
          created: new Date(date + 'T12:00:00Z').toISOString(),
          tags: ['daily', 'memory'],
          source: 'memory'
        });
      }
    }
  } catch (error) {
    console.error('Failed to read memory files:', error);
  }

  return tasks;
}

async function readCronJobs(): Promise<Task[]> {
  const tasks: Task[] = [];

  try {
    const config = await readOpenClawConfig();
    if (config?.cron?.jobs) {
      config.cron.jobs.forEach((job, index) => {
        tasks.push({
          id: `cron-${job.id || index}`,
          title: job.name || `Cron Job ${index + 1}`,
          description: `Schedule: ${job.schedule || 'Unknown'}\nCommand: ${job.command || 'Unknown'}`,
          status: job.enabled === false ? 'todo' : 'in-progress',
          priority: 'medium',
          created: new Date().toISOString(),
          tags: ['cron', 'automation'],
          source: 'cron'
        });
      });
    }
  } catch (error) {
    console.error('Failed to read cron jobs:', error);
  }

  return tasks;
}

async function readAgentWorkspaces(): Promise<Task[]> {
  const tasks: Task[] = [];

  try {
    const config = await readOpenClawConfig();
    if (config?.agents?.list) {
      for (const agent of config.agents.list) {
        if (agent.workspace && agent.id !== 'main') {
          try {
            // Check if agent workspace exists
            const soulPath = path.join(agent.workspace, 'SOUL.md');
            try {
              const soulContent = await fs.readFile(soulPath, 'utf-8');
              tasks.push({
                id: `agent-${agent.id}`,
                title: `Agent: ${agent.identity?.name || agent.name || agent.id}`,
                description: soulContent.substring(0, 200) + (soulContent.length > 200 ? '...' : ''),
                status: 'in-progress',
                priority: 'high',
                created: new Date().toISOString(),
                assignee: agent.identity?.name || agent.name || agent.id,
                tags: ['agent', agent.id],
                source: 'agent'
              });
            } catch {
              // No SOUL.md, create basic task
              tasks.push({
                id: `agent-${agent.id}`,
                title: `Agent: ${agent.identity?.name || agent.name || agent.id}`,
                description: `Agent workspace: ${agent.workspace}`,
                status: 'todo',
                priority: 'medium',
                created: new Date().toISOString(),
                assignee: agent.identity?.name || agent.name || agent.id,
                tags: ['agent', agent.id],
                source: 'agent'
              });
            }
          } catch (error) {
            console.warn(`Failed to read agent ${agent.id} workspace:`, error);
          }
        }
      }
    }
  } catch (error) {
    console.error('Failed to read agent workspaces:', error);
  }

  return tasks;
}

export async function GET(request: NextRequest) {
  try {
    // Read all task sources
    const [memoryTasks, cronTasks, agentTasks] = await Promise.all([
      readMemoryFiles(),
      readCronJobs(),
      readAgentWorkspaces()
    ]);

    // Combine all tasks
    const allTasks = [...memoryTasks, ...cronTasks, ...agentTasks];

    // Add some metadata
    const response = {
      tasks: allTasks,
      meta: {
        total: allTasks.length,
        bySource: {
          memory: memoryTasks.length,
          cron: cronTasks.length,
          agent: agentTasks.length
        },
        byStatus: {
          todo: allTasks.filter(t => t.status === 'todo').length,
          'in-progress': allTasks.filter(t => t.status === 'in-progress').length,
          done: allTasks.filter(t => t.status === 'done').length
        }
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}