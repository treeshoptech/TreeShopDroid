import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { getUserFromAuth, getDefaultPermissions, getTierFromRole } from "./auth";

/**
 * List all users in the organization
 */
export const list = query({
  handler: async (ctx) => {
    const user = await getUserFromAuth(ctx);

    return await ctx.db
      .query("users")
      .withIndex("by_organization", (q) => q.eq("organizationId", user.organizationId))
      .collect();
  },
});

/**
 * Get current user profile
 */
export const getCurrent = query({
  handler: async (ctx) => {
    return await getUserFromAuth(ctx);
  },
});

/**
 * Get user by ID
 */
export const get = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUser = await getUserFromAuth(ctx);
    const targetUser = await ctx.db.get(args.userId);

    if (!targetUser) {
      throw new Error("User not found");
    }

    // Ensure both users are in the same organization
    if (currentUser.organizationId !== targetUser.organizationId) {
      throw new Error("Access denied");
    }

    return targetUser;
  },
});

/**
 * Create a new user (called during Clerk sync or manual invitation)
 */
export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
    clerkUserId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(
      v.literal("owner"),
      v.literal("manager"),
      v.literal("operations"),
      v.literal("sales"),
      v.literal("crew_leader"),
      v.literal("crew_member"),
      v.literal("accountant"),
      v.literal("customer")
    ),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_user", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();

    if (existingUser) {
      throw new Error("User already exists");
    }

    const now = Date.now();
    const tier = getTierFromRole(args.role);
    const permissions = getDefaultPermissions(args.role);

    const userId = await ctx.db.insert("users", {
      organizationId: args.organizationId,
      clerkUserId: args.clerkUserId,
      email: args.email,
      name: args.name,
      role: args.role,
      tier,
      isActive: true,
      phone: args.phone,
      permissions,
      createdAt: now,
      updatedAt: now,
    });

    // Update organization user count
    const org = await ctx.db.get(args.organizationId);
    if (org) {
      await ctx.db.patch(args.organizationId, {
        userCount: org.userCount + 1,
      });
    }

    return userId;
  },
});

/**
 * Update user profile
 */
export const update = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.optional(v.union(
      v.literal("owner"),
      v.literal("manager"),
      v.literal("operations"),
      v.literal("sales"),
      v.literal("crew_leader"),
      v.literal("crew_member"),
      v.literal("accountant"),
      v.literal("customer")
    )),
  },
  handler: async (ctx, args) => {
    const currentUser = await getUserFromAuth(ctx);

    // Only owners and managers can update other users
    if (currentUser.role !== "owner" && currentUser.role !== "manager" && currentUser._id !== args.userId) {
      throw new Error("Permission denied");
    }

    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new Error("User not found");
    }

    // Ensure same organization
    if (currentUser.organizationId !== targetUser.organizationId) {
      throw new Error("Access denied");
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.name) updates.name = args.name;
    if (args.phone) updates.phone = args.phone;
    if (args.role) {
      updates.role = args.role;
      updates.tier = getTierFromRole(args.role);
      updates.permissions = getDefaultPermissions(args.role);
    }

    await ctx.db.patch(args.userId, updates);
  },
});

/**
 * Deactivate user (soft delete)
 */
export const deactivate = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUser = await getUserFromAuth(ctx);

    // Only owners and managers can deactivate users
    if (currentUser.role !== "owner" && currentUser.role !== "manager") {
      throw new Error("Permission denied");
    }

    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new Error("User not found");
    }

    // Ensure same organization
    if (currentUser.organizationId !== targetUser.organizationId) {
      throw new Error("Access denied");
    }

    await ctx.db.patch(args.userId, {
      isActive: false,
      updatedAt: Date.now(),
    });

    // Update organization user count
    const org = await ctx.db.get(currentUser.organizationId);
    if (org) {
      await ctx.db.patch(currentUser.organizationId, {
        userCount: Math.max(0, org.userCount - 1),
      });
    }
  },
});

/**
 * Reactivate user
 */
export const reactivate = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUser = await getUserFromAuth(ctx);

    // Only owners and managers can reactivate users
    if (currentUser.role !== "owner" && currentUser.role !== "manager") {
      throw new Error("Permission denied");
    }

    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new Error("User not found");
    }

    // Ensure same organization
    if (currentUser.organizationId !== targetUser.organizationId) {
      throw new Error("Access denied");
    }

    // Check license limits
    const org = await ctx.db.get(currentUser.organizationId);
    if (org && org.userCount >= org.maxUsers) {
      throw new Error("User limit reached. Please upgrade your plan.");
    }

    await ctx.db.patch(args.userId, {
      isActive: true,
      updatedAt: Date.now(),
    });

    // Update organization user count
    if (org) {
      await ctx.db.patch(currentUser.organizationId, {
        userCount: org.userCount + 1,
      });
    }
  },
});
