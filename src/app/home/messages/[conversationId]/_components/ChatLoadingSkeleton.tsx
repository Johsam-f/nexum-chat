import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ChatLoadingSkeleton() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header Skeleton */}
      <div className="border-b p-4 flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Messages Skeleton */}
      <div className="flex-1 p-4 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "flex gap-2",
              i % 2 === 0 && "flex-row-reverse"
            )}
          >
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-16 w-48" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Input Skeleton */}
      <div className="border-t p-4">
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}
