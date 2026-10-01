"use client"

import * as React from "react"
import { useActionState, useEffect, useState } from "react"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAction } from "../_action/authAction"
import { toast } from "sonner"

export function LoginPageComponent() {
  const [state, action, pending] = useActionState(loginAction, false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success(state.message || "Login successful")
    } else {
      toast.error(state.message || "Login failed")
    }
  }, [state])

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 flex flex-col items-center text-center">
        <Link href="/" className="group flex items-center gap-2 transition-transform hover:scale-105">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-md shadow-primary/20">
            R
          </div>
        </Link>
        <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to your RentNest account to continue
        </p>
      </div>

      <div className="rounded-2xl border bg-card/95 backdrop-blur-sm p-6 sm:p-8 shadow-xl shadow-black/5 ring-1 ring-border/50">
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="h-11 pl-10 rounded-lg text-sm bg-background border-border focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                className="h-11 pl-10 pr-10 rounded-lg text-sm bg-background border-border focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={pending}
              className="w-full h-11 gap-2 text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all"
            >
              {pending ? "Signing in..." : "Sign in to account"}
              {!pending && <ArrowRight className="size-4" />}
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-border text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Create one now
          </Link>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-4 text-emerald-500" />
        <span>Protected with 256-bit secure encryption</span>
      </div>
    </div>
  )
}
