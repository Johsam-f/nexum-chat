import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getOrCreateConversation = mutation({
  args: {
    otherUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const currentUserId = identity.subject;
    const { otherUserId } = args;

    if (currentUserId === otherUserId) {
      throw new Error("Cannot create conversation with yourself");
    }

    // Sort user IDs to ensure consistent ordering
    const [participant1Id, participant2Id] = [currentUserId, otherUserId].sort();

    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_participants", (q) =>
        q.eq("participant1Id", participant1Id).eq("participant2Id", participant2Id)
      )
      .first();

    if (existing) {
      return existing._id;
    }

    const conversationId = await ctx.db.insert("conversations", {
      participant1Id,
      participant2Id,
      createdAt: Date.now(),
    });

    return conversationId;
  },
});

export const getMyConversations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const userId = identity.subject;

    const asParticipant1 = await ctx.db
      .query("conversations")
      .withIndex("by_participant1", (q) => q.eq("participant1Id", userId))
      .collect();

    const asParticipant2 = await ctx.db
      .query("conversations")
      .withIndex("by_participant2", (q) => q.eq("participant2Id", userId))
      .collect();

    const allConversations = [...asParticipant1, ...asParticipant2].sort(
      (a, b) => (b.lastMessageAt ?? b.createdAt) - (a.lastMessageAt ?? a.createdAt)
    );

    // Enrich with other user's profile and last message
    const enrichedConversations = await Promise.all(
      allConversations.map(async (conversation) => {
        const otherUserId =
          conversation.participant1Id === userId
            ? conversation.participant2Id
            : conversation.participant1Id;

        const otherUserProfile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", otherUserId))
          .first();

        const lastMessage = await ctx.db
          .query("messages")
          .withIndex("by_conversation_and_created", (q) =>
            q.eq("conversationId", conversation._id)
          )
          .order("desc")
          .first();

        // Count unread messages
        const unreadCount = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) => q.eq("conversationId", conversation._id))
          .filter((q) =>
            q.and(
              q.neq(q.field("senderId"), userId),
              q.or(q.eq(q.field("isRead"), false), q.eq(q.field("isRead"), undefined))
            )
          )
          .collect()
          .then((messages) => messages.length);

        return {
          ...conversation,
          otherUser: otherUserProfile
            ? {
                userId: otherUserProfile.userId,
                username: otherUserProfile.username,
                avatar: otherUserProfile.avatar,
              }
            : null,
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
                senderId: lastMessage.senderId,
              }
            : null,
          unreadCount,
        };
      })
    );

    return enrichedConversations;
  },
});

// Get conversation info with other user's details
export const getConversationInfo = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const userId = identity.subject;
    const { conversationId } = args;

    const conversation = await ctx.db.get(conversationId);
    if (!conversation) return null;

    // if user not participant return null
    if (
      conversation.participant1Id !== userId &&
      conversation.participant2Id !== userId
    ) {
      return null;
    }

    const otherUserId =
      conversation.participant1Id === userId
        ? conversation.participant2Id
        : conversation.participant1Id;

    const otherUserProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", otherUserId))
      .first();

    if (!otherUserProfile) return null;

    return {
      conversationId: conversation._id,
      otherUser: {
        userId: otherUserProfile.userId,
        username: otherUserProfile.username,
        avatar: otherUserProfile.avatar,
      },
    };
  },
});

export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const userId = identity.subject;
    const { conversationId } = args;

    const conversation = await ctx.db.get(conversationId);
    if (!conversation) return [];

    if (
      conversation.participant1Id !== userId &&
      conversation.participant2Id !== userId
    ) {
      throw new Error("Not authorized to view this conversation");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation_and_created", (q) =>
        q.eq("conversationId", conversationId)
      )
      .filter((q) => q.neq(q.field("isDeleted"), true))
      .collect();

    // Enrich with sender profile
    const enrichedMessages = await Promise.all(
      messages.map(async (message) => {
        const senderProfile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", message.senderId))
          .first();

        return {
          ...message,
          sender: senderProfile
            ? {
                userId: senderProfile.userId,
                username: senderProfile.username,
                avatar: senderProfile.avatar,
              }
            : null,
        };
      })
    );

    return enrichedMessages;
  },
});

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    const { conversationId, content } = args;

    const conversation = await ctx.db.get(conversationId);
    if (!conversation) throw new Error("Conversation not found");

    if (
      conversation.participant1Id !== userId &&
      conversation.participant2Id !== userId
    ) {
      throw new Error("Not authorized to send messages in this conversation");
    }

    // Create message
    const messageId = await ctx.db.insert("messages", {
      conversationId,
      senderId: userId,
      content,
      isRead: false,
      createdAt: Date.now(),
    });

    // Update conversation's lastMessageAt
    await ctx.db.patch(conversationId, {
      lastMessageAt: Date.now(),
    });

    return messageId;
  },
});

// Mark messages as read
export const markAsRead = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const userId = identity.subject;
    const { conversationId } = args;

    // Get all unread messages in this conversation that were sent by the other user
    const unreadMessages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", conversationId))
      .filter((q) =>
        q.and(
          q.neq(q.field("senderId"), userId),
          q.or(q.eq(q.field("isRead"), false), q.eq(q.field("isRead"), undefined))
        )
      )
      .collect();

    await Promise.all(
      unreadMessages.map((message) =>
        ctx.db.patch(message._id, { isRead: true })
      )
    );
  },
});

// Delete a message (soft delete)
export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    const { messageId } = args;

    const message = await ctx.db.get(messageId);
    if (!message) throw new Error("Message not found");

    // Only allow deleting own messages
    if (message.senderId !== userId) {
      throw new Error("Not authorized to delete this message");
    }

    await ctx.db.patch(messageId, {
      isDeleted: true,
      updatedAt: Date.now(),
    });
  },
});
