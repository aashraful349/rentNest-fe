import Link from "next/link"
import { FileQuestion, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full border border-border shadow-lg text-center p-6 sm:p-8">
        <CardContent className="p-0 space-y-6">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <FileQuestion className="size-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              404 Error
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Page Not Found
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The page you are looking for doesn&apos;t exist, has been removed, or is temporarily unavailable.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full gap-2 shadow-xs">
                <Home className="size-4" />
                Go to Homepage
              </Button>
            </Link>

            <Link href="/properties" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="size-4" />
                Browse Properties
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
