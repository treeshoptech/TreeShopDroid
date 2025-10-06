import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { getUserFromAuth } from "./auth";

/**
 * List all proposals
 */
export const list = query({
  handler: async (ctx) => {
    const user = await getUserFromAuth(ctx);

    return await ctx.db
      .query("proposals")
      .withIndex("by_organization", (q) => q.eq("organizationId", user.organizationId))
      .order("desc")
      .collect();
  },
});

/**
 * Get proposal by ID
 */
export const get = query({
  args: { proposalId: v.id("proposals") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    const proposal = await ctx.db.get(args.proposalId);

    if (!proposal) {
      throw new Error("Proposal not found");
    }

    if (proposal.organizationId !== user.organizationId) {
      throw new Error("Access denied");
    }

    return proposal;
  },
});

/**
 * Create a new proposal
 */
export const create = mutation({
  args: {
    leadId: v.optional(v.id("leads")),
    customerId: v.id("customers"),
    proposalNumber: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("viewed"),
      v.literal("accepted"),
      v.literal("rejected")
    ),
    validUntil: v.number(),
    services: v.array(
      v.object({
        name: v.string(),
        description: v.string(),
        quantity: v.number(),
        unit: v.string(),
        rate: v.number(),
        total: v.number(),
      })
    ),
    subtotal: v.number(),
    taxRate: v.number(),
    taxAmount: v.number(),
    total: v.number(),
    terms: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    if (!user.permissions.proposals.create) {
      throw new Error("Permission denied: Cannot create proposals");
    }

    const now = Date.now();

    const proposalId = await ctx.db.insert("proposals", {
      organizationId: user.organizationId,
      leadId: args.leadId,
      customerId: args.customerId,
      proposalNumber: args.proposalNumber,
      status: args.status,
      validUntil: args.validUntil,
      services: args.services,
      subtotal: args.subtotal,
      taxRate: args.taxRate,
      taxAmount: args.taxAmount,
      total: args.total,
      terms: args.terms,
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
      resource: "proposal",
      resourceId: proposalId,
      timestamp: now,
    });

    return proposalId;
  },
});

/**
 * Update proposal
 */
export const update = mutation({
  args: {
    proposalId: v.id("proposals"),
    status: v.optional(v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("viewed"),
      v.literal("accepted"),
      v.literal("rejected")
    )),
    services: v.optional(v.array(
      v.object({
        name: v.string(),
        description: v.string(),
        quantity: v.number(),
        unit: v.string(),
        rate: v.number(),
        total: v.number(),
      })
    )),
    subtotal: v.optional(v.number()),
    taxRate: v.optional(v.number()),
    taxAmount: v.optional(v.number()),
    total: v.optional(v.number()),
    terms: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    const proposal = await ctx.db.get(args.proposalId);

    if (!proposal) {
      throw new Error("Proposal not found");
    }

    if (proposal.organizationId !== user.organizationId) {
      throw new Error("Access denied");
    }

    if (!user.permissions.proposals.update) {
      throw new Error("Permission denied: Cannot update proposals");
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.status !== undefined) updates.status = args.status;
    if (args.services !== undefined) updates.services = args.services;
    if (args.subtotal !== undefined) updates.subtotal = args.subtotal;
    if (args.taxRate !== undefined) updates.taxRate = args.taxRate;
    if (args.taxAmount !== undefined) updates.taxAmount = args.taxAmount;
    if (args.total !== undefined) updates.total = args.total;
    if (args.terms !== undefined) updates.terms = args.terms;
    if (args.notes !== undefined) updates.notes = args.notes;

    await ctx.db.patch(args.proposalId, updates);

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId: user.organizationId,
      userId: user._id,
      action: "update",
      resource: "proposal",
      resourceId: args.proposalId,
      changes: updates,
      timestamp: Date.now(),
    });
  },
});

/**
 * Delete proposal
 */
export const remove = mutation({
  args: { proposalId: v.id("proposals") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    const proposal = await ctx.db.get(args.proposalId);

    if (!proposal) {
      throw new Error("Proposal not found");
    }

    if (proposal.organizationId !== user.organizationId) {
      throw new Error("Access denied");
    }

    if (!user.permissions.proposals.delete) {
      throw new Error("Permission denied: Cannot delete proposals");
    }

    await ctx.db.delete(args.proposalId);

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId: user.organizationId,
      userId: user._id,
      action: "delete",
      resource: "proposal",
      resourceId: args.proposalId,
      timestamp: Date.now(),
    });
  },
});

/**
 * Mark proposal as sent
 */
export const markAsSent = mutation({
  args: { proposalId: v.id("proposals") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    const proposal = await ctx.db.get(args.proposalId);

    if (!proposal) {
      throw new Error("Proposal not found");
    }

    if (proposal.organizationId !== user.organizationId) {
      throw new Error("Access denied");
    }

    const now = Date.now();

    await ctx.db.patch(args.proposalId, {
      status: "sent",
      sentAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Mark proposal as accepted
 */
export const markAsAccepted = mutation({
  args: { proposalId: v.id("proposals") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    const proposal = await ctx.db.get(args.proposalId);

    if (!proposal) {
      throw new Error("Proposal not found");
    }

    if (proposal.organizationId !== user.organizationId) {
      throw new Error("Access denied");
    }

    const now = Date.now();

    await ctx.db.patch(args.proposalId, {
      status: "accepted",
      acceptedAt: now,
      updatedAt: now,
    });

    // Auto-update lead to "won" if exists
    if (proposal.leadId) {
      await ctx.db.patch(proposal.leadId, {
        status: "won",
        updatedAt: now,
      });
    }
  },
});
