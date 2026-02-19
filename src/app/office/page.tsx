import dynamic from 'next/dynamic'
import { PageTransition } from "@/components/ui/page-transition"
import { PageSkeleton } from "@/components/ui/loading-skeleton"

const IsometricOffice = dynamic(() => import("@/components/office/isometric-office").then(mod => ({ default: mod.IsometricOffice })), {
  loading: () => <PageSkeleton />
})

export default function OfficePage() {
  return (
    <PageTransition>
      <IsometricOffice />
    </PageTransition>
  )
}