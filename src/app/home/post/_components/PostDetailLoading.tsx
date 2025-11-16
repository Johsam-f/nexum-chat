import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export function PostDetailLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ScrollArea className="flex-1">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            {/* Back Button Skeleton */}
            <div className="sticky top-0 z-10 bg-background border-b p-4">
              <Skeleton className="h-9 w-20" />
            </div>

            {/* Post Skeleton */}
            <div className="px-4 pt-4">
              <Card className="p-6">
                {/* Post Header */}
                <div className="flex items-start gap-3 mb-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>

                {/* Post Content */}
                <div className="space-y-3 mb-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>

                {/* Post Actions */}
                <div className="flex items-center gap-2 pt-4 border-t">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16 ml-auto" />
                </div>
              </Card>
            </div>

            <Separator className="my-4" />

            {/* Comments Section Skeleton */}
            <div className="px-4">
              <Skeleton className="h-6 w-32 mb-4" />

              {/* Comment Skeletons */}
              <div className="space-y-4 mb-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 py-3">
                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="flex items-center gap-2 pt-1">
                        <Skeleton className="h-6 w-12" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comment Form Skeleton */}
            <div className="sticky bottom-0 bg-background border-t p-4">
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-20 w-full" />
                  <div className="flex justify-end">
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
