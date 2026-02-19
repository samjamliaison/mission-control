import { DashboardView } from "@/components/dashboard/dashboard-view"
import { PageTransition } from "@/components/ui/page-transition"

export default function Home() {
  return (
    <PageTransition>
      <DashboardView />
    </PageTransition>
  )
}