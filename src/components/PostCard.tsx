"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface PostCardProps {
  post: {
    _id: Id<"posts">;
    userId: string;
    content: string;
    image?: string;
    createdAt: number;
    likeCount?: number;
    commentCount?: number;
    isLikedByCurrentUser?: boolean;
  };
  showAuthor?: boolean; 
  onDelete?: () => void; 
}

export function PostCard({ post, showAuthor = true, onDelete }: PostCardProps) {
  const currentUser = useQuery(api.auth.getCurrentUser);
  const authorProfile = useQuery(
    api.userProfiles.getProfile,
    showAuthor ? { userId: post.userId } : "skip"
  );
  const likePost = useMutation(api.posts.likePost);
  const unlikePost = useMutation(api.posts.unlikePost);
  const deletePost = useMutation(api.posts.deletePost);
  
  const [isDeleting, setIsDeleting] = useState(false);

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  const isOwnPost = currentUser?._id === post.userId;

  const handleLikeToggle = async () => {
    if (!currentUser) return;
    
    try {
      if (post.isLikedByCurrentUser) {
        await unlikePost({ postId: post._id });
      } else {
        await likePost({ postId: post._id });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    setIsDeleting(true);
    try {
      await deletePost({ postId: post._id });
      onDelete?.();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  const authorName = authorProfile?.username || "User";
  const authorAvatar = authorProfile?.avatar || undefined;
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <Card className="p-6 hover:bg-accent/50 transition-colors">
      {/* Post Header */}
      {showAuthor && (
        <div className="flex items-start gap-3 mb-4">
          <Link href={`/home/profile/${authorProfile?.username || post.userId}`}>
            <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80">
              <AvatarImage src={authorAvatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {authorInitial}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <Link 
                  href={`/home/profile/${authorProfile?.username || post.userId}`}
                  className="font-semibold hover:underline"
                >
                  {authorName}
                </Link>
                {authorProfile?.isVerified && (
                  <span className="ml-1 text-blue-500">✓</span>
                )}
                <p className="text-xs text-muted-foreground">{timeAgo}</p>
              </div>
              
              {/* More Options Menu */}
              {isOwnPost && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                  
                    <DropdownMenuItem
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Post Content */}
      <Link href={`/home/post/${post._id}`} className="space-y-4">
        <p className="whitespace-pre-wrap text-foreground leading-relaxed">
          {post.content}
        </p>
        
        {post.image && (
          <div className="relative w-full rounded-lg overflow-hidden bg-muted">
            <Image
              src={post.image}
              alt="Post image"
              width={600}
              height={400}
              className="w-full object-contain max-h-96"
              priority={false}
            />
          </div>
        )}
      </Link>

      {/* Post Actions */}
      <div className="flex items-center gap-1 mt-4 pt-4 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLikeToggle}
          disabled={!currentUser}
          className={post.isLikedByCurrentUser ? "text-red-500 hover:text-red-600" : ""}
        >
          <Heart
            className={cn(
              "h-4 w-4 mr-2",
              post.isLikedByCurrentUser && "fill-current"
            )}
          />
          <span className="text-sm">{post.likeCount || 0}</span>
        </Button>

        <Link href={`/home/post/${post._id}`}>
          <Button variant="ghost" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">{post.commentCount || 0}</span>
          </Button>
        </Link>

        <Button variant="ghost" size="sm" className="ml-auto">
          <Share2 className="h-4 w-4 mr-2" />
          <span className="text-sm">Share</span>
        </Button>
      </div>
    </Card>
  );
}
