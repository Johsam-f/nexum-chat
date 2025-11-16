"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Id } from "../../../../../convex/_generated/dataModel";

interface CommentFormProps {
  postId: Id<"posts">;
}

export function CommentForm({ postId }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session } = authClient.useSession();
  const myProfile = useQuery(api.userProfiles.getMyProfile);
  const createComment = useMutation(api.comments.createComment);

  const canSubmit = content.trim().length > 0 && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      await createComment({
        postId,
        content: content.trim(),
      });
      setContent("");
      toast.success("Comment posted!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to post comment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Please sign in to comment
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={session?.user?.image ?? undefined} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {myProfile?.username?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <Textarea
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="resize-none min-h-20"
            disabled={isSubmitting}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={!canSubmit} size="sm">
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Comment
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
