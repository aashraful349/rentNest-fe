import React from "react"
import { GetAllProperties } from "../_action/GetAllProperties"
import { IProperty } from "@/lib/type"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import { Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const PropertyCard = async () => {
  // 1. Await directly on the server
  const properties = await GetAllProperties()
  const list: IProperty[] = Array.isArray(properties)
    ? properties
    : properties?.data || properties?.properties || []

  const availableProperties = list.filter(
    (property) => property.availability === "AVAILABLE"
  )

  const hasValidImage = (property: IProperty) => {
    const hasValidImage =
      property.pImage && property.pImage !== "Image not provided"
    return hasValidImage
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {availableProperties.map((property) => (
        <Card key={property.id}>
          <CardHeader>
            <CardTitle>{property.pName}</CardTitle>
            <CardDescription>{property.availability}</CardDescription>
            {/* <CardAction>Card Action</CardAction> */}
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
          </CardContent>
          <CardFooter>
            <Button className="w-full">View Details</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default PropertyCard
