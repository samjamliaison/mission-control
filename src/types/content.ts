export interface ContentItem {
  _id: string
  title: string
  description: string
  platform: "YouTube" | "Blog" | "X"
  scriptText: string
  thumbnailUrl: string
  status: "idea" | "script" | "thumbnail" | "filming" | "published"
  stage?: string
  assignee: string
  priority?: "low" | "medium" | "high"
  type?: string
  deadline?: number
  views?: number
  engagement?: number
  createdAt: number
  updatedAt: number
}
