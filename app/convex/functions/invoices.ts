import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { getUserFromAuth } from "./auth";

/**
 * List all invoices
 */
export const list = query({
  handler: async (ctx) => {
    const user = await getUserFromAuth(ctx);

    return await ctx.db
      .query("invoices")
      .withIndex("by_organization", (q) => q.eq("organizationId", user.organizationId))
      .order("desc")
      .collect();
  },
});

/**
 * Get invoice by ID
 */
export const get = query({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    const invoice = await ctx.db.get(args.invoiceId);

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    if (invoice.organizationId !== user.organizationId) {
      throw new Error("Access denied");
    }

    return invoice;
  },
});

/**
 * Create invoice
 */
export const create = mutation({
  args: {
    workOrderId: v.optional(v.id("workOrders")),
    customerId: v.id("customers"),
    invoiceNumber: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("paid"),
      v.literal("overdue"),
      v.literal("cancelled")
    ),
    dueDate: v.number(),
    lineItems: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        rate: v.number(),
        total: v.number(),
      })
    ),
    subtotal: v.number(),
    taxRate: v.number(),
    taxAmount: v.number(),
    total: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    if (!user.permissions.invoices.create) {
      throw new Error("Permission denied: Cannot create invoices");
    }

    const now = Date.now();

    const invoiceId = await ctx.db.insert("invoices", {
      organizationId: user.organizationId,
      workOrderId: args.workOrderId,
      customerId: args.customerId,
      invoiceNumber: args.invoiceNumber,
      status: args.status,
      dueDate: args.dueDate,
      lineItems: args.lineItems,
      subtotal: args.subtotal,
      taxRate: args.taxRate,
      taxAmount: args.taxAmount,
      total: args.total,
      amountPaid: 0,
      createdBy: user._id,
      createdAt: now,
      updatedAt: now,
    });

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId: user.organizationId,
      userId: user._id,
      action: "create",
      resource: "invoice",
      resourceId: invoiceId,
      timestamp: now,
    });

    return invoiceId;
  },
});

/**
 * Update invoice
 */
export const update = mutation({
  args: {
    invoiceId: v.id("invoices"),
    status: v.optional(v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("paid"),
      v.literal("overdue"),
      v.literal("cancelled")
    )),
    dueDate: v.optional(v.number()),
    lineItems: v.optional(v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        rate: v.number(),
        total: v.number(),
      })
    )),
    subtotal: v.optional(v.number()),
    taxRate: v.optional(v.number()),
    taxAmount: v.optional(v.number()),
    total: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    const invoice = await ctx.db.get(args.invoiceId);

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    if (invoice.organizationId !== user.organizationId) {
      throw new Error("Access denied");
    }

    if (!user.permissions.invoices.update) {
      throw new Error("Permission denied: Cannot update invoices");
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.status !== undefined) updates.status = args.status;
    if (args.dueDate !== undefined) updates.dueDate = args.dueDate;
    if (args.lineItems !== undefined) updates.lineItems = args.lineItems;
    if (args.subtotal !== undefined) updates.subtotal = args.subtotal;
    if (args.taxRate !== undefined) updates.taxRate = args.taxRate;
    if (args.taxAmount !== undefined) updates.taxAmount = args.taxAmount;
    if (args.total !== undefined) updates.total = args.total;

    await ctx.db.patch(args.invoiceId, updates);

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId: user.organizationId,
      userId: user._id,
      action: "update",
      resource: "invoice",
      resourceId: args.invoiceId,
      changes: updates,
      timestamp: Date.now(),
    });
  },
});

/**
 * Mark invoice as paid
 */
export const markAsPaid = mutation({
  args: {
    invoiceId: v.id("invoices"),
    paymentMethod: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    const invoice = await ctx.db.get(args.invoiceId);

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    if (invoice.organizationId !== user.organizationId) {
      throw new Error("Access denied");
    }

    const now = Date.now();

    await ctx.db.patch(args.invoiceId, {
      status: "paid",
      amountPaid: invoice.total,
      paymentMethod: args.paymentMethod,
      paidAt: now,
      updatedAt: now,
    });

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId: user.organizationId,
      userId: user._id,
      action: "update",
      resource: "invoice",
      resourceId: args.invoiceId,
      changes: { status: "paid", paymentMethod: args.paymentMethod },
      timestamp: now,
    });
  },
});

/**
 * Get overdue invoices
 */
export const listOverdue = query({
  handler: async (ctx) => {
    const user = await getUserFromAuth(ctx);
    const now = Date.now();

    const allInvoices = await ctx.db
      .query("invoices")
      .withIndex("by_organization", (q) => q.eq("organizationId", user.organizationId))
      .collect();

    return allInvoices.filter(
      (inv) => inv.status === "sent" && inv.dueDate < now
    );
  },
});

/**
 * Get invoices by status
 */
export const listByStatus = query({
  args: {
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("paid"),
      v.literal("overdue"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    return await ctx.db
      .query("invoices")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .filter((q) => q.eq(q.field("organizationId"), user.organizationId))
      .order("desc")
      .collect();
  },
});
