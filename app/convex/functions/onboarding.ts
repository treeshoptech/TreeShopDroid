import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { getDefaultPermissions, getTierFromRole } from "./auth";

/**
 * Auto-create user and organization on first login
 * Called from frontend when user signs in with Clerk
 */
export const setupNewUser = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_user", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();

    if (existingUser) {
      return { userId: existingUser._id, organizationId: existingUser.organizationId };
    }

    const now = Date.now();

    // Create organization for this user
    const organizationId = await ctx.db.insert("organizations", {
      name: `${args.name}'s Company`,
      plan: "base",
      subscriptionStatus: "trialing", // 14-day trial
      billingEmail: args.email,
      maxUsers: 5,
      userCount: 1,
      settings: {},
      createdAt: now,
      updatedAt: now,
    });

    // Create user as owner (tier 1)
    const role = "owner";
    const tier = getTierFromRole(role);
    const permissions = getDefaultPermissions(role);

    const userId = await ctx.db.insert("users", {
      organizationId,
      clerkUserId: args.clerkUserId,
      email: args.email,
      name: args.name,
      role,
      tier,
      isActive: true,
      permissions,
      createdAt: now,
      updatedAt: now,
    });

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId,
      userId,
      action: "create",
      resource: "user",
      resourceId: userId,
      timestamp: now,
    });

    return { userId, organizationId };
  },
});
