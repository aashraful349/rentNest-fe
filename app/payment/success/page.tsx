"use client"

import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  CheckCircle2,
  ArrowRight,
  Home,
  MessageSquare,
  ShieldCheck,
  Star,
  Loader2,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createReviewAction } from "@/services/review"
import { toast } from "sonner"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const [rentalRequestId, setRentalRequestId] = useState<string>("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [reviewError, setReviewError] = useState<string | null>(null)

  useEffect(() => {
    const urlParam = searchParams.get("rentalRequestId")
    if (urlParam) {
      setRentalRequestId(urlParam)
    } else if (typeof window !== "undefined") {
      const stored = localStorage.getItem("lastPaymentRentalRequestId")
      if (stored) {
        setRentalRequestId(stored)
      }
    }
  }, [searchParams])

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!rentalRequestId.trim()) {
      setReviewError("Rental request ID is required to associate your review.")
      return
    }

    if (!title.trim() || !description.trim()) {
      setReviewError("Please fill out both the review title and description.")
      return
    }

    setSubmitting(true)
    setReviewError(null)

    try {
      const res = await createReviewAction({
        rentalRequestId: rentalRequestId.trim(),
        title: title.trim(),
        description: description.trim(),
      })

      if (res?.success) {
        setReviewSubmitted(true)
        toast.success("Thank you! Your review has been submitted.")
        if (typeof window !== "undefined") {
          localStorage.removeItem("lastPaymentRentalRequestId")
        }
      } else {
        setReviewError(res?.message || "Failed to submit review. Please try again.")
        toast.error(res?.message || "Failed to submit review")
      }
    } catch (err: any) {
      setReviewError(err?.message || "An unexpected error occurred while submitting review.")
      toast.error("Failed to submit review")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <Card className="border border-emerald-500/20 bg-card p-6 shadow-sm text-center sm:p-8">
        <CardContent className="p-0 space-y-4">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
            <CheckCircle2 className="size-8 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Payment Successful!
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your rental payment was processed securely. Your booking is confirmed!
            </p>
          </div>

          <div className="rounded-xl border bg-muted/40 p-3.5 text-left text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="size-3.5" /> Paid & Completed
              </span>
            </div>
            {rentalRequestId && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rental Request ID</span>
                <span className="font-mono text-[11px] truncate max-w-[240px] text-foreground">
                  {rentalRequestId}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 pt-1 text-muted-foreground border-t">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              <span>Escrow agreement and receipt logged successfully.</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Star className="size-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Leave a Property Review</CardTitle>
              <CardDescription>
                Share your rental experience and feedback about the property.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {reviewSubmitted ? (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/50 p-6 text-center space-y-3 dark:bg-emerald-950/20">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                <Check className="size-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-foreground">Review Submitted!</h3>
              <p className="text-xs text-muted-foreground">
                Thank you for your valuable feedback. Your review will help future tenants find their ideal home.
              </p>
              <div className="pt-2">
                <Link href="/dashboard/tenant">
                  <Button className="gap-2 shadow-xs">
                    Go to Tenant Dashboard
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {reviewError && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                  {reviewError}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="rentalRequestId" className="text-xs font-semibold">
                  Rental Request ID
                </Label>
                <Input
                  id="rentalRequestId"
                  value={rentalRequestId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRentalRequestId(e.target.value)}
                  placeholder="e.g. 71991bba-752e-4b79-b92a-331730b3b76e"
                  required
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-semibold">
                  Review Headline / Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  placeholder="e.g. Fantastic apartment, smooth lease process!"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-semibold">
                  Detailed Experience
                </Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  placeholder="Describe the property condition, neighborhood, landlord responsiveness..."
                  rows={4}
                  required
                  className="flex min-h-[90px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <Link href="/dashboard/tenant" className="w-full sm:w-auto">
                  <Button type="button" variant="ghost" className="w-full text-xs">
                    Skip for now
                  </Button>
                </Link>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Submitting Review...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="size-4" />
                      Submit Review
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4 text-xs text-muted-foreground">
        <Link href="/dashboard/tenant" className="hover:text-foreground inline-flex items-center gap-1">
          <ArrowRight className="size-3.5" /> Tenant Dashboard
        </Link>
        <span>&bull;</span>
        <Link href="/properties" className="hover:text-foreground inline-flex items-center gap-1">
          <Home className="size-3.5" /> Browse Properties
        </Link>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">Loading payment confirmation...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
