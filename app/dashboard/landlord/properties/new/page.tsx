"use client"

import * as React from "react"
import { useActionState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, PlusCircle, Building2, MapPin, DollarSign, Image as ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { createPropertyAction } from "@/services/landlord"
import { toast } from "sonner"

export default function CreatePropertyPage() {
  const [state, action, pending] = useActionState(createPropertyAction, false)

  useEffect(() => {
    if (!state) return
    if (!state.success && state.message) {
      toast.error(state.message)
    }
  }, [state])

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
          Create Property Listing
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Publish a new rental property to RentNest marketplace (POST /api/landlord/properties).
        </p>
      </div>

      <Card className="border p-6 shadow-2xs">
        <form action={action} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="pName">Property Title / Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="pName"
                name="pName"
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
                  placeholder="e.g. Downtown Manhattan, NY"
                  required
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pPrice">Monthly Rent ($ USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="pPrice"
                  name="pPrice"
                  type="number"
                  placeholder="e.g. 3200"
                  required
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoryType">Category</Label>
              <select
                id="categoryType"
                name="categoryType"
                defaultValue="APARTMENT"
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
              <Label htmlFor="pImage">Cover Image URL</Label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="pImage"
                  name="pImage"
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
              rows={4}
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
              <PlusCircle className="size-4" />
              {pending ? "Publishing..." : "Create Listing"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
