import { Skeleton } from "@/components/ui/loading-skeleton"

export default function AnalyticsLoading() {
  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Summary stats skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="w-12 h-12 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Horizontal bar chart skeleton */}
        <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-12 h-4" />
                <Skeleton className="flex-1 h-8 rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Vertical bar chart skeleton */}
        <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="flex items-end justify-between gap-4 h-64">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <Skeleton className="h-4 w-8 mb-2" />
                <Skeleton className={`w-full rounded-lg h-20`} />
                <Skeleton className="h-3 w-12 mt-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Progress bars skeleton */}
        <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-5 w-10 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Donut chart skeleton */}
        <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="flex items-center justify-center mb-6">
            <Skeleton className="w-48 h-48 rounded-full" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}