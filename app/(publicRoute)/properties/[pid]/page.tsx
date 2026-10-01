import { Suspense } from "react"
import PropertyDetailsView from "./_components/PropertyDetailsView"
import { getPropertyDetails } from "@/services/GetPropertyDetails"
import { DProperty } from "@/lib/type"

export default async function Page({
  params,
}: {
  params: Promise<{ pid: string }>
}) {
  const { pid } = await params
  const res = await getPropertyDetails(pid)
  const property: DProperty | null = res?.success ? res?.data : res?.data || res || null

  return (
    <div className="mx-auto max-w-7xl mt-6 mb-20 px-4 sm:px-6 lg:px-8">
      <PropertyDetailsView pid={pid} initialProperty={property} />
    </div>
  )
}
