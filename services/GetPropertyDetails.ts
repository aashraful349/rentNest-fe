"use server"

export const getPropertyDetails = async (propertyId: string) => {
  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/properties/${propertyId}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error fetching property details:", error)
    return null
  }
}
