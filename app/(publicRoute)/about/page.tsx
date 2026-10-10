import React from "react"
import Link from "next/link"
import {
  Home,
  ShieldCheck,
  Search,
  KeyRound,
  CreditCard,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export const instant = false

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="outline" className="text-primary border-primary/30 px-3 py-1 text-xs">
          About RentNest
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          The Modern Rental Marketplace Built on Trust
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          RentNest is an end-to-end property rental ecosystem that connects tenants directly with verified landlords, offering seamless browsing, verified listings, integrated lease requests, and secure escrow payments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="border shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="pt-6 space-y-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Search className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Verified Listings Only</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every property on RentNest is reviewed and moderated by platform administrators, ensuring accurate prices, genuine photos, and authentic landlord identities.
            </p>
          </CardContent>
        </Card>

        <Card className="border shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="pt-6 space-y-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <ShieldCheck className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Direct & Transparent Requests</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tenants submit rental requests directly to property managers with custom notes. Landlords review applicants in real time without middlemen or hidden broker fees.
            </p>
          </CardContent>
        </Card>

        <Card className="border shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="pt-6 space-y-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <CreditCard className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Secure Stripe Payments</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Once an application is approved, tenants pay rent seamlessly through Stripe-hosted checkouts. Every payment is logged with clear receipts and transaction history.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-2xl border bg-muted/30 p-8 sm:p-12 space-y-8">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Why RentNest?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Finding a new home or renting out your property shouldn&apos;t involve questionable classified ads, tedious paperwork, or uncertain payment handoffs. RentNest simplifies every step into one unified dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
              <CheckCircle2 className="size-4 text-emerald-500" />
              For Tenants
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Filter by category, search verified spaces, track inquiry statuses live, and pay securely.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
              <Building2 className="size-4 text-blue-500" />
              For Landlords
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              List homes with rich descriptions and photos, manage inquiries, and track incoming tenant payments.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
              <KeyRound className="size-4 text-amber-500" />
              Instant Booking Flow
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              From discovering a property to lease approval and card settlement in just a few clicks.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
              <Sparkles className="size-4 text-purple-500" />
              Curated Listings
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Explore featured residential and commercial spaces verified by our moderation team.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center py-6 space-y-4">
        <h3 className="text-xl font-bold text-foreground">
          Ready to discover your next space?
        </h3>
        <div className="flex justify-center gap-4">
          <Link href="/properties">
            <Button size="lg" className="gap-2 shadow-xs">
              Browse Properties
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="lg" variant="outline">
              Join RentNest
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
