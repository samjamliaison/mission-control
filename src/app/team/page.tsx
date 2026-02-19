import type { Metadata } from "next"
import dynamic from 'next/dynamic'
import { PageTransition } from "@/components/ui/page-transition"
import { PageSkeleton } from "@/components/ui/loading-skeleton"

export const metadata: Metadata = {
  title: "Team | Mission Control",
  description: "Manage your AI agent team, view agent profiles, monitor performance, and coordinate agent interactions.",
  openGraph: {
    title: "Team | Mission Control",
    description: "Manage your AI agent team, view agent profiles, monitor performance, and coordinate interactions.",
  },
}

const TeamDashboard = dynamic(() => import("@/components/team/team-dashboard").then(mod => ({ default: mod.TeamDashboard })), {
  loading: () => <PageSkeleton />
})

export default function TeamPage() {
  return (
    <PageTransition>
      <TeamDashboard />
    </PageTransition>
  )
}