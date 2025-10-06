import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { getUserFromAuth } from "./auth";

/**
 * List all customers
 */
export const list = query({
  handler: async (ctx) => {
    const user = await getUserFromAuth(ctx);

    if (!user.permissions.customers.read) {
      throw new Error("Permission denied: Cannot read customers");
    }

    return await ctx.db
      .query("customers")
      .withIndex("by_organization", (q) => q.eq("organizationId", user.organizationId))
      .order("desc")
      .collect();
  },
});

/**
 * Get customer by ID
 */
export const get = query({
  args: { customerId: v.id("customers") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    const customer = await ctx.db.get(args.customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    if (customer.organizationId !== user.organizationId) {
      throw new Error("Access denied");
    }

    return customer;
  },
});

/**
 * Create customer
 */
export const create = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    propertyType: v.union(
      v.literal("residential"),
      v.literal("commercial"),
      v.literal("municipal")
    ),
    notes: v.optional(v.string()),
    source: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    if (!user.permissions.customers.create) {
      throw new Error("Permission denied: Cannot create customers");
    }

    const now = Date.now();

    const customerId = await ctx.db.insert("customers", {
      organizationId: user.organizationId,
      name: args.name,
      email: args.email,
      phone: args.phone,
      address: args.address,
      city: args.city,
      state: args.state,
      zipCode: args.zipCode,
      propertyType: args.propertyType,
      notes: args.notes,
      source: args.source,
      tags: args.tags,
      createdBy: user._id,
      createdAt: now,
      updatedAt: now,
    });

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId: user.organizationId,
      userId: user._id,
      action: "create",
      resource: "customer",
      resourceId: customerId,
      timestamp: now,
    });

    return customerId;
  },
});

/**
 * Update customer
 */
export const update = mutation({
  args: {
    customerId: v.id("customers"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    propertyType: v.optional(v.union(
      v.literal("residential"),
      v.literal("commercial"),
      v.literal("municipal")
    )),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    const customer = await ctx.db.get(args.customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    if (customer.organizationId !== user.organizationId) {
      throw new Error("Access denied");
    }

    if (!user.permissions.customers.update) {
      throw new Error("Permission denied: Cannot update customers");
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) updates.name = args.name;
    if (args.email !== undefined) updates.email = args.email;
    if (args.phone !== undefined) updates.phone = args.phone;
    if (args.address !== undefined) updates.address = args.address;
    if (args.city !== undefined) updates.city = args.city;
    if (args.state !== undefined) updates.state = args.state;
    if (args.zipCode !== undefined) updates.zipCode = args.zipCode;
    if (args.propertyType !== undefined) updates.propertyType = args.propertyType;
    if (args.notes !== undefined) updates.notes = args.notes;
    if (args.tags !== undefined) updates.tags = args.tags;

    await ctx.db.patch(args.customerId, updates);

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId: user.organizationId,
      userId: user._id,
      action: "update",
      resource: "customer",
      resourceId: args.customerId,
      changes: updates,
      timestamp: Date.now(),
    });
  },
});

/**
 * Search customers by name, email, or phone
 */
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    if (!user.permissions.customers.read) {
      throw new Error("Permission denied: Cannot read customers");
    }

    const allCustomers = await ctx.db
      .query("customers")
      .withIndex("by_organization", (q) => q.eq("organizationId", user.organizationId))
      .collect();

    const searchTerm = args.query.toLowerCase();

    return allCustomers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email?.toLowerCase().includes(searchTerm) ||
        customer.phone.includes(searchTerm)
    );
  },
});
