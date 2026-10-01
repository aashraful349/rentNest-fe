"use server"

import { PropertyFilterQuery } from "@/lib/type"

export const GetAllProperties = async (filters?: PropertyFilterQuery) => {
  try {
    const params = new URLSearchParams()
    if (filters?.location) params.append("location", filters.location.trim())
    if (filters?.price) params.append("price", filters.price.trim())
    if (filters?.type && filters.type !== "ALL") {
      params.append("type", filters.type.trim())
    }
    if (filters?.sort) {
      params.append("sort", filters.sort.trim())
    }

    const queryString = params.toString()
    const url = `${process.env.BACKEND_API_URL}/api/properties${queryString ? `?${queryString}` : ""}`

    const res = await fetch(url, { cache: "no-store" })

    // When backend returns 404 on 0 matching properties, return []
    if (res.status === 404) {
      return []
    }

    if (!res.ok) {
      return []
    }

    const data = await res.json()
    let properties: any[] = data?.data || data || []

    // 1. Sort by price if requested (Low to High / High to Low)
    if (filters?.sort === "price-asc") {
      properties.sort((a, b) => Number(a.pPrice) - Number(b.pPrice))
    } else if (filters?.sort === "price-desc") {
      properties.sort((a, b) => Number(b.pPrice) - Number(a.pPrice))
    } else if (filters?.price && !isNaN(Number(filters.price))) {
      // 2. Default to proximity if target price was provided
      const target = Number(filters.price)
      properties.sort((a, b) => {
        return Math.abs(Number(a.pPrice) - target) - Math.abs(Number(b.pPrice) - target)
      })
    }

    return properties
  } catch (error) {
    console.error("Error fetching properties:", error)
    return []
  }
}
