/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as functions_auth from "../functions/auth.js";
import type * as functions_customers from "../functions/customers.js";
import type * as functions_invoices from "../functions/invoices.js";
import type * as functions_leads from "../functions/leads.js";
import type * as functions_onboarding from "../functions/onboarding.js";
import type * as functions_organizations from "../functions/organizations.js";
import type * as functions_proposals from "../functions/proposals.js";
import type * as functions_users from "../functions/users.js";
import type * as functions_workOrders from "../functions/workOrders.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "functions/auth": typeof functions_auth;
  "functions/customers": typeof functions_customers;
  "functions/invoices": typeof functions_invoices;
  "functions/leads": typeof functions_leads;
  "functions/onboarding": typeof functions_onboarding;
  "functions/organizations": typeof functions_organizations;
  "functions/proposals": typeof functions_proposals;
  "functions/users": typeof functions_users;
  "functions/workOrders": typeof functions_workOrders;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
