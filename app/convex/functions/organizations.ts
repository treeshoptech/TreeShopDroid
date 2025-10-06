import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { getUserFromAuth } from "./auth";

/**
 * Get organization by ID
 */
export const get = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    // Ensure user belongs to this organization
    if (user.organizationId !== args.organizationId) {
      throw new Error("Access denied");
    }

    return await ctx.db.get(args.organizationId);
  },
});

/**
 * Get current user's organization
 */
export const getCurrent = query({
  handler: async (ctx) => {
    const user = await getUserFromAuth(ctx);
    return await ctx.db.get(user.organizationId);
  },
});

/**
 * Create a new organization (called during onboarding)
 */
export const create = mutation({
  args: {
    name: v.string(),
    billingEmail: v.string(),
    plan: v.optional(v.union(v.literal("base"), v.literal("growth"), v.literal("enterprise"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const now = Date.now();

    const organizationId = await ctx.db.insert("organizations", {
      name: args.name,
      plan: args.plan || "base",
      subscriptionStatus: "trialing", // 14-day trial
      billingEmail: args.billingEmail,
      maxUsers: 5, // Base plan limit
      userCount: 0,
      settings: {},
      createdAt: now,
      updatedAt: now,
    });

    return organizationId;
  },
});

/**
 * Update organization settings
 */
export const update = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.optional(v.string()),
    settings: v.optional(v.object({
      companyAddress: v.optional(v.string()),
      companyPhone: v.optional(v.string()),
      logoUrl: v.optional(v.string()),
      timezone: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    // Only owners and managers can update settings
    if (user.role !== "owner" && user.role !== "manager") {
      throw new Error("Permission denied");
    }

    // Ensure user belongs to this organization
    if (user.organizationId !== args.organizationId) {
      throw new Error("Access denied");
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.name) updates.name = args.name;
    if (args.settings) updates.settings = args.settings;

    await ctx.db.patch(args.organizationId, updates);
  },
});

/**
 * Update subscription status (called by Stripe webhook)
 */
export const updateSubscription = mutation({
  args: {
    stripeCustomerId: v.string(),
    subscriptionStatus: v.union(
      v.literal("active"),
      v.literal("past_due"),
      v.literal("cancelled"),
      v.literal("trialing")
    ),
    stripeSubscriptionId: v.optional(v.string()),
    plan: v.optional(v.union(v.literal("base"), v.literal("growth"), v.literal("enterprise"))),
    maxUsers: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // This function is called by Stripe webhooks (should validate webhook signature in production)

    const org = await ctx.db
      .query("organizations")
      .withIndex("by_stripe_customer", (q) => q.eq("stripeCustomerId", args.stripeCustomerId))
      .unique();

    if (!org) {
      throw new Error("Organization not found");
    }

    const updates: any = {
      subscriptionStatus: args.subscriptionStatus,
      updatedAt: Date.now(),
    };

    if (args.stripeSubscriptionId) updates.stripeSubscriptionId = args.stripeSubscriptionId;
    if (args.plan) updates.plan = args.plan;
    if (args.maxUsers) updates.maxUsers = args.maxUsers;

    await ctx.db.patch(org._id, updates);
  },
});

/**
 * Get organization usage stats
 */
export const getUsageStats = query({
  handler: async (ctx) => {
    const user = await getUserFromAuth(ctx);
    const org = await ctx.db.get(user.organizationId);

    if (!org) {
      throw new Error("Organization not found");
    }

    // Count active users
    const activeUsers = await ctx.db
      .query("users")
      .withIndex("by_organization", (q) => q.eq("organizationId", user.organizationId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    return {
      userCount: activeUsers.length,
      maxUsers: org.maxUsers,
      plan: org.plan,
      subscriptionStatus: org.subscriptionStatus,
    };
  },
});
