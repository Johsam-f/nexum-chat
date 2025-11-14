"use client";

import { Card } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { PostCard } from "@/components/PostCard";

interface LikedPostsProps {
  userId: string;
  isOwnProfile: boolean;
}

export function LikedPosts({ userId, isOwnProfile }: LikedPostsProps) {
    const likedPosts = useQuery(api.userProfiles.getLikedPostsByUser, { userId });
    
    if (likedPosts === undefined) {
        return null;
    }

    return (
        <div className="space-y-4">  
            {likedPosts.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-muted-foreground">
                        {isOwnProfile ? "You haven't" : "This user hasn't"} liked any posts yet
                    </p>
                </Card>
            ) : (
                likedPosts.map((post) => (
                    <PostCard 
                        key={post._id} 
                        post={post}
                        showAuthor={true}
                    />
                ))
            )}
        </div>
    );
}
