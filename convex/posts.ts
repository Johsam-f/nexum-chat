import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

// get all posts with like and comment counts
export const getAllPosts = query({
  args: {},
  handler: async (ctx) => {
    // Get current user (optional - query works for both authenticated and unauthenticated users)
    let currentUser;
    try {
      currentUser = await authComponent.getAuthUser(ctx);
    } catch {
      currentUser = null;
    }

    const posts = await ctx.db.query("posts").collect();

    // Get like and comment counts for each post
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const likes = await ctx.db
          .query("likes")
          .withIndex("by_post", (q) => q.eq("postId", post._id))
          .collect();

        const comments = await ctx.db
          .query("comments")
          .withIndex("by_post", (q) => q.eq("postId", post._id))
          .collect();

        // Check if current user liked this post
        const isLikedByCurrentUser = currentUser
          ? likes.some((like) => like.userId === currentUser._id)
          : false;

        return {
          ...post,
          likeCount: likes.length,
          commentCount: comments.length,
          isLikedByCurrentUser,
        };
      })
    );

    return postsWithCounts;
  },
});

// create a new post
export const createPost = mutation({
  args: {
    content: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const newPost = await ctx.db.insert("posts", {
      userId: currentUser._id,
      content: args.content,
      image: args.imageUrl ? args.imageUrl : undefined,
      createdAt: Date.now(),
    });

    return newPost;
  },
});

// delete a post
export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    if (post.userId !== currentUser._id) throw new Error("Not authorized to delete this post");

    // Delete all likes on this post
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    
    await Promise.all(likes.map((like) => ctx.db.delete(like._id)));

    // Delete all comments on this post
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    
    await Promise.all(comments.map((comment) => ctx.db.delete(comment._id)));

    // Finally, delete the post itself
    await ctx.db.delete(args.postId);
    
    return { success: true };
  },
});

// update a post
export const updatePost = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    if (post.userId !== currentUser._id) throw new Error("Not authorized to update this post");

    try {
        await ctx.db.patch(args.postId, {
            content: args.content,
        });
    } catch (error) {
        console.error("Error updating post:", error);
        throw new Error("Failed to update post");
    }

    return { success: true };
  },
});

// get posts by user
export const getPostsByUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    return posts;
  },
});

// get post by id
export const getPostById = query({
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

    const post = await ctx.db.get(args.postId);
    if (!post) return null;

    // Get like and comment counts
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_post", (q) => q.eq("postId", post._id))
      .collect();

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", post._id))
      .collect();

    // Check if current user liked this post
    const isLikedByCurrentUser = currentUser
      ? likes.some((like) => like.userId === currentUser._id)
      : false;

    return {
      ...post,
      likeCount: likes.length,
      commentCount: comments.length,
      isLikedByCurrentUser,
    };
  },
});

// like a post
export const likePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    // Check if the like already exists
    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_post_and_user", (q) =>
        q.eq("postId", args.postId).eq("userId", currentUser._id)
      )
      .first();

    if (existingLike) {
      throw new Error("Post already liked");
    }

    const newLike = await ctx.db.insert("likes", {
      userId: currentUser._id,
      postId: args.postId,
      createdAt: Date.now(),
    });

    return newLike;
  },
});

// unlike a post
export const unlikePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    // Find the like entry
    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_post_and_user", (q) =>
        q.eq("postId", args.postId).eq("userId", currentUser._id)
      )
      .first();

    if (!existingLike) {
      throw new Error("Like not found");
    }

    await ctx.db.delete(existingLike._id);
    return { success: true };
  },
});

// get likes for a post
export const getLikesForPost = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    return likes;
  },
});