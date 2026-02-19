import { PageTransition } from "@/components/ui/page-transition"
import { CalendarView } from "@/components/calendar/calendar-view"

export default function CalendarPage() {
  return (
    <PageTransition>
      <CalendarView />
    </PageTransition>
  )
}