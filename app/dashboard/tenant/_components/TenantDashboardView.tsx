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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

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

  const handleCancelApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id))
    toast.success("Application withdrawn successfully")
  }

  const getStatusBadge = (status: string) => {
    if (status === "Approved" || status === "APPROVED") {
      return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">{status}</Badge>
    }
    if (status === "Under Review" || status === "PENDING") {
      return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">{status}</Badge>
    }
    return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">{status}</Badge>
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
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold">{applications.length}</span>
            <span className="text-xs text-muted-foreground">Total submitted</span>
          </div>
        </Card>

        <Card className="p-4 shadow-2xs border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Payments Made
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <CreditCard className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold">{payments.length}</span>
            <span className="text-xs text-muted-foreground">Recorded receipts</span>
          </div>
        </Card>

        <Card className="p-4 shadow-2xs border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Approved Leases
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold">
              {applications.filter((a) => a.status === "Approved" || a.status === "APPROVED").length}
            </span>
            <span className="text-xs text-amber-600 font-medium">Ready for payment</span>
          </div>
        </Card>

        <Card className="p-4 shadow-2xs border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tenant Status
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-sm font-bold text-foreground">Active</span>
            <span className="text-xs text-muted-foreground">Account Verified</span>
          </div>
        </Card>
      </div>

      <div className="flex border-b border-border/80 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("applications")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "applications"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="size-4" />
          Request History ({applications.length})
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
          Marketplace Units
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
            applications.map((app) => (
              <Card key={app.id} className="overflow-hidden border p-4 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {app.image || app.property?.pImage ? (
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
                        {getStatusBadge(app.status)}
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
                            ${app.price || app.property?.pPrice}
                          </span>
                          <span className="text-xs text-muted-foreground"> / month</span>
                        </div>
                      )}
                      <p className="text-[11px] text-muted-foreground">ID: #{app.id}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {(app.status === "Approved" || app.status === "APPROVED") && (
                        <Link href={`/dashboard/tenant/requests/${app.id}/pay`}>
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-xs">
                            <CreditCard className="size-3.5" />
                            Pay Rent
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
            ))
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
            <div className="rounded-xl border overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-b text-xs uppercase font-semibold text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Property / Ref</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Payment Method</th>
                      <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-semibold text-foreground">
                          {p.propertyName || p.rental?.property?.pName || `Payment #${p.id}`}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {p.date || p.createdAt || "Recent"}
                        </td>
                        <td className="px-4 py-3 font-bold text-foreground">
                          ${p.amount?.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {p.method || p.paymentMethod || "Stripe Payment"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                            {p.status || "Completed"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "recommended" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties && properties.length > 0 ? (
            properties.slice(0, 6).map((prop: any) => (
              <Card key={prop.id} className="overflow-hidden border p-0 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="relative h-40 w-full bg-muted">
                  {prop.pImage && prop.pImage !== "Image not provided" ? (
                    <Image
                      src={prop.pImage}
                      alt={prop.pName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground text-xs">
                      No image provided
                    </div>
                  )}
                  <Badge className="absolute top-2.5 left-2.5 bg-primary text-primary-foreground text-[10px]">
                    {prop.category?.type || prop.categoryType || "Property"}
                  </Badge>
                </div>
                <div className="p-3.5">
                  <h4 className="font-semibold text-sm line-clamp-1">{prop.pName}</h4>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" />
                    {prop.pLocation}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t pt-2.5">
                    <span className="font-bold text-sm text-foreground">
                      ${prop.pPrice}
                      <span className="text-[11px] font-normal text-muted-foreground">/mo</span>
                    </span>
                    <Link href={`/properties/${prop.id}`}>
                      <Button size="sm" className="h-7 text-xs">
                        View Unit
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              No active properties found on the marketplace.
            </div>
          )}
        </div>
      )}

      {activeTab === "profile" && (
        <Card className="border p-6 shadow-2xs max-w-2xl">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg">Tenant Credentials & Information</CardTitle>
            <CardDescription>Your account credentials and verified rental information.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Full Name</span>
                <p className="mt-1 text-sm font-medium">{user?.name || "Not specified"}</p>
              </div>
              <div className="rounded-lg border p-3">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Email</span>
                <p className="mt-1 text-sm font-medium flex items-center gap-1.5">
                  <Mail className="size-3.5 text-muted-foreground" />
                  {user?.email || "Not specified"}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Phone</span>
                <p className="mt-1 text-sm font-medium flex items-center gap-1.5">
                  <Phone className="size-3.5 text-muted-foreground" />
                  {user?.phone || "Phone not provided"}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Role</span>
                <div className="mt-1">
                  <Badge variant="outline" className="text-emerald-600 border-emerald-500/30">
                    {user?.role || "TENANT"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Bio & Introduction</span>
              <p className="mt-1 text-sm text-muted-foreground">
                {user?.bio && user.bio !== "Bio not provided" ? user.bio : "No bio provided yet."}
              </p>
            </div>
            <div className="pt-2">
              <Link href="/profile">
                <Button variant="outline" className="w-full sm:w-auto">
                  Edit Profile Information
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
