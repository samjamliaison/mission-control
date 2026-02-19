import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface MemoryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'daily' | 'longterm' | 'section';
  tags: string[];
  wordCount: number;
}

const OPENCLAW_WORKSPACE = '/root/.openclaw/workspace';

async function readLongTermMemory(): Promise<MemoryEntry[]> {
  const entries: MemoryEntry[] = [];
  const memoryPath = path.join(OPENCLAW_WORKSPACE, 'MEMORY.md');
  
  try {
    const content = await fs.readFile(memoryPath, 'utf-8');
    const lines = content.split('\n');
    let currentSection = '';
    let currentContent: string[] = [];
    let sectionIndex = 0;
    
    for (const line of lines) {
      if (line.startsWith('## ')) {
        // Save previous section
        if (currentSection && currentContent.length > 0) {
          const sectionContent = currentContent.join('\n').trim();
          entries.push({
            id: `longterm-${sectionIndex}`,
            title: currentSection,
            content: sectionContent,
            date: new Date().toISOString().split('T')[0],
            type: 'section',
            tags: extractTags(currentSection + ' ' + sectionContent),
            wordCount: sectionContent.split(/\s+/).length
          });
          sectionIndex++;
        }
        
        // Start new section
        currentSection = line.replace('## ', '').trim();
        currentContent = [];
      } else if (line.startsWith('# ')) {
        // Skip main title
        continue;
      } else if (line.trim()) {
        currentContent.push(line);
      }
    }
    
    // Don't forget the last section
    if (currentSection && currentContent.length > 0) {
      const sectionContent = currentContent.join('\n').trim();
      entries.push({
        id: `longterm-${sectionIndex}`,
        title: currentSection,
        content: sectionContent,
        date: new Date().toISOString().split('T')[0],
        type: 'section',
        tags: extractTags(currentSection + ' ' + sectionContent),
        wordCount: sectionContent.split(/\s+/).length
      });
    }
  } catch (error) {
    console.error('Failed to read MEMORY.md:', error);
  }
  
  return entries;
}

async function readDailyMemories(): Promise<MemoryEntry[]> {
  const entries: MemoryEntry[] = [];
  const memoryDir = path.join(OPENCLAW_WORKSPACE, 'memory');
  
  try {
    const files = await fs.readdir(memoryDir);
    const mdFiles = files
      .filter(f => f.endsWith('.md') && f.match(/^\d{4}-\d{2}-\d{2}\.md$/))
      .sort()
      .reverse(); // Most recent first
    
    for (const file of mdFiles) {
      const filePath = path.join(memoryDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const date = file.replace('.md', '');
      
      // Extract title from first line or use date
      const lines = content.split('\n');
      const title = lines[0]?.startsWith('# ') 
        ? lines[0].replace('# ', '').trim()
        : `Daily Memory - ${date}`;
      
      const bodyContent = lines[0]?.startsWith('# ') 
        ? lines.slice(1).join('\n').trim()
        : content.trim();
      
      entries.push({
        id: `daily-${date}`,
        title,
        content: bodyContent,
        date,
        type: 'daily',
        tags: extractTags(content),
        wordCount: bodyContent.split(/\s+/).filter(word => word.length > 0).length
      });
    }
  } catch (error) {
    console.error('Failed to read daily memory files:', error);
  }
  
  return entries;
}

function extractTags(content: string): string[] {
  const tags = new Set<string>();
  const text = content.toLowerCase();
  
  // Common tech/project tags
  const techTerms = ['telegram', 'api', 'bot', 'cron', 'github', 'mission-control', 'agent', 'openclaw'];
  techTerms.forEach(term => {
    if (text.includes(term)) tags.add(term);
  });
  
  // Agent names
  const agents = ['monica', 'jarvis', 'luna', 'manus'];
  agents.forEach(agent => {
    if (text.includes(agent)) tags.add(agent);
  });
  
  // Status indicators
  if (text.includes('error') || text.includes('failed')) tags.add('error');
  if (text.includes('success') || text.includes('completed')) tags.add('success');
  if (text.includes('todo') || text.includes('task')) tags.add('todo');
  if (text.includes('urgent') || text.includes('important')) tags.add('urgent');
  
  // Location/context
  if (text.includes('oslo') || text.includes('norway')) tags.add('location');
  if (text.includes('travel')) tags.add('travel');
  if (text.includes('research')) tags.add('research');
  
  return Array.from(tags);
}

export async function GET(request: NextRequest) {
  try {
    const [longTermEntries, dailyEntries] = await Promise.all([
      readLongTermMemory(),
      readDailyMemories()
    ]);
    
    const allEntries = [...longTermEntries, ...dailyEntries];
    
    // Sort by date/importance
    allEntries.sort((a, b) => {
      if (a.type === 'longterm' && b.type === 'daily') return -1;
      if (a.type === 'daily' && b.type === 'longterm') return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    const response = {
      memories: allEntries,
      meta: {
        total: allEntries.length,
        byType: {
          longterm: longTermEntries.length,
          daily: dailyEntries.length,
          section: longTermEntries.filter(e => e.type === 'section').length
        },
        totalWords: allEntries.reduce((sum, entry) => sum + entry.wordCount, 0),
        latestDaily: dailyEntries[0]?.date || null,
        allTags: Array.from(new Set(allEntries.flatMap(e => e.tags))).sort()
      },
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Memory API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memories', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}