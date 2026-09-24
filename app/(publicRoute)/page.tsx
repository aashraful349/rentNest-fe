import { Suspense } from "react"
import PropertyCard from "./_components/PropertyCard"

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl mt-3 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Loading properties...</div>}>
        <PropertyCard />
      </Suspense>
    </div>
  )
}
