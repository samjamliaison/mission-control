import dynamic from 'next/dynamic'
import { PageTransition } from "@/components/ui/page-transition"
import { PageSkeleton } from "@/components/ui/loading-skeleton"

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