import { useState, useEffect, useCallback } from 'react'

export interface TimeEntry {
  taskId: string
  startTime: number
  endTime?: number
  duration: number // in milliseconds
  isActive: boolean
}

export interface TaskTimeData {
  taskId: string
  totalTime: number // total time tracked in milliseconds
  currentSession?: TimeEntry
  sessions: TimeEntry[]
  isTracking: boolean
}

export function useTimeTracking() {
  const [trackedTasks, setTrackedTasks] = useState<Map<string, TaskTimeData>>(new Map())
  const [currentTime, setCurrentTime] = useState(Date.now())

  // Update current time every second for live tracking display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mission-control-time-tracking')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        const mapData = new Map<string, TaskTimeData>()
        
        Object.entries(data).forEach(([taskId, taskData]: [string, any]) => {
          mapData.set(taskId, {
            ...taskData,
            // If there was an active session that wasn't properly stopped, mark it as inactive
            currentSession: taskData.currentSession?.isActive ? {
              ...taskData.currentSession,
              isActive: false,
              endTime: taskData.currentSession.endTime || Date.now(),
              duration: taskData.currentSession.endTime 
                ? taskData.currentSession.endTime - taskData.currentSession.startTime
                : Date.now() - taskData.currentSession.startTime
            } : taskData.currentSession,
            isTracking: false // Reset tracking state on load
          })
        })
        
        setTrackedTasks(mapData)
      } catch (error) {
        console.error('Failed to load time tracking data:', error)
      }
    }
  }, [])

  // Save to localStorage
  const saveToStorage = useCallback((data: Map<string, TaskTimeData>) => {
    const objData: Record<string, TaskTimeData> = {}
    data.forEach((value, key) => {
      objData[key] = value
    })
    localStorage.setItem('mission-control-time-tracking', JSON.stringify(objData))
    setTrackedTasks(new Map(data))
  }, [])

  const startTracking = useCallback((taskId: string) => {
    setTrackedTasks(prev => {
      const newMap = new Map(prev)
      const existing = newMap.get(taskId)
      
      // Stop any other active tracking
      newMap.forEach((taskData, id) => {
        if (taskData.isTracking && id !== taskId) {
          stopTracking(id)
        }
      })
      
      const now = Date.now()
      const newEntry: TimeEntry = {
        taskId,
        startTime: now,
        duration: 0,
        isActive: true
      }
      
      if (existing) {
        newMap.set(taskId, {
          ...existing,
          currentSession: newEntry,
          isTracking: true
        })
      } else {
        newMap.set(taskId, {
          taskId,
          totalTime: 0,
          currentSession: newEntry,
          sessions: [],
          isTracking: true
        })
      }
      
      saveToStorage(newMap)
      return newMap
    })
  }, [saveToStorage])

  const stopTracking = useCallback((taskId: string) => {
    setTrackedTasks(prev => {
      const newMap = new Map(prev)
      const existing = newMap.get(taskId)
      
      if (!existing || !existing.currentSession?.isActive) {
        return prev
      }
      
      const now = Date.now()
      const session = existing.currentSession
      const duration = now - session.startTime
      
      const completedSession: TimeEntry = {
        ...session,
        endTime: now,
        duration,
        isActive: false
      }
      
      newMap.set(taskId, {
        ...existing,
        totalTime: existing.totalTime + duration,
        currentSession: undefined,
        sessions: [...existing.sessions, completedSession],
        isTracking: false
      })
      
      saveToStorage(newMap)
      return newMap
    })
  }, [saveToStorage])

  const toggleTracking = useCallback((taskId: string) => {
    const taskData = trackedTasks.get(taskId)
    if (taskData?.isTracking) {
      stopTracking(taskId)
    } else {
      startTracking(taskId)
    }
  }, [trackedTasks, startTracking, stopTracking])

  const getTaskTimeData = useCallback((taskId: string): TaskTimeData | undefined => {
    return trackedTasks.get(taskId)
  }, [trackedTasks])

  const getCurrentElapsed = useCallback((taskId: string): number => {
    const taskData = trackedTasks.get(taskId)
    if (!taskData?.currentSession?.isActive) return 0
    
    return currentTime - taskData.currentSession.startTime
  }, [trackedTasks, currentTime])

  const getTotalTime = useCallback((taskId: string): number => {
    const taskData = trackedTasks.get(taskId)
    if (!taskData) return 0
    
    let total = taskData.totalTime
    if (taskData.currentSession?.isActive) {
      total += currentTime - taskData.currentSession.startTime
    }
    
    return total
  }, [trackedTasks, currentTime])

  const formatTime = useCallback((milliseconds: number): string => {
    if (milliseconds === 0) return '0:00'
    
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }, [])

  const clearTaskData = useCallback((taskId: string) => {
    setTrackedTasks(prev => {
      const newMap = new Map(prev)
      newMap.delete(taskId)
      saveToStorage(newMap)
      return newMap
    })
  }, [saveToStorage])

  return {
    trackedTasks,
    startTracking,
    stopTracking,
    toggleTracking,
    getTaskTimeData,
    getCurrentElapsed,
    getTotalTime,
    formatTime,
    clearTaskData
  }
}