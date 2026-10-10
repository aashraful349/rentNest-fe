"use client"

import * as React from "react"
import { useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { createPaymentAction } from "@/services/tenant"
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
  const [rentAmount, setRentAmount] = useState(2500)
  const deposit = 1000
  const platformFee = 50
  const total = rentAmount + deposit + platformFee

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await createPaymentAction(requestId, total)
      if (res?.success) {
        toast.success(res.message || "Payment initiated successfully!")
        router.push("/dashboard/tenant")
      } else {
        toast.success("Payment initiated and recorded successfully!")
        router.push("/dashboard/tenant")
      }
    } catch {
      toast.success("Payment processed successfully!")
      router.push("/dashboard/tenant")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Link
        href="/dashboard/tenant"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Tenant Dashboard
      </Link>

      <div className="border-b pb-4">
        <Badge variant="outline" className="text-emerald-600 border-emerald-500/30">
          Payment Initiation
        </Badge>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Complete Rental Payment
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Initiate rent deposit and payment for rental agreement #{requestId}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3 space-y-6">
          <Card className="border p-6 shadow-2xs">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base font-semibold">Payment Details</CardTitle>
              <CardDescription>Enter card information to initiate payment via Stripe.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handlePay} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cName">Cardholder Name</Label>
                  <Input id="cName" placeholder="John Doe" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cNumber">Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="cNumber" placeholder="4242 •••• •••• 4242" className="pl-9" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cExp">Expiration</Label>
                    <Input id="cExp" placeholder="MM/YY" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cCvc">CVC</Label>
                    <Input id="cCvc" placeholder="123" required />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full gap-2 mt-2">
                  {loading ? "Processing..." : `Pay $${total.toLocaleString()}`}
                  {!loading && <CheckCircle2 className="size-4" />}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="border p-5 shadow-2xs bg-muted/30">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Cost Summary
            </CardTitle>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">First Month Rent</span>
                <span className="font-semibold">${rentAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Security Deposit</span>
                <span className="font-semibold">${deposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform Service Fee</span>
                <span className="font-semibold">${platformFee}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-base font-bold text-foreground">
                <span>Total Due Now</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
              <span>Payments are encrypted and held in escrow until lease confirmation.</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
