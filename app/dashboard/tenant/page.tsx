import React from "react"
import { getMe } from "@/services/getMe"
import { GetAllProperties } from "@/app/(publicRoute)/properties/_action/GetAllProperties"
import { getTenantRentals, getTenantPayments } from "@/services/tenant"
import TenantDashboardView from "./_components/TenantDashboardView"

export const instant = false

export default async function TenantDashboardPage() {
  let currentUser = null
  let properties: any[] = []
  let rentals: any[] = []
  let payments: any[] = []

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

  return (
    <TenantDashboardView
      user={currentUser}
      properties={properties}
      initialRentals={rentals}
      initialPayments={payments}
    />
  )
}
