"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

function PaymentCancelContent() {
  const searchParams = useSearchParams()

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-24">
      <Card className="border border-rose-500/20 bg-card p-6 shadow-lg text-center sm:p-10">
        <CardContent className="p-0 space-y-6">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/50">
            <XCircle className="size-10 text-rose-600 dark:text-rose-400" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Payment Cancelled
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your transaction was not completed. You were not charged, and your rental request remains in its current status.
            </p>
          </div>

          <div className="rounded-xl border border-dashed bg-muted/30 p-4 text-xs text-muted-foreground leading-relaxed">
            If you experienced an issue with Stripe or want to use a different payment card, you can retry anytime from your dashboard.
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/dashboard/tenant" className="w-full sm:w-auto">
              <Button className="w-full gap-2 shadow-xs">
                <ArrowLeft className="size-4" />
                Return to Dashboard
              </Button>
            </Link>

            <Link href="/contact" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full gap-2">
                <HelpCircle className="size-4" />
                Contact Support
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">Loading...</div>}>
      <PaymentCancelContent />
    </Suspense>
  )
}
