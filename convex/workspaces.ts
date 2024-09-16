// api call for workspaces
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// all possilble workspaces
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("workspaces").collect();
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
    //! change later
    const joinCode = "123456";
    // every time a document is creeated it returns an id
    const worksapceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode,
    });
    //* to eturning entite eorkspaces
    //const workspce =  await ctx.db.get(worksapceId)

    return worksapceId;
  },
});

export const getById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const workSpaceById = await ctx.db.get(args.id);
    return workSpaceById;
  },
});
