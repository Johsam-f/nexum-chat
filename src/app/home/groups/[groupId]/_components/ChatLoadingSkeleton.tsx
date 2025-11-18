import { Skeleton } from "@/components/ui/skeleton";

export function ChatLoadingSkeleton() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header Skeleton */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>

      {/* Messages Skeleton */}
      <div className="flex-1 p-4 space-y-4">
        {/* Left message */}
        <div className="flex gap-3">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-16 w-[200px] rounded-2xl" />
          </div>
        </div>

        {/* Right message */}
        <div className="flex gap-3 flex-row-reverse">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <Skeleton className="h-16 w-[180px] rounded-2xl" />
        </div>

        {/* Left message */}
        <div className="flex gap-3">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-20 w-60 rounded-2xl" />
          </div>
        </div>

        {/* Right message */}
        <div className="flex gap-3 flex-row-reverse">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <Skeleton className="h-12 w-40 rounded-2xl" />
        </div>
      </div>

      {/* Input Skeleton */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Skeleton className="h-[60px] flex-1 rounded-md" />
          <Skeleton className="h-[60px] w-[60px] rounded-md" />
        </div>
      </div>
    </div>
  );
}
