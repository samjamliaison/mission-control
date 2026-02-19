"use client"

import dynamic from 'next/dynamic'
import { PageTransition } from "@/components/ui/page-transition"
import { DashboardSkeleton } from "@/components/ui/loading-skeleton"

const StarredView = dynamic(() => import("@/components/starred/starred-view").then(mod => ({ default: mod.StarredView })), {
  loading: () => <DashboardSkeleton />
})

export default function StarredPage() {
  return (
    <PageTransition>
      <StarredView />
    </PageTransition>
  )
}