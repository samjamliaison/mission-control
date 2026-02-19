import { MemoryViewer } from "@/components/memory/memory-viewer"
import { PageTransition } from "@/components/ui/page-transition"

export default function MemoryPage() {
  return (
    <PageTransition>
      <MemoryViewer />
    </PageTransition>
  )
}