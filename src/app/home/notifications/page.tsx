"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyNotifications } from "./_components/EmptyNotifications";

export default function NotificationsPage() {
  // TODO: Create getMyNotifications query in Convex
  const notifications = useQuery(api.posts.getAllPosts); // Placeholder - will replace with actual notifications query
  const isLoading = notifications === undefined;

  const handleRefresh = () => {
    // TODO: Implement refresh functionality
    console.log("Refresh notifications clicked");
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">
          Stay updated with your latest activity
        </p>
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </Card>
        </div>
      ) : notifications && notifications.length === 0 ? (
        <EmptyNotifications onRefresh={handleRefresh} />
      ) : (
        <div className="space-y-4">
          {/* TODO: Map through actual notifications when backend is ready */}
          <Card className="p-6">
            <p className="text-muted-foreground text-center">
              Notifications functionality coming soon...
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}