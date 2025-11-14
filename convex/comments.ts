import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

// Get comments for a post with like counts
export const getCommentsForPost = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    // Get current user (optional)
    let currentUser;
    try {
      currentUser = await authComponent.getAuthUser(ctx);
    } catch {
      currentUser = null;
    }

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .filter((q) => q.neq(q.field("isDeleted"), true))
      .collect();

    // Get like counts for each comment
    const commentsWithLikes = await Promise.all(
      comments.map(async (comment) => {
        const likes = await ctx.db
          .query("likes")
          .withIndex("by_comment", (q) => q.eq("commentId", comment._id))
          .collect();

        // Check if current user liked this comment
        const isLikedByCurrentUser = currentUser
          ? likes.some((like) => like.userId === currentUser._id)
          : false;

        return {
          ...comment,
          likeCount: likes.length,
          isLikedByCurrentUser,
        };
      })
    );

    return commentsWithLikes;
  },
});

// Create a comment
export const createComment = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const newComment = await ctx.db.insert("comments", {
      userId: currentUser._id,
      postId: args.postId,
      content: args.content,
      createdAt: Date.now(),
    });

    return newComment;
  },
});

// Delete a comment
export const deleteComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error("Comment not found");
    if (comment.userId !== currentUser._id) {
      throw new Error("Not authorized to delete this comment");
    }

    // Soft delete
    await ctx.db.patch(args.commentId, {
      isDeleted: true,
    });

    return { success: true };
  },
});

// Update a comment
export const updateComment = mutation({
  args: {
    commentId: v.id("comments"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error("Comment not found");
    if (comment.userId !== currentUser._id) {
      throw new Error("Not authorized to update this comment");
    }

    await ctx.db.patch(args.commentId, {
      content: args.content,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Like a comment
export const likeComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    // Check if the like already exists
    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_comment_and_user", (q) =>
        q.eq("commentId", args.commentId).eq("userId", currentUser._id)
      )
      .first();

    if (existingLike) {
      throw new Error("Comment already liked");
    }

    const newLike = await ctx.db.insert("likes", {
      userId: currentUser._id,
      commentId: args.commentId,
      createdAt: Date.now(),
    });

    return newLike;
  },
});

// Unlike a comment
export const unlikeComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    // Find the like entry
    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_comment_and_user", (q) =>
        q.eq("commentId", args.commentId).eq("userId", currentUser._id)
      )
      .first();

    if (!existingLike) {
      throw new Error("Like not found");
    }

    await ctx.db.delete(existingLike._id);
    return { success: true };
  },
});
