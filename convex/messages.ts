import { v } from "convex/values";
import { query, mutation, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import { count } from "console";
import { paginationOptsValidator } from "convex/server";

const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
) => {
  return ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId)
    )
    .unique()
}

const getChannelMember = async (
  ctx: QueryCtx,
  channelId: Id<"channels">,
  userId: Id<"users">
) => {
  return ctx.db
    .query("channelMembers")
    .withIndex("by_channel_id_user_id", (q) =>
      q.eq("channelId", channelId).eq("userId", userId)
    )
    .unique();
};

const populateUser = async (ctx: QueryCtx, userId: Id<"users">) => {
  return await ctx.db.get(userId)
}

const populateMember = async (ctx: QueryCtx, memberId: Id<"members">) => {
  return await ctx.db.get(memberId)
}

const populateReactions = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  return await ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect()
}

const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_parent_message_id", (q) => q.eq("parentMessageId", messageId))
    .collect()
  
  if (messages.length === 0) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0
    }
  }

  const lastMessage = messages[messages.length - 1];
  const lastMessageMember = await populateMember(ctx, lastMessage.memberId)

  if (!lastMessageMember) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0
    }
  }

  const lastMessageUser = await populateUser(ctx, lastMessageMember.userId)

  return {
    count: messages.length,
    image: lastMessageUser?.image,
    timestamp: lastMessage._creationTime
  }
}


export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages"))
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error("Unauthorized");
    }
    
    const member = await getMember(ctx, args.workspaceId, userId)
    
    if (!member) {
      throw new Error("Unauthorized");
    }

    if (args.channelId) {
      const channelMember = await getChannelMember(ctx, args.channelId, userId);
      if (!channelMember) {
        throw new Error("Unauthorized - Not a channel member");
      }
    }

    let _conversationId = args.conversationId

    // If replying to parent message
    if (!_conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId)

      if (!parentMessage) {
        throw new Error("Message recipient unknown")
      }

      _conversationId = parentMessage.conversationId
    }

    const messageId = await ctx.db.insert("messages", {
      memberId: member._id,
      body: args.body,
      image: args.image,
      channelId: args.channelId,
      conversationId: _conversationId,
      workspaceId: args.workspaceId,
      parentMessageId: args.parentMessageId,
      updatedAt: Date.now()
    })
    
    return messageId;
  }
})


// Channel messages
export const get = query({
  args: {
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
    paginationOpts: paginationOptsValidator
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    //Confirm user is a workspace member
    const member = await getMember(ctx, args.workspaceId, userId)

    if (!member) throw new Error("Unauthorized");

    // For getting reply messages
    let _conversationId = args.conversationId

    if (!_conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId)

      if (!parentMessage) {
        throw new Error("Message recipient unknown")
      }

      _conversationId = parentMessage.conversationId
    }

    //For Channel
    if (args.channelId) {
      //Validate access to channel
      const channelMember = await getChannelMember(ctx, args.channelId, userId);
      if (!channelMember) throw new Error("Unauthorized");

      // for messages in parent_id in conversation_id
      if (args.parentMessageId && _conversationId) {
        return await ctx.db
          .query("messages")
          .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
            q
              .eq("channelId", args.channelId!)
              .eq("parentMessageId", args.parentMessageId!)
              .eq("conversationId", _conversationId!)
          )
          .order("desc")
          .paginate(args.paginationOpts);
      }

      // messages in channel_id
      return await ctx.db
        .query("messages")
        .withIndex("by_channel_id", (q) =>
          q.eq("channelId", args.channelId!)
        )
        .order("desc")
        .paginate(args.paginationOpts);
    }

    //For direct messages
    if (args.conversationId) {
      const conversation = await ctx.db.get(args.conversationId);
      if (!conversation) throw new Error("Conversation not found");

      const isParticipant = conversation.memberPrimaryId === member._id || conversation.memberSecondaryId === member._id;

      if (!isParticipant) {
        throw new Error("Unauthorized");
      }

      const messages = await ctx.db
        .query("messages")
        .withIndex("by_conversation_id", (q) =>
          q.eq("conversationId", args.conversationId)
        )
        .order("desc")
        .paginate(args.paginationOpts);

      return messages
    }
    
    return {
      page: [],
      isDone: true,
      continueCursor: ""
    };
  }
});
