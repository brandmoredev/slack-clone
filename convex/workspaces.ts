import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";


export const create = mutation({
  args: {
    name: v.string()
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode
    })

    await ctx.db.insert("members", {
      userId,
      workspaceId,
      role: "admin"
    })

    return await ctx.db.get(workspaceId);
  }
})

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) return []

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect()

    const workSpaceIds = members.map((member) => member.workspaceId)
    const workspaces = []

    for (const workspaceId of workSpaceIds) {
      const workspace = await ctx.db.get(workspaceId)

      if (workspace) {
        workspaces.push(workspace)
      }
    }

    return workspaces
  }
})

export const getById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Unauthorized");

    //get member row with workSpaceId and userId
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
    )
    .unique()

    if (!member) return null

    const workspace = await ctx.db.get(args.id)
    return workspace
  }
})

export const update = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.string()
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Unauthorized");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
    )
    .unique()

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized")
    }

    const updatedWorkspace = await ctx.db.patch(args.id, {
      name: args.name
    })

    return updatedWorkspace
  }
})

export const remove = mutation({
  args: {
    id: v.id("workspaces")
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Unauthorized");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
    )
    .unique()

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized")
    }

    const [members] = await Promise.all([
      ctx.db
        .query("members")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
        .collect()
    ])

    for (const member of members) {
      await ctx.db.delete(member._id)
    }

    await ctx.db.delete(args.id)
  }
}) 