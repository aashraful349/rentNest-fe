"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Home,
  FileText,
  User,
  CheckCircle2,
  MapPin,
  Calendar,
  Search,
  Phone,
  Mail,
  Shield,
  CreditCard,
  Eye,
  Loader2,
  Receipt,
  MessageSquare,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { createPaymentAction } from "@/services/tenant"

type TenantDashboardProps = {
  user: any
  properties: any[]
  initialRentals?: any[]
  initialPayments?: any[]
}

export default function TenantDashboardView({
  user,
  properties,
  initialRentals,
  initialPayments,
}: TenantDashboardProps) {
  const [activeTab, setActiveTab] = useState<"applications" | "payments" | "recommended" | "profile">("applications")
  const [applications, setApplications] = useState<any[]>(initialRentals || [])
  const [payments, setPayments] = useState<any[]>(initialPayments || [])
  const [payingId, setPayingId] = useState<string | null>(null)

  const paidRentalRequestIds = new Set(
    payments
      .map((p) => p.rentalRequestId || p.rentalRequest?.id)
      .filter(Boolean)
  )

  const hasValidImage = (img?: string | null) => {
    return Boolean(
      img &&
        img !== "Image not provided" &&
        (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("/"))
    )
  }

  const handleCancelApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id))
    toast.success("Application withdrawn successfully")
  }

  const handleDirectPay = async (rentalRequestId: string) => {
    setPayingId(rentalRequestId)
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("lastPaymentRentalRequestId", rentalRequestId)
      }

      const res = await createPaymentAction(rentalRequestId)
      if (res?.success && res?.data?.paymentUrl) {
        toast.success("Redirecting to Stripe checkout...")
        window.location.href = res.data.paymentUrl
        return
      }
      if (res?.paymentUrl) {
        toast.success("Redirecting to Stripe checkout...")
        window.location.href = res.paymentUrl
        return
      }
      toast.error(res?.message || "Failed to create payment session")
    } catch {
      toast.error("Failed to create payment session")
    } finally {
      setPayingId(null)
    }
  }

  const getStatusBadge = (rawStatus: string, isPaid: boolean) => {
    const status = (rawStatus || "").toUpperCase()

    if (status === "ACTIVE" || isPaid) {
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
          ACTIVE
        </Badge>
      )
    }
    if (status === "APPROVED") {
      return (
        <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30">
          APPROVED
        </Badge>
      )
    }
    if (status === "REJECTED") {
      return (
        <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30">
          REJECTED
        </Badge>
      )
    }
    if (status === "COMPLETED") {
      return (
        <Badge className="bg-muted text-muted-foreground border-border">
          COMPLETED
        </Badge>
      )
    }
    return (
      <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30">
        PENDING
      </Badge>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-primary border-primary/30">
              Tenant Portal
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Shield className="size-3 text-emerald-500" /> Verified Tenant
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {user?.name || "Tenant"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your rental inquiries, payments, and discover matching properties.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/properties">
            <Button className="gap-2 shadow-xs">
              <Search className="size-4" />
              Browse Properties
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 shadow-2xs border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Applications
            </span>
            <FileText className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {applications.length}
          </p>
          <span className="text-xs text-muted-foreground">
            Active inquiries
          </span>
        </Card>

        <Card className="p-4 shadow-2xs border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Approved
            </span>
            <CheckCircle2 className="size-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {applications.filter((a) => a.status?.toUpperCase() === "APPROVED").length}
          </p>
          <span className="text-xs text-muted-foreground">
            Ready for payment
          </span>
        </Card>

        <Card className="p-4 shadow-2xs border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Payments
            </span>
            <CreditCard className="size-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {payments.length}
          </p>
          <span className="text-xs text-muted-foreground">
            Completed transactions
          </span>
        </Card>

        <Card className="p-4 shadow-2xs border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Saved Homes
            </span>
            <Home className="size-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">0</p>
          <span className="text-xs text-muted-foreground">
            Bookmarked listings
          </span>
        </Card>
      </div>

      <div className="flex border-b overflow-x-auto gap-4">
        <button
          onClick={() => setActiveTab("applications")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "applications"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="size-4" />
          My Rental Requests ({applications.length})
        </button>

        <button
          onClick={() => setActiveTab("payments")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "payments"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <CreditCard className="size-4" />
          Payment History ({payments.length})
        </button>

        <button
          onClick={() => setActiveTab("recommended")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "recommended"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Home className="size-4" />
          Recommended Homes
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "profile"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="size-4" />
          Tenant Profile
        </button>
      </div>

      {activeTab === "applications" && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <FileText className="mx-auto size-10 text-muted-foreground" />
              <h3 className="mt-3 text-base font-semibold">No rental requests found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You haven&apos;t submitted any rental requests yet. Explore the marketplace to find your home.
              </p>
              <Link href="/properties" className="mt-4 inline-block">
                <Button>Browse Properties</Button>
              </Link>
            </div>
          ) : (
            applications.map((app) => {
              const rawStatus = (app.status || "PENDING").toUpperCase()
              const isPaid = paidRentalRequestIds.has(app.id) || app.payment?.status === "COMPLETED" || Boolean(app.payment)
              const isActive = rawStatus === "ACTIVE" || isPaid
              const isApproved = rawStatus === "APPROVED" && !isPaid

              return (
                <Card key={app.id} className="overflow-hidden border p-4 shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {hasValidImage(app.image || app.property?.pImage) ? (
                          <Image
                            src={app.image || app.property?.pImage}
                            alt={app.propertyName || app.property?.pName || "Property"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                            Rental
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground text-base">
                            {app.propertyName || app.property?.pName || `Rental Request #${app.id}`}
                          </h3>
                          {getStatusBadge(rawStatus, isPaid)}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          {(app.location || app.property?.pLocation) && (
                            <span className="flex items-center gap-1">
                              <MapPin className="size-3.5" />
                              {app.location || app.property?.pLocation}
                            </span>
                          )}
                          {(app.landlord || app.property?.landLord?.name) && (
                            <span className="flex items-center gap-1">
                              <User className="size-3.5" />
                              Landlord: {app.landlord || app.property?.landLord?.name}
                            </span>
                          )}
                          {app.moveInDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="size-3.5" />
                              Move-in: {app.moveInDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0">
                      <div className="text-left sm:text-right">
                        {(app.price || app.property?.pPrice) && (
                          <div>
                            <span className="text-base font-bold text-foreground">
                              ৳{app.price || app.property?.pPrice}
                            </span>
                            
                          </div>
                        )}
                        <p className="text-[11px] text-muted-foreground">ID: #{app.id}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/tenant/requests/${app.id}`}>
                          <Button variant="outline" size="sm" className="gap-1.5 shadow-2xs">
                            <Eye className="size-3.5" />
                            View Details
                          </Button>
                        </Link>

                        {isApproved && (
                          <Button
                            size="sm"
                            disabled={payingId === app.id}
                            onClick={() => handleDirectPay(app.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-xs"
                          >
                            {payingId === app.id ? (
                              <>
                                <Loader2 className="size-3.5 animate-spin" />
                                Connecting...
                              </>
                            ) : (
                              <>
                                <CreditCard className="size-3.5" />
                                Pay Now
                              </>
                            )}
                          </Button>
                        )}

                        {isActive && (
                          <Link href={`/payment/success?rentalRequestId=${app.id}`}>
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-xs"
                            >
                              <MessageSquare className="size-3.5" />
                              Leave Review
                            </Button>
                          </Link>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelApplication(app.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      )}

      {activeTab === "payments" && (
        <div className="space-y-4">
          {payments.length === 0 ? (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <CreditCard className="mx-auto size-10 text-muted-foreground" />
              <h3 className="mt-3 text-base font-semibold">No payment records found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You haven&apos;t made any rental payments yet. Approved rental requests will appear with payment options.
              </p>
            </div>
          ) : (
            payments.map((p) => (
              <Card key={p.id} className="p-4 shadow-2xs border">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">
                      {p.rentalRequest?.property?.pName || p.propertyTitle || "Rental Payment"}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Transaction Date: {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : (p.date || "Recent")} &bull; Ref: #{p.id}
                    </p>
                    {p.rentalRequest?.property?.pLocation && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="size-3" />
                        {p.rentalRequest.property.pLocation}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-base font-bold text-foreground">
                      ৳{p.amount}
                    </span>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      {p.status || "Paid"}
                    </Badge>
                    <Link href={`/dashboard/tenant/payments/${p.id}`}>
                      <Button variant="outline" size="sm" className="gap-1.5 shadow-2xs">
                        <Receipt className="size-3.5" />
                        View Receipt
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === "recommended" && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.slice(0, 6).map((prop) => (
            <Card key={prop.id} className="overflow-hidden border shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div>
                <div className="relative h-48 w-full bg-muted">
                  {hasValidImage(prop.pImage) ? (
                    <Image
                      src={prop.pImage}
                      alt={prop.pName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <Home className="size-10" />
                    </div>
                  )}
                  <Badge className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur-xs">
                    {prop.category?.type || "Rental"}
                  </Badge>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-foreground text-base line-clamp-1">
                    {prop.pName}
                  </h4>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3.5" />
                    {prop.pLocation}
                  </p>
                  <p className="mt-3 text-lg font-bold text-primary">
                    ৳{prop.pPrice}
                    <span className="text-xs font-normal text-muted-foreground">
                      {" "}

                    </span>
                  </p>
                </div>
              </div>
              <div className="p-4 pt-0">
                <Link href={`/properties/${prop.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "profile" && (
        <Card className="max-w-2xl border shadow-2xs">
          <CardHeader>
            <CardTitle>Tenant Profile</CardTitle>
            <CardDescription>
              Manage your personal rental profile information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Full Name
                </label>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {user?.name || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Email Address
                </label>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {user?.email || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Role
                </label>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {user?.role || "TENANT"}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Account Status
                </label>
                <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                  <CheckCircle2 className="size-4" /> Active Tenant
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
