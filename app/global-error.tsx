"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertOctagon, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GlobalCriticalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Critical layout error:", error)
  }, [error])

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-background px-4 py-12 text-foreground font-sans">
        <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center shadow-2xl space-y-6">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertOctagon className="size-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Critical Error</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {error?.message || "An unrecoverable system error occurred."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => reset()}
              className="w-full sm:w-auto gap-2"
            >
              <RotateCcw className="size-4" />
              Reload Page
            </Button>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                Homepage
              </Button>
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
