"use server"

import { cookies } from "next/headers"

export const getTenantRentals = async () => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    if (!token) {
      return { success: false, data: [] }
    }

    const apiUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    const res = await fetch(`${apiUrl}/api/rentals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    const data = await res.json()
    return data
  } catch (error) {
    return { success: false, data: [] }
  }
}

export const getRentalRequestById = async (id: string) => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    if (!token) {
      return { success: false, message: "User not logged in" }
    }

    const apiUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    const res = await fetch(`${apiUrl}/api/rentals/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    const data = await res.json()
    return data
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch rental request details" }
  }
}

export const getTenantPayments = async () => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    if (!token) {
      return { success: false, data: [] }
    }

    const apiUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    const res = await fetch(`${apiUrl}/api/payments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    const data = await res.json()
    return data
  } catch (error) {
    return { success: false, data: [] }
  }
}

export const getPaymentDetailsById = async (id: string) => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    if (!token) {
      return { success: false, message: "User not logged in" }
    }

    const apiUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    const res = await fetch(`${apiUrl}/api/payments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    const data = await res.json()
    return data
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch payment details" }
  }
}

export const createPaymentAction = async (rentalRequestId: string) => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    if (!token) {
      return {
        success: false,
        message: "You must be logged in to make a payment",
      }
    }

    const apiUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    const res = await fetch(`${apiUrl}/api/payments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rentalRequestId }),
    })
    return await res.json()
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to initiate payment",
    }
  }
}

export const requestRentalAction = async (propertyId: string, message?: string) => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    if (!token) {
      return {
        success: false,
        message: "You must be logged in to request a rental",
        statusCode: 401,
      }
    }

    const apiUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    const res = await fetch(`${apiUrl}/api/rentals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        propertyId,
        ...(message ? { message } : {}),
      }),
    })

    const data = await res.json()
    return data
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to submit rental request",
    }
  }
}
