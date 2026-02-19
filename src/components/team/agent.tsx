export interface Agent {
  _id: string
  name: string
  avatar: string
  role: string
  status: "online" | "active" | "idle"
  currentActivity: string
  activeTasks: number
  completedTasks: number
  skills: string[]
  expertise: string[]
  lastSeen: number
  joinedAt: number
  efficiency: number
  description: string
  recentAchievements: string[]
}