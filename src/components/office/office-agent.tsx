export interface OfficeAgent {
  _id: string
  name: string
  avatar: string
  role: string
  status: "online" | "active" | "idle"
  currentTask: string
  position: { x: number; y: number } // percentage position in office
  workstation: string
  activityLevel: number // 0-100
  lastAction: string
  timeInCurrentTask: number // minutes
}