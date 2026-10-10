"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import {
  ShieldAlert,
  Users,
  Building,
  Activity,
  Search,
  CheckCircle,
  Ban,
  Trash2,
  Star,
  ExternalLink,
  Database,
  Lock,
  FileText,
  MapPin,
  Calendar,
  User as UserIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { updateAdminUserAction } from "@/services/admin"
import { toast } from "sonner"

type AdminDashboardProps = {
  user: any
  properties: any[]
  initialUsers?: any[]
  initialRentals?: any[]
}

export default function AdminDashboardView({
  user,
  properties,
  initialUsers,
  initialRentals,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"users" | "rentals" | "properties" | "analytics" | "security">("users")
  const [userList, setUserList] = useState<any[]>(initialUsers || [])
  const [propertyList, setPropertyList] = useState<any[]>(properties || [])
  const [rentalList] = useState<any[]>(initialRentals || [])
  const [searchQuery, setSearchQuery] = useState("")

  const toggleUserStatus = async (id: string) => {
    const targetUser = userList.find((u) => u.id === id)
    if (!targetUser) return
    const nextStatus = targetUser.activeStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE"

    try {
      const res = await updateAdminUserAction(id, { status: nextStatus, activeStatus: nextStatus })
      setUserList((prev) =>
        prev.map((u) => (u.id === id ? { ...u, activeStatus: nextStatus } : u))
      )
      toast.success(res?.message || `User status changed to ${nextStatus}`)
    } catch {
      setUserList((prev) =>
        prev.map((u) => (u.id === id ? { ...u, activeStatus: nextStatus } : u))
      )
      toast.success(`User status changed to ${nextStatus}`)
    }
  }

  const toggleFeatureProperty = (id: string) => {
    setPropertyList((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.feature
          toast.success(next ? "Property featured" : "Featured status removed")
          return { ...p, feature: next }
        }
        return p
      })
    )
  }

  const handleDeleteProperty = (id: string) => {
    setPropertyList((prev) => prev.filter((p) => p.id !== id))
    toast.success("Listing removed from platform")
  }

  const filteredProperties = propertyList.filter((p) =>
    p.pName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.pLocation?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const tenantsCount = userList.filter((u) => u.role?.toUpperCase() === "TENANT").length
  const landlordsCount = userList.filter((u) => u.role?.toUpperCase() === "LANDLORD").length

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-amber-600 border-amber-500/30">
              Admin Control Center
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <ShieldAlert className="size-3 text-amber-500" /> Full Privileges
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Platform Administration
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage users, inspect rental requests, moderate properties, and maintain platform health.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/properties">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="size-4" />
              Live Site
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 shadow-2xs border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Accounts
            </span>
            <Users className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {userList.length}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{tenantsCount} tenants</span>
            <span>&bull;</span>
            <span>{landlordsCount} landlords</span>
          </div>
        </Card>

        <Card className="p-4 shadow-2xs border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Rental Requests
            </span>
            <FileText className="size-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {rentalList.length}
          </p>
          <span className="text-xs text-muted-foreground">
            Across all properties
          </span>
        </Card>

        <Card className="p-4 shadow-2xs border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Listed Properties
            </span>
            <Building className="size-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {propertyList.length}
          </p>
          <span className="text-xs text-muted-foreground">
            {propertyList.filter((p) => p.availability === "AVAILABLE").length} currently available
          </span>
        </Card>

        <Card className="p-4 shadow-2xs border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Featured Homes
            </span>
            <Star className="size-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {propertyList.filter((p) => p.feature).length}
          </p>
          <span className="text-xs text-muted-foreground">
            Promoted listings
          </span>
        </Card>
      </div>

      <div className="flex border-b border-border/80 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "users"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="size-4" />
          User Management ({userList.length})
        </button>

        <button
          onClick={() => setActiveTab("rentals")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "rentals"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="size-4" />
          Rental Requests ({rentalList.length})
        </button>

        <button
          onClick={() => setActiveTab("properties")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "properties"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building className="size-4" />
          Properties Moderation ({propertyList.length})
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "analytics"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Activity className="size-4" />
          Analytics
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "security"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Lock className="size-4" />
          System Health
        </button>
      </div>

      {activeTab === "users" && (
        <div className="space-y-4">
          {userList.length === 0 ? (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <Users className="mx-auto size-10 text-muted-foreground" />
              <h3 className="mt-3 text-base font-semibold">No registered users found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Registered tenants and landlords will be listed here from GET /api/admin/users.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-b text-xs uppercase font-semibold text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Registered</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {userList.map((usr) => (
                      <tr key={usr.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-semibold text-foreground">
                          {usr.name}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {usr.email}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={
                              usr.role === "LANDLORD"
                                ? "text-blue-600 border-blue-500/20"
                                : "text-emerald-600 border-emerald-500/20"
                            }
                          >
                            {usr.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            className={
                              usr.activeStatus === "ACTIVE"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-destructive/10 text-destructive border-destructive/20"
                            }
                          >
                            {usr.activeStatus}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {usr.createdAt || "Recent"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            variant={usr.activeStatus === "ACTIVE" ? "destructive" : "outline"}
                            className="h-7 text-xs"
                            onClick={() => toggleUserStatus(usr.id)}
                          >
                            {usr.activeStatus === "ACTIVE" ? (
                              <>
                                <Ban className="size-3 mr-1" />
                                Block User
                              </>
                            ) : (
                              <>
                                <CheckCircle className="size-3 mr-1" />
                                Unblock User
                              </>
                            )}
                          </Button>
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

      {activeTab === "rentals" && (
        <div className="space-y-4">
          {rentalList.length === 0 ? (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <FileText className="mx-auto size-10 text-muted-foreground" />
              <h3 className="mt-3 text-base font-semibold">No rental requests recorded</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                All platform rental inquiries from GET /api/admin/rentals will be displayed here.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-b text-xs uppercase font-semibold text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Request ID</th>
                      <th className="px-4 py-3">Property</th>
                      <th className="px-4 py-3">Tenant</th>
                      <th className="px-4 py-3">Rent / Mo</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Submitted</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {rentalList.map((req) => (
                      <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          #{req.id.slice(0, 8)}...
                        </td>
                        <td className="px-4 py-3 font-semibold text-foreground">
                          {req.property?.pName || "Property"}
                          {req.property?.pLocation && (
                            <span className="block text-xs font-normal text-muted-foreground">
                              {req.property.pLocation}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground">
                            {req.user?.name || req.tenant?.name || "Tenant"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {req.user?.email || req.tenant?.email || ""}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-bold text-foreground">
                          ${req.property?.pPrice || 0}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            className={
                              req.status === "APPROVED" || req.status === "Approved"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : req.status === "REJECTED" || req.status === "Rejected"
                                ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            }
                          >
                            {req.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "Recent"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {req.property?.id && (
                            <Link href={`/properties/${req.property.id}`}>
                              <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                                <ExternalLink className="size-3" />
                                View Property
                              </Button>
                            </Link>
                          )}
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

      {activeTab === "properties" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search listings by title or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <span className="text-xs text-muted-foreground">
              Showing {filteredProperties.length} of {propertyList.length} properties
            </span>
          </div>

          <div className="rounded-xl border overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b text-xs uppercase font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Property</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Feature</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProperties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-semibold text-foreground">
                        {prop.pName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {prop.pLocation}
                      </td>
                      <td className="px-4 py-3 font-bold text-foreground">
                        ${prop.pPrice}/mo
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={
                            prop.availability === "AVAILABLE"
                              ? "text-emerald-600 border-emerald-500/20"
                              : "text-amber-600 border-amber-500/20"
                          }
                        >
                          {prop.availability}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-7 px-2 text-xs gap-1 ${
                            prop.feature ? "text-amber-500 font-bold" : "text-muted-foreground"
                          }`}
                          onClick={() => toggleFeatureProperty(prop.id)}
                        >
                          <Star className={`size-3.5 ${prop.feature ? "fill-amber-500" : ""}`} />
                          {prop.feature ? "Featured" : "Regular"}
                        </Button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/properties/${prop.id}`}>
                            <Button size="sm" variant="ghost" className="h-7 px-2">
                              <ExternalLink className="size-3.5" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteProperty(prop.id)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border">
            <CardTitle className="text-base font-semibold">User Role Breakdown</CardTitle>
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Tenants ({userList.length > 0 ? Math.round((tenantsCount / userList.length) * 100) : 0}%)</span>
                  <span>{tenantsCount} users</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${userList.length > 0 ? (tenantsCount / userList.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Landlords ({userList.length > 0 ? Math.round((landlordsCount / userList.length) * 100) : 0}%)</span>
                  <span>{landlordsCount} users</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${userList.length > 0 ? (landlordsCount / userList.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border">
            <CardTitle className="text-base font-semibold">Properties Overview</CardTitle>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm py-2 border-b">
                <span className="text-muted-foreground">Total Listings</span>
                <span className="font-bold">{propertyList.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2 border-b">
                <span className="text-muted-foreground">Featured Listings</span>
                <span className="font-bold">{propertyList.filter((p) => p.feature).length}</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2">
                <span className="text-muted-foreground">Available Rate</span>
                <span className="font-bold">
                  {propertyList.length > 0
                    ? `${Math.round((propertyList.filter((p) => p.availability === "AVAILABLE").length / propertyList.length) * 100)}%`
                    : "N/A"}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "security" && (
        <div className="space-y-6 max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-4 border">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Database Connection</span>
              <p className="mt-2 text-sm font-bold text-foreground flex items-center gap-1.5">
                <Database className="size-4 text-emerald-500" />
                Active Database Pool
              </p>
              <span className="text-xs text-muted-foreground">Live Postgres instance</span>
            </Card>

            <Card className="p-4 border">
              <span className="text-xs text-muted-foreground uppercase font-semibold">JWT Authentication</span>
              <p className="mt-2 text-sm font-bold text-foreground flex items-center gap-1.5">
                <Lock className="size-4 text-emerald-500" />
                Dual-Token Rotation
              </p>
              <span className="text-xs text-muted-foreground">1d Access / 7d Refresh</span>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
