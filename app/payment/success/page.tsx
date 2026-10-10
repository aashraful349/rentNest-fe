"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, ArrowRight, Home, CreditCard, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-24">
      <Card className="border border-emerald-500/20 bg-card p-6 shadow-lg text-center sm:p-10">
        <CardContent className="p-0 space-y-6">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
            <CheckCircle2 className="size-10 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Payment Successful!
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your rental payment was processed successfully through Stripe. Your booking is confirmed and your receipt has been generated.
            </p>
          </div>

          <div className="rounded-xl border bg-muted/40 p-4 text-left text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Payment Status</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="size-3.5" /> Completed
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Processed By</span>
              <span className="font-medium text-foreground">Stripe Checkout</span>
            </div>
            {sessionId && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Session ID</span>
                <span className="font-mono text-[11px] truncate max-w-[200px] text-foreground">
                  {sessionId}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 pt-1 text-muted-foreground border-t">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              <span>Escrow agreement and payment confirmation recorded.</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/dashboard/tenant" className="w-full sm:w-auto">
              <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs">
                Go to Tenant Dashboard
                <ArrowRight className="size-4" />
              </Button>
            </Link>

            <Link href="/properties" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full gap-2">
                <Home className="size-4" />
                Browse More Properties
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">Loading payment details...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
