import dynamic from 'next/dynamic'
import { PageTransition } from "@/components/ui/page-transition"
import { DashboardSkeleton } from "@/components/ui/loading-skeleton"

const ActivityView = dynamic(() => import("@/components/activity/activity-view").then(mod => ({ default: mod.ActivityView })), {
  loading: () => <DashboardSkeleton />
})

export default function ActivityPage() {
  return (
    <PageTransition>
      <ActivityView />
    </PageTransition>
  )
}