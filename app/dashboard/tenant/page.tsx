import React from "react"
import { getMe } from "@/services/getMe"
import { GetAllProperties } from "@/app/(publicRoute)/properties/_action/GetAllProperties"
import { getTenantRentals, getTenantPayments } from "@/services/tenant"
import { getPropertyReviews } from "@/services/review"
import TenantDashboardView from "./_components/TenantDashboardView"

export const instant = false

export default async function TenantDashboardPage() {
  let currentUser = null
  let properties: any[] = []
  let rentals: any[] = []
  let payments: any[] = []
  let reviewedRentalRequestIds: string[] = []

  try {
    const userRes = await getMe()
    if (userRes?.success && userRes?.data) {
      currentUser = userRes.data
    }
  } catch {}

  try {
    const rentalsRes = await getTenantRentals()
    if (Array.isArray(rentalsRes)) {
      rentals = rentalsRes
    } else if (Array.isArray(rentalsRes?.data)) {
      rentals = rentalsRes.data
    }
  } catch {}

  try {
    const paymentsRes = await getTenantPayments()
    if (Array.isArray(paymentsRes)) {
      payments = paymentsRes
    } else if (Array.isArray(paymentsRes?.data)) {
      payments = paymentsRes.data
    }
  } catch {}

  try {
    const propsRes = await GetAllProperties()
    if (Array.isArray(propsRes)) {
      properties = propsRes
    } else if (Array.isArray(propsRes?.data)) {
      properties = propsRes.data
    }
  } catch {}

  try {
    const propertyIdsToFetch = Array.from(
      new Set(
        rentals
          .map((r) => r.propertyId || r.property?.id)
          .filter(Boolean)
      )
    )

    if (propertyIdsToFetch.length > 0) {
      const reviewPromises = propertyIdsToFetch.map(async (pid) => {
        try {
          const revRes = await getPropertyReviews(pid)
          const list = revRes?.success ? revRes?.data : revRes?.data || (Array.isArray(revRes) ? revRes : [])
          return Array.isArray(list) ? list : []
        } catch {
          return []
        }
      })

      const allReviewsNested = await Promise.all(reviewPromises)
      const allReviews = allReviewsNested.flat()

      const reviewedReqIds = new Set<string>()
      allReviews.forEach((rev) => {
        if (rev?.rentalRequestId) {
          reviewedReqIds.add(rev.rentalRequestId)
        }
      })

      reviewedRentalRequestIds = Array.from(reviewedReqIds)
    }
  } catch {}

  return (
    <TenantDashboardView
      user={currentUser}
      properties={properties}
      initialRentals={rentals}
      initialPayments={payments}
      reviewedRentalRequestIds={reviewedRentalRequestIds}
    />
  )
}
