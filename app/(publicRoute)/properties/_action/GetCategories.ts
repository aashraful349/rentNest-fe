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
    const list: ICategory[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : []

    const seen = new Set<string>()
    const uniqueList: ICategory[] = []

    for (const item of list) {
      if (item && item.type) {
        const key = item.type.trim().toUpperCase()
        if (!seen.has(key)) {
          seen.add(key)
          uniqueList.push({
            id: item.id,
            type: item.type.trim(),
            description: item.description,
          })
        }
      }
    }

    return uniqueList
  } catch (error) {
    return []
  }
}
