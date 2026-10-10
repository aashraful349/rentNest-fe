"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const getLandlordProperties = async () => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/landlord/properties`, {
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

export const createPropertyAction = async (prevState: any, formData: FormData) => {
  const pName = formData.get("pName") as string
  const pLocation = formData.get("pLocation") as string
  const pPrice = formData.get("pPrice") as string
  const pDescription = formData.get("pDescription") as string
  const type = (formData.get("type") || formData.get("categoryType") || "APARTMENT") as string
  const pImage = formData.get("pImage") as string

  if (!pName || !pLocation || !pPrice || !pDescription) {
    return {
      success: false,
      message: "Property name, location, price, and description are required",
    }
  }

  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    const payload: any = {
      pName,
      pLocation,
      pPrice: String(pPrice),
      pDescription,
      type: type.toLowerCase(),
    }

    if (pImage && pImage.trim()) {
      payload.pImage = pImage.trim()
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/landlord/properties`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const result = await res.json()
    if (!result?.success) {
      return result
    }

    redirect("/dashboard/landlord")
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error
    }
    return {
      success: false,
      message: error?.message || "Failed to create property",
    }
  }
}

export const getLandlordRequests = async () => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/landlord/requests`, {
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

export const updateLandlordRequestAction = async (id: string, status: string) => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/landlord/requests/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })
    return await res.json()
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update request",
    }
  }
}
