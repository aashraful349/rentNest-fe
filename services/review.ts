"use server"

import { cookies } from "next/headers"

export type CreateReviewPayload = {
  rentalRequestId: string
  title: string
  description: string
}

export const createReviewAction = async (payload: CreateReviewPayload) => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    if (!token) {
      return {
        success: false,
        message: "You must be logged in to leave a review",
      }
    }

    const apiUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    const res = await fetch(`${apiUrl}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    return data
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to submit review",
    }
  }
}

export const getPropertyReviews = async (propertyId: string) => {
  try {
    const apiUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    const res = await fetch(`${apiUrl}/api/reviews/${propertyId}`, {
      cache: "no-store",
    })

    const data = await res.json()
    return data
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: error?.message || "Failed to fetch reviews",
    }
  }
}
