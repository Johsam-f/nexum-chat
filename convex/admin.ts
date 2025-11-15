import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";
import type { QueryCtx, MutationCtx } from "./_generated/server";

// Helper function to check if a user is admin
export async function isAdmin(ctx: QueryCtx | MutationCtx, userId: string): Promise<boolean> {
  const userRole = await ctx.db
    .query("userRoles")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();
  
  return userRole?.role === "admin";
}

// Helper function to check if a user is moderator or admin
export async function isModerator(ctx: QueryCtx | MutationCtx, userId: string): Promise<boolean> {
  const userRole = await ctx.db
    .query("userRoles")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();
  
  return userRole?.role === "admin" || userRole?.role === "moderator";
}

// Get current user's role
export const getMyRole = query({
  handler: async (ctx) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) return null;

    const userRole = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .first();

    return userRole?.role || "user";
  },
});

// Initialize admin 
// export const initializeAdmin = mutation({
//   args: {
//     secretKey: v.string(), 
//   },
//   handler: async (ctx, args) => {
//     // IMPORTANT: Change this secret key to something only you know
//     const ADMIN_SECRET = process.env.ADMIN_SETUP_SECRET || "change-this-secret-key-in-production";
    
//     if (args.secretKey !== ADMIN_SECRET) {
//       throw new Error("Invalid secret key");
//     }

//     // Get current authenticated user
//     const currentUser = await authComponent.getAuthUser(ctx);
//     if (!currentUser) {
//       throw new Error("You must be logged in to initialize admin");
//     }

//     // Check if user already has a role
//     const existingRole = await ctx.db
//       .query("userRoles")
//       .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
//       .first();

//     if (existingRole) {
//       // Update to admin if not already
//       if (existingRole.role !== "admin") {
//         await ctx.db.patch(existingRole._id, {
//           role: "admin",
//           updatedAt: Date.now(),
//         });
//         return { message: "User upgraded to admin", userId: currentUser._id };
//       }
//       return { message: "User is already admin", userId: currentUser._id };
//     }

//     // Create admin role
//     await ctx.db.insert("userRoles", {
//       userId: currentUser._id,
//       role: "admin",
//       grantedAt: Date.now(),
//     });

//     return { message: "Admin role granted successfully", userId: currentUser._id };
//   },
// });

// Grant role to a user (admin only)
export const grantRole = mutation({
  args: {
    targetUserId: v.string(),
    role: v.union(v.literal("admin"), v.literal("moderator"), v.literal("user")),
  },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    // Check if current user is admin
    if (!(await isAdmin(ctx, currentUser._id))) {
      throw new Error("Only admins can grant roles");
    }

    // Check if target user already has a role
    const existingRole = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", args.targetUserId))
      .first();

    if (existingRole) {
      await ctx.db.patch(existingRole._id, {
        role: args.role,
        grantedBy: currentUser._id,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("userRoles", {
        userId: args.targetUserId,
        role: args.role,
        grantedBy: currentUser._id,
        grantedAt: Date.now(),
      });
    }

    // Log the action
    await ctx.db.insert("auditLogs", {
      adminId: currentUser._id,
      action: "grant_role",
      targetType: "user",
      targetId: args.targetUserId,
      details: JSON.stringify({ role: args.role }),
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Ban a user (admin/moderator only)
export const banUser = mutation({
  args: {
    userId: v.string(),
    reason: v.string(),
    duration: v.optional(v.number()), // Duration in milliseconds (null = permanent)
  },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    if (!(await isModerator(ctx, currentUser._id))) {
      throw new Error("Only moderators and admins can ban users");
    }

    // Can't ban yourself
    if (args.userId === currentUser._id) {
      throw new Error("You cannot ban yourself");
    }

    // Can't ban another admin (only admin can ban moderators)
    const targetRole = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (targetRole?.role === "admin") {
      throw new Error("Cannot ban an admin");
    }

    const expiresAt = args.duration ? Date.now() + args.duration : undefined;

    await ctx.db.insert("bannedUsers", {
      userId: args.userId,
      reason: args.reason,
      bannedBy: currentUser._id,
      bannedAt: Date.now(),
      expiresAt,
      isActive: true,
    });

    // Log the action
    await ctx.db.insert("auditLogs", {
      adminId: currentUser._id,
      action: "ban_user",
      targetType: "user",
      targetId: args.userId,
      details: JSON.stringify({ reason: args.reason, duration: args.duration }),
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Delete a post (admin/moderator only)
export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    if (!(await isModerator(ctx, currentUser._id))) {
      throw new Error("Only moderators and admins can delete posts");
    }

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    // Soft delete
    await ctx.db.patch(args.postId, {
      isDeleted: true,
      updatedAt: Date.now(),
    });

    // Log the action
    await ctx.db.insert("auditLogs", {
      adminId: currentUser._id,
      action: "delete_post",
      targetType: "post",
      targetId: args.postId,
      details: JSON.stringify({ reason: args.reason, originalAuthor: post.userId }),
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Get all reports (admin/moderator only)
export const getReports = query({
  args: {
    status: v.optional(v.union(v.literal("pending"), v.literal("reviewed"), v.literal("resolved"), v.literal("dismissed"))),
  },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    if (!(await isModerator(ctx, currentUser._id))) {
      throw new Error("Only moderators and admins can view reports");
    }

    if (args.status) {
      const reports = await ctx.db
        .query("reports")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(100);
      return reports;
    }

    const reports = await ctx.db.query("reports").order("desc").take(100);
    return reports;
  },
});

// Get audit logs (admin only)
export const getAuditLogs = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    if (!(await isAdmin(ctx, currentUser._id))) {
      throw new Error("Only admins can view audit logs");
    }

    const logs = await ctx.db
      .query("auditLogs")
      .withIndex("by_created_at")
      .order("desc")
      .take(args.limit || 100);

    return logs;
  },
});

// Check if user is banned
export const checkBanStatus = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const ban = await ctx.db
      .query("bannedUsers")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    if (!ban) return { isBanned: false };

    // Check if temporary ban has expired
    if (ban.expiresAt && ban.expiresAt < Date.now()) {
      return { isBanned: false, expired: true };
    }

    return {
      isBanned: true,
      reason: ban.reason,
      bannedAt: ban.bannedAt,
      expiresAt: ban.expiresAt,
    };
  },
});

// Clean up expired bans (call this periodically or in a cron job)
export const cleanupExpiredBans = mutation({
  handler: async (ctx) => {
    const expiredBans = await ctx.db
      .query("bannedUsers")
      .filter((q) =>
        q.and(
          q.eq(q.field("isActive"), true),
          q.neq(q.field("expiresAt"), undefined),
          q.lt(q.field("expiresAt"), Date.now())
        )
      )
      .collect();

    for (const ban of expiredBans) {
      await ctx.db.patch(ban._id, { isActive: false });
    }

    return { cleaned: expiredBans.length };
  },
});
