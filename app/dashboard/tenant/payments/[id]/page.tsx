import React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  CreditCard,
  Building2,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  User,
  MapPin,
  Receipt,
  FileText,
} from "lucide-react"

import { getPaymentDetailsById } from "@/services/tenant"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const instant = false

export default async function TenantPaymentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const res = await getPaymentDetailsById(id)
  const payment = res?.success ? res?.data : res?.data || (res?.id ? res : null)

  if (!payment) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <Receipt className="mx-auto size-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-bold">Payment Record Not Found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The requested payment details could not be found or you are not authorized to view them.
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

  const property = payment.rentalRequest?.property
  const user = payment.user

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
        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1 text-sm">
          {payment.status || "COMPLETED"}
        </Badge>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Payment Receipt
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Transaction ID: <span className="font-mono">{payment.id}</span>
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs text-muted-foreground uppercase tracking-wider block">
            Amount Paid
          </span>
          <span className="text-3xl font-extrabold text-foreground">
            ${payment.amount}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Building2 className="size-5 text-primary" />
                Property & Rental Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {property?.pName || "Rental Property"}
                </h3>
                {property?.pLocation && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-4 text-primary shrink-0" />
                    {property.pLocation}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/40 p-4 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">Rental Request ID</span>
                  <span className="font-mono text-xs font-semibold">{payment.rentalRequestId || payment.rentalRequest?.id}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Rental Status</span>
                  <span className="font-semibold text-emerald-600">{payment.rentalRequest?.status || "APPROVED"}</span>
                </div>
              </div>

              {property?.id && (
                <div className="pt-2">
                  <Link href={`/properties/${property.id}`}>
                    <Button variant="outline" size="sm" className="gap-2 text-xs">
                      <Building2 className="size-3.5" />
                      View Property Details
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <User className="size-5 text-primary" />
                Payer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">Tenant Name</span>
                  <span className="font-semibold text-foreground">{user?.name || "N/A"}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Email</span>
                  <span className="font-medium text-foreground">{user?.email || "N/A"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Payment Date</span>
                <span className="font-medium text-foreground">
                  {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "Recent"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Payment Status</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> {payment.status || "Completed"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Processor</span>
                <span className="font-medium text-foreground">Stripe Hosted</span>
              </div>

              <Separator />

              <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground space-y-2">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <ShieldCheck className="size-3.5 text-emerald-500" />
                  Stripe Payment Verified
                </div>
                <p>
                  This payment has been logged securely in the system escrow records.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
