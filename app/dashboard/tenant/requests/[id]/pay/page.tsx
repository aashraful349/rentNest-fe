"use client"

import * as React from "react"
import { useState, use, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  ExternalLink,
  AlertCircle,
  Building2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createPaymentAction, getRentalRequestById } from "@/services/tenant"
import { toast } from "sonner"

export default function TenantPaymentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const requestId = resolvedParams.id
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [requestDetails, setRequestDetails] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function loadRequest() {
      try {
        const res = await getRentalRequestById(requestId)
        const data = res?.success ? res?.data : res?.data || (res?.id ? res : null)
        setRequestDetails(data)
      } catch {
      } finally {
        setFetching(false)
      }
    }
    loadRequest()
  }, [requestId])

  const handlePay = async () => {
    setLoading(true)
    setErrorMessage(null)

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("lastPaymentRentalRequestId", requestId)
      }

      const res = await createPaymentAction(requestId)

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

      setErrorMessage(res?.message || "Failed to create payment session. Please try again.")
      toast.error(res?.message || "Failed to create payment session")
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred while creating payment session.")
      toast.error("Failed to initiate payment")
    } finally {
      setLoading(false)
    }
  }

  const property = requestDetails?.property
  const rentPrice = property?.pPrice ? Number(property.pPrice) : null

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Link
        href="/dashboard/tenant"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Tenant Dashboard
      </Link>

      <div className="border-b pb-4">
        <Badge variant="outline" className="text-emerald-600 border-emerald-500/30">
          Stripe Secure Checkout
        </Badge>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Pay Rent
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete payment for rental request #{requestId}.
        </p>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <Card className="border p-6 shadow-2xs">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="size-5 text-primary" />
            {property?.pName || "Rental Property"}
          </CardTitle>
          <CardDescription>
            {property?.pLocation ? `Location: ${property.pLocation}` : "Secure checkout via Stripe"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 space-y-6">
          <div className="rounded-lg bg-muted/40 p-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Rental Request ID</span>
              <span className="font-mono text-xs font-semibold">{requestId}</span>
            </div>
            {rentPrice !== null && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Monthly Rent</span>
                <span className="font-bold text-foreground">${rentPrice.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Payment Processor</span>
              <span className="font-medium text-foreground">Stripe Hosted Checkout</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handlePay}
              disabled={loading || fetching}
              className="w-full gap-2 text-base font-semibold py-6 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Creating Stripe Checkout Session...
                </>
              ) : (
                <>
                  <CreditCard className="size-5" />
                  Pay with Stripe Checkout
                  <ExternalLink className="size-4 ml-1" />
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
              <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
              <span>You will be safely redirected to Stripe to enter your payment details.</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
