"use server"

import { cookies } from "next/headers"

export const getAdminUsers = async () => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    if (!token) {
      return { success: false, data: [] }
    }

    const apiUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    const res = await fetch(`${apiUrl}/api/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    return await res.json()
  } catch (error) {
    return { success: false, data: [] }
  }
}

export const getAdminRentals = async () => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    if (!token) {
      return { success: false, data: [] }
    }

    const apiUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    const res = await fetch(`${apiUrl}/api/admin/rentals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    return await res.json()
  } catch (error) {
    return { success: false, data: [] }
  }
}

export const updateAdminUserAction = async (id: string, payload: any) => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    if (!token) {
      return {
        success: false,
        message: "Authentication required",
      }
    }

    const apiUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    const res = await fetch(`${apiUrl}/api/admin/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
    return await res.json()
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update user",
    }
  }
}
