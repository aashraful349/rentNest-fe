"use server"

import { cookies } from "next/headers"

export const getTenantRentals = async () => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/rentals`, {
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

export const getTenantPayments = async () => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/payments`, {
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

export const createPaymentAction = async (rentalId: string, amount: number) => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/payments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rentalId, amount }),
    })
    return await res.json()
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to initiate payment",
    }
  }
}
