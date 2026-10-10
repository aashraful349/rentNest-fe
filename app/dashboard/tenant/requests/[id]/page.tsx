import React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Building2,
  Calendar,
  CreditCard,
  MapPin,
  Clock,
  ShieldCheck,
  FileText,
  DollarSign,
  MessageSquare,
} from "lucide-react"

import { getRentalRequestById } from "@/services/tenant"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const instant = false

export default async function RentalRequestDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const res = await getRentalRequestById(id)

  const request = res?.success ? res?.data : res?.data || (res?.id ? res : null)

  if (!request) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <FileText className="mx-auto size-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-bold">Rental Request Not Found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The requested rental record could not be loaded or you are not authorized to view it.
        </p>
        <Link href="/dashboard/tenant" className="mt-6 inline-block">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  const rawStatus = (request.status || "PENDING").toUpperCase()
  const isPaid = request.payment?.status === "COMPLETED" || Boolean(request.payment)
  const isApproved = rawStatus === "APPROVED" && !isPaid
  const isActive = rawStatus === "ACTIVE" || isPaid

  const getStatusBadge = () => {
    if (isActive) {
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-sm px-3 py-1">
          ACTIVE
        </Badge>
      )
    }
    if (rawStatus === "APPROVED") {
      return (
        <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30 text-sm px-3 py-1">
          APPROVED
        </Badge>
      )
    }
    if (rawStatus === "REJECTED") {
      return (
        <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 text-sm px-3 py-1">
          REJECTED
        </Badge>
      )
    }
    if (rawStatus === "COMPLETED") {
      return (
        <Badge className="bg-muted text-muted-foreground border-border text-sm px-3 py-1">
          COMPLETED
        </Badge>
      )
    }
    return (
      <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-sm px-3 py-1">
        PENDING
      </Badge>
    )
  }

  const property = request.property

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/tenant"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>
        {getStatusBadge()}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Rental Request Details
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Request ID: <span className="font-mono">{request.id}</span>
          </p>
        </div>

        {isApproved && (
          <Link href={`/dashboard/tenant/requests/${request.id}/pay`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-xs">
              <CreditCard className="size-4" />
              Pay Now
            </Button>
          </Link>
        )}

        {isActive && (
          <Link href={`/payment/success?rentalRequestId=${request.id}`}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-xs">
              <MessageSquare className="size-4" />
              Leave Review
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Building2 className="size-5 text-primary" />
                Property Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {property?.pName || "Property"}
                </h3>
                {property?.pLocation && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-4 text-primary shrink-0" />
                    {property.pLocation}
                  </p>
                )}
              </div>

              {property?.pDescription && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Description
                  </h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {property.pDescription}
                  </p>
                </div>
              )}

              {property?.id && (
                <div className="pt-2">
                  <Link href={`/properties/${property.id}`}>
                    <Button variant="outline" size="sm" className="gap-2 text-xs">
                      <Building2 className="size-3.5" />
                      View Full Property Page
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <MessageSquare className="size-5 text-primary" />
                Message from Tenant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {request.message || "No specific message left with this request."}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Rental Price</span>
                <span className="font-bold text-foreground">
                  ৳{property?.pPrice || 0}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium text-foreground">
                  {rawStatus}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Submitted On</span>
                <span className="text-foreground">
                  {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>

              <Separator />

              <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground space-y-2">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <ShieldCheck className="size-3.5 text-emerald-500" />
                  Verified Application
                </div>
                <p>
                  Your request is routed directly to the property landlord. You will receive updates as the landlord reviews your request.
                </p>
              </div>

              {isApproved && (
                <Link href={`/dashboard/tenant/requests/${request.id}/pay`} className="block w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-xs">
                    <CreditCard className="size-4" />
                    Pay Now
                  </Button>
                </Link>
              )}

              {isActive && (
                <Link href={`/payment/success?rentalRequestId=${request.id}`} className="block w-full">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-xs">
                    <MessageSquare className="size-4" />
                    Leave Review
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
