import { TeamDashboard } from "@/components/team/team-dashboard"
import { PageTransition } from "@/components/ui/page-transition"

export default function TeamPage() {
  return (
    <PageTransition>
      <TeamDashboard />
    </PageTransition>
  )
}