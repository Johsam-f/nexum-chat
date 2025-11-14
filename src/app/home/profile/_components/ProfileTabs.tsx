"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostsList } from "./PostsList";
import { LikedPosts } from "./LikedPosts";
import { MediaGrid } from "./MediaGrid";

interface ProfileTabsProps {
  profile: {
    userId: string;
    username: string;
  };
  isOwnProfile: boolean;
}

export function ProfileTabs({ profile, isOwnProfile }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="likes">Likes</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="mt-6">
        <PostsList userId={profile.userId} isOwnProfile={isOwnProfile} />
      </TabsContent>

      <TabsContent value="likes" className="mt-6">
        <LikedPosts userId={profile.userId} isOwnProfile={isOwnProfile} />
      </TabsContent>

      <TabsContent value="media" className="mt-6">
        <MediaGrid userId={profile.userId} />
      </TabsContent>
    </Tabs>
  );
}
