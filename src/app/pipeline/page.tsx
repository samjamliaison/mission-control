import { ContentPipeline } from "@/components/pipeline/content-pipeline"
import { PageTransition } from "@/components/ui/page-transition"

export default function PipelinePage() {
  return (
    <PageTransition>
      <ContentPipeline />
    </PageTransition>
  )
}