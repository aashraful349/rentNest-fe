"use client"

import { getPropertyDetails } from "@/actions/GetPropertyDetails"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DProperty } from "@/lib/type"
import React from "react"

type ViewDetailsDialogProps = {
  PID: string
}

export function ViewDetailsDialog({ PID }: ViewDetailsDialogProps) {
  const [propertyDetails, setPropertyDetails] =
    React.useState<DProperty | null>(null)

  const handleClick = async () => {
    const data = await getPropertyDetails(PID)
    setPropertyDetails(data.data)
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button onClick={handleClick} className="w-[50%]" variant="outline">
            View Details
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {propertyDetails?.pName || "Property Details"}
          </DialogTitle>
          <DialogDescription>
            <p>Category: {propertyDetails?.category.type}</p>
            <p>
              Location: {propertyDetails?.pLocation || "No location available."}
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
          <p className="mt-2 font-bold">
            Price: ${propertyDetails?.pPrice || "N/A"}
          </p>
          <p className="mt-2 font-bold">
            Status: {propertyDetails?.availability || "N/A"}
          </p>
          <div className="relative h-48 w-full overflow-hidden rounded-md bg-muted">
            {propertyDetails?.pImage &&
            propertyDetails.pImage !== "Image not provided" ? (
              <img
                src={propertyDetails.pImage}
                alt={propertyDetails.pName}
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <span className="text-xs font-medium">No Image Available</span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-center  gap-2">
          <Button className="w-full" >
            Leave a Rent Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
