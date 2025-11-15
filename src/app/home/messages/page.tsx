"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyMessages } from "./_components/EmptyMessages";

export default function MessagesPage() {
  // TODO: Create getMyConversations query in Convex
  const conversations = useQuery(api.posts.getAllPosts); // Placeholder - will replace with actual conversations query
  const isLoading = conversations === undefined;

  const handleNewMessage = () => {
    // TODO: Implement new message functionality
    console.log("New message clicked");
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Connect and chat with your friends
          </p>
        </div>
        <Button onClick={handleNewMessage} className="gap-2">
          <Plus className="h-4 w-4" />
          New Message
        </Button>
      </div>

      {/* Messages List */}
      {isLoading ? (
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <Skeleton className="h-3 w-16" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <Skeleton className="h-3 w-16" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <Skeleton className="h-3 w-16" />
            </div>
          </Card>
        </div>
      ) : conversations && conversations.length === 0 ? (
        <EmptyMessages onNewMessage={handleNewMessage} />
      ) : (
        <div className="space-y-4">
          {/* TODO: Map through actual conversations when backend is ready */}
          <Card className="p-6">
            <p className="text-muted-foreground text-center">
              Messages functionality coming soon...
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
