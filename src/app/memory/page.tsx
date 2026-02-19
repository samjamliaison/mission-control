import dynamic from 'next/dynamic'
import { PageTransition } from "@/components/ui/page-transition"
import { PageSkeleton } from "@/components/ui/loading-skeleton"

const MemoryViewer = dynamic(() => import("@/components/memory/memory-viewer").then(mod => ({ default: mod.MemoryViewer })), {
  loading: () => <PageSkeleton />
})

export default function MemoryPage() {
  return (
    <PageTransition>
      <MemoryViewer />
    </PageTransition>
  )
}