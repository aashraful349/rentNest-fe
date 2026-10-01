import { HomeSkeleton } from "../_components/HomeSkelaton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl mt-6 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-60 rounded-md" />
        <Skeleton className="h-4 w-96 rounded-md" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="rounded-xl border bg-card p-4 shadow-xs mb-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      <HomeSkeleton />
    </div>
  )
}
