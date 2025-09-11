import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { query, QueryCtx, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const populateUser = async (ctx: QueryCtx, id: Id<"users">) => {
  return await ctx.db.get(id);
};

export const get = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const channel = await ctx.db.get(args.channelId);
    if (!channel) return [];

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", channel.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) return [];

    // Fetch all channel members
    const data = await ctx.db
      .query("channelMembers")
      .withIndex("by_channel_id", (q) =>
        q.eq("channelId", args.channelId)
      )
      .collect();

    // Populate users
    const channelMembers = [];
    for (const member of data) {
      const user = await populateUser(ctx, member.userId);
      if (user) {
        channelMembers.push({
          ...member,
          user,
        });
      }
    }

    return channelMembers
  },
});


export const current = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Fetch the channel to verify workspace
    const channel = await ctx.db.get(args.channelId);
    if (!channel) return null;

    // Verify user is part of the workspace
    const workspaceMembership = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", channel.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!workspaceMembership) return null;

    // Fetch channel membership
    const channelMember = await ctx.db
      .query("channelMembers")
      .withIndex("by_channel_id_user_id", (q) =>
        q.eq("channelId", args.channelId).eq("userId", userId)
      )
      .unique();

    return channelMember ?? null;
  },
});



export const createChannelMember = mutation({
  args: {
    channelId: v.id("channels"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) throw new Error("Not authenticated");

    //user to be added
    const user = await ctx.db.get(args.userId)
    if (!user) throw new Error("User not found");


    const channel = await ctx.db.get(args.channelId);
    if (!channel) throw new Error("Channel not authenticated");

    //only authUser with admin role can add channelMembers
    const authUserChannelMembership = await ctx.db
      .query("channelMembers")
      .withIndex("by_channel_id_user_id", (q) =>
        q.eq("channelId", args.channelId).eq("userId", authUserId)
      )
      .unique();

    if (!authUserChannelMembership) {
      throw new Error("Unauthorized");
    }

        // Ensure authUser is a workspace member
    const authUserWorkspaceMembership = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", channel.workspaceId).eq("userId", authUserId)
      )
      .unique();

    if (!authUserWorkspaceMembership || authUserWorkspaceMembership.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const targetUserWorkspaceMembership = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", channel.workspaceId).eq("userId", args.userId)
      )
      .unique();

    if (!targetUserWorkspaceMembership) {
      throw new Error("Unauthorized");
    }

    // Prevent duplicate
    const existing = await ctx.db
      .query("channelMembers")
      .withIndex("by_channel_id_user_id", (q) =>
        q.eq("channelId", args.channelId).eq("userId", args.userId)
      )
      .unique();

    if (existing) {
      throw new Error("User is already a member of this channel.");
    }

    // Add member to channel with role
    const channelMemberId = await ctx.db.insert("channelMembers", {
      channelId: args.channelId,
      userId: args.userId,
      role: "member"
    });

    return channelMemberId;
  },
});
