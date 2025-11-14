"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface MediaGridProps {
  userId: string;
}

export function MediaGrid({ userId }: MediaGridProps) {
  const posts = useQuery(api.posts.getPostsByUser, { userId });
  const mediaPosts = posts?.filter((post) => post.image) || [];

  if (posts === undefined) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (mediaPosts.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No media posts yet</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {mediaPosts.map((post) => (
        <div
          key={post._id}
          className="aspect-square overflow-hidden rounded-lg border hover:opacity-75 transition-opacity cursor-pointer"
        >
          <Image
            src={post.image!}
            alt="Media"
            className="w-full h-full object-cover"
            layout="fill"
          />
        </div>
      ))}
    </div>
  );
}
