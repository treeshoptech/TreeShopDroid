import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { getUserFromAuth } from "./auth";

/**
 * List all leads (with row-level security)
 */
export const list = query({
  handler: async (ctx) => {
    const user = await getUserFromAuth(ctx);

    // Tier 1 & 2: See all leads in organization
    if (user.tier === 1 || user.tier === 2) {
      return await ctx.db
        .query("leads")
        .withIndex("by_organization", (q) => q.eq("organizationId", user.organizationId))
        .order("desc")
        .collect();
    }

    // Tier 3: Only see assigned leads
    if (user.tier === 3) {
      return await ctx.db
        .query("leads")
        .withIndex("by_assigned", (q) => q.eq("assignedTo", user._id))
        .order("desc")
        .collect();
    }

    // Tier 4 & customers: No access
    return [];
  },
});

/**
 * Get lead by ID
 */
export const get = query({
  args: { leadId: v.id("leads") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    const lead = await ctx.db.get(args.leadId);

    if (!lead) {
      throw new Error("Lead not found");
    }

    // Ensure user can access this lead
    if (lead.organizationId !== user.organizationId) {
      throw new Error("Access denied");
    }

    // Tier 3: Can only view assigned leads
    if (user.tier === 3 && lead.assignedTo !== user._id) {
      throw new Error("Access denied");
    }

    return lead;
  },
});

/**
 * Create a new lead
 */
export const create = mutation({
  args: {
    customerId: v.optional(v.id("customers")),
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("scheduled"),
      v.literal("quoted"),
      v.literal("won"),
      v.literal("lost")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    source: v.string(),
    serviceType: v.array(v.string()),
    description: v.string(),
    estimatedValue: v.optional(v.number()),
    scheduledDate: v.optional(v.number()),
    assignedTo: v.optional(v.id("users")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    // Check permission
    if (!user.permissions.leads.create) {
      throw new Error("Permission denied: Cannot create leads");
    }

    const now = Date.now();

    const leadId = await ctx.db.insert("leads", {
      organizationId: user.organizationId,
      customerId: args.customerId,
      status: args.status,
      priority: args.priority,
      source: args.source,
      serviceType: args.serviceType,
      description: args.description,
      estimatedValue: args.estimatedValue,
      scheduledDate: args.scheduledDate,
      assignedTo: args.assignedTo,
      notes: args.notes,
      createdBy: user._id,
      createdAt: now,
      updatedAt: now,
    });

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId: user.organizationId,
      userId: user._id,
      action: "create",
      resource: "lead",
      resourceId: leadId,
      timestamp: now,
    });

    return leadId;
  },
});

/**
 * Update a lead
 */
export const update = mutation({
  args: {
    leadId: v.id("leads"),
    status: v.optional(v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("scheduled"),
      v.literal("quoted"),
      v.literal("won"),
      v.literal("lost")
    )),
    priority: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    )),
    source: v.optional(v.string()),
    serviceType: v.optional(v.array(v.string())),
    description: v.optional(v.string()),
    estimatedValue: v.optional(v.number()),
    scheduledDate: v.optional(v.number()),
    assignedTo: v.optional(v.id("users")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    const lead = await ctx.db.get(args.leadId);

    if (!lead) {
      throw new Error("Lead not found");
    }

    // Ensure user can access this lead
    if (lead.organizationId !== user.organizationId) {
      throw new Error("Access denied");
    }

    // Check permission
    if (!user.permissions.leads.update) {
      throw new Error("Permission denied: Cannot update leads");
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.status !== undefined) updates.status = args.status;
    if (args.priority !== undefined) updates.priority = args.priority;
    if (args.source !== undefined) updates.source = args.source;
    if (args.serviceType !== undefined) updates.serviceType = args.serviceType;
    if (args.description !== undefined) updates.description = args.description;
    if (args.estimatedValue !== undefined) updates.estimatedValue = args.estimatedValue;
    if (args.scheduledDate !== undefined) updates.scheduledDate = args.scheduledDate;
    if (args.assignedTo !== undefined) updates.assignedTo = args.assignedTo;
    if (args.notes !== undefined) updates.notes = args.notes;

    await ctx.db.patch(args.leadId, updates);

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId: user.organizationId,
      userId: user._id,
      action: "update",
      resource: "lead",
      resourceId: args.leadId,
      changes: updates,
      timestamp: Date.now(),
    });
  },
});

/**
 * Delete a lead
 */
export const remove = mutation({
  args: { leadId: v.id("leads") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    const lead = await ctx.db.get(args.leadId);

    if (!lead) {
      throw new Error("Lead not found");
    }

    // Ensure user can access this lead
    if (lead.organizationId !== user.organizationId) {
      throw new Error("Access denied");
    }

    // Check permission
    if (!user.permissions.leads.delete) {
      throw new Error("Permission denied: Cannot delete leads");
    }

    await ctx.db.delete(args.leadId);

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId: user.organizationId,
      userId: user._id,
      action: "delete",
      resource: "lead",
      resourceId: args.leadId,
      timestamp: Date.now(),
    });
  },
});

/**
 * Get leads by status
 */
export const listByStatus = query({
  args: {
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("scheduled"),
      v.literal("quoted"),
      v.literal("won"),
      v.literal("lost")
    ),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    return await ctx.db
      .query("leads")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .filter((q) => q.eq(q.field("organizationId"), user.organizationId))
      .order("desc")
      .collect();
  },
});

/**
 * Get leads assigned to a specific user
 */
export const listByAssignee = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    return await ctx.db
      .query("leads")
      .withIndex("by_assigned", (q) => q.eq("assignedTo", args.userId))
      .filter((q) => q.eq(q.field("organizationId"), user.organizationId))
      .order("desc")
      .collect();
  },
});
