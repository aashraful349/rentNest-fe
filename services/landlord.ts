"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const getApiUrl = () => {
  return (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "")
}

export const getLandlordProperties = async () => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    const res = await fetch(`${getApiUrl()}/api/landlord/properties`, {
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

    const res = await fetch(`${getApiUrl()}/api/landlord/properties`, {
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

    const res = await fetch(`${getApiUrl()}/api/landlord/requests`, {
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

    const res = await fetch(`${getApiUrl()}/api/landlord/requests/${id}`, {
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

export const updateLandlordPropertyAction = async (id: string, payload: any) => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    if (!token) {
      return {
        success: false,
        message: "Authentication required",
      }
    }

    const apiUrl = getApiUrl()

    let res = await fetch(`${apiUrl}/api/landlord/properties/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok && res.status === 404) {
      res = await fetch(`${apiUrl}/api/landlord/properties/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
    }

    return await res.json()
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update property",
    }
  }
}

export const updatePropertyAvailabilityAction = async (
  id: string,
  availability: "AVAILABLE" | "UNAVAILABLE"
) => {
  return updateLandlordPropertyAction(id, { availability })
}

export const updatePropertyFormAction = async (prevState: any, formData: FormData) => {
  const id = formData.get("id") as string
  const pName = formData.get("pName") as string
  const pLocation = formData.get("pLocation") as string
  const pPrice = formData.get("pPrice") as string
  const pDescription = formData.get("pDescription") as string
  const type = (formData.get("type") || formData.get("categoryType") || "APARTMENT") as string
  const pImage = formData.get("pImage") as string
  const availability = (formData.get("availability") || "AVAILABLE") as string

  if (!id) {
    return {
      success: false,
      message: "Property ID is required",
    }
  }

  const payload: any = {}
  if (pName) payload.pName = pName
  if (pLocation) payload.pLocation = pLocation
  if (pPrice) payload.pPrice = Number(pPrice)
  if (pDescription) payload.pDescription = pDescription
  if (type) payload.type = type.toUpperCase()
  if (pImage !== undefined) payload.pImage = pImage.trim()
  if (availability) payload.availability = availability.toUpperCase()

  try {
    const result = await updateLandlordPropertyAction(id, payload)
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
      message: error?.message || "Failed to update property",
    }
  }
}
