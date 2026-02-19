import type { Metadata } from "next"
import dynamic from 'next/dynamic'
import { PageTransition } from "@/components/ui/page-transition"
import { DashboardSkeleton } from "@/components/ui/loading-skeleton"
import { SetupGuard } from "@/components/setup-guard"

export const metadata: Metadata = {
  title: "Dashboard | Mission Control",
  description: "Real-time command center dashboard with agent status, active sessions, and system monitoring for OpenClaw operations.",
  openGraph: {
    title: "Dashboard | Mission Control",
    description: "Real-time command center dashboard with agent status, active sessions, and system monitoring.",
  },
}

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