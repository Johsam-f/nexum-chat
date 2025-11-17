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
        await ctx.db.insert("userProfiles", {
          userId: currentUser._id,
          username: normalizedUsername,
          avatar: (currentUser as { image?: string }).image || undefined,
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

// Update username with 30-day cooldown
export const updateUsername = mutation({
  args: {
    newUsername: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const currentUser = await authComponent.getAuthUser(ctx);
      if (!currentUser) {
        throw new Error("Not authenticated");
      }

      // Get current profile
      const profile = await ctx.db
        .query("userProfiles")
        .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
        .first();

      if (!profile) {
        throw new Error("Profile not found");
      }

      // Validate username format
      const normalizedUsername = args.newUsername.toLowerCase().trim();
      
      // Username validation rules
      if (normalizedUsername.length < 3 || normalizedUsername.length > 20) {
        throw new Error("Username must be between 3 and 20 characters");
      }

      if (!/^[a-z0-9_]+$/.test(normalizedUsername)) {
        throw new Error("Username can only contain lowercase letters, numbers, and underscores");
      }

      if (normalizedUsername === profile.username) {
        throw new Error("New username must be different from current username");
      }

      // Check if username is already taken
      const existingProfile = await ctx.db
        .query("userProfiles")
        .withIndex("by_username", (q) => q.eq("username", normalizedUsername))
        .first();

      if (existingProfile) {
        throw new Error("Username is already taken");
      }

      // Check 30-day cooldown
      const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
      const now = Date.now();

      if (profile.lastUsernameChange) {
        const timeSinceLastChange = now - profile.lastUsernameChange;
        if (timeSinceLastChange < THIRTY_DAYS_MS) {
          const daysRemaining = Math.ceil((THIRTY_DAYS_MS - timeSinceLastChange) / (24 * 60 * 60 * 1000));
          throw new Error(`You can change your username again in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`);
        }
      }

      // Update username
      await ctx.db.patch(profile._id, {
        username: normalizedUsername,
        lastUsernameChange: now,
        updatedAt: now,
      });

      return { 
        success: true, 
        newUsername: normalizedUsername 
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed to update username");
    }
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
    try {
      const currentUser = await authComponent.getAuthUser(ctx);
      if (!currentUser) return null;

      const profile = await ctx.db
        .query("userProfiles")
        .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
        .first();

      return profile;
    } catch {
      return null;
    }
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

// Search users for discovery page
export const searchUsersForDiscovery = query({
  args: {
    query: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const searchTerm = args.query?.toLowerCase().trim() || "";
    const limit = args.limit || 20;

    try {
      const currentUser = await authComponent.getAuthUser(ctx);
      
      // Get profiles based on search
      let profiles;
      if (searchTerm) {
        // Search by username
        const allProfiles = await ctx.db.query("userProfiles").collect();
        profiles = allProfiles
          .filter((profile) => profile.username.includes(searchTerm))
          .slice(0, limit);
      } else {
        // Get recent users if no search term
        profiles = await ctx.db
          .query("userProfiles")
          .order("desc")
          .take(limit);
      }

      // Get user details for each profile
      const usersWithDetails = await Promise.all(
        profiles.map(async (profile) => {
          const user = await authComponent.getAnyUserById(ctx, profile.userId);
          
          return {
            userId: profile.userId,
            username: profile.username,
            image: user?.image,
            isVerified: profile.isVerified || false,
            // Exclude current user from results
            isCurrentUser: currentUser ? profile.userId === currentUser._id : false,
          };
        })
      );

      // Filter out current user
      return usersWithDetails.filter(user => !user.isCurrentUser);
    } catch {
      // If not authenticated, return public profiles only
      let profiles;
      if (searchTerm) {
        const allProfiles = await ctx.db.query("userProfiles").collect();
        profiles = allProfiles
          .filter((profile) => 
            profile.username.includes(searchTerm) &&
            !profile.isPrivate
          )
          .slice(0, limit);
      } else {
        profiles = await ctx.db
          .query("userProfiles")
          .order("desc")
          .take(limit);
      }

      const usersWithDetails = await Promise.all(
        profiles.map(async (profile) => {
          const user = await authComponent.getAnyUserById(ctx, profile.userId);
          
          return {
            userId: profile.userId,
            username: profile.username,
            image: user?.image,
            isVerified: profile.isVerified || false,
            isCurrentUser: false,
          };
        })
      );

      return usersWithDetails;
    }
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

    await ctx.db.insert("userProfiles", {
      userId: currentUser._id,
      username: normalizedUsername,
      avatar: (currentUser as { image?: string }).image || undefined,
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

// get posts liked by user
export const getLikedPostsByUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const postLikes = likes.filter((like) => like.postId !== undefined);
    
    const posts = await Promise.all(
      postLikes.map(async (like) => {
        if (!like.postId) return null;
        return await ctx.db.get(like.postId);
      })
    );

    // Filter out null posts 
    return posts.filter((post): post is NonNullable<typeof post> => post !== null);
  },
});

// Get all users (for messaging)
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) return [];

    const profiles = await ctx.db
      .query("userProfiles")
      .filter((q) => q.neq(q.field("userId"), currentUser._id))
      .collect();

    return profiles.map((profile) => ({
      userId: profile.userId,
      username: profile.username,
      avatar: profile.avatar,
      bio: profile.bio,
    }));
  },
});