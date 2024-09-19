// api call for workspaces
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// all possilble workspaces in which user is a mamber
export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      //  throw new Error("Not a member of this workspace");
      return [];
    }

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const workspaceIds = members.map((member) => member.workspaceId);
    const workspaces = [];

    for (const workspaceId of workspaceIds) {
      const workspace = await ctx.db.get(workspaceId);
      if (workspace) {
        workspaces.push(workspace);
      }
    }
    return workspaces;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const generateCode = () => {
      const code = Array.from(
        { length: 6 },
        () =>
          "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
      ).join("");

      return code;
    };
    const joinCode = generateCode();
    // every time a document is creeated it returns an id
    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode,
    });
    await ctx.db.insert("members", {
      userId,
      workspaceId,
      role: "admin",
    });
    await ctx.db.insert("channels", {
      name: "general",
      workspaceId,
    });
    //* to returning entite eorkspaces
    //const workspce =  await ctx.db.get(workspaceId)

    return workspaceId;
  },
});

export const getById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .unique();
    if (!member) {
      return null;
    }
    const workSpaceById = await ctx.db.get(args.id);
    return workSpaceById;
  },
});

export const update = mutation({
  args: { id: v.id("workspaces"), name: v.string() },
  handler: async (ctx, args) => {
    //member  should be admin
    const userID = await auth.getUserId(ctx);
    if (!userID) {
      throw new Error("Not authenticated");
    }
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userID)
      )
      .unique();
    if (!member || member?.role !== "admin") {
      throw new Error("Not an admin");
    }
    const workspace = await ctx.db.get(args.id);
    if (!workspace) {
      throw new Error("Workspace not found");
    }
    await ctx.db.patch(args.id, {
      name: args.name,
    });
    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    //member  should be admin
    const userID = await auth.getUserId(ctx);
    if (!userID) {
      throw new Error("Not authenticated");
    }
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userID)
      )
      .unique();
    if (!member || member?.role !== "admin") {
      throw new Error("Not an admin");
    }
    const workspace = await ctx.db.get(args.id);
    if (!workspace) {
      throw new Error("Workspace not found");
    }
    //deleting membrs
    const [members] = await Promise.all([
      ctx.db
        .query("members")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
        .collect(),
    ]);
    for (const member of members) {
      await ctx.db.delete(member._id);
    }
    await ctx.db.delete(args.id);

    return args.id;
  },
});
