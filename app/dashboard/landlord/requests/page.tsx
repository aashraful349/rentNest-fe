import React from "react"
import { getLandlordRequests } from "@/services/landlord"
import LandlordRequestsView from "./_components/LandlordRequestsView"

export const instant = false

export default async function LandlordRequestsPage() {
  let requests: any[] = []

  try {
    const res = await getLandlordRequests()
    if (Array.isArray(res)) {
      requests = res
    } else if (res?.data && Array.isArray(res.data)) {
      requests = res.data
    }
  } catch {}

  return <LandlordRequestsView initialRequests={requests} />
}
