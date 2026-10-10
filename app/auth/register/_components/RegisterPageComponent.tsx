"use client"

import * as React from "react"
import { useActionState, useEffect, useState } from "react"
import Link from "next/link"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  User,
  Phone,
  Home,
  Building,
  Check,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerAction } from "../_action/registerAction"
import { toast } from "sonner"

export function RegisterPageComponent() {
  const [state, action, pending] = useActionState(registerAction, false)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"TENANT" | "LANDLORD">("TENANT")

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success(state.message || "Account created successfully!")
    } else {
      toast.error(state.message || "Registration failed")
    }
  }, [state])

  return (
    <div className="w-full max-w-lg">
      <div className="mb-6 flex flex-col items-center text-center">
        <Link
          href="/"
          className="group flex items-center gap-2 transition-transform hover:scale-105"
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground shadow-md shadow-primary/20">
            R
          </div>
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Create an account
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Join RentNest to find or list your next home
        </p>
      </div>

      <div className="rounded-2xl border bg-card/95 p-6 shadow-xl shadow-black/5 ring-1 ring-border/50 backdrop-blur-sm sm:p-8">
        <form action={action} className="space-y-4">
          <input type="hidden" name="role" value={selectedRole} />

          <div className="space-y-2">
            <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              I want to
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("TENANT")}
                className={`relative flex flex-col items-start gap-1 rounded-xl border p-3.5 text-left transition-all ${
                  selectedRole === "TENANT"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border bg-background hover:border-border/80 hover:bg-muted/40"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <div
                    className={`flex size-8 items-center justify-center rounded-lg ${
                      selectedRole === "TENANT"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Home className="size-4" />
                  </div>
                  {selectedRole === "TENANT" && (
                    <div className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3" />
                    </div>
                  )}
                </div>
                <span className="mt-1 text-sm font-semibold text-foreground">
                  Rent a Home
                </span>
                <span className="text-[11px] text-muted-foreground leading-tight">
                  Browse and apply for properties
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("LANDLORD")}
                className={`relative flex flex-col items-start gap-1 rounded-xl border p-3.5 text-left transition-all ${
                  selectedRole === "LANDLORD"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border bg-background hover:border-border/80 hover:bg-muted/40"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <div
                    className={`flex size-8 items-center justify-center rounded-lg ${
                      selectedRole === "LANDLORD"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Building className="size-4" />
                  </div>
                  {selectedRole === "LANDLORD" && (
                    <div className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3" />
                    </div>
                  )}
                </div>
                <span className="mt-1 text-sm font-semibold text-foreground">
                  List Properties
                </span>
                <span className="text-[11px] text-muted-foreground leading-tight">
                  Manage rentals and tenants
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
            >
              Full Name
            </Label>
            <div className="relative">
              <User className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                className="h-11 rounded-lg border-border bg-background pl-10 text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="h-11 rounded-lg border-border bg-background pl-10 text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
            >
              Phone Number <span className="text-muted-foreground/60 lowercase">(optional)</span>
            </Label>
            <div className="relative">
              <Phone className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+88 01712345678"
                className="h-11 rounded-lg border-border bg-background pl-10 text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="h-11 rounded-lg border-border bg-background pr-10 pl-10 text-sm focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={pending}
              className="h-11 w-full gap-2 rounded-lg text-sm font-semibold shadow-xs transition-all hover:shadow-sm"
            >
              {pending ? "Creating account..." : "Create account"}
              {!pending && <ArrowRight className="size-4" />}
            </Button>
          </div>
        </form>

        <div className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Sign in
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
