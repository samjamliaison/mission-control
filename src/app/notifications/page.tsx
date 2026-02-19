"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Check, CheckCheck, Trash2, AlertCircle, CheckCircle, XCircle, Clock, User, Calendar, Settings } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: 'cron' | 'agent' | 'error' | 'system' | 'task'
  title: string
  message: string
  timestamp: number
  read: boolean
  priority: 'low' | 'medium' | 'high'
  source?: string
  data?: any
}

const notificationIcons = {
  cron: Clock,
  agent: User,
  error: XCircle,
  system: Settings,
  task: CheckCircle
}

const notificationColors = {
  cron: 'text-blue-500',
  agent: 'text-green-500', 
  error: 'text-red-500',
  system: 'text-purple-500',
  task: 'text-cyan-500'
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'errors'>('all')

  // Load notifications from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('mission-control-notifications')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setNotifications(parsed)
      } catch (error) {
        console.error('Failed to parse notifications:', error)
      }
    }

    // Load activity log and convert to notifications
    const activityLog = localStorage.getItem('mission-control-activity-log')
    if (activityLog) {
      try {
        const activities = JSON.parse(activityLog)
        const activityNotifications = activities
          .slice(-20) // Last 20 activities
          .map((activity: any) => ({
            id: `activity-${activity.timestamp || Date.now()}-${Math.random()}`,
            type: activity.type || 'system',
            title: activity.action || 'System Activity',
            message: activity.details || activity.message || 'No details available',
            timestamp: activity.timestamp || Date.now(),
            read: false,
            priority: activity.type === 'error' ? 'high' : 'medium',
            source: activity.source || 'system',
            data: activity
          }))
        
        // Merge with existing notifications
        const existingIds = new Set(notifications.map(n => n.id))
        const newNotifications = activityNotifications.filter((n: Notification) => !existingIds.has(n.id))
        
        if (newNotifications.length > 0) {
          const updated = [...notifications, ...newNotifications]
          setNotifications(updated)
          localStorage.setItem('mission-control-notifications', JSON.stringify(updated))
        }
      } catch (error) {
        console.error('Failed to parse activity log:', error)
      }
    }

    // Add some sample notifications if none exist
    if (notifications.length === 0) {
      const sampleNotifications: Notification[] = [
        {
          id: '1',
          type: 'agent',
          title: 'Task Completed',
          message: 'Claude successfully completed the data analysis task for Project Alpha',
          timestamp: Date.now() - 300000, // 5 minutes ago
          read: false,
          priority: 'medium',
          source: 'claude-main'
        },
        {
          id: '2', 
          type: 'cron',
          title: 'Daily Backup',
          message: 'System backup completed successfully. 2.4GB archived.',
          timestamp: Date.now() - 3600000, // 1 hour ago
          read: false,
          priority: 'low',
          source: 'system-cron'
        },
        {
          id: '3',
          type: 'error',
          title: 'API Rate Limit',
          message: 'OpenAI API rate limit exceeded. Tasks queued for retry.',
          timestamp: Date.now() - 7200000, // 2 hours ago
          read: false,
          priority: 'high',
          source: 'task-manager'
        }
      ]
      setNotifications(sampleNotifications)
      localStorage.setItem('mission-control-notifications', JSON.stringify(sampleNotifications))
    }
  }, [])

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read
    if (filter === 'errors') return n.type === 'error'
    return true
  }).sort((a, b) => b.timestamp - a.timestamp)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
    setNotifications(updated)
    localStorage.setItem('mission-control-notifications', JSON.stringify(updated))
  }

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }))
    setNotifications(updated)
    localStorage.setItem('mission-control-notifications', JSON.stringify(updated))
  }

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id)
    setNotifications(updated)
    localStorage.setItem('mission-control-notifications', JSON.stringify(updated))
  }

  const clearAll = () => {
    setNotifications([])
    localStorage.removeItem('mission-control-notifications')
  }

  const getRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <PageHeader 
        title="Notifications"
        subtitle="System alerts, agent completions, and activity updates"
        icon={Bell}
      />

      {/* Filter Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
            className="text-sm"
          >
            All ({notifications.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setFilter('unread')}
            className="text-sm"
          >
            Unread ({unreadCount})
          </Button>
          <Button
            variant={filter === 'errors' ? 'default' : 'ghost'}
            size="sm" 
            onClick={() => setFilter('errors')}
            className="text-sm"
          >
            Errors ({notifications.filter(n => n.type === 'error').length})
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark All Read
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-sm text-red-400 hover:text-red-300"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications"
              description={
                filter === 'all' 
                  ? "You're all caught up! No notifications at the moment."
                  : filter === 'unread'
                  ? "All notifications have been read."
                  : "No error notifications found."
              }
              actionLabel="Go to Dashboard"
              onAction={() => window.location.href = '/'}
            />
          ) : (
            filteredNotifications.map((notification, index) => {
              const IconComponent = notificationIcons[notification.type] || AlertCircle
              const iconColor = notificationColors[notification.type] || 'text-gray-500'
              
              return (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={cn(
                    "p-4 transition-all duration-200 hover:bg-white/[0.02] cursor-pointer",
                    !notification.read && "border-l-4 border-l-cyan-500 bg-white/[0.01]"
                  )}>
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={cn("p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]", iconColor)}>
                        <IconComponent className="h-4 w-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-white/90">
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                              )}
                              <Badge variant="secondary" className="text-xs">
                                {notification.type}
                              </Badge>
                              {notification.priority === 'high' && (
                                <Badge variant="destructive" className="text-xs">
                                  High Priority
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-white/70 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-white/50">
                              <span>{getRelativeTime(notification.timestamp)}</span>
                              {notification.source && (
                                <span>from {notification.source}</span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markAsRead(notification.id)
                                }}
                                className="text-cyan-400 hover:text-cyan-300"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}