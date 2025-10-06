import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

/**
 * Get the current authenticated user from Clerk
 */
export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity;
}

/**
 * Get the user record from the database
 */
export async function getUserFromAuth(ctx: QueryCtx | MutationCtx) {
  const identity = await getCurrentUser(ctx);

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_user", (q) => q.eq("clerkUserId", identity.subject))
    .unique();

  if (!user) {
    throw new Error("User not found in database");
  }

  return user;
}

/**
 * Check if user has permission for a specific action on a resource
 */
export function hasPermission(
  user: any,
  resource: "leads" | "proposals" | "workOrders" | "invoices" | "customers" | "reports" | "settings",
  action: "create" | "read" | "update" | "delete"
) {
  return user.permissions[resource][action] === true;
}

/**
 * Enforce row-level security: user can only access data from their organization
 */
export async function enforceOrganizationAccess(
  ctx: QueryCtx | MutationCtx,
  organizationId: Id<"organizations">
) {
  const user = await getUserFromAuth(ctx);

  if (user.organizationId !== organizationId) {
    throw new Error("Access denied: Organization mismatch");
  }

  return user;
}

/**
 * Get default permissions based on role
 */
export function getDefaultPermissions(
  role: "owner" | "manager" | "operations" | "sales" | "crew_leader" | "crew_member" | "accountant" | "customer"
) {
  const basePermissions = {
    leads: { create: false, read: false, update: false, delete: false },
    proposals: { create: false, read: false, update: false, delete: false },
    workOrders: { create: false, read: false, update: false, delete: false },
    invoices: { create: false, read: false, update: false, delete: false },
    customers: { create: false, read: false, update: false, delete: false },
    reports: { read: false },
    settings: { read: false, update: false },
  };

  switch (role) {
    case "owner":
    case "manager":
      // Tier 1: Full access
      return {
        leads: { create: true, read: true, update: true, delete: true },
        proposals: { create: true, read: true, update: true, delete: true },
        workOrders: { create: true, read: true, update: true, delete: true },
        invoices: { create: true, read: true, update: true, delete: true },
        customers: { create: true, read: true, update: true, delete: true },
        reports: { read: true },
        settings: { read: true, update: true },
      };

    case "operations":
    case "sales":
      // Tier 2: No settings access
      return {
        leads: { create: true, read: true, update: true, delete: true },
        proposals: { create: true, read: true, update: true, delete: true },
        workOrders: { create: true, read: true, update: true, delete: true },
        invoices: { create: true, read: true, update: true, delete: true },
        customers: { create: true, read: true, update: true, delete: true },
        reports: { read: true },
        settings: { read: true, update: false },
      };

    case "crew_leader":
    case "crew_member":
      // Tier 3: Only assigned work
      return {
        leads: { create: false, read: true, update: false, delete: false },
        proposals: { create: false, read: true, update: false, delete: false },
        workOrders: { create: false, read: true, update: true, delete: false },
        invoices: { create: false, read: false, update: false, delete: false },
        customers: { create: false, read: true, update: false, delete: false },
        reports: { read: false },
        settings: { read: false, update: false },
      };

    case "accountant":
      // Tier 4: Financial reports only
      return {
        leads: { create: false, read: false, update: false, delete: false },
        proposals: { create: false, read: true, update: false, delete: false },
        workOrders: { create: false, read: false, update: false, delete: false },
        invoices: { create: false, read: true, update: false, delete: false },
        customers: { create: false, read: true, update: false, delete: false },
        reports: { read: true },
        settings: { read: false, update: false },
      };

    case "customer":
      // Customer portal: Own data only
      return basePermissions;

    default:
      return basePermissions;
  }
}

/**
 * Get tier number based on role
 */
export function getTierFromRole(
  role: "owner" | "manager" | "operations" | "sales" | "crew_leader" | "crew_member" | "accountant" | "customer"
): 1 | 2 | 3 | 4 | undefined {
  switch (role) {
    case "owner":
    case "manager":
      return 1;
    case "operations":
    case "sales":
      return 2;
    case "crew_leader":
    case "crew_member":
      return 3;
    case "accountant":
      return 4;
    case "customer":
      return undefined; // Customers don't have a tier (free)
    default:
      return undefined;
  }
}
