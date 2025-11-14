import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return(
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                    <Skeleton className="h-20 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                </Card>
            ))}
        </div>
    )
}