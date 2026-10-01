"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Share2,
  Heart,
  Clock,
  Check,
  Sparkles,
  Info,
  DollarSign,
  Tag,
  PhoneCall,
  Send,
} from "lucide-react"

import { DProperty } from "@/lib/type"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type PropertyDetailsViewProps = {
  pid: string
  initialProperty: DProperty | null
}

export default function PropertyDetailsView({
  pid,
  initialProperty,
}: PropertyDetailsViewProps) {
  const [property] = useState<DProperty | null>(initialProperty)
  const [copied, setCopied] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isRequested, setIsRequested] = useState(false)

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleRequestRental = () => {
    setIsRequested(true)
  }

  const hasValidImage = (img?: string) => {
    return Boolean(
      img &&
        img !== "Image not provided" &&
        (img.startsWith("http") || img.startsWith("/"))
    )
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Recently listed"
    try {
      const d = new Date(dateStr)
      return isNaN(d.getTime())
        ? "Recently listed"
        : d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
    } catch {
      return "Recently listed"
    }
  }

  if (!property) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Building2 className="size-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Property Not Found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The property you are looking for does not exist or may have been removed.
        </p>
        <Link href="/properties" className="mt-6">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="size-4" />
            Back to Browse Properties
          </Button>
        </Link>
      </div>
    )
  }

  const isAvailable = property.availability === "AVAILABLE"

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Browse Properties
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-1.5 text-xs font-medium"
            title="Copy property link"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-600" />
                Copied Link!
              </>
            ) : (
              <>
                <Share2 className="size-3.5" />
                Share
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSaved(!isSaved)}
            className={`gap-1.5 text-xs font-medium transition-colors ${
              isSaved ? "text-rose-600 border-rose-200 bg-rose-50 dark:bg-rose-950/30" : ""
            }`}
            title="Save to favorites"
          >
            <Heart className={`size-3.5 ${isSaved ? "fill-rose-600" : ""}`} />
            {isSaved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="secondary" className="gap-1 px-2.5 py-0.5 text-xs font-semibold">
            <Tag className="size-3" />
            {property.category?.type || "Property"}
          </Badge>

          <Badge
            variant="outline"
            className={`gap-1.5 px-2.5 py-0.5 text-xs font-semibold ${
              isAvailable
                ? "border-emerald-300 text-emerald-700 bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:bg-emerald-950/40"
                : "border-amber-300 text-amber-700 bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:bg-amber-950/40"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                isAvailable ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            {property.availability}
          </Badge>

          {property.feature && (
            <Badge className="gap-1 bg-amber-500 text-white hover:bg-amber-600 px-2.5 py-0.5 text-xs font-semibold">
              <Sparkles className="size-3" />
              Featured
            </Badge>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
          {property.pName}
        </h1>

        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="size-4 text-primary shrink-0" />
            <span>{property.pLocation}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="size-4 text-muted-foreground shrink-0" />
            <span>Listed on {formatDate(property.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="relative h-[320px] sm:h-[440px] lg:h-[500px] w-full overflow-hidden rounded-2xl border bg-muted shadow-sm">
        {hasValidImage(property.pImage) ? (
          <Image
            src={property.pImage}
            alt={property.pName}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-muted/60 text-muted-foreground">
            <Building2 className="size-16 stroke-[1.25] text-muted-foreground/60" />
            <p className="text-sm font-medium">No Image Provided For This Listing</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border bg-card p-3.5 shadow-xs">
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                <DollarSign className="size-3.5 text-primary" />
                Rent
              </div>
              <p className="mt-1 text-base font-bold text-foreground truncate">
                ${property.pPrice}
                <span className="text-xs font-normal text-muted-foreground">/mo</span>
              </p>
            </div>

            <div className="rounded-xl border bg-card p-3.5 shadow-xs">
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                <Building2 className="size-3.5 text-primary" />
                Category
              </div>
              <p className="mt-1 text-base font-bold text-foreground truncate">
                {property.category?.type || "Standard"}
              </p>
            </div>

            <div className="rounded-xl border bg-card p-3.5 shadow-xs">
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                <CheckCircle2 className="size-3.5 text-primary" />
                Status
              </div>
              <p className="mt-1 text-base font-bold text-foreground truncate">
                {property.availability}
              </p>
            </div>

            <div className="rounded-xl border bg-card p-3.5 shadow-xs">
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                <ShieldCheck className="size-3.5 text-primary" />
                Verification
              </div>
              <p className="mt-1 text-base font-bold text-emerald-600 dark:text-emerald-400 truncate">
                Verified
              </p>
            </div>
          </div>

          <Card className="rounded-xl border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <Info className="size-5 text-primary" />
                About This Property
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-muted-foreground">
                {property.pDescription ||
                  "No detailed description provided for this listing. Please reach out to the landlord for further information and inquiries."}
              </p>
            </CardContent>
          </Card>

          {property.category?.description && (
            <Card className="rounded-xl border shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  Category: {property.category.type}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {property.category.description}
                </p>
              </CardContent>
            </Card>
          )}

          <div className="rounded-xl border bg-muted/30 p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Why rent through RentNest?
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>Verified landlord identity and genuine property records.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>Fast response guarantee — prompt reply from property manager.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>Transparent terms with zero hidden fees or surprise charges.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Building2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>Convenient neighborhood with accessible transportation.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border bg-card p-6 shadow-md space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Rental Price
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-foreground">
                  ${property.pPrice}
                </span>
                <span className="text-sm font-medium text-muted-foreground">/ month</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Availability</span>
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <span
                    className={`size-2 rounded-full ${
                      isAvailable ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  {property.availability}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Property Type</span>
                <span className="font-semibold text-foreground">
                  {property.category?.type || "Standard"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="font-semibold text-foreground truncate max-w-[160px] text-right">
                  {property.pLocation}
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2.5">
              {isRequested ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 p-3 text-center text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  <Check className="size-4 inline-block mr-1.5" />
                  Rental request submitted! The landlord will contact you soon.
                </div>
              ) : (
                <Button
                  size="lg"
                  disabled={!isAvailable}
                  onClick={handleRequestRental}
                  className="w-full gap-2 text-base font-semibold shadow-xs"
                >
                  <Send className="size-4" />
                  {isAvailable ? "Request For Rental" : "Currently Unavailable"}
                </Button>
              )}

              <Link href="/contact" className="block w-full">
                <Button variant="outline" size="lg" className="w-full gap-2 text-sm font-medium">
                  <PhoneCall className="size-4" />
                  Contact Support
                </Button>
              </Link>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              You won&apos;t be charged yet. Submission initiates a direct rental dialogue.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
