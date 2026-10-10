import React from "react"
import { getMe } from "@/services/getMe"
import { GetAllProperties } from "@/app/(publicRoute)/properties/_action/GetAllProperties"
import { getAdminUsers, getAdminRentals } from "@/services/admin"
import AdminDashboardView from "./_components/AdminDashboardView"

export const instant = false

export default async function AdminDashboardPage() {
  let currentUser = null
  let properties: any[] = []
  let users: any[] = []
  let rentals: any[] = []

  try {
    const userRes = await getMe()
    if (userRes?.success && userRes?.data) {
      currentUser = userRes.data
    }
  } catch {}

  try {
    const usersRes = await getAdminUsers()
    if (Array.isArray(usersRes)) {
      users = usersRes
    } else if (usersRes?.data && Array.isArray(usersRes.data)) {
      users = usersRes.data
    }
  } catch {}

  try {
    const rentalsRes = await getAdminRentals()
    if (Array.isArray(rentalsRes)) {
      rentals = rentalsRes
    } else if (rentalsRes?.data && Array.isArray(rentalsRes.data)) {
      rentals = rentalsRes.data
    }
  } catch {}

  try {
    const propsRes = await GetAllProperties()
    if (Array.isArray(propsRes)) {
      properties = propsRes
    } else if (propsRes?.data && Array.isArray(propsRes.data)) {
      properties = propsRes.data
    }
  } catch {}

  return (
    <AdminDashboardView
      user={currentUser}
      properties={properties}
      initialUsers={users}
      initialRentals={rentals}
    />
  )
}
