import { OfficeView } from "@/components/office/office-view"
import { PageTransition } from "@/components/ui/page-transition"

export default function OfficePage() {
  return (
    <PageTransition>
      <OfficeView />
    </PageTransition>
  )
}