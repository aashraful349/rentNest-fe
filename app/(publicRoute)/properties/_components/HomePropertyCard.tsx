import React from "react"
import { IProperty } from "@/lib/type"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import { Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GetAllProperties } from "@/services/GetAllProperties"
import { PropertyFilterQuery } from "@/lib/type"
import Link from "next/link"

type PropertyCardProps = {
  filters?: PropertyFilterQuery
}

const PropertyCard = async ({ filters }: PropertyCardProps) => {
  // Await directly on the server with optional filters
  const properties = await GetAllProperties(filters)
  const list: IProperty[] = (Array.isArray(properties) ? properties : (properties as any)?.data || []) as IProperty[]

  const availableProperties = list.filter(
    (property) => property.availability === "AVAILABLE"
  )

  const hasValidImage = (property: IProperty) => {
    const hasValidImage =
      property.pImage && property.pImage !== "Image not provided"
    return hasValidImage
  }

  if (availableProperties.length === 0) {
    return (
      <div className="py-16 text-center">
        <h3 className="text-lg font-semibold">No properties found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          No rentals matched your search criteria. Try different filters.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {availableProperties.map((property) => (
        <Card key={property.id}>
          <CardHeader>
            <CardTitle>{property.pName}</CardTitle>
            <p>Category: {property.category.type}</p>
            <CardDescription>Status: {property.availability}</CardDescription>
            <p>Location: {property.pLocation}</p>
          </CardHeader>
          <CardContent>
            <div className="relative h-48 w-full overflow-hidden rounded-md bg-muted">
              {hasValidImage(property) ? (
                <Image
                  src={property.pImage}
                  alt={property.pName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Building2 className="h-8 w-8 stroke-[1.5]" />
                  <span className="text-xs font-medium">
                    No Image Available
                  </span>
                </div>
              )}
            </div>
            <p className="mt-2 font-bold">Price: ${property.pPrice} </p>
          </CardContent>
          <CardFooter className="flex justify-between gap-2">
            <Link className="w-full" href={`/properties/${property.id}`}>
              <Button className="w-full">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default PropertyCard
