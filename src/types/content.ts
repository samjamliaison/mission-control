export interface ContentItem {
  _id: string
  title: string
  description: string
  platform: string
  scriptText: string
  thumbnailUrl: string
  status: "idea" | "script" | "thumbnail" | "filming" | "published"
  stage?: string
  assignee: string
  priority?: "low" | "medium" | "high"
  type?: string
  createdAt: number
  updatedAt: number
}
