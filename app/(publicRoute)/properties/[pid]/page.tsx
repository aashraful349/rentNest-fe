import { Suspense } from "react"
import PropertyDetailsView from "./_components/PropertyDetailsView"
import { getPropertyDetails } from "@/services/GetPropertyDetails"
import { getMe } from "@/services/getMe"
import { getPropertyReviews } from "@/services/review"
import { DProperty } from "@/lib/type"

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ pid: string }>
}) {
  const { pid } = await params
  const [res, userRes, reviewsRes] = await Promise.all([
    getPropertyDetails(pid),
    getMe(),
    getPropertyReviews(pid),
  ])

  const property: DProperty | null = res?.success ? res?.data : res?.data || res || null
  const currentUser = userRes?.success ? userRes?.data : null
  const reviews = Array.isArray(reviewsRes)
    ? reviewsRes
    : Array.isArray(reviewsRes?.data)
    ? reviewsRes.data
    : []

  return (
    <div className="mx-auto max-w-7xl mt-6 mb-20 px-4 sm:px-6 lg:px-8">
      <PropertyDetailsView
        pid={pid}
        initialProperty={property}
        currentUser={currentUser}
        initialReviews={reviews}
      />
    </div>
  )
}
