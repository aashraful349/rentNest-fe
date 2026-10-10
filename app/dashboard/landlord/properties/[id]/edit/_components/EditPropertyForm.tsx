"use client"

import * as React from "react"
import { useActionState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Building2, MapPin, DollarSign, Image as ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { updatePropertyFormAction } from "@/services/landlord"
import { toast } from "sonner"

type EditPropertyFormProps = {
  property: any
}

export default function EditPropertyForm({ property }: EditPropertyFormProps) {
  const [state, action, pending] = useActionState(updatePropertyFormAction, false)

  useEffect(() => {
    if (!state) return
    if (!state.success && state.message) {
      toast.error(state.message)
    }
  }, [state])

  const initialCategory =
    property?.category?.type ||
    property?.type ||
    property?.categoryType ||
    "APARTMENT"

  const initialAvailability =
    property?.availability === "UNAVAILABLE" ? "UNAVAILABLE" : "AVAILABLE"

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Link
        href="/dashboard/landlord"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Landlord Dashboard
      </Link>

      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Edit Property Listing
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update listing details, pricing, availability, and description.
        </p>
      </div>

      <Card className="border p-6 shadow-2xs">
        <form action={action} className="space-y-5">
          <input type="hidden" name="id" value={property?.id || ""} />

          <div className="space-y-2">
            <Label htmlFor="pName">Property Title / Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="pName"
                name="pName"
                defaultValue={property?.pName || ""}
                placeholder="e.g. Modern Sunset Penthouse"
                required
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pLocation">Location / Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="pLocation"
                  name="pLocation"
                  defaultValue={property?.pLocation || ""}
                  placeholder="e.g. Downtown Manhattan, NY"
                  required
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pPrice">Rental Price (BDT ৳)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="pPrice"
                  name="pPrice"
                  type="number"
                  defaultValue={property?.pPrice || ""}
                  placeholder="e.g. 3200"
                  required
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Category</Label>
              <select
                id="type"
                name="type"
                defaultValue={initialCategory.toUpperCase()}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="APARTMENT">APARTMENT</option>
                <option value="HOUSE">HOUSE</option>
                <option value="STUDIO">STUDIO</option>
                <option value="OFFICE">OFFICE</option>
                <option value="SHOP">SHOP</option>
                <option value="WAREHOUSE">WAREHOUSE</option>
                <option value="LAND">LAND</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability Status</Label>
              <select
                id="availability"
                name="availability"
                defaultValue={initialAvailability}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="UNAVAILABLE">UNAVAILABLE</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pImage">Cover Image URL</Label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="pImage"
                  name="pImage"
                  defaultValue={property?.pImage === "Image not provided" ? "" : property?.pImage || ""}
                  placeholder="https://example.com/property.jpg"
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pDescription">Description & Amenities</Label>
            <textarea
              id="pDescription"
              name="pDescription"
              rows={5}
              required
              defaultValue={property?.pDescription || ""}
              placeholder="Describe bedrooms, bathrooms, square footage, heating, and amenities..."
              className="flex w-full rounded-md border border-input bg-background p-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Link href="/dashboard/landlord">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={pending} className="gap-2">
              <Save className="size-4" />
              {pending ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

