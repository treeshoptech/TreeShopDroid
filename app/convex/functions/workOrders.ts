import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { getUserFromAuth } from "./auth";

/**
 * List all work orders
 */
export const list = query({
  handler: async (ctx) => {
    const user = await getUserFromAuth(ctx);

    // Tier 1 & 2: See all work orders
    if (user.tier === 1 || user.tier === 2) {
      return await ctx.db
        .query("workOrders")
        .withIndex("by_organization", (q) => q.eq("organizationId", user.organizationId))
        .order("desc")
        .collect();
    }

    // Tier 3: Only see assigned work orders
    if (user.tier === 3) {
      const allWorkOrders = await ctx.db
        .query("workOrders")
        .withIndex("by_organization", (q) => q.eq("organizationId", user.organizationId))
        .collect();

      return allWorkOrders.filter((wo) => wo.assignedCrew.includes(user._id));
    }

    return [];
  },
});

/**
 * Get work order by ID
 */
export const get = query({
  args: { workOrderId: v.id("workOrders") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    const workOrder = await ctx.db.get(args.workOrderId);

    if (!workOrder) {
      throw new Error("Work order not found");
    }

    if (workOrder.organizationId !== user.organizationId) {
      throw new Error("Access denied");
    }

    // Tier 3: Can only view if assigned
    if (user.tier === 3 && !workOrder.assignedCrew.includes(user._id)) {
      throw new Error("Access denied");
    }

    return workOrder;
  },
});

/**
 * Create work order
 */
export const create = mutation({
  args: {
    proposalId: v.optional(v.id("proposals")),
    customerId: v.id("customers"),
    workOrderNumber: v.string(),
    status: v.union(
      v.literal("scheduled"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    scheduledDate: v.number(),
    assignedCrew: v.array(v.id("users")),
    services: v.array(
      v.object({
        name: v.string(),
        description: v.string(),
        completed: v.boolean(),
      })
    ),
    equipment: v.array(v.string()),
    safetyNotes: v.optional(v.string()),
    jobNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    if (!user.permissions.workOrders.create) {
      throw new Error("Permission denied: Cannot create work orders");
    }

    const now = Date.now();

    const workOrderId = await ctx.db.insert("workOrders", {
      organizationId: user.organizationId,
      proposalId: args.proposalId,
      customerId: args.customerId,
      workOrderNumber: args.workOrderNumber,
      status: args.status,
      scheduledDate: args.scheduledDate,
      assignedCrew: args.assignedCrew,
      services: args.services,
      equipment: args.equipment,
      safetyNotes: args.safetyNotes,
      jobNotes: args.jobNotes,
      createdBy: user._id,
      createdAt: now,
      updatedAt: now,
    });

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId: user.organizationId,
      userId: user._id,
      action: "create",
      resource: "work_order",
      resourceId: workOrderId,
      timestamp: now,
    });

    return workOrderId;
  },
});

/**
 * Update work order
 */
export const update = mutation({
  args: {
    workOrderId: v.id("workOrders"),
    status: v.optional(v.union(
      v.literal("scheduled"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    )),
    scheduledDate: v.optional(v.number()),
    assignedCrew: v.optional(v.array(v.id("users"))),
    services: v.optional(v.array(
      v.object({
        name: v.string(),
        description: v.string(),
        completed: v.boolean(),
      })
    )),
    equipment: v.optional(v.array(v.string())),
    safetyNotes: v.optional(v.string()),
    jobNotes: v.optional(v.string()),
    photos: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    const workOrder = await ctx.db.get(args.workOrderId);

    if (!workOrder) {
      throw new Error("Work order not found");
    }

    if (workOrder.organizationId !== user.organizationId) {
      throw new Error("Access denied");
    }

    if (!user.permissions.workOrders.update) {
      throw new Error("Permission denied: Cannot update work orders");
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.status !== undefined) updates.status = args.status;
    if (args.scheduledDate !== undefined) updates.scheduledDate = args.scheduledDate;
    if (args.assignedCrew !== undefined) updates.assignedCrew = args.assignedCrew;
    if (args.services !== undefined) updates.services = args.services;
    if (args.equipment !== undefined) updates.equipment = args.equipment;
    if (args.safetyNotes !== undefined) updates.safetyNotes = args.safetyNotes;
    if (args.jobNotes !== undefined) updates.jobNotes = args.jobNotes;
    if (args.photos !== undefined) updates.photos = args.photos;

    await ctx.db.patch(args.workOrderId, updates);

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId: user.organizationId,
      userId: user._id,
      action: "update",
      resource: "work_order",
      resourceId: args.workOrderId,
      changes: updates,
      timestamp: Date.now(),
    });
  },
});

/**
 * Mark work order as completed
 */
export const markAsCompleted = mutation({
  args: { workOrderId: v.id("workOrders") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    const workOrder = await ctx.db.get(args.workOrderId);

    if (!workOrder) {
      throw new Error("Work order not found");
    }

    if (workOrder.organizationId !== user.organizationId) {
      throw new Error("Access denied");
    }

    const now = Date.now();

    await ctx.db.patch(args.workOrderId, {
      status: "completed",
      completedDate: now,
      updatedAt: now,
    });
  },
});

/**
 * Get work orders by date range
 */
export const listByDateRange = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    const allWorkOrders = await ctx.db
      .query("workOrders")
      .withIndex("by_organization", (q) => q.eq("organizationId", user.organizationId))
      .collect();

    return allWorkOrders.filter(
      (wo) => wo.scheduledDate >= args.startDate && wo.scheduledDate <= args.endDate
    );
  },
});
