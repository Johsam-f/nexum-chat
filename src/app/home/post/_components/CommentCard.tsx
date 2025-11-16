"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

interface CommentCardProps {
  comment: {
    _id: Id<"comments">;
    userId: string;
    content: string;
    createdAt: number;
    likeCount?: number;
    isLikedByCurrentUser?: boolean;
  };
}

export function CommentCard({ comment }: CommentCardProps) {
  const currentUser = useQuery(api.auth.getCurrentUser);
  const authorProfile = useQuery(api.userProfiles.getProfile, {
    userId: comment.userId,
  });
  const likeComment = useMutation(api.comments.likeComment);
  const unlikeComment = useMutation(api.comments.unlikeComment);

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

  const handleLikeToggle = async () => {
    if (!currentUser) return;

    try {
      if (comment.isLikedByCurrentUser) {
        await unlikeComment({ commentId: comment._id });
      } else {
        await likeComment({ commentId: comment._id });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const authorName = authorProfile?.username || "User";
  const authorAvatar = authorProfile?.avatar || undefined;
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <div className="flex gap-3 py-3">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={authorAvatar} />
        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
          {authorInitial}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm">{authorName}</span>
          {authorProfile?.isVerified && (
            <span className="text-blue-500 text-xs">✓</span>
          )}
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        </div>

        <p className="text-sm text-foreground mb-2 whitespace-pre-wrap">
          {comment.content}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLikeToggle}
            disabled={!currentUser}
            className={`h-7 px-2 ${
              comment.isLikedByCurrentUser
                ? "text-red-500 hover:text-red-600"
                : ""
            }`}
          >
            <Heart
              className={`h-3 w-3 mr-1 ${
                comment.isLikedByCurrentUser ? "fill-current" : ""
              }`}
            />
            <span className="text-xs">{comment.likeCount || 0}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
