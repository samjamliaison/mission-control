import dynamic from 'next/dynamic'
import { PageTransition } from "@/components/ui/page-transition"
import { PageSkeleton } from "@/components/ui/loading-skeleton"

const OfficeView = dynamic(() => import("@/components/office/office-view").then(mod => ({ default: mod.OfficeView })), {
  loading: () => <PageSkeleton />
})

export default function OfficePage() {
  return (
    <PageTransition>
      <OfficeView />
    </PageTransition>
  )
}