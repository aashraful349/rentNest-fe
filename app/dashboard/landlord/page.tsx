import React from "react"
import { getMe } from "@/services/getMe"
import { getLandlordProperties, getLandlordRequests } from "@/services/landlord"
import LandlordDashboardView from "./_components/LandlordDashboardView"

export const instant = false

export default async function LandlordDashboardPage() {
  let currentUser = null
  let properties: any[] = []
  let requests: any[] = []

  try {
    const userRes = await getMe()
    if (userRes?.success && userRes?.data) {
      currentUser = userRes.data
    }
  } catch {}

  try {
    const propsRes = await getLandlordProperties()
    if (Array.isArray(propsRes)) {
      properties = propsRes
    } else if (propsRes?.data && Array.isArray(propsRes.data)) {
      properties = propsRes.data
    }
  } catch {}

  try {
    const reqRes = await getLandlordRequests()
    if (Array.isArray(reqRes)) {
      requests = reqRes
    } else if (reqRes?.data && Array.isArray(reqRes.data)) {
      requests = reqRes.data
    }
  } catch {}

  return (
    <LandlordDashboardView
      user={currentUser}
      properties={properties}
      initialRequests={requests}
    />
  )
}
