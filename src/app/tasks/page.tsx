import { TasksBoard } from "@/components/tasks/tasks-board"
import { PageTransition } from "@/components/ui/page-transition"

export default function TasksPage() {
  return (
    <PageTransition>
      <TasksBoard />
    </PageTransition>
  )
}