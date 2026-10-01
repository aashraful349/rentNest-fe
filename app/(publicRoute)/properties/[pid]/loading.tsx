import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl mt-6 mb-20 px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40 rounded-md" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-10 w-2/3 max-w-lg rounded-md" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-44 rounded-md" />
          <Skeleton className="h-4 w-36 rounded-md" />
        </div>
      </div>

      <Skeleton className="h-[320px] sm:h-[440px] lg:h-[500px] w-full rounded-2xl" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card p-3.5 space-y-2">
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>

          <Card className="rounded-xl">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-44" />
            </CardHeader>
            <CardContent className="space-y-2.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </CardContent>
          </Card>

          <div className="rounded-xl border bg-muted/20 p-5 space-y-3">
            <Skeleton className="h-4 w-48" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-2xl border bg-card p-6 shadow-md space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-9 w-36" />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            <Separator />

            <div className="space-y-2.5">
              <Skeleton className="h-11 w-full rounded-md" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
