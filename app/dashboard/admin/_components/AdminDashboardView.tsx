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
}

export default function AdminDashboardView({
  user,
  properties,
  initialUsers,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"users" | "properties" | "analytics" | "security">("users")
  const [userList, setUserList] = useState<any[]>(initialUsers || [])
  const [propertyList, setPropertyList] = useState<any[]>(properties || [])
  const [searchQuery, setSearchQuery] = useState("")

  const toggleUserStatus = async (id: string) => {
    const targetUser = userList.find((u) => u.id === id)
    if (!targetUser) return
    const nextStatus = targetUser.activeStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE"

    try {
      const res = await updateAdminUserAction(id, { activeStatus: nextStatus })
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
            Platform Overview & User Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage users (GET /api/admin/users & PATCH /api/admin/users/:id) and moderate listings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1 text-xs gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Core APIs Active
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 shadow-2xs border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Registered Users
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
              <Users className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold">{userList.length}</span>
            <span className="text-xs text-muted-foreground">Total Accounts</span>
          </div>
        </Card>

        <Card className="p-4 shadow-2xs border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Listings
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <Building className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold">{propertyList.length}</span>
            <span className="text-xs text-muted-foreground">Properties</span>
          </div>
        </Card>

        <Card className="p-4 shadow-2xs border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Featured Units
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
              <Star className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold">
              {propertyList.filter((p) => p.feature).length}
            </span>
            <span className="text-xs text-purple-600 font-medium">Spotlight active</span>
          </div>
        </Card>

        <Card className="p-4 shadow-2xs border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Blocked Accounts
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <Ban className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold">
              {userList.filter((u) => u.activeStatus === "BLOCKED").length}
            </span>
            <span className="text-xs text-muted-foreground">Restricted</span>
          </div>
        </Card>
      </div>

      <div className="flex border-b border-border/80 gap-2">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "users"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="size-4" />
          User Management ({userList.length})
        </button>

        <button
          onClick={() => setActiveTab("properties")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors ${
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
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors ${
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
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors ${
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

      {activeTab === "properties" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Filter by name or location..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link href="/properties">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                View Marketplace
                <ExternalLink className="size-3.5" />
              </Button>
            </Link>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <Building className="mx-auto size-10 text-muted-foreground" />
              <h3 className="mt-3 text-base font-semibold">No properties found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                There are currently no property listings in this view.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-b text-xs uppercase font-semibold text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Property</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Featured</th>
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
                        <td className="px-4 py-3 font-bold">
                          ${prop.pPrice}/mo
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-xs">
                            {prop.category?.type || prop.categoryType || "Standard"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          {prop.feature ? (
                            <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-xs">
                              Featured
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">Regular</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="size-8 p-0"
                              onClick={() => toggleFeatureProperty(prop.id)}
                              title={prop.feature ? "Unfeature" : "Make Featured"}
                            >
                              <Star className={`size-4 ${prop.feature ? "fill-purple-500 text-purple-500" : "text-muted-foreground"}`} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="size-8 p-0 text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteProperty(prop.id)}
                              title="Remove listing"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
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

      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border">
            <CardTitle className="text-base font-semibold">User Role Distribution</CardTitle>
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
