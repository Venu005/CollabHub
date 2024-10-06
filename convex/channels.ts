import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

export const get = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .unique();
    if (!member) {
      return [];
    }
    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
      .collect();

    return channels;
  },
});

export const create = mutation({
  args: { name: v.string(), workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    //admin or not
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();
    if (!member || member?.role !== "admin") {
      throw new Error("Not an admin");
    }
    const parsedName = args.name.replace(/s\+/g, "-").toLowerCase();

    const channelId = await ctx.db.insert("channels", {
      name: parsedName,
      workspaceId: args.workspaceId,
    });

    return channelId;
  },
});

export const getById = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return null;
    }

    const channel = await ctx.db.get(args.channelId);
    if (!channel) {
      return null;
    }
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", channel.workspaceId).eq("userId", userId)
      )
      .unique();
    if (!member) {
      return null;
    }

    return channel;
  },
});

export const update = mutation({
  args: { id: v.id("channels"), name: v.string() },
  handler: async (ctx, args) => {
    //member  should be admin
    const userID = await auth.getUserId(ctx);
    if (!userID) {
      throw new Error("Not authenticated");
    }
    const channel = await ctx.db.get(args.id);
    if (!channel) {
      throw new Error("Channel not found");
    }
    if (!channel.workspaceId) {
      throw new Error("Workspae not found not found");
    }
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", channel.workspaceId).eq("userId", userID)
      )
      .unique();
    if (!member || member?.role !== "admin") {
      throw new Error("Not an admin");
    }

    await ctx.db.patch(args.id, {
      name: args.name,
    });

    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id("channels") },
  handler: async (ctx, args) => {
    //member  should be admin
    const userID = await auth.getUserId(ctx);
    if (!userID) {
      throw new Error("Not authenticated");
    }
    const channel = await ctx.db.get(args.id);
    if (!channel) {
      throw new Error("Channel not found");
    }
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", channel.workspaceId).eq("userId", userID)
      )
      .unique();
    if (!member || member?.role !== "admin") {
      throw new Error("Not an admin");
    }
    const [messages] = await Promise.all([
      ctx.db
        .query("messages")
        .withIndex("by_channel_id", (q) => q.eq("channelId", args.id))
        .collect(),
    ]);
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    await ctx.db.delete(channel._id);

    return args.id;
  },
});
