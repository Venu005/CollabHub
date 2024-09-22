import { v } from "convex/values";
import { auth } from "./auth";
import { mutation, query, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
) => {
  const member = await ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId)
    )
    .unique();

  return member;
};

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")), // direct meesages kuda untay
    parentMessageId: v.optional(v.id("messages")), // replies
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return null;
    }
    const member = await getMember(ctx, args.workspaceId, userId);
    if (!member) {
      return null;
    }
    const messageId = await ctx.db.insert("messages", {
      memberId: member._id,
      workspaceId: args.workspaceId,
      channelId: args.channelId,
      body: args.body,
      image: args.image,
      parentMessageId: args.parentMessageId,
      updatedAt: Date.now(),
    });
    return messageId;
  },
});
