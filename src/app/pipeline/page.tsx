import dynamic from 'next/dynamic'
import { PageTransition } from "@/components/ui/page-transition"
import { PageSkeleton } from "@/components/ui/loading-skeleton"

const ContentPipeline = dynamic(() => import("@/components/pipeline/content-pipeline").then(mod => ({ default: mod.ContentPipeline })), {
  loading: () => <PageSkeleton />
})

export default function PipelinePage() {
  return (
    <PageTransition>
      <ContentPipeline />
    </PageTransition>
  )
}