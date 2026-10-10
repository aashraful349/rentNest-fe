import { Suspense } from "react"
import PropertyCard from "./_components/BrowsePropertyCard"
import { HomeSkeleton } from "../_components/HomeSkelaton"
import { PropertyFilters } from "./_components/PropertyFilters"
import { GetCategories, ICategory } from "./_action/GetCategories"
import { GetAllProperties } from "@/services/GetAllProperties"
import { PropertyFilterQuery } from "@/lib/type"

async function PropertyFiltersSection() {
  const [categories, allProperties] = await Promise.all([
    GetCategories(),
    GetAllProperties(),
  ])

  const propertyList = (
    Array.isArray(allProperties) ? allProperties : (allProperties as any)?.data || []
  )

  const availableProperties = propertyList.filter(
    (p: any) => p.availability === "AVAILABLE"
  )

  const availableCategoryMap = new Map<string, ICategory>()

  for (const p of availableProperties) {
    if (p.category?.type) {
      const typeKey = p.category.type.trim().toUpperCase()
      if (!availableCategoryMap.has(typeKey)) {
        const matched = categories.find(
          (c) => c.type?.trim().toUpperCase() === typeKey
        )
        availableCategoryMap.set(typeKey, {
          id: matched?.id || p.category.id || typeKey,
          type: matched?.type || p.category.type,
          description: matched?.description || p.category.description,
        })
      }
    }
  }

  const availableCategories = Array.from(availableCategoryMap.values())

  const locations: string[] = Array.from(
    new Set(
      availableProperties
        .map((p: any) => p.pLocation?.trim())
        .filter(Boolean) as string[]
    )
  ).sort()

  return <PropertyFilters categories={availableCategories} locations={locations} />
}

export default function PropertyListPage({
  searchParams,
}: {
  searchParams: Promise<PropertyFilterQuery>
}) {
  return (
    <div className="mx-auto max-w-7xl mt-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Browse Properties</h1>
        <p className="text-sm text-muted-foreground">
          Find rental properties by location, type, and price.
        </p>
      </div>

      <Suspense fallback={<div className="mb-6 h-16 w-full animate-pulse rounded-xl bg-muted" />}>
        <PropertyFiltersSection />
      </Suspense>

      <Suspense fallback={<HomeSkeleton />}>
        <PropertyCard filters={searchParams} />
      </Suspense>
    </div>
  )
}
