import { Suspense } from "react"
import PropertyCard from "../_components/HomePropertyCard"
import { HomeSkeleton } from "../../_components/HomeSkelaton"
import PropertyDetailsView from "./_components/PropertyDetailsView"

export default async function Page({
  params,
}: {
  params: Promise<{ pid: string }>
    }) {
    const { pid } = await params
  return <div className="mx-auto max-w-7xl mt-3 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<HomeSkeleton />}>
        <PropertyDetailsView pid={pid}></PropertyDetailsView>
      </Suspense>
    </div>
}