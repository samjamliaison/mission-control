/**
 * Export utilities for Mission Control data
 */

import { Task } from "@/components/tasks/task-card"
import { ContentItem } from "@/types/content"

// Convert tasks to CSV format
export function exportTasksAsCSV(tasks: Task[]): string {
  const headers = [
    'ID',
    'Title',
    'Description', 
    'Assignee',
    'Status',
    'Priority',
    'Due Date',
    'Created At',
    'Updated At'
  ]

  const csvRows = [headers.join(',')]
  
  tasks.forEach(task => {
    const row = [
      task._id,
      `"${task.title.replace(/"/g, '""')}"`,
      `"${task.description.replace(/"/g, '""')}"`,
      task.assignee,
      task.status,
      task.priority,
      task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '',
      new Date(task.createdAt).toLocaleDateString(),
      new Date(task.updatedAt).toLocaleDateString()
    ]
    csvRows.push(row.join(','))
  })
  
  return csvRows.join('\n')
}

// Convert tasks to JSON format
export function exportTasksAsJSON(tasks: Task[]): string {
  const exportData = {
    exportedAt: new Date().toISOString(),
    exportType: 'tasks',
    totalCount: tasks.length,
    data: tasks.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt).toISOString(),
      updatedAt: new Date(task.updatedAt).toISOString(),
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null
    }))
  }
  
  return JSON.stringify(exportData, null, 2)
}

// Convert pipeline content to JSON format
export function exportPipelineAsJSON(content: ContentItem[]): string {
  const exportData = {
    exportedAt: new Date().toISOString(),
    exportType: 'pipeline',
    totalCount: content.length,
    statusBreakdown: content.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    data: content.map(item => ({
      ...item,
      createdAt: new Date(item.createdAt).toISOString(),
      updatedAt: new Date(item.updatedAt).toISOString()
    }))
  }
  
  return JSON.stringify(exportData, null, 2)
}

// Trigger file download
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  
  // Cleanup
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Generate filename with timestamp
export function generateFilename(prefix: string, extension: string): string {
  const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  return `${prefix}-${timestamp}.${extension}`
}