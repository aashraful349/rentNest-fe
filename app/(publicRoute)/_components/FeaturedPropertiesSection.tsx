"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Building2, Sparkles, MapPin, ArrowRight } from "lucide-react"
import { IProperty } from "@/lib/type"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Props = {
  initialProperties: IProperty[]
}

export default function FeaturedPropertiesSection({ initialProperties }: Props) {
  const [properties, setProperties] = useState<IProperty[]>(initialProperties)

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("adminFeaturedOverrides") || "{}")
        if (stored && Object.keys(stored).length > 0) {
          setProperties((prev) =>
            prev.map((p) => {
              if (stored[p.id] !== undefined) {
                return { ...p, feature: stored[p.id] }
              }
              return p
            })
          )
        }
      } catch {}
    }
  }, [])

  const availableProperties = properties.filter((property) => {
    const isAvail = property.availability === "AVAILABLE"
    const isFeat = property.feature === true
    return isAvail && isFeat
  })

  const hasValidImage = (property: IProperty) => {
    return Boolean(
      property.pImage &&
      property.pImage !== "Image not provided" &&
      (property.pImage.startsWith("http://") ||
       property.pImage.startsWith("https://") ||
       property.pImage.startsWith("/"))
    )
  }

  return (
    <div className="space-y-6 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-400 gap-1 px-2.5 py-0.5 text-xs">
              <Sparkles className="size-3 fill-amber-500" />
              Handpicked Homes
            </Badge>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Featured Properties
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Top-rated and verified rentals chosen by the RentNest team.
          </p>
        </div>

        <Link href="/properties">
          <Button variant="outline" size="sm" className="gap-1.5 shadow-2xs">
            View All Properties
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </div>

      {availableProperties.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <Building2 className="mx-auto size-10 text-muted-foreground" />
          <h3 className="mt-3 text-base font-semibold">No Featured Properties Right Now</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
            Browse our full catalog to explore all available apartments and houses.
          </p>
          <Link href="/properties" className="mt-4 inline-block">
            <Button size="sm">Browse Catalog</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {availableProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden border shadow-2xs transition-all hover:shadow-sm flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-1 text-lg font-bold">{property.pName}</CardTitle>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {property.category?.type || "Rental"}
                  </Badge>
                </div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <MapPin className="size-3 text-primary shrink-0" />
                  {property.pLocation}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative h-48 w-full overflow-hidden rounded-md bg-muted">
                  {hasValidImage(property) ? (
                    <Image
                      src={property.pImage}
                      alt={property.pName}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Building2 className="h-8 w-8 stroke-[1.5]" />
                      <span className="text-xs font-medium">No Image Available</span>
                    </div>
                  )}
                  <Badge className="absolute top-2.5 right-2.5 bg-amber-500 text-white border-0 gap-1 text-[11px] shadow-xs">
                    <Sparkles className="size-3 fill-white" />
                    Featured
                  </Badge>
                </div>
                <div className="pt-1">
                  <span className="text-xs text-muted-foreground block">Rent Price</span>
                  <p className="text-xl font-extrabold text-primary">
                    ৳{Number(property.pPrice || 0).toLocaleString()}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Link className="w-full" href={`/properties/${property.id}`}>
                  <Button className="w-full shadow-2xs">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
