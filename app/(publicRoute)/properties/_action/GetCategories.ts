"use server"

export interface ICategory {
  id: string
  type: string
  description?: string
}

export const GetCategories = async (): Promise<ICategory[]> => {
  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/categories`, {
      cache: "no-store",
    })

    if (!res.ok) return []

    const data = await res.json()
    return data?.data || data || []
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}
