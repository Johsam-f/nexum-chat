import { query } from "./_generated/server";

// Get users count
export const getUsersCount = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("userProfiles").collect();
    return users.length;
  },
});

// Get posts count
export const getPostsCount = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").collect();
    return posts.length;
  },
});

// Get pending reports count
export const getPendingReportsCount = query({
  args: {},
  handler: async (ctx) => {
    const reports = await ctx.db
      .query("reports")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    return reports.length;
  },
});

// Get banned users count
export const getBannedUsersCount = query({
  args: {},
  handler: async (ctx) => {
    const bannedUsers = await ctx.db
      .query("bannedUsers")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
    return bannedUsers.length;
  },
});
