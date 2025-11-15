"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyFriends } from "./_components/EmptyFriends";

export default function FriendsPage() {
  const router = useRouter();
  // TODO: Create getMyFriends query in Convex
  const friends = useQuery(api.posts.getAllPosts); // Placeholder - will replace with actual friends query
  const isLoading = friends === undefined;

  const handleDiscover = () => {
    router.push("/home/discover");
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Friends</h1>
        <p className="text-muted-foreground">
          Your network of connections
        </p>
      </div>

      {/* Friends List */}
      {isLoading ? (
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          </Card>
        </div>
      ) : friends && friends.length === 0 ? (
        <EmptyFriends onDiscover={handleDiscover} />
      ) : (
        <div className="space-y-4">
          {/* TODO: Map through actual friends when backend is ready */}
          <Card className="p-6">
            <p className="text-muted-foreground text-center">
              Friends functionality coming soon...
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
