import dynamic from 'next/dynamic'
import { PageTransition } from "@/components/ui/page-transition"
import { PageSkeleton } from "@/components/ui/loading-skeleton"

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