import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createGroup = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    avatar: v.optional(v.string()),
    memberIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const currentUserId = identity.subject;

    // Create the group
    const groupId = await ctx.db.insert("groups", {
      name: args.name,
      description: args.description,
      avatar: args.avatar,
      createdById: currentUserId,
      createdAt: Date.now(),
    });

    // Add creator as admin
    await ctx.db.insert("groupMembers", {
      groupId,
      userId: currentUserId,
      role: "admin",
      joinedAt: Date.now(),
      isActive: true,
    });

    // Add other members
    for (const memberId of args.memberIds) {
      if (memberId !== currentUserId) {
        await ctx.db.insert("groupMembers", {
          groupId,
          userId: memberId,
          role: "member",
          joinedAt: Date.now(),
          isActive: true,
        });
      }
    }

    return groupId;
  },
});

export const getMyGroups = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const userId = identity.subject;

    const memberships = await ctx.db
      .query("groupMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Get group details for each membership
    const groups = await Promise.all(
      memberships.map(async (membership) => {
        const group = await ctx.db.get(membership.groupId);
        if (!group || group.isDeleted) return null;

        // Get last message
        const lastMessage = await ctx.db
          .query("groupMessages")
          .withIndex("by_group_and_created", (q) => q.eq("groupId", membership.groupId))
          .order("desc")
          .filter((q) => q.neq(q.field("isDeleted"), true))
          .first();

        // Get member count
        const memberCount = await ctx.db
          .query("groupMembers")
          .withIndex("by_group_and_active", (q) =>
            q.eq("groupId", membership.groupId).eq("isActive", true)
          )
          .collect();

        // Get unread count 
        const allMessages = await ctx.db
          .query("groupMessages")
          .withIndex("by_group_and_created", (q) => q.eq("groupId", membership.groupId))
          .filter((q) => q.neq(q.field("isDeleted"), true))
          .collect();

        const unreadCount = allMessages.filter(
          (msg) => msg.senderId !== userId && msg.createdAt > (membership.joinedAt || 0)
        ).length;

        return {
          _id: group._id,
          name: group.name,
          description: group.description,
          avatar: group.avatar,
          createdById: group.createdById,
          createdAt: group.createdAt,
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
                senderId: lastMessage.senderId,
              }
            : null,
          memberCount: memberCount.length,
          unreadCount,
          userRole: membership.role,
        };
      })
    );

    // Filter out null values and sort by last activity
    return groups
      .filter((g) => g !== null)
      .sort((a, b) => {
        const aTime = a.lastMessage?.createdAt ?? a.createdAt;
        const bTime = b.lastMessage?.createdAt ?? b.createdAt;
        return bTime - aTime;
      });
  },
});

export const getGroupInfo = query({
  args: {
    groupId: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const userId = identity.subject;

    const group = await ctx.db.get(args.groupId);
    if (!group || group.isDeleted) return null;

    // Check if user is a member
    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_and_user", (q) =>
        q.eq("groupId", args.groupId).eq("userId", userId)
      )
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    if (!membership) return null;

    // Get all active members with their profiles
    const members = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_and_active", (q) =>
        q.eq("groupId", args.groupId).eq("isActive", true)
      )
      .collect();

    const memberProfiles = await Promise.all(
      members.map(async (member) => {
        const profile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", member.userId))
          .first();

        return {
          userId: member.userId,
          username: profile?.username || "Unknown User",
          avatar: profile?.avatar,
          role: member.role,
          joinedAt: member.joinedAt,
        };
      })
    );

    return {
      _id: group._id,
      name: group.name,
      description: group.description,
      avatar: group.avatar,
      createdById: group.createdById,
      createdAt: group.createdAt,
      members: memberProfiles,
      userRole: membership.role,
    };
  },
});

export const addMembers = mutation({
  args: {
    groupId: v.id("groups"),
    memberIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;

    // Check if user is admin
    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_and_user", (q) =>
        q.eq("groupId", args.groupId).eq("userId", userId)
      )
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    if (!membership || membership.role !== "admin") {
      throw new Error("Only admins can add members");
    }

    // Add each member
    for (const memberId of args.memberIds) {
      // Check if already a member
      const existing = await ctx.db
        .query("groupMembers")
        .withIndex("by_group_and_user", (q) =>
          q.eq("groupId", args.groupId).eq("userId", memberId)
        )
        .first();

      if (!existing) {
        await ctx.db.insert("groupMembers", {
          groupId: args.groupId,
          userId: memberId,
          role: "member",
          joinedAt: Date.now(),
          isActive: true,
        });
      } else if (!existing.isActive) {
        // Reactivate if they left before
        await ctx.db.patch(existing._id, {
          isActive: true,
          joinedAt: Date.now(),
        });
      }
    }
  },
});

export const removeMember = mutation({
  args: {
    groupId: v.id("groups"),
    memberId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;

    // Check if user is admin
    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_and_user", (q) =>
        q.eq("groupId", args.groupId).eq("userId", userId)
      )
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    if (!membership || membership.role !== "admin") {
      throw new Error("Only admins can remove members");
    }

    // Cannot remove group creator
    const group = await ctx.db.get(args.groupId);
    if (group?.createdById === args.memberId) {
      throw new Error("Cannot remove group creator");
    }

    // Remove the member
    const targetMembership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_and_user", (q) =>
        q.eq("groupId", args.groupId).eq("userId", args.memberId)
      )
      .first();

    if (targetMembership) {
      await ctx.db.patch(targetMembership._id, { isActive: false });
    }
  },
});

export const leaveGroup = mutation({
  args: {
    groupId: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;

    // Check if user is the creator
    const group = await ctx.db.get(args.groupId);
    if (group?.createdById === userId) {
      throw new Error(
        "Group creator cannot leave. Transfer admin role or delete the group first."
      );
    }

    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_and_user", (q) =>
        q.eq("groupId", args.groupId).eq("userId", userId)
      )
      .first();

    if (membership) {
      await ctx.db.patch(membership._id, { isActive: false });
    }
  },
});

export const deleteGroup = mutation({
  args: {
    groupId: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;

    const group = await ctx.db.get(args.groupId);
    if (!group) throw new Error("Group not found");

    // Only creator can delete
    if (group.createdById !== userId) {
      throw new Error("Only group creator can delete the group");
    }

    await ctx.db.patch(args.groupId, { isDeleted: true });
  },
});

// Initialize the default "Nexum Chat" group 
export const initializeDefaultGroup = mutation({
  args: {
    adminUserId: v.string(), // Your user ID
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Check if default group already exists
    const existingDefault = await ctx.db
      .query("systemGroups")
      .withIndex("by_type", (q) => q.eq("type", "default"))
      .first();

    if (existingDefault) {
      throw new Error("Default group already exists");
    }

    // Create the Nexum Chat group
    const groupId = await ctx.db.insert("groups", {
      name: "Nexum Chat",
      description: "Welcome to Nexum Chat! Connect with everyone in the community.",
      createdById: args.adminUserId,
      createdAt: Date.now(),
    });

    // Add admin as admin member
    await ctx.db.insert("groupMembers", {
      groupId,
      userId: args.adminUserId,
      role: "admin",
      joinedAt: Date.now(),
      isActive: true,
    });

    // Mark as system default group
    await ctx.db.insert("systemGroups", {
      groupId,
      type: "default",
      isActive: true,
      createdAt: Date.now(),
    });

    // Add all existing users to the group
    const allUsers = await ctx.db.query("userProfiles").collect();
    for (const user of allUsers) {
      if (user.userId !== args.adminUserId) {
        await ctx.db.insert("groupMembers", {
          groupId,
          userId: user.userId,
          role: "member",
          joinedAt: Date.now(),
          isActive: true,
        });
      }
    }

    return groupId;
  },
});

// Get the default group ID
export const getDefaultGroup = query({
  args: {},
  handler: async (ctx) => {
    const defaultGroup = await ctx.db
      .query("systemGroups")
      .withIndex("by_type", (q) => q.eq("type", "default"))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    return defaultGroup;
  },
});

// Add user to default group (called when new user signs up)
export const addUserToDefaultGroup = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the default group
    const defaultGroup = await ctx.db
      .query("systemGroups")
      .withIndex("by_type", (q) => q.eq("type", "default"))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    if (!defaultGroup) {
      // Default group doesn't exist yet, skip
      return null;
    }

    // Check if user is already a member
    const existingMembership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_and_user", (q) =>
        q.eq("groupId", defaultGroup.groupId).eq("userId", args.userId)
      )
      .first();

    if (existingMembership) {
      // User is already a member
      if (!existingMembership.isActive) {
        // Reactivate membership
        await ctx.db.patch(existingMembership._id, {
          isActive: true,
          joinedAt: Date.now(),
        });
      }
      return existingMembership._id;
    }

    // Add user to the default group
    const membershipId = await ctx.db.insert("groupMembers", {
      groupId: defaultGroup.groupId,
      userId: args.userId,
      role: "member",
      joinedAt: Date.now(),
      isActive: true,
    });

    return membershipId;
  },
});
