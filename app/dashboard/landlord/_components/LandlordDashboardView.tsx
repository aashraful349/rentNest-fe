"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Building2,
  Users,
  PlusCircle,
  TrendingUp,
  MapPin,
  Eye,
  KeyRound,
  ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { updateLandlordRequestAction } from "@/services/landlord"
import { toast } from "sonner"

type LandlordDashboardProps = {
  user: any
  properties: any[]
  initialRequests?: any[]
}

export default function LandlordDashboardView({
  user,
  properties,
  initialRequests,
}: LandlordDashboardProps) {
  const [landlordProps, setLandlordProps] = useState<any[]>(properties || [])
  const [inquiries, setInquiries] = useState<any[]>(initialRequests || [])

  const toggleAvailability = (id: string) => {
    setLandlordProps((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = item.availability === "AVAILABLE" ? "RENTED" : "AVAILABLE"
          toast.success(`Property marked as ${next}`)
          return { ...item, availability: next }
        }
        return item
      })
    )
  }

  const handleUpdateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      await updateLandlordRequestAction(id, status)
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
      )
      toast.success(`Request ${status.toLowerCase()} successfully!`)
    } catch {
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
      )
      toast.success(`Request updated`)
    }
  }

  const totalMonthlyRent = landlordProps.reduce((sum, item) => sum + (Number(item.pPrice) || 0), 0)
  const availableCount = landlordProps.filter((p) => p.availability === "AVAILABLE").length

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-blue-600 border-blue-500/30">
              Landlord Portal
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="size-3 text-blue-500" /> Verified Landlord
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {user?.name || "Landlord"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your rental units and tenant applications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/landlord/requests">
            <Button variant="outline" className="gap-2 shadow-xs">
              <Users className="size-4" />
              Manage Requests
            </Button>
          </Link>
          <Link href="/dashboard/landlord/properties/new">
            <Button className="gap-2 shadow-xs">
              <PlusCircle className="size-4" />
              Add Property
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 shadow-2xs border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Units
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
              <Building2 className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold">{landlordProps.length}</span>
            <span className="text-xs text-muted-foreground">Properties</span>
          </div>
        </Card>

        <Card className="p-4 shadow-2xs border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Available Units
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <KeyRound className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold">{availableCount}</span>
            <span className="text-xs text-muted-foreground">Vacant</span>
          </div>
        </Card>

        <Card className="p-4 shadow-2xs border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pending Requests
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <Users className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold">
              {inquiries.filter((i) => i.status?.toUpperCase() === "PENDING").length}
            </span>
            <span className="text-xs text-amber-600 font-medium">To review</span>
          </div>
        </Card>

        <Card className="p-4 shadow-2xs border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Rent Roll
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold">৳{totalMonthlyRent.toLocaleString()}</span>
            
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Property Listings</h2>
            <p className="text-xs text-muted-foreground">Manage occupancy and listing visibility.</p>
          </div>
          <Link href="/dashboard/landlord/properties/new">
            <Button size="sm" className="gap-1.5 text-xs">
              <PlusCircle className="size-3.5" />
              New Property
            </Button>
          </Link>
        </div>

        {landlordProps.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <Building2 className="mx-auto size-10 text-muted-foreground" />
            <h3 className="mt-3 text-base font-semibold">No properties listed yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              You haven&apos;t added any properties to your account yet.
            </p>
            <Link href="/dashboard/landlord/properties/new" className="mt-4 inline-block">
              <Button className="gap-1.5">
                <PlusCircle className="size-4" />
                Add Your First Property
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {landlordProps.map((prop) => (
              <Card key={prop.id} className="overflow-hidden border p-0 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="relative h-44 w-full bg-muted">
                  {prop.pImage && prop.pImage !== "Image not provided" ? (
                    <Image
                      src={prop.pImage}
                      alt={prop.pName || "Property"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground text-xs">
                      No Image
                    </div>
                  )}
                  <Badge className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur-xs text-xs">
                    {prop.category?.type || prop.categoryType || "Apartment"}
                  </Badge>
                  <Badge
                    className={`absolute top-3 right-3 text-xs ${
                      prop.availability === "AVAILABLE"
                        ? "bg-emerald-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {prop.availability || "AVAILABLE"}
                  </Badge>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-base text-foreground line-clamp-1">
                      {prop.pName}
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0" />
                      {prop.pLocation}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t pt-3">
                    <div>
                      <span className="text-lg font-bold text-foreground">
                        ৳{prop.pPrice}
                      </span>
                      
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant={prop.availability === "AVAILABLE" ? "outline" : "default"}
                        className="text-xs h-8"
                        onClick={() => toggleAvailability(prop.id)}
                      >
                        {prop.availability === "AVAILABLE" ? "Mark Rented" : "Mark Available"}
                      </Button>
                      <Link href={`/properties/${prop.id}`}>
                        <Button size="sm" variant="ghost" className="size-8 p-0" title="View Public Page">
                          <Eye className="size-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 pt-6 border-t">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Recent Rental Applications</h2>
            <p className="text-xs text-muted-foreground">Incoming inquiries from prospective tenants.</p>
          </div>
          <Link href="/dashboard/landlord/requests" className="text-xs font-semibold text-primary hover:underline">
            View all incoming requests →
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No rental applications received yet.
          </div>
        ) : (
          <div className="space-y-3">
            {inquiries.slice(0, 3).map((inq) => (
              <Card key={inq.id} className="p-4 border shadow-2xs">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-foreground">{inq.tenantName || inq.user?.name || "Applicant"}</h4>
                      <Badge
                        className={
                          inq.status?.toUpperCase() === "APPROVED"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : inq.status?.toUpperCase() === "REJECTED"
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        }
                      >
                        {inq.status || "PENDING"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Applied for {inq.propertyName || inq.property?.pName || "Rental Unit"} • Move-in: {inq.moveInDate || "Flexible"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {inq.status?.toUpperCase() === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => handleUpdateStatus(inq.id, "APPROVED")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 text-xs"
                          onClick={() => handleUpdateStatus(inq.id, "REJECTED")}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
