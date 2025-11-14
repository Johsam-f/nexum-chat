"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { PostCard } from "@/components/PostCard";
import { Card } from "@/components/ui/card";

interface PostsListProps {
  userId: string;
  isOwnProfile?: boolean;
}

export function PostsList({ userId, isOwnProfile = false }: PostsListProps) {
  const posts = useQuery(api.posts.getPostsByUser, { userId });

  if (posts === undefined) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">
          {isOwnProfile ? "You haven't posted anything yet" : "This user hasn't posted anything yet"}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard 
          key={post._id} 
          post={post}
          showAuthor={false}
        />
      ))}
    </div>
  );
}
