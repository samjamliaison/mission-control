export interface CalendarEvent {
  _id: string
  title: string
  description: string
  type: "task" | "cron"
  agent: string
  scheduledTime: number
  status: "pending" | "completed" | "failed"
  duration: number // in minutes
  recurrence: "daily" | "weekly" | "monthly" | null
}