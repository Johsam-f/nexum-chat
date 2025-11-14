import { Skeleton } from "@/components/ui/skeleton";

export default function Loading () {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="space-y-4">
          {/* Header skeleton */}
          <div className="flex items-start gap-6">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </div>
          {/* Stats skeleton */}
          <div className="flex gap-6 border-y py-4">
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-12 w-24" />
          </div>
        </div>
      </div>
  )
}