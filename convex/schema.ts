import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  
  userProfiles: defineTable({
    userId: v.string(),
    avatar: v.optional(v.string()),
    username: v.string(),
    bio: v.optional(v.string()), 
    website: v.optional(v.string()), 
    location: v.optional(v.string()), 
    birthday: v.optional(v.number()), 
    isPrivate: v.optional(v.boolean()), 
    isVerified: v.optional(v.boolean()),
    lastUsernameChange: v.optional(v.number()), // Timestamp of last username change
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_username", ["username"]), 
  
  // User Roles - admin/moderator privileges
  userRoles: defineTable({
    userId: v.string(),
    role: v.union(
      v.literal("admin"), 
      v.literal("moderator"), 
      v.literal("user")
    ),
    permissions: v.optional(v.array(v.string())),
    grantedBy: v.optional(v.string()), 
    grantedAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_role", ["role"]),

  // Reported Content - violations reports
  reports: defineTable({
    reporterId: v.string(), 
    targetType: v.union(
      v.literal("post"),
      v.literal("comment"),
      v.literal("message"),
      v.literal("user")
    ),
    targetId: v.string(), // ID of the reported item
    reason: v.string(), 
    description: v.optional(v.string()), 
    status: v.union(
      v.literal("pending"),
      v.literal("reviewed"),
      v.literal("resolved"),
      v.literal("dismissed")
    ),
    reviewedBy: v.optional(v.string()), 
    reviewedAt: v.optional(v.number()),
    resolution: v.optional(v.string()), 
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_reporter", ["reporterId"])
    .index("by_target", ["targetType", "targetId"])
    .index("by_created_at", ["createdAt"]),

  bannedUsers: defineTable({
    userId: v.string(), 
    reason: v.string(), 
    bannedBy: v.string(), 
    bannedAt: v.number(),
    expiresAt: v.optional(v.number()), // For temporary bans (null = permanent)
    isActive: v.boolean(), // Can be unbanned
  })
    .index("by_user", ["userId"])
    .index("by_active", ["isActive"])
    .index("by_banned_by", ["bannedBy"]),

  // Audit Log - Track admin actions for accountability
  auditLogs: defineTable({
    adminId: v.string(), 
    action: v.union(
      v.literal("delete_post"),
      v.literal("delete_comment"),
      v.literal("ban_user"),
      v.literal("unban_user"),
      v.literal("grant_role"),
      v.literal("revoke_role"),
      v.literal("resolve_report")
    ),
    targetType: v.optional(v.string()), // "user", "post", "comment", etc.
    targetId: v.optional(v.string()), // ID of affected item
    details: v.optional(v.string()), 
    createdAt: v.number(),
  })
    .index("by_admin", ["adminId"])
    .index("by_action", ["action"])
    .index("by_created_at", ["createdAt"])
    .index("by_target", ["targetType", "targetId"]),

  posts: defineTable({
    userId: v.string(), 
    content: v.string(), 
    image: v.optional(v.string()), // Cloudinary URL
    imagePublicId: v.optional(v.string()), // Cloudinary public ID for deletion
    createdAt: v.number(), 
    updatedAt: v.optional(v.number()),
    isDeleted: v.optional(v.boolean()),
  })
    .index("by_user", ["userId"])
    .index("by_created_at", ["createdAt"])
    .index("by_user_and_created", ["userId", "createdAt"]),

  // Likes on posts and comments
  likes: defineTable({
    userId: v.string(), // User who liked
    postId: v.optional(v.id("posts")), // Post that was liked (if liking a post)
    commentId: v.optional(v.id("comments")), // Comment that was liked (if liking a comment)
    createdAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_comment", ["commentId"])
    .index("by_user", ["userId"])
    .index("by_post_and_user", ["postId", "userId"]) // Prevent duplicate likes on posts
    .index("by_comment_and_user", ["commentId", "userId"]), // Prevent duplicate likes on comments

  comments: defineTable({
    userId: v.string(),
    postId: v.id("posts"), 
    content: v.string(), 
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    isDeleted: v.optional(v.boolean()),
  })
    .index("by_post", ["postId"])
    .index("by_user", ["userId"])
    .index("by_post_and_created", ["postId", "createdAt"]),

  follows: defineTable({
    followerId: v.string(), 
    followingId: v.string(), 
    createdAt: v.number(),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_follower_and_following", ["followerId", "followingId"]), // Prevent duplicate follows

  conversations: defineTable({
    participant1Id: v.string(), 
    participant2Id: v.string(), 
    lastMessageAt: v.optional(v.number()), 
    createdAt: v.number(),
  })
    .index("by_participant1", ["participant1Id"])
    .index("by_participant2", ["participant2Id"])
    .index("by_participants", ["participant1Id", "participant2Id"])
    .index("by_last_message", ["lastMessageAt"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.string(), 
    content: v.string(),
    images: v.optional(v.array(v.string())),
    isRead: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    isDeleted: v.optional(v.boolean()),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_conversation_and_created", ["conversationId", "createdAt"])
    .index("by_sender", ["senderId"]),

  groups: defineTable({
    name: v.string(), 
    description: v.optional(v.string()),
    createdById: v.string(), 
    avatar: v.optional(v.string()), 
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    isDeleted: v.optional(v.boolean()),
  })
    .index("by_creator", ["createdById"])
    .index("by_created_at", ["createdAt"]),

  groupMembers: defineTable({
    groupId: v.id("groups"),
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("member")), 
    joinedAt: v.number(),
    isActive: v.optional(v.boolean()), // For soft delete when user leaves
  })
    .index("by_group", ["groupId"])
    .index("by_user", ["userId"])
    .index("by_group_and_user", ["groupId", "userId"])
    .index("by_group_and_active", ["groupId", "isActive"]),

  groupMessages: defineTable({
    groupId: v.id("groups"),
    senderId: v.string(),
    content: v.string(),
    images: v.optional(v.array(v.string())), 
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    isDeleted: v.optional(v.boolean()),
  })
    .index("by_group", ["groupId"])
    .index("by_group_and_created", ["groupId", "createdAt"])
    .index("by_sender", ["senderId"]),

  notifications: defineTable({
    userId: v.string(), 
    type: v.union(
      v.literal("like"), 
      v.literal("comment"), 
      v.literal("follow"), 
      v.literal("message"), 
      v.literal("group_message"), 
      v.literal("group_invite") 
    ),
    actorId: v.string(), 
    referenceId: v.optional(v.string()), // ID of related item (post, message, etc.)
    isRead: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_read", ["userId", "isRead"])
    .index("by_user_and_created", ["userId", "createdAt"]),

  friendRequests: defineTable({
    senderId: v.string(), 
    receiverId: v.string(), 
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("rejected")
    ),
    createdAt: v.number(),
    respondedAt: v.optional(v.number()),
  })
    .index("by_sender", ["senderId"])
    .index("by_receiver", ["receiverId"])
    .index("by_sender_and_receiver", ["senderId", "receiverId"])
    .index("by_receiver_and_status", ["receiverId", "status"]),

  // User Presence - Track online/offline status
  presence: defineTable({
    userId: v.string(),
    status: v.union(v.literal("online"), v.literal("offline"), v.literal("away")),
    lastSeen: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  // Typing Indicators 
  typingIndicators: defineTable({
    userId: v.string(),
    conversationId: v.optional(v.id("conversations")),
    groupId: v.optional(v.id("groups")),
    expiresAt: v.number(), // Auto expire after a few seconds
  })
    .index("by_conversation", ["conversationId"])
    .index("by_group", ["groupId"])
    .index("by_expires", ["expiresAt"]),

  systemGroups: defineTable({
    groupId: v.id("groups"),
    type: v.union(v.literal("default"), v.literal("announcements")),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_group", ["groupId"]),
});
