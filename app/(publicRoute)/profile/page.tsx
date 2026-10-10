import React from "react"
import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Home,
  Building,
} from "lucide-react"

import { getMe } from "@/services/getMe"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const instant = false

export default async function ProfilePage() {
  const userRes = await getMe()

  if (!userRes?.success || !userRes?.data) {
    redirect("/auth/login?redirect=/profile")
  }

  const user = userRes.data

  const hasValidImage = (img?: string | null) => {
    return Boolean(
      img &&
        img !== "Image not provided" &&
        (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("/"))
    )
  }

  const getDashboardLink = (role: string) => {
    if (role === "ADMIN") return "/dashboard/admin"
    if (role === "LANDLORD") return "/dashboard/landlord"
    return "/dashboard/tenant"
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={getDashboardLink(user.role)}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>

        <Badge
          variant="outline"
          className={
            user.role === "ADMIN"
              ? "text-amber-600 border-amber-500/30"
              : user.role === "LANDLORD"
              ? "text-blue-600 border-blue-500/30"
              : "text-emerald-600 border-emerald-500/30"
          }
        >
          {user.role} Account
        </Badge>
      </div>

      <Card className="overflow-hidden border shadow-sm">
        <div className="h-32 bg-gradient-to-r from-primary/15 via-primary/5 to-muted border-b" />
        <CardContent className="relative pt-0 pb-6 px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 mb-6">
            <div className="flex items-end gap-4">
              <div className="relative size-24 sm:size-28 shrink-0 overflow-hidden rounded-2xl border-4 border-card bg-muted shadow-md">
                {hasValidImage(user.image) ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User Avatar"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                    <User className="size-12 stroke-[1.5]" />
                  </div>
                )}
              </div>
              <div className="space-y-1 mb-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {user.name}
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Mail className="size-3.5" />
                  {user.email}
                </p>
              </div>
            </div>

            <Link href={getDashboardLink(user.role)}>
              <Button className="gap-2 shadow-xs">
                {user.role === "ADMIN" ? (
                  <Shield className="size-4" />
                ) : user.role === "LANDLORD" ? (
                  <Building className="size-4" />
                ) : (
                  <Home className="size-4" />
                )}
                Go to Portal
              </Button>
            </Link>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Personal Information
              </h3>
              <div className="space-y-3 rounded-xl border bg-muted/20 p-4 text-sm">
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <User className="size-4" />
                    Full Name
                  </span>
                  <span className="font-semibold text-foreground">{user.name}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Mail className="size-4" />
                    Email
                  </span>
                  <span className="font-semibold text-foreground">{user.email}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Phone className="size-4" />
                    Phone
                  </span>
                  <span className="font-semibold text-foreground">
                    {user.phone && user.phone !== "Phone not provided" ? user.phone : "Not provided"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Shield className="size-4" />
                    Account Status
                  </span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    <CheckCircle2 className="size-3 mr-1" />
                    {user.activeStatus || "ACTIVE"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Bio & Membership
              </h3>
              <div className="space-y-4 rounded-xl border bg-muted/20 p-4 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">
                    About / Bio
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {user.bio && user.bio !== "Bio not provided"
                      ? user.bio
                      : "No personal bio has been set yet."}
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    Member since
                  </span>
                  <span className="font-medium text-foreground">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }) : "Recent"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
