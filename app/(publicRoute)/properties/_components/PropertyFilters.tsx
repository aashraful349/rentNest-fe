"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition, useRef, useEffect } from "react"
import { Search, MapPin, Tag, DollarSign, RotateCcw, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ICategory } from "../_action/GetCategories"

type PropertyFiltersProps = {
  categories: ICategory[]
  locations?: string[]
}

export function PropertyFilters({ categories, locations = [] }: PropertyFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [price, setPrice] = useState(searchParams.get("price") || "")
  const [type, setType] = useState(searchParams.get("type") || "ALL")
  const [sort, setSort] = useState(searchParams.get("sort") || "")

  // Recommendations state
  const [showLocationRecommendations, setShowLocationRecommendations] = useState(false)
  const locationContainerRef = useRef<HTMLDivElement>(null)

  // Filter recommendations based on user input
  const filteredLocations = locations.filter((loc) =>
    loc.toLowerCase().includes(location.trim().toLowerCase())
  )

  // Close recommendations on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationContainerRef.current &&
        !locationContainerRef.current.contains(event.target as Node)
      ) {
        setShowLocationRecommendations(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const applyFilters = (
    nextLocation: string,
    nextPrice: string,
    nextType: string,
    nextSort: string
  ) => {
    const params = new URLSearchParams()

    if (nextLocation.trim()) params.set("location", nextLocation.trim())
    if (nextPrice.trim()) params.set("price", nextPrice.trim())
    if (nextType && nextType !== "ALL") params.set("type", nextType)
    if (nextSort) params.set("sort", nextSort)

    startTransition(() => {
      const query = params.toString()
      router.push(`${pathname}${query ? `?${query}` : ""}`)
      router.refresh()
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setShowLocationRecommendations(false)
    applyFilters(location, price, type, sort)
  }

  const handleSelectLocation = (selectedLoc: string) => {
    setLocation(selectedLoc)
    setShowLocationRecommendations(false)
    applyFilters(selectedLoc, price, type, sort)
  }

  const handleSortChange = (newSort: string) => {
    setSort(newSort)
    applyFilters(location, price, type, newSort)
  }

  const handleReset = () => {
    setLocation("")
    setPrice("")
    setType("ALL")
    setSort("")
    setShowLocationRecommendations(false)
    startTransition(() => {
      router.push(pathname)
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSearch} className="relative z-30 mb-8 rounded-xl border bg-card p-4 shadow-xs">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* 1. Location with Recommendations */}
        <div ref={locationContainerRef} className="relative">
          <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search location..."
            value={location}
            onFocus={() => setShowLocationRecommendations(true)}
            onClick={() => setShowLocationRecommendations(true)}
            onChange={(e) => {
              setLocation(e.target.value)
              setShowLocationRecommendations(true)
            }}
            className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-primary"
            autoComplete="off"
          />

          {/* Location Recommendations Dropdown */}
          {showLocationRecommendations && locations.length > 0 && (
            <div className="absolute left-0 top-full z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-md border bg-popover p-1 shadow-lg">
              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                Available Locations
              </div>
              {filteredLocations.length > 0 ? (
                filteredLocations.map((loc) => (
                  <button
                    type="button"
                    key={loc}
                    onClick={() => handleSelectLocation(loc)}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{loc}</span>
                  </button>
                ))
              ) : (
                <div className="px-2 py-2 text-xs text-muted-foreground">
                  No matching locations
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. Dynamic Categories from API */}
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Categories</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.type.toUpperCase()}>
                {cat.type}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Price */}
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="number"
            placeholder="Price..."
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* 4. Sort By Price */}
        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Sort by Price (Default)</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {/* 5. Action Buttons */}
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending} className="flex-1 gap-1.5">
            <Search className="size-4" />
            {isPending ? "Searching..." : "Search"}
          </Button>
          <Button type="button" variant="outline" onClick={handleReset} title="Reset filters">
            <RotateCcw className="size-4" />
          </Button>
        </div>
      </div>
    </form>
  )
}
