"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <Card className={cn("flex flex-col items-center justify-center p-12 text-center max-w-md mx-auto", className)}>
      <div className="relative mb-6">
        {/* Floating background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="relative text-6xl animate-float">
          {icon}
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-3">
        {title}
      </h3>
      
      <p className="text-white/60 leading-relaxed mb-8">
        {description}
      </p>
      
      {action && (
        <Button 
          onClick={action.onClick}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0"
        >
          {action.label}
        </Button>
      )}
    </Card>
  )
}

// Specific empty states for different pages
interface TasksEmptyStateProps {
  onAddTask: () => void
}

export function TasksEmptyState({ onAddTask }: TasksEmptyStateProps) {
  return (
    <EmptyState
      icon="✅"
      title="No tasks yet"
      description="Start organizing your work and boost productivity. Create your first task to get things moving."
      action={{
        label: "Create First Task",
        onClick: onAddTask
      }}
    />
  )
}

interface AgentsEmptyStateProps {
  onAddAgent: () => void
}

export function AgentsEmptyState({ onAddAgent }: AgentsEmptyStateProps) {
  return (
    <EmptyState
      icon="🤖"
      title="No agents deployed"
      description="Deploy AI agents to automate your workflows. Your digital workforce is ready to get started."
      action={{
        label: "Deploy First Agent",
        onClick: onAddAgent
      }}
    />
  )
}

interface CalendarEmptyStateProps {
  onAddEvent: () => void
}

export function CalendarEmptyState({ onAddEvent }: CalendarEmptyStateProps) {
  return (
    <EmptyState
      icon="📅"
      title="No events scheduled"
      description="Keep track of important meetings and deadlines. Schedule your first event to start planning."
      action={{
        label: "Add Event",
        onClick: onAddEvent
      }}
    />
  )
}

interface MemoryEmptyStateProps {
  onAddMemory: () => void
}

export function MemoryEmptyState({ onAddMemory }: MemoryEmptyStateProps) {
  return (
    <EmptyState
      icon="🧠"
      title="No memories stored"
      description="Capture important knowledge and insights. Store your first memory to build your knowledge base."
      action={{
        label: "Save First Memory",
        onClick: onAddMemory
      }}
    />
  )
}

interface PipelineEmptyStateProps {
  onAddContent: () => void
}

export function PipelineEmptyState({ onAddContent }: PipelineEmptyStateProps) {
  return (
    <EmptyState
      icon="🔄"
      title="No content in pipeline"
      description="Start building your content workflow. Add items to track progress from idea to completion."
      action={{
        label: "Add Content",
        onClick: onAddContent
      }}
    />
  )
}

interface AnalyticsEmptyStateProps {
  onStartTracking: () => void
}

export function AnalyticsEmptyState({ onStartTracking }: AnalyticsEmptyStateProps) {
  return (
    <EmptyState
      icon="📊"
      title="No data to analyze"
      description="Analytics will appear here as you use Mission Control. Start using features to generate insights."
      action={{
        label: "Explore Dashboard",
        onClick: onStartTracking
      }}
    />
  )
}

interface NotificationsEmptyStateProps {
  onEnableNotifications: () => void
}

export function NotificationsEmptyState({ onEnableNotifications }: NotificationsEmptyStateProps) {
  return (
    <EmptyState
      icon="🔔"
      title="No notifications"
      description="You're all caught up! Notifications for important updates and alerts will appear here."
      action={{
        label: "Notification Settings",
        onClick: onEnableNotifications
      }}
    />
  )
}

interface StarredEmptyStateProps {
  onExploreContent: () => void
}

export function StarredEmptyState({ onExploreContent }: StarredEmptyStateProps) {
  return (
    <EmptyState
      icon="⭐"
      title="No starred items"
      description="Star important tasks, memories, or content to quickly access them later. Nothing starred yet."
      action={{
        label: "Explore Content",
        onClick: onExploreContent
      }}
    />
  )
}

interface OfficeEmptyStateProps {
  onStartOffice: () => void
}

export function OfficeEmptyState({ onStartOffice }: OfficeEmptyStateProps) {
  return (
    <EmptyState
      icon="🏢"
      title="Office is empty"
      description="Your virtual office workspace is ready. Add agents and tasks to see them come to life."
      action={{
        label: "Populate Office",
        onClick: onStartOffice
      }}
    />
  )
}