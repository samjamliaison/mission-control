import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getOpenClawWorkspace } from '@/lib/config';

interface MemoryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'daily' | 'longterm' | 'section';
  tags: string[];
  wordCount: number;
}

async function readLongTermMemory(): Promise<MemoryEntry[]> {
  const entries: MemoryEntry[] = [];
  const memoryPath = path.join(getOpenClawWorkspace(), 'MEMORY.md');

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
  const memoryDir = path.join(getOpenClawWorkspace(), 'memory');

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, type = 'daily', date } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const now = new Date();
    const memoryDate = date || now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timestamp = now.toISOString();

    if (type === 'daily') {
      // Write to daily memory file
      const memoryDir = path.join(getOpenClawWorkspace(), 'memory');
      await fs.mkdir(memoryDir, { recursive: true });
      
      const dailyFile = path.join(memoryDir, `${memoryDate}.md`);
      
      // Check if file exists to determine if we need a header
      let needsHeader = false;
      try {
        await fs.access(dailyFile);
      } catch {
        needsHeader = true;
      }
      
      const entry = `
${needsHeader ? `# Daily Memory - ${memoryDate}\n` : ''}
## ${title} (${now.toTimeString().split(' ')[0]})

${content}

---
`;
      
      await fs.appendFile(dailyFile, entry);
      
      return NextResponse.json({
        success: true,
        type: 'daily',
        file: `memory/${memoryDate}.md`,
        message: `Memory saved to daily file for ${memoryDate}`
      });
      
    } else if (type === 'longterm') {
      // Append to MEMORY.md
      const memoryFile = path.join(getOpenClawWorkspace(), 'MEMORY.md');
      
      const entry = `
## ${title}

${content}

*Added: ${timestamp}*

`;
      
      await fs.appendFile(memoryFile, entry);
      
      return NextResponse.json({
        success: true,
        type: 'longterm',
        file: 'MEMORY.md',
        message: 'Memory saved to long-term memory'
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid memory type. Use "daily" or "longterm"' },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('Memory POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to save memory', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}