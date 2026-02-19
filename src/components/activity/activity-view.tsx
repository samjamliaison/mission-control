"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/ui/page-header"
import { StatsCard } from "@/components/ui/stats-card"
import { StaggeredList } from "@/components/ui/staggered-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Activity,
  Filter,
  Search,
  Download,
  Upload,
  Trash2,
  Calendar,
  User,
  Tag,
  AlertCircle,
  CheckSquare,
  Film,
  Brain,
  Settings,
  Navigation,
  TrendingUp,
  Clock,
  RefreshCw,
  X
} from "lucide-react"
import { activityLogger, ActivityEntry, logNavigationAction } from "@/lib/activity-logger"
import { cn } from "@/lib/utils"

const actionTypeIcons: Record<ActivityEntry['actionType'], React.ElementType> = {
  task_created: CheckSquare,
  task_updated: CheckSquare,
  task_completed: CheckSquare,
  task_deleted: CheckSquare,
  content_created: Film,
  content_updated: Film,
  content_published: Film,
  content_deleted: Film,
  event_created: Calendar,
  event_updated: Calendar,
  event_deleted: Calendar,
  memory_created: Brain,
  memory_updated: Brain,
  memory_deleted: Brain,
  navigation: Navigation,
  search: Search,
  filter_applied: Filter,
  export_data: Download,
  import_data: Upload,
  settings_changed: Settings,
  agent_action: User,
  system_event: AlertCircle,
  user_login: User,
  session_start: Activity,
  command_executed: Settings,
}

const actionTypeColors: Record<ActivityEntry['actionType'], string> = {
  task_created: 'text-[hsl(var(--command-accent))]',
  task_updated: 'text-[hsl(var(--command-accent))]',
  task_completed: 'text-green-400',
  task_deleted: 'text-red-400',
  content_created: 'text-purple-400',
  content_updated: 'text-purple-400',
  content_published: 'text-green-400',
  content_deleted: 'text-red-400',
  event_created: 'text-blue-400',
  event_updated: 'text-blue-400',
  event_deleted: 'text-red-400',
  memory_created: 'text-emerald-400',
  memory_updated: 'text-emerald-400',
  memory_deleted: 'text-red-400',
  navigation: 'text-gray-400',
  search: 'text-yellow-400',
  filter_applied: 'text-cyan-400',
  export_data: 'text-green-400',
  import_data: 'text-blue-400',
  settings_changed: 'text-orange-400',
  agent_action: 'text-[hsl(var(--command-accent))]',
  system_event: 'text-red-400',
  user_login: 'text-green-400',
  session_start: 'text-[hsl(var(--command-accent))]',
  command_executed: 'text-orange-400',
}

const importanceColors: Record<ActivityEntry['importance'], string> = {
  low: 'border-gray-500/20',
  medium: 'border-yellow-500/30',
  high: 'border-orange-500/40',
  critical: 'border-red-500/50'
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0.0, 0.2, 1] as any
    }
  }
}

