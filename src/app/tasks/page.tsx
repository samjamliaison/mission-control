import type { Metadata } from "next"
import dynamic from 'next/dynamic'
import { PageTransition } from "@/components/ui/page-transition"
import { PageSkeleton } from "@/components/ui/loading-skeleton"

export const metadata: Metadata = {
  title: "Tasks | Mission Control",
  description: "Kanban-style task board for managing projects, assigning agents, and tracking progress across all operations.",
  openGraph: {
    title: "Tasks | Mission Control",
    description: "Kanban-style task board for managing projects, assigning agents, and tracking progress.",
  },
}

const TasksBoard = dynamic(() => import("@/components/tasks/tasks-board").then(mod => ({ default: mod.TasksBoard })), {
  loading: () => <PageSkeleton />
})

export default function TasksPage() {
  return (
    <PageTransition>
      <TasksBoard />
    </PageTransition>
  )
}