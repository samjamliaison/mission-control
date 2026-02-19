import dynamic from 'next/dynamic'
import { PageTransition } from "@/components/ui/page-transition"
import { DashboardSkeleton } from "@/components/ui/loading-skeleton"
import { SetupGuard } from "@/components/setup-guard"

const DashboardView = dynamic(() => import("@/components/dashboard/dashboard-view").then(mod => ({ default: mod.DashboardView })), {
  loading: () => <DashboardSkeleton />
})

export default function Home() {
  return (
    <SetupGuard>
      <PageTransition>
        <DashboardView />
      </PageTransition>
    </SetupGuard>
  )
}