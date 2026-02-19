import dynamic from 'next/dynamic'
import { PageTransition } from "@/components/ui/page-transition"
import { PageSkeleton } from "@/components/ui/loading-skeleton"

const EnhancedMemoryViewer = dynamic(() => import("@/components/memory/enhanced-memory-viewer").then(mod => ({ default: mod.EnhancedMemoryViewer })), {
  loading: () => <PageSkeleton />
})

export default function MemoryPage() {
  return (
    <PageTransition>
      <EnhancedMemoryViewer />
    </PageTransition>
  )
}