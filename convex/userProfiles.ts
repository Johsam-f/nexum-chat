import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

// Check if a username is available
export const checkUsernameAvailability = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedUsername = args.username.toLowerCase().trim();

    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_username", (q) => q.eq("username", normalizedUsername))
      .first();

    return {
      available: !existing,
      username: normalizedUsername,
    };
  },
});

export const updateProfile = mutation({
  args: {
    username: v.optional(v.string()),
    bio: v.optional(v.string()),
    website: v.optional(v.string()),
    location: v.optional(v.string()),
    birthday: v.optional(v.number()),
    isPrivate: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    // Get existing profile
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .first();

    // If updating username, check availability
    if (args.username) {
      const normalizedUsername = args.username.toLowerCase().trim();

      // Validate username format
      if (!/^[a-z0-9_]{3,20}$/.test(normalizedUsername)) {
        throw new Error(
          "Username must be 3-20 characters long and contain only lowercase letters, numbers, and underscores"
        );
      }

      const usernameTaken = await ctx.db
        .query("userProfiles")
        .withIndex("by_username", (q) => q.eq("username", normalizedUsername))
        .first();

      if (usernameTaken && usernameTaken.userId !== currentUser._id) {
        throw new Error("Username is already taken");
      }

      // Update username
      if (existingProfile) {
        await ctx.db.patch(existingProfile._id, {
          username: normalizedUsername,
          ...args,
          updatedAt: Date.now(),
        });
      } else {
        // Create new profile with username
        await ctx.db.insert("userProfiles", {
          userId: currentUser._id,
          username: normalizedUsername,
          ...args,
          createdAt: Date.now(),
        });
      }
    } else if (existingProfile) {
      // Update other profile fields without changing username
      const updateData = { 
        bio: args.bio,
        website: args.website,
        location: args.location,
        birthday: args.birthday,
        isPrivate: args.isPrivate,
        updatedAt: Date.now() 
      };
      await ctx.db.patch(existingProfile._id, updateData);
    } else {
      throw new Error("Username is required when creating a profile");
    }

    return { success: true };
  },
});

// Get user profile by userId
export const getProfile = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    return profile;
  },
});

// Get user profile by username
export const getProfileByUsername = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedUsername = args.username.toLowerCase().trim();

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_username", (q) => q.eq("username", normalizedUsername))
      .first();

    if (!profile) return null;

    return profile;
  },
});

// Get current user's profile
export const getMyProfile = query({
  handler: async (ctx) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) return null;

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .first();

    return profile;
  },
});

// Search users by username
export const searchUsersByUsername = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const searchTerm = args.query.toLowerCase().trim();
    const limit = args.limit || 20;

    // Get all profiles and filter by username
    const allProfiles = await ctx.db.query("userProfiles").collect();
    const matchingProfiles = allProfiles
      .filter((profile) => profile.username.includes(searchTerm))
      .slice(0, limit);

    return matchingProfiles;
  },
});

// Initialize profile for new users
export const initializeProfile = mutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .first();

    if (existingProfile) {
      throw new Error("Profile already exists");
    }

    const normalizedUsername = args.username.toLowerCase().trim();

    // Validate username format
    if (!/^[a-z0-9_]{3,20}$/.test(normalizedUsername)) {
      throw new Error(
        "Username must be 3-20 characters long and contain only lowercase letters, numbers, and underscores"
      );
    }

    // Check if username is taken
    const usernameTaken = await ctx.db
      .query("userProfiles")
      .withIndex("by_username", (q) => q.eq("username", normalizedUsername))
      .first();

    if (usernameTaken) {
      throw new Error("Username is already taken");
    }

    // Create profile
    await ctx.db.insert("userProfiles", {
      userId: currentUser._id,
      username: normalizedUsername,
      createdAt: Date.now(),
    });

    return { success: true, username: normalizedUsername };
  },
});

// Generate a suggested username from email or name
export const suggestUsername = query({
  handler: async (ctx) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) return null;

    // Try to generate username from email or name
    let baseUsername = "";

    if (currentUser.email) {
      // Extract username from email (part before @)
      baseUsername = currentUser.email.split("@")[0];
    } else if (currentUser.name) {
      baseUsername = currentUser.name;
    }

    // Normalize: lowercase, remove spaces and special chars, keep only alphanumeric and underscore
    baseUsername = baseUsername
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 20);

    if (baseUsername.length < 3) {
      baseUsername = "user" + Math.floor(Math.random() * 10000);
    }

    // Check if this username is available
    let suggestedUsername = baseUsername;
    let counter = 1;

    while (true) {
      const existing = await ctx.db
        .query("userProfiles")
        .withIndex("by_username", (q) => q.eq("username", suggestedUsername))
        .first();

      if (!existing) {
        return suggestedUsername;
      }

      // Try with a number suffix
      suggestedUsername = baseUsername + counter;
      counter++;

      // Prevent infinite loop
      if (counter > 1000) {
        suggestedUsername = baseUsername + Math.floor(Math.random() * 100000);
        break;
      }
    }

    return suggestedUsername;
  },
});
