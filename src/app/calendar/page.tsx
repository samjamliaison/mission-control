import { CalendarView } from "@/components/calendar/calendar-view"
import { PageTransition } from "@/components/ui/page-transition"

export default function CalendarPage() {
  return (
    <PageTransition>
      <CalendarView />
    </PageTransition>
  )
}