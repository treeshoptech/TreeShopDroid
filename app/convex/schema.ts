import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Organizations (Companies using TreeShop)
  organizations: defineTable({
    name: v.string(),
    plan: v.union(v.literal("base"), v.literal("growth"), v.literal("enterprise")),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    subscriptionStatus: v.union(
      v.literal("active"),
      v.literal("past_due"),
      v.literal("cancelled"),
      v.literal("trialing")
    ),
    billingEmail: v.string(),
    maxUsers: v.number(), // License limit
    userCount: v.number(), // Current active users
    settings: v.object({
      companyAddress: v.optional(v.string()),
      companyPhone: v.optional(v.string()),
      logoUrl: v.optional(v.string()),
      timezone: v.optional(v.string()),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_stripe_customer", ["stripeCustomerId"])
    .index("by_subscription_status", ["subscriptionStatus"]),

  // Users (Employees and customers)
  users: defineTable({
    organizationId: v.id("organizations"),
    clerkUserId: v.string(), // From Clerk
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
    tier: v.optional(v.union(v.literal(1), v.literal(2), v.literal(3), v.literal(4))),
    isActive: v.boolean(),
    phone: v.optional(v.string()),
    avatar: v.optional(v.string()),
    permissions: v.object({
      leads: v.object({
        create: v.boolean(),
        read: v.boolean(),
        update: v.boolean(),
        delete: v.boolean(),
      }),
      proposals: v.object({
        create: v.boolean(),
        read: v.boolean(),
        update: v.boolean(),
        delete: v.boolean(),
      }),
      workOrders: v.object({
        create: v.boolean(),
        read: v.boolean(),
        update: v.boolean(),
        delete: v.boolean(),
      }),
      invoices: v.object({
        create: v.boolean(),
        read: v.boolean(),
        update: v.boolean(),
        delete: v.boolean(),
      }),
      customers: v.object({
        create: v.boolean(),
        read: v.boolean(),
        update: v.boolean(),
        delete: v.boolean(),
      }),
      reports: v.object({
        read: v.boolean(),
      }),
      settings: v.object({
        read: v.boolean(),
        update: v.boolean(),
      }),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_clerk_user", ["clerkUserId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  // Customers (End clients of tree service companies)
  customers: defineTable({
    organizationId: v.id("organizations"),
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
    source: v.optional(v.string()), // Where they found us
    tags: v.optional(v.array(v.string())),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_email", ["email"])
    .index("by_phone", ["phone"]),

  // Leads
  leads: defineTable({
    organizationId: v.id("organizations"),
    customerId: v.optional(v.id("customers")),
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("scheduled"),
      v.literal("quoted"),
      v.literal("won"),
      v.literal("lost")
    ),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    source: v.string(),
    serviceType: v.array(v.string()),
    description: v.string(),
    estimatedValue: v.optional(v.number()),
    scheduledDate: v.optional(v.number()),
    assignedTo: v.optional(v.id("users")),
    notes: v.optional(v.string()),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_customer", ["customerId"])
    .index("by_status", ["status"])
    .index("by_assigned", ["assignedTo"])
    .index("by_created", ["createdAt"]),

  // Proposals
  proposals: defineTable({
    organizationId: v.id("organizations"),
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
    pdfUrl: v.optional(v.string()),
    createdBy: v.id("users"),
    sentAt: v.optional(v.number()),
    viewedAt: v.optional(v.number()),
    acceptedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_customer", ["customerId"])
    .index("by_lead", ["leadId"])
    .index("by_status", ["status"])
    .index("by_proposal_number", ["proposalNumber"]),

  // Work Orders
  workOrders: defineTable({
    organizationId: v.id("organizations"),
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
    completedDate: v.optional(v.number()),
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
    photos: v.optional(v.array(v.string())),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_customer", ["customerId"])
    .index("by_proposal", ["proposalId"])
    .index("by_status", ["status"])
    .index("by_scheduled", ["scheduledDate"]),

  // Invoices
  invoices: defineTable({
    organizationId: v.id("organizations"),
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
    amountPaid: v.number(),
    paymentMethod: v.optional(v.string()),
    pdfUrl: v.optional(v.string()),
    createdBy: v.id("users"),
    sentAt: v.optional(v.number()),
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_customer", ["customerId"])
    .index("by_work_order", ["workOrderId"])
    .index("by_status", ["status"])
    .index("by_invoice_number", ["invoiceNumber"])
    .index("by_due_date", ["dueDate"]),

  // Audit Logs
  auditLogs: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    action: v.string(), // "create", "update", "delete", "view"
    resource: v.string(), // "lead", "proposal", "work_order", "invoice"
    resourceId: v.string(),
    changes: v.optional(v.any()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_user", ["userId"])
    .index("by_resource", ["resource", "resourceId"])
    .index("by_timestamp", ["timestamp"]),
});
