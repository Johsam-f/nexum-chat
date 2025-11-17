"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { CommentCard } from "@/app/home/post/_components/CommentCard";
import { CommentForm } from "@/app/home/post/_components/CommentForm";
import { PostDetailLoading } from "@/app/home/post/_components/PostDetailLoading";
import { Separator } from "@/components/ui/separator";
import { Id } from "../../../../../convex/_generated/dataModel";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  // Validate ID format - Convex IDs start with 'k' followed by specific characters
  const isValidId = postId && /^k[a-z0-9]{31}$/.test(postId);

  const post = useQuery(
    api.posts.getPostById,
    isValidId ? { postId: postId as Id<"posts"> } : "skip"
  );
  const comments = useQuery(
    api.comments.getCommentsForPost,
    isValidId ? { postId: postId as Id<"posts"> } : "skip"
  );

  // Invalid ID format
  if (!isValidId) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-bold mb-2">Invalid Post ID</h2>
          <p className="text-muted-foreground mb-4">
            The post link you followed is invalid.
          </p>
          <Button onClick={() => router.push("/home")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  if (post === undefined || comments === undefined) {
    return <PostDetailLoading />;
  }

  if (post === null) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-bold mb-2">Post not found</h2>
          <p className="text-muted-foreground mb-4">
            This post may have been deleted or doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/home")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ScrollArea className="flex-1">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            {/* Back Button */}
            <div className="sticky top-0 z-10 bg-background border-b p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </div>

            <div className="px-4 pt-4">
              <PostCard post={post} showAuthor={true} />
            </div>            

            <div className="bg-background border-t mt-4">
              <CommentForm postId={postId as Id<"posts">} />
            </div>

            <Separator className="my-4" />

            {/* Comments Section */}
            <div className="px-4">
              <h2 className="text-lg font-semibold mb-4">
                Comments ({comments.length})
              </h2>

              {comments.length === 0 ? (
                <Card className="p-8 text-center mb-4">
                  <p className="text-muted-foreground">
                    No comments yet. Be the first to comment!
                  </p>
                </Card>
              ) : (
                <div className="space-y-1 mb-4">
                  {comments.map((comment) => (
                    <CommentCard key={comment._id} comment={comment} />
                  ))}
                </div>
              )}
            </div>
          
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
