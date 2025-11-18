import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getGroupMessages = query({
  args: {
    groupId: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const userId = identity.subject;

    // Check if user is a member of the group
    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_and_user", (q) =>
        q.eq("groupId", args.groupId).eq("userId", userId)
      )
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    if (!membership) return [];

    // Get all messages in the group
    const messages = await ctx.db
      .query("groupMessages")
      .withIndex("by_group_and_created", (q) => q.eq("groupId", args.groupId))
      .filter((q) => q.neq(q.field("isDeleted"), true))
      .collect();

    // Enrich messages with sender profiles
    const enrichedMessages = await Promise.all(
      messages.map(async (message) => {
        const senderProfile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", message.senderId))
          .first();

        return {
          ...message,
          sender: {
            userId: message.senderId,
            username: senderProfile?.username || "Unknown User",
            avatar: senderProfile?.avatar,
          },
        };
      })
    );

    return enrichedMessages;
  },
});

export const sendGroupMessage = mutation({
  args: {
    groupId: v.id("groups"),
    content: v.string(),
    images: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;

    // Check if user is a member
    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_and_user", (q) =>
        q.eq("groupId", args.groupId).eq("userId", userId)
      )
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    if (!membership) {
      throw new Error("You are not a member of this group");
    }

    const messageId = await ctx.db.insert("groupMessages", {
      groupId: args.groupId,
      senderId: userId,
      content: args.content,
      images: args.images,
      createdAt: Date.now(),
    });

    return messageId;
  },
});

export const deleteGroupMessage = mutation({
  args: {
    messageId: v.id("groupMessages"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    const message = await ctx.db.get(args.messageId);

    if (!message) throw new Error("Message not found");

    // Only sender or group admin can delete
    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_and_user", (q) =>
        q.eq("groupId", message.groupId).eq("userId", userId)
      )
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    if (!membership) throw new Error("You are not a member of this group");

    if (message.senderId !== userId && membership.role !== "admin") {
      throw new Error("You can only delete your own messages");
    }

    await ctx.db.patch(args.messageId, { isDeleted: true });
  },
});
