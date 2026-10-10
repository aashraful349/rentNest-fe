"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

function PaymentRedirectContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const success = searchParams.get("success")

  useEffect(() => {
    const savedRequestId = typeof window !== "undefined" ? localStorage.getItem("lastPaymentRentalRequestId") : null
    const param = savedRequestId ? `?rentalRequestId=${savedRequestId}` : ""

    if (success === "true") {
      router.replace(`/payment/success${param}`)
    } else if (success === "false") {
      router.replace("/payment/cancel")
    } else {
      router.replace("/dashboard/tenant")
    }
  }, [success, router])

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="animate-pulse text-sm text-muted-foreground">
        Processing payment outcome...
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">Loading...</div>}>
      <PaymentRedirectContent />
    </Suspense>
  )
}
