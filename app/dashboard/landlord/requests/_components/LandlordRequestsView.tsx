"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Users,
  Building2,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  DollarSign,
  Calendar,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { updateLandlordRequestAction } from "@/services/landlord"
import { toast } from "sonner"

type RequestItem = {
  id: string
  tenantName?: string
  tenantEmail?: string
  tenantPhone?: string
  propertyName?: string
  monthlyIncome?: string
  moveInDate?: string
  status: string
  user?: {
    name?: string
    email?: string
    phone?: string
  }
  property?: {
    pName?: string
  }
}

type LandlordRequestsViewProps = {
  initialRequests: RequestItem[]
}

export default function LandlordRequestsView({ initialRequests }: LandlordRequestsViewProps) {
  const [requests, setRequests] = useState<RequestItem[]>(initialRequests || [])
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL")

  const handleUpdate = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      const res = await updateLandlordRequestAction(id, status)
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      )
      if (status === "APPROVED") {
        toast.success(res?.message || "Request approved successfully!")
      } else {
        toast.error(res?.message || "Request rejected.")
      }
    } catch {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      )
      toast.success(`Request ${status.toLowerCase()} successfully!`)
    }
  }

  const filtered = requests.filter((r) => {
    if (filter === "ALL") return true
    return r.status?.toUpperCase() === filter
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Link
        href="/dashboard/landlord"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Landlord Dashboard
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <Badge variant="outline" className="text-blue-600 border-blue-500/30">
            Incoming Applications
          </Badge>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Manage Rental Requests
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review, approve, and decline rental applications from tenants.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={filter === "ALL" ? "default" : "outline"}
            onClick={() => setFilter("ALL")}
          >
            All ({requests.length})
          </Button>
          <Button
            size="sm"
            variant={filter === "PENDING" ? "default" : "outline"}
            onClick={() => setFilter("PENDING")}
          >
            Pending
          </Button>
          <Button
            size="sm"
            variant={filter === "APPROVED" ? "default" : "outline"}
            onClick={() => setFilter("APPROVED")}
          >
            Approved
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <Users className="mx-auto size-10 text-muted-foreground" />
            <h3 className="mt-3 text-base font-semibold">No rental requests found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              There are currently no incoming rental applications matching this filter.
            </p>
          </div>
        ) : (
          filtered.map((req) => (
            <Card key={req.id} className="p-5 border shadow-2xs">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base text-foreground">
                      {req.tenantName || req.user?.name || "Applicant"}
                    </h4>
                    <Badge
                      className={
                        req.status?.toUpperCase() === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : req.status?.toUpperCase() === "REJECTED"
                          ? "bg-destructive/10 text-destructive border-destructive/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      }
                    >
                      {req.status || "PENDING"}
                    </Badge>
                  </div>

                  <p className="mt-1 text-xs font-medium text-primary flex items-center gap-1">
                    <Building2 className="size-3.5" />
                    Unit: {req.propertyName || req.property?.pName || "Rental Property"}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
                    {(req.tenantEmail || req.user?.email) && (
                      <span className="flex items-center gap-1">
                        <Mail className="size-3" />
                        {req.tenantEmail || req.user?.email}
                      </span>
                    )}
                    {(req.tenantPhone || req.user?.phone) && (
                      <span className="flex items-center gap-1">
                        <Phone className="size-3" />
                        {req.tenantPhone || req.user?.phone}
                      </span>
                    )}
                    {req.monthlyIncome && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="size-3" />
                        Income: {req.monthlyIncome}
                      </span>
                    )}
                    {req.moveInDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        Move-in: {req.moveInDate}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t md:border-t-0 md:pt-0">
                  {req.status?.toUpperCase() === "PENDING" ? (
                    <>
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                        onClick={() => handleUpdate(req.id, "APPROVED")}
                      >
                        <CheckCircle2 className="size-3.5" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-1"
                        onClick={() => handleUpdate(req.id, "REJECTED")}
                      >
                        <XCircle className="size-3.5" />
                        Decline
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground font-medium">Status Updated</span>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
