import { Suspense } from "react"
import PropertyCard from "./_components/PropertyCard"
import { Skeleton } from "@/components/ui/skeleton"
import { SkeletonCard } from "@/components/shared/skeletonCard"
import { HomeSkeleton } from "./_components/HomeSkelaton"

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl mt-3 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<HomeSkeleton />}>
        <PropertyCard />
      </Suspense>
    </div>
  )
}
