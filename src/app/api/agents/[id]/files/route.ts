import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getOpenClawWorkspace } from '@/lib/config';

// Workspace path now loaded from environment

interface FileTreeItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: string;
  content?: string;  // For small files
  children?: FileTreeItem[];
}

async function buildFileTree(dirPath: string, basePath: string = '', maxDepth: number = 3, currentDepth: number = 0): Promise<FileTreeItem[]> {
  if (currentDepth >= maxDepth) return [];
  
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const items: FileTreeItem[] = [];
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.join(basePath, entry.name);
      
      // Skip hidden files and common ignore patterns
      if (entry.name.startsWith('.') && !['AGENTS.md', 'MEMORY.md', 'SOUL.md'].includes(entry.name)) {
        continue;
      }
      
      if (entry.name.includes('node_modules') || entry.name.includes('.git')) {
        continue;
      }
      
      try {
        const stats = await fs.stat(fullPath);
        
        if (entry.isDirectory()) {
          const children = await buildFileTree(fullPath, relativePath, maxDepth, currentDepth + 1);
          items.push({
            name: entry.name,
            path: relativePath,
            type: 'directory',
            modified: stats.mtime.toISOString(),
            children
          });
        } else {
          const item: FileTreeItem = {
            name: entry.name,
            path: relativePath,
            type: 'file',
            size: stats.size,
            modified: stats.mtime.toISOString()
          };
          
          // Include content for important files and small text files
          if (
            ['AGENTS.md', 'MEMORY.md', 'SOUL.md', 'USER.md', 'TOOLS.md', 'HEARTBEAT.md'].includes(entry.name) ||
            (stats.size < 10000 && (entry.name.endsWith('.md') || entry.name.endsWith('.txt') || entry.name.endsWith('.json')))
          ) {
            try {
              const content = await fs.readFile(fullPath, 'utf-8');
              item.content = content;
            } catch {
              // Skip if can't read
            }
          }
          
          items.push(item);
        }
      } catch {
        // Skip files we can't stat
        continue;
      }
    }
    
    // Sort: directories first, then files, alphabetically
    return items.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
    
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return [];
  }
}

async function getAgentWorkspace(agentId: string) {
  // For now, we'll assume all agents use the same workspace
  // In the future, this could map to specific agent directories
  let agentDir = getOpenClawWorkspace();
  
  // Map known agent IDs to their potential workspace paths
  const agentPaths: Record<string, string> = {
    'main': getOpenClawWorkspace(),
    'manus': getOpenClawWorkspace(),
    'monica': getOpenClawWorkspace(),
    'jarvis': getOpenClawWorkspace(),
    'luna': getOpenClawWorkspace(),
  };
  
  if (agentPaths[agentId.toLowerCase()]) {
    agentDir = agentPaths[agentId.toLowerCase()];
  }
  
  return agentDir;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params;
    
    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }
    
    const agentWorkspace = await getAgentWorkspace(agentId);
    
    // Check if workspace exists
    try {
      await fs.access(agentWorkspace);
    } catch {
      return NextResponse.json(
        { error: 'Agent workspace not found' },
        { status: 404 }
      );
    }
    
    const files = await buildFileTree(agentWorkspace);
    
    // Get workspace stats
    const stats = await fs.stat(agentWorkspace);
    
    // Find key agent files
    const keyFiles = ['AGENTS.md', 'MEMORY.md', 'SOUL.md', 'USER.md', 'TOOLS.md', 'HEARTBEAT.md'];
    const foundKeyFiles: Record<string, FileTreeItem | null> = {};
    
    function findFileInTree(items: FileTreeItem[], fileName: string): FileTreeItem | null {
      for (const item of items) {
        if (item.type === 'file' && item.name === fileName) {
          return item;
        }
        if (item.type === 'directory' && item.children) {
          const found = findFileInTree(item.children, fileName);
          if (found) return found;
        }
      }
      return null;
    }
    
    keyFiles.forEach(fileName => {
      foundKeyFiles[fileName] = findFileInTree(files, fileName);
    });
    
    const response = {
      agent: {
        id: agentId,
        workspace: agentWorkspace,
        modified: stats.mtime.toISOString()
      },
      files,
      keyFiles: foundKeyFiles,
      meta: {
        totalFiles: countFiles(files),
        totalDirectories: countDirectories(files),
        lastModified: stats.mtime.toISOString(),
        hasKeyFiles: Object.values(foundKeyFiles).filter(Boolean).length
      },
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Agent Files API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent files', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function countFiles(items: FileTreeItem[]): number {
  let count = 0;
  for (const item of items) {
    if (item.type === 'file') {
      count++;
    } else if (item.children) {
      count += countFiles(item.children);
    }
  }
  return count;
}

function countDirectories(items: FileTreeItem[]): number {
  let count = 0;
  for (const item of items) {
    if (item.type === 'directory') {
      count++;
      if (item.children) {
        count += countDirectories(item.children);
      }
    }
  }
  return count;
}