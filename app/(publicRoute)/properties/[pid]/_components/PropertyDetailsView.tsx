"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
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
  Loader2,
  AlertCircle,
  LogIn,
  Star,
  MessageSquare,
  User,
} from "lucide-react"

import { DProperty } from "@/lib/type"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { requestRentalAction } from "@/services/tenant"

type CurrentUser = {
  id?: string
  role?: "TENANT" | "LANDLORD" | "ADMIN"
  email?: string
  name?: string
} | null

export type PropertyReview = {
  id: string
  title: string
  description: string
  createdAt?: string
  tenantId?: string
  user?: {
    name?: string
    email?: string
  }
}

type PropertyDetailsViewProps = {
  pid: string
  initialProperty: DProperty | null
  currentUser?: CurrentUser
  initialReviews?: PropertyReview[]
}

export default function PropertyDetailsView({
  pid,
  initialProperty,
  currentUser,
  initialReviews = [],
}: PropertyDetailsViewProps) {
  const router = useRouter()
  const [property] = useState<DProperty | null>(initialProperty)
  const [reviews] = useState<PropertyReview[]>(initialReviews)
  const [copied, setCopied] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isRequested, setIsRequested] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isTenant = currentUser?.role === "TENANT"
  const isLoggedIn = Boolean(currentUser)

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleRequestRental = async () => {
    if (!isLoggedIn) {
      router.push(`/auth/login?redirect=/properties/${pid}`)
      return
    }

    if (!isTenant) {
      setErrorMessage("Only tenants can request rentals. You are currently logged in as a " + currentUser?.role?.toLowerCase() + ".")
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const res = await requestRentalAction(pid)
      if (res?.success) {
        setIsRequested(true)
        router.refresh()
      } else {
        setErrorMessage(res?.message || "Failed to submit rental request. Please try again.")
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
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
        <div className="mb-4 rounded-full bg-muted p-4">
          <Building2 className="size-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Property Not Found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The property you are looking for does not exist or may have been
          removed.
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
              isSaved
                ? "border-rose-200 bg-rose-50 text-rose-600 dark:bg-rose-950/30"
                : ""
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
          <Badge
            variant="secondary"
            className="gap-1 px-2.5 py-0.5 text-xs font-semibold"
          >
            <Tag className="size-3" />
            {property.category?.type || "Property"}
          </Badge>

          <Badge
            variant="outline"
            className={`gap-1.5 px-2.5 py-0.5 text-xs font-semibold ${
              isAvailable
                ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                isAvailable ? "animate-pulse bg-emerald-500" : "bg-amber-500"
              }`}
            />
            {property.availability}
          </Badge>

          {property.feature && (
            <Badge className="gap-1 bg-amber-500 px-2.5 py-0.5 text-xs font-semibold text-white hover:bg-amber-600">
              <Sparkles className="size-3" />
              Featured
            </Badge>
          )}
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {property.pName}
        </h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="size-4 shrink-0 text-primary" />
            <span>{property.pLocation}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="size-4 shrink-0 text-muted-foreground" />
            <span>Listed on {formatDate(property.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="relative h-[320px] w-full overflow-hidden rounded-2xl border bg-muted shadow-sm sm:h-[440px] lg:h-[500px]">
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
            <p className="text-sm font-medium">
              No Image Provided For This Listing
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border bg-card p-3.5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <DollarSign className="size-3.5 text-primary" />
                Rent
              </div>
              <p className="mt-1 truncate text-base font-bold text-foreground">
                ৳{property.pPrice}
              </p>
            </div>

            <div className="rounded-xl border bg-card p-3.5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Building2 className="size-3.5 text-primary" />
                Category
              </div>
              <p className="mt-1 truncate text-base font-bold text-foreground">
                {property.category?.type || "Standard"}
              </p>
            </div>

            <div className="rounded-xl border bg-card p-3.5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <CheckCircle2 className="size-3.5 text-primary" />
                Status
              </div>
              <p className="mt-1 truncate text-base font-bold text-foreground">
                {property.availability}
              </p>
            </div>

            <div className="rounded-xl border bg-card p-3.5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="size-3.5 text-primary" />
                Verification
              </div>
              <p className="mt-1 truncate text-base font-bold text-emerald-600 dark:text-emerald-400">
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
              <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground sm:text-base">
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
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {property.category.description}
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="rounded-xl border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <Star className="size-5 text-amber-500 fill-amber-500" />
                  Tenant Reviews ({reviews.length})
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  Verified tenants feedback
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <div className="rounded-xl border border-dashed p-6 text-center text-muted-foreground">
                  <MessageSquare className="mx-auto size-8 text-muted-foreground/60" />
                  <p className="mt-2 text-sm font-medium">No reviews yet for this property</p>
                  <p className="text-xs text-muted-foreground">
                    Reviews from tenants who have completed rentals will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-xl border bg-muted/20 p-4 space-y-2 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold text-foreground text-sm">
                          {rev.title}
                        </h4>
                        <span className="text-[11px] text-muted-foreground">
                          {rev.createdAt ? formatDate(rev.createdAt) : "Recent"}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line">
                        {rev.description}
                      </p>
                      {rev.user?.name && (
                        <div className="flex items-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
                          <User className="size-3 text-primary" />
                          <span>Reviewed by {rev.user.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="rounded-xl border bg-muted/30 p-5">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Why rent through RentNest?
            </h3>
            <div className="grid grid-cols-1 gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <span>
                  Verified landlord identity and genuine property records.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <span>
                  Fast response guarantee — prompt reply from property manager.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <span>
                  Transparent terms with zero hidden fees or surprise charges.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Building2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <span>
                  Convenient neighborhood with accessible transportation.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6 rounded-2xl border bg-card p-6 shadow-md">
            <div className="space-y-1">
              <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Rental Price
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-foreground">
                  ৳{property.pPrice}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Availability</span>
                <span className="flex items-center gap-1.5 font-semibold text-foreground">
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
                <span className="max-w-[160px] truncate text-right font-semibold text-foreground">
                  {property.pLocation}
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2.5">
              {errorMessage && (
                <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {isRequested ? (
                <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center dark:bg-emerald-950/40">
                  <div className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                    <Check className="mr-1.5 inline-block size-4" />
                    Rental request submitted!
                  </div>
                  <Link href="/dashboard/tenant" className="block w-full">
                    <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs">
                      View in Dashboard
                    </Button>
                  </Link>
                </div>
              ) : !isLoggedIn ? (
                <Link href={`/auth/login?redirect=/properties/${pid}`} className="block w-full">
                  <Button
                    size="lg"
                    className="w-full gap-2 text-base font-semibold shadow-xs"
                  >
                    <LogIn className="size-4" />
                    Sign In to Request Rental
                  </Button>
                </Link>
              ) : !isTenant ? (
                <div className="rounded-lg border border-muted bg-muted/50 p-3 text-center text-xs text-muted-foreground">
                  Logged in as <span className="font-semibold">{currentUser?.role}</span>. Only tenants can request rentals.
                </div>
              ) : (
                <Button
                  size="lg"
                  disabled={!isAvailable || isSubmitting}
                  onClick={handleRequestRental}
                  className="w-full gap-2 text-base font-semibold shadow-xs"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      {isAvailable ? "Request for Rental" : "Currently Unavailable"}
                    </>
                  )}
                </Button>
              )}

              <Link href="/contact" className="block w-full">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full gap-2 text-sm font-medium"
                >
                  <PhoneCall className="size-4" />
                  Contact Support
                </Button>
              </Link>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              You won&apos;t be charged yet. Submission initiates a direct
              rental dialogue.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
