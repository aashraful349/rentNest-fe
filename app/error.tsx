"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RotateCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full border border-destructive/20 shadow-lg text-center p-6 sm:p-8">
        <CardContent className="p-0 space-y-6">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="size-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Something went wrong
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {error?.message || "An unexpected error occurred while loading this page. Please try again."}
            </p>
            {error?.digest && (
              <p className="font-mono text-[11px] text-muted-foreground/70">
                Error Code: {error.digest}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => reset()}
              className="w-full sm:w-auto gap-2 shadow-xs"
            >
              <RotateCcw className="size-4" />
              Try Again
            </Button>

            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full gap-2">
                <Home className="size-4" />
                Return Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