export function ActivityView() {
  const [entries, setEntries] = useState<ActivityEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<ActivityEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('all')
  const [agentFilter, setAgentFilter] = useState<string>('all')
  const [importanceFilter, setImportanceFilter] = useState<string>('all')
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('all')
  const [mounted, setMounted] = useState(false)

  // Load activity data and set up listeners
  useEffect(() => {
    setMounted(true)
    
    // Log navigation
    logNavigationAction('Activity Log')
    
    // Load initial data
    loadEntries()
    
    // Listen for new activity
    const handleActivityUpdate = () => {
      loadEntries()
    }
    
    window.addEventListener('activityLogUpdated', handleActivityUpdate)
    window.addEventListener('activityLogCleared', handleActivityUpdate)
    
    return () => {
      window.removeEventListener('activityLogUpdated', handleActivityUpdate)
      window.removeEventListener('activityLogCleared', handleActivityUpdate)
    }
  }, [])

  const loadEntries = () => {
    const allEntries = activityLogger.getEntries()
    setEntries(allEntries)
  }

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    const actionTypes = [...new Set(entries.map(e => e.actionType))].sort()
    const agents = [...new Set(entries.map(e => e.agent))].sort()
    
    return { actionTypes, agents }
  }, [entries])

  // Apply filters
  useEffect(() => {
    let filtered = [...entries]

    // Date range filter
    if (dateRangeFilter !== 'all') {
      const now = Date.now()
      let startTime = 0
      
      switch (dateRangeFilter) {
        case 'today':
          startTime = new Date(now).setHours(0, 0, 0, 0)
          break
        case 'week':
          startTime = now - (7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startTime = now - (30 * 24 * 60 * 60 * 1000)
          break
      }
      
      if (startTime > 0) {
        filtered = filtered.filter(entry => entry.timestamp >= startTime)
      }
    }

    // Other filters
    filtered = activityLogger.getEntries(undefined, {
      actionType: actionTypeFilter === 'all' ? undefined : [actionTypeFilter as ActivityEntry['actionType']],
      agent: agentFilter === 'all' ? undefined : [agentFilter],
      importance: importanceFilter === 'all' ? undefined : [importanceFilter as ActivityEntry['importance']],
      search: searchQuery || undefined
    }).filter(entry => {
      // Apply date range to pre-filtered results
      if (dateRangeFilter !== 'all') {
        const now = Date.now()
        let startTime = 0
        
        switch (dateRangeFilter) {
          case 'today':
            startTime = new Date(now).setHours(0, 0, 0, 0)
            break
          case 'week':
            startTime = now - (7 * 24 * 60 * 60 * 1000)
            break
          case 'month':
            startTime = now - (30 * 24 * 60 * 60 * 1000)
            break
        }
        
        return startTime === 0 || entry.timestamp >= startTime
      }
      return true
    })

    setFilteredEntries(filtered)
  }, [entries, searchQuery, actionTypeFilter, agentFilter, importanceFilter, dateRangeFilter])

  const stats = useMemo(() => activityLogger.getStats(), [entries])

  const clearFilters = () => {
    setSearchQuery('')
    setActionTypeFilter('all')
    setAgentFilter('all')
    setImportanceFilter('all')
    setDateRangeFilter('all')
  }

  const exportData = () => {
    const data = activityLogger.exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mission-control-activity-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const clearAllActivity = () => {
    if (confirm('Are you sure you want to clear all activity logs? This cannot be undone.')) {
      activityLogger.clear()
    }
  }

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (seconds < 60) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(timestamp).toLocaleDateString()
  }

  if (!mounted) return null

  return (
    <div className="min-h-[calc(100vh-5rem)] relative">
      {/* Command Center Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[hsl(var(--command-background))] via-[hsl(220_13%_3%)] to-[hsl(var(--command-background))] pointer-events-none" />
      
      <motion.div 
        className="relative z-10 p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <PageHeader
            icon={Activity}
            title="Activity Log & Audit Trail"
            subtitle="Complete chronological record of all user actions, system events, and agent activities across Mission Control."
          >
            <div className="flex gap-4">
              <StatsCard
                icon={TrendingUp}
                label="Total Events"
                value={stats.total.toLocaleString()}
                subLabel="Today"
                subValue={stats.today.toString()}
              />
              <StatsCard
                icon={Clock}
                label="This Week"
                value={stats.thisWeek.toString()}
                subLabel="Most Active"
                subValue={Object.entries(stats.byAgent).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'}
              />
            </div>
          </PageHeader>

          {/* Filters */}
          <motion.div variants={itemVariants}>
            <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-[hsl(var(--command-accent))]" />
                    Filters
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportData}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearAllActivity} className="text-red-400 border-red-400/20">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[hsl(var(--command-text-muted))]" />
                    <Input
                      placeholder="Search activities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-[hsl(var(--command-surface))] border-[hsl(var(--command-border))]"
                    />
                  </div>

                  {/* Action Type Filter */}
                  <Select value={actionTypeFilter} onValueChange={setActionTypeFilter}>
                    <SelectTrigger className="bg-[hsl(var(--command-surface))] border-[hsl(var(--command-border))]">
                      <SelectValue placeholder="Action Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      {filterOptions.actionTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Agent Filter */}
                  <Select value={agentFilter} onValueChange={setAgentFilter}>
                    <SelectTrigger className="bg-[hsl(var(--command-surface))] border-[hsl(var(--command-border))]">
                      <SelectValue placeholder="Agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Agents</SelectItem>
                      {filterOptions.agents.map(agent => (
                        <SelectItem key={agent} value={agent}>
                          {agent}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Importance Filter */}
                  <Select value={importanceFilter} onValueChange={setImportanceFilter}>
                    <SelectTrigger className="bg-[hsl(var(--command-surface))] border-[hsl(var(--command-border))]">
                      <SelectValue placeholder="Importance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Date Range Filter */}
                  <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                    <SelectTrigger className="bg-[hsl(var(--command-surface))] border-[hsl(var(--command-border))]">
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Active Filters Display */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {searchQuery && (
                    <Badge variant="outline" className="bg-[hsl(var(--command-accent))]/10 text-[hsl(var(--command-accent))]">
                      Search: {searchQuery}
                    </Badge>
                  )}
                  {actionTypeFilter !== 'all' && (
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-400">
                      Action: {actionTypeFilter.replace(/_/g, ' ')}
                    </Badge>
                  )}
                  {agentFilter !== 'all' && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-400">
                      Agent: {agentFilter}
                    </Badge>
                  )}
                  {importanceFilter !== 'all' && (
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-400">
                      Importance: {importanceFilter}
                    </Badge>
                  )}
                  {dateRangeFilter !== 'all' && (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                      Date: {dateRangeFilter}
                    </Badge>
                  )}
                  <span className="text-sm text-[hsl(var(--command-text-muted))]">
                    {filteredEntries.length} of {entries.length} entries
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity Feed */}
          <motion.div variants={itemVariants}>
            <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-[hsl(var(--command-accent))]" />
                    Activity Feed
                  </div>
                  <Badge variant="outline" className="bg-[hsl(var(--command-accent))]/10 text-[hsl(var(--command-accent))]">
                    {filteredEntries.length} entries
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredEntries.length > 0 ? (
                  <StaggeredList className="space-y-3" staggerDelay={0.05}>
                    {filteredEntries.map((entry) => {
                      const Icon = actionTypeIcons[entry.actionType]
                      const iconColor = actionTypeColors[entry.actionType]
                      const borderColor = importanceColors[entry.importance]
                      
                      return (
                        <motion.div
                          key={entry.id}
                          className={cn(
                            "flex items-start gap-4 p-4 glass-morphism rounded-lg border-l-2",
                            borderColor
                          )}
                          whileHover={{ scale: 1.005, x: 4 }}
                        >
                          <div className={cn("mt-1 p-2 rounded-lg bg-opacity-10", iconColor.replace('text-', 'bg-').replace('400', '500/10'))}>
                            <Icon className={cn("h-4 w-4", iconColor)} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="font-medium">{entry.details}</p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-sm text-[hsl(var(--command-text-muted))]">
                                    by {entry.agent}
                                  </span>
                                  <span className="text-sm text-[hsl(var(--command-text-muted))]">
                                    {formatRelativeTime(entry.timestamp)}
                                  </span>
                                  {entry.entityType && (
                                    <Badge variant="outline" className="text-xs">
                                      {entry.entityType}
                                    </Badge>
                                  )}
                                  <Badge variant="outline" className={cn(
                                    "text-xs",
                                    entry.importance === 'critical' ? 'border-red-400/40 text-red-400' :
                                    entry.importance === 'high' ? 'border-orange-400/40 text-orange-400' :
                                    entry.importance === 'medium' ? 'border-yellow-400/40 text-yellow-400' :
                                    'border-gray-400/40 text-gray-400'
                                  )}>
                                    {entry.importance}
                                  </Badge>
                                </div>
                                {entry.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {entry.tags.map(tag => (
                                      <Badge key={tag} variant="outline" className="text-xs bg-[hsl(var(--command-accent))]/5">
                                        <Tag className="h-2 w-2 mr-1" />
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              <div className="text-xs text-[hsl(var(--command-text-muted))] whitespace-nowrap">
                                {new Date(entry.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </StaggeredList>
                ) : (
                  <div className="text-center py-12">
                    <div className="space-y-3">
                      <div className="w-12 h-12 mx-auto glass-morphism rounded-full flex items-center justify-center">
                        <Activity className="h-5 w-5 text-[hsl(var(--command-text-muted))]" />
                      </div>
                      <p className="text-[hsl(var(--command-text-muted))]">
                        {entries.length === 0 ? 'No activity logged yet' : 'No entries match your filters'}
                      </p>
                      {entries.length === 0 && (
                        <p className="text-sm text-[hsl(var(--command-text-muted))]">
                          Activity will appear here as you use Mission Control
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}