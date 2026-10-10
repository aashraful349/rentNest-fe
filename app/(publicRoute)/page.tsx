import { Suspense } from "react"
import Link from "next/link"
import PropertyCard from "./_components/HomePropertyCard"
import { HomeSkeleton } from "./_components/HomeSkelaton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ShieldCheck,
  Search,
  Building2,
  CreditCard,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* RentNest Introduction Banner */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-b from-primary/5 via-card to-card p-6 sm:p-10 shadow-xs">
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-primary/30 text-primary px-3 py-1 text-xs">
              Welcome to RentNest
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              Verified Rentals in Bangladesh
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Find your ideal home with complete peace of mind.
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            RentNest is a transparent rental marketplace connecting tenants and landlords directly. Browse verified apartments, request leases without middlemen, and complete secure one-time payments in BDT with escrow protection.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/properties">
              <Button className="gap-2 shadow-xs">
                <Search className="size-4" />
                Explore All Listings
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="gap-2 shadow-2xs">
                About RentNest
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 pt-6 border-t">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="size-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Verified Homes</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Every listing is inspected and approved by RentNest admins.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Zero Broker Fees</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Direct tenant-to-landlord applications without hidden middleman fees.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <CreditCard className="size-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Secure Payments</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Transparent one-time checkout in BDT (৳) via Stripe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <Suspense fallback={<HomeSkeleton />}>
        <PropertyCard />
      </Suspense>
    </div>
  )
}
