export interface MemoryEntry {
  _id: string
  title: string
  content: string
  category: "daily" | "knowledge" | "lessons"
  createdAt: number
  updatedAt: number
  tags: string[]
  author: string
  wordCount: number
  pinned?: boolean
}