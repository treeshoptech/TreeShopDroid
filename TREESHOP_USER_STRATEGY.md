# TreeShopDroid - Enterprise User Authentication & Licensing Strategy

## Executive Summary
TreeShopDroid is a B2B SaaS platform for tree service companies. Revenue model: **Per-User Monthly Subscription** with role-based access control (RBAC). Built on Convex.dev backend with enterprise-grade security.

---

## 1. USER HIERARCHY & ROLES

### **Company Structure**
```
Company (Organization)
├── Owner/Admin Users (Unlimited - included in base plan)
├── Licensed Users (Billable - by role tier)
│   ├── Tier 1: Management Users
│   ├── Tier 2: Operations Users
│   ├── Tier 3: Field Users
│   └── Tier 4: Read-Only Users
└── Customer Portal Users (Free - unlimited)
```

### **Role Definitions & Permissions**

#### **TIER 1: MANAGEMENT** ($49/user/month)
**Roles:** Owner, General Manager, Operations Manager

**Full Access To:**
- ✓ Dashboard (all metrics)
- ✓ Leads (create, edit, delete, assign)
- ✓ Proposals (create, edit, delete, send)
- ✓ Work Orders (create, edit, delete, assign crews)
- ✓ Invoices (create, edit, delete, payments)
- ✓ Customers (full CRUD)
- ✓ Calendar (full scheduling)
- ✓ Map View (all locations)
- ✓ Reports & Analytics (full access)
- ✓ Settings (company-wide configuration)
- ✓ User Management (add/remove users, assign roles)
- ✓ Billing & Subscription Management

**Restrictions:**
- None

---

#### **TIER 2: OPERATIONS** ($35/user/month)
**Roles:** Office Manager, Dispatcher, Sales Representative

**Access To:**
- ✓ Dashboard (limited metrics - own assignments)
- ✓ Leads (create, edit own, view all)
- ✓ Proposals (create, edit own, view all)
- ✓ Work Orders (create, edit, assign crews)
- ✓ Invoices (create, edit, view all)
- ✓ Customers (full CRUD)
- ✓ Calendar (full scheduling)
- ✓ Map View (all locations)
- ✓ Reports (view-only, no export)
- ✗ Settings (view-only)
- ✗ User Management
- ✗ Billing Management

**Restrictions:**
- Cannot delete records older than 30 days
- Cannot modify financial settings
- Cannot access user billing information
- Cannot export sensitive data

---

#### **TIER 3: FIELD** ($25/user/month)
**Roles:** Crew Leader, Crew Member, Equipment Operator

**Access To:**
- ✓ Dashboard (own jobs only)
- ✗ Leads (view assigned only)
- ✗ Proposals (view assigned only)
- ✓ Work Orders (edit assigned jobs, mark complete)
- ✗ Invoices (view-only for their jobs)
- ✓ Customers (view contact info for assigned jobs)
- ✓ Calendar (view own schedule only)
- ✓ Map View (assigned jobs only)
- ✗ Reports (no access)
- ✗ Settings (no access)

**Restrictions:**
- Cannot create leads/proposals
- Cannot delete any records
- Cannot view financial data
- Cannot access analytics
- Cannot view other crew assignments
- Mobile-optimized interface only

---

#### **TIER 4: READ-ONLY** ($15/user/month)
**Roles:** Accountant, Bookkeeper, Auditor, Investor

**Access To:**
- ✓ Dashboard (financial metrics only)
- ✓ Leads (view-only)
- ✓ Proposals (view-only)
- ✓ Work Orders (view-only)
- ✓ Invoices (full access - for accounting)
- ✓ Customers (view-only)
- ✗ Calendar (no access)
- ✗ Map View (no access)
- ✓ Reports (full access, can export)
- ✗ Settings (no access)

**Restrictions:**
- Cannot create/edit/delete anything except invoice payments
- Cannot assign work or schedule jobs
- Cannot communicate with customers
- Read-only audit trail access

---

#### **CUSTOMER PORTAL** (Free - Unlimited)
**Roles:** Customer, Property Owner

**Access To:**
- ✓ View their own jobs (Lead → Completed)
- ✓ View/download proposals
- ✓ Approve/reject proposals (digital signature)
- ✓ View work order status
- ✓ View/download invoices
- ✓ Make payments (Stripe integration)
- ✓ Upload photos/documents
- ✓ Message their assigned rep
- ✗ See other customers
- ✗ See internal data

**Restrictions:**
- Completely isolated from company operations
- Can only see their own data
- Cannot create new jobs (must contact company)

---

## 2. PRICING MODEL

### **Base Plan: $99/month**
**Includes:**
- 1 Company/Organization
- 2 Management Users (Tier 1)
- Unlimited Customer Portal Access
- 500 Active Customers
- 1,000 Jobs/Year
- Standard Support (Email, 48hr response)
- Data Retention: 2 years

### **Additional User Licenses:**
- **Tier 1 (Management):** $49/user/month
- **Tier 2 (Operations):** $35/user/month
- **Tier 3 (Field):** $25/user/month
- **Tier 4 (Read-Only):** $15/user/month

### **Volume Discounts:**
- 5-10 users: 10% off per-user pricing
- 11-25 users: 20% off per-user pricing
- 26+ users: 25% off per-user pricing (Enterprise)

### **Add-Ons:**
- **Premium Support:** $199/month (Phone, 4hr response, dedicated rep)
- **Extended Data Retention:** $49/month (7 years for compliance)
- **API Access:** $299/month (REST API for integrations)
- **White-Label Branding:** $499/month (custom domain, logo, colors)
- **Advanced Analytics:** $149/month (AI insights, forecasting)

### **Enterprise Plan: Custom Pricing**
- 50+ users
- Multi-location support
- Dedicated infrastructure
- Custom integrations
- On-premise deployment option
- SLA guarantees (99.9% uptime)
- Dedicated account manager

---

## 3. TECHNICAL ARCHITECTURE

### **Authentication Stack**
```typescript
// Convex + Clerk for enterprise-grade auth
Convex.dev (Backend)
  ├── Clerk (Auth Provider)
  │   ├── Social Login (Google, Microsoft)
  │   ├── Email/Password
  │   ├── MFA/2FA (SMS, Authenticator)
  │   ├── SSO/SAML (Enterprise)
  │   └── Session Management
  ├── Row-Level Security (RLS)
  ├── Audit Logging
  └── Real-time Subscriptions
```

### **Database Schema (Convex)**

```typescript
// organizations.ts
{
  _id: Id<"organizations">,
  name: string,
  plan: "base" | "growth" | "enterprise",
  billingEmail: string,
  stripeCustomerId: string,
  subscriptionStatus: "active" | "past_due" | "cancelled",
  maxUsers: number,
  currentUsers: number,
  features: {
    apiAccess: boolean,
    whiteLabel: boolean,
    advancedAnalytics: boolean,
    premiumSupport: boolean
  },
  createdAt: number,
  updatedAt: number
}

// users.ts
{
  _id: Id<"users">,
  organizationId: Id<"organizations">,
  clerkUserId: string, // From Clerk
  email: string,
  name: string,
  role: "owner" | "manager" | "operations" | "sales" | "crew_leader" | "crew_member" | "accountant" | "customer",
  tier: 1 | 2 | 3 | 4 | null, // null for customers
  permissions: {
    leads: { create: boolean, read: boolean, update: boolean, delete: boolean },
    proposals: { create: boolean, read: boolean, update: boolean, delete: boolean },
    workOrders: { create: boolean, read: boolean, update: boolean, delete: boolean },
    invoices: { create: boolean, read: boolean, update: boolean, delete: boolean },
    customers: { create: boolean, read: boolean, update: boolean, delete: boolean },
    reports: { read: boolean, export: boolean },
    settings: { read: boolean, update: boolean },
    users: { manage: boolean },
    billing: { manage: boolean }
  },
  assignedCrews?: string[], // For crew leaders
  isActive: boolean,
  lastLogin: number,
  createdAt: number,
  updatedAt: number
}

// audit_logs.ts
{
  _id: Id<"audit_logs">,
  organizationId: Id<"organizations">,
  userId: Id<"users">,
  action: string, // "create_lead", "update_invoice", "delete_customer"
  resource: string, // "leads", "invoices", "customers"
  resourceId: string,
  changes?: object, // What changed
  ipAddress: string,
  userAgent: string,
  timestamp: number
}

// subscriptions.ts
{
  _id: Id<"subscriptions">,
  organizationId: Id<"organizations">,
  stripeSubscriptionId: string,
  plan: "base" | "growth" | "enterprise",
  status: "active" | "past_due" | "cancelled" | "trialing",
  currentPeriodStart: number,
  currentPeriodEnd: number,
  cancelAtPeriodEnd: boolean,
  trialEnd?: number,
  userLicenses: {
    tier1: number,
    tier2: number,
    tier3: number,
    tier4: number
  },
  addOns: string[], // ["premium_support", "api_access"]
  mrr: number, // Monthly Recurring Revenue
  createdAt: number,
  updatedAt: number
}

// customers.ts (end customers, not users)
{
  _id: Id<"customers">,
  organizationId: Id<"organizations">,
  portalUserId?: Id<"users">, // If they have portal access
  name: string,
  email: string,
  phone: string,
  address: string,
  status: "lead" | "active" | "inactive",
  priority: "low" | "medium" | "high" | "critical",
  totalJobs: number,
  totalRevenue: number,
  assignedSalesRep?: Id<"users">,
  createdAt: number,
  updatedAt: number
}

// leads.ts, proposals.ts, workOrders.ts, invoices.ts
{
  _id: Id<"leads">,
  organizationId: Id<"organizations">,
  customerId: Id<"customers">,
  createdBy: Id<"users">,
  assignedTo?: Id<"users">,
  status: "new" | "contacted" | "qualified" | "converted" | "lost",
  // ... other fields

  // Security: Row-Level Security
  _permissions: {
    readBy: Id<"users">[], // Who can read this
    updateBy: Id<"users">[], // Who can update
    deleteBy: Id<"users">[]  // Who can delete
  }
}
```

### **Row-Level Security (RLS) Implementation**

```typescript
// convex/functions/leads.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query with RLS
export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Get current user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    // Apply RLS based on role/tier
    let leads;

    if (user.tier === 1 || user.role === "owner") {
      // Management: See all leads in organization
      leads = await ctx.db
        .query("leads")
        .withIndex("by_organization", (q) => q.eq("organizationId", user.organizationId))
        .collect();
    } else if (user.tier === 2) {
      // Operations: See all leads, but can only edit own
      leads = await ctx.db
        .query("leads")
        .withIndex("by_organization", (q) => q.eq("organizationId", user.organizationId))
        .collect();
    } else if (user.tier === 3) {
      // Field: Only see assigned leads
      leads = await ctx.db
        .query("leads")
        .withIndex("by_assigned", (q) => q.eq("assignedTo", user._id))
        .collect();
    } else {
      // Read-only or no access
      if (user.permissions.leads.read) {
        leads = await ctx.db
          .query("leads")
          .withIndex("by_organization", (q) => q.eq("organizationId", user.organizationId))
          .collect();
      } else {
        throw new Error("Insufficient permissions");
      }
    }

    return leads;
  },
});

// Mutation with permission check
export const update = mutation({
  args: {
    id: v.id("leads"),
    data: v.object({
      status: v.optional(v.string()),
      notes: v.optional(v.string()),
      // ... other fields
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user || !user.permissions.leads.update) {
      throw new Error("Insufficient permissions");
    }

    const lead = await ctx.db.get(args.id);
    if (!lead) throw new Error("Lead not found");

    // Verify same organization
    if (lead.organizationId !== user.organizationId) {
      throw new Error("Access denied");
    }

    // Tier 2 users can only edit their own leads
    if (user.tier === 2 && lead.createdBy !== user._id) {
      throw new Error("Can only edit your own leads");
    }

    // Log the change
    await ctx.db.insert("audit_logs", {
      organizationId: user.organizationId,
      userId: user._id,
      action: "update_lead",
      resource: "leads",
      resourceId: args.id,
      changes: args.data,
      ipAddress: identity.ipAddress || "unknown",
      userAgent: identity.userAgent || "unknown",
      timestamp: Date.now(),
    });

    // Update the lead
    await ctx.db.patch(args.id, args.data);

    return { success: true };
  },
});
```

---

## 4. SECURITY FEATURES

### **Enterprise-Grade Security**

✅ **Authentication**
- Clerk.dev integration (SOC 2 Type II certified)
- Multi-factor authentication (MFA) required for Management tier
- SSO/SAML for enterprise customers
- Session management with configurable timeout
- IP whitelisting for sensitive operations

✅ **Authorization**
- Role-based access control (RBAC)
- Attribute-based access control (ABAC) for complex rules
- Row-level security on all database queries
- Field-level permissions (e.g., hide salary data from non-managers)

✅ **Data Protection**
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Automatic data backup (daily, 30-day retention)
- GDPR compliance (data export, right to be forgotten)
- HIPAA compliance option (for medical tree services)

✅ **Audit & Compliance**
- Complete audit trail of all actions
- Immutable audit logs (append-only)
- Real-time anomaly detection
- Compliance reports (SOC 2, ISO 27001)
- Data retention policies

✅ **Rate Limiting & DDoS**
- API rate limiting per user/organization
- Progressive throttling for suspicious activity
- Cloudflare CDN + DDoS protection
- Request size limits

✅ **Payment Security**
- Stripe for payment processing (PCI DSS compliant)
- Never store credit card data
- Webhook signature verification
- Fraud detection

---

## 5. BILLING IMPLEMENTATION

### **Stripe + Convex Integration**

```typescript
// convex/billing/subscriptions.ts
import { mutation } from "../_generated/server";
import { v } from "convex/values";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createSubscription = mutation({
  args: {
    organizationId: v.id("organizations"),
    plan: v.string(),
    userLicenses: v.object({
      tier1: v.number(),
      tier2: v.number(),
      tier3: v.number(),
      tier4: v.number(),
    }),
    addOns: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Get organization
    const org = await ctx.db.get(args.organizationId);
    if (!org) throw new Error("Organization not found");

    // Calculate pricing
    const basePrice = args.plan === "base" ? 9900 : args.plan === "growth" ? 29900 : 0;
    const tier1Price = args.userLicenses.tier1 * 4900;
    const tier2Price = args.userLicenses.tier2 * 3500;
    const tier3Price = args.userLicenses.tier3 * 2500;
    const tier4Price = args.userLicenses.tier4 * 1500;

    const totalUsers = Object.values(args.userLicenses).reduce((a, b) => a + b, 0);
    let discount = 0;
    if (totalUsers >= 26) discount = 0.25;
    else if (totalUsers >= 11) discount = 0.20;
    else if (totalUsers >= 5) discount = 0.10;

    const subtotal = tier1Price + tier2Price + tier3Price + tier4Price;
    const discountAmount = Math.floor(subtotal * discount);
    const total = basePrice + subtotal - discountAmount;

    // Create Stripe subscription
    const subscription = await stripe.subscriptions.create({
      customer: org.stripeCustomerId,
      items: [
        { price: process.env[`STRIPE_PRICE_${args.plan.toUpperCase()}`], quantity: 1 },
        { price: process.env.STRIPE_PRICE_TIER1, quantity: args.userLicenses.tier1 },
        { price: process.env.STRIPE_PRICE_TIER2, quantity: args.userLicenses.tier2 },
        { price: process.env.STRIPE_PRICE_TIER3, quantity: args.userLicenses.tier3 },
        { price: process.env.STRIPE_PRICE_TIER4, quantity: args.userLicenses.tier4 },
      ],
      trial_period_days: 14,
      metadata: {
        organizationId: args.organizationId,
      },
    });

    // Store in Convex
    await ctx.db.insert("subscriptions", {
      organizationId: args.organizationId,
      stripeSubscriptionId: subscription.id,
      plan: args.plan as any,
      status: subscription.status as any,
      currentPeriodStart: subscription.current_period_start * 1000,
      currentPeriodEnd: subscription.current_period_end * 1000,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEnd: subscription.trial_end ? subscription.trial_end * 1000 : undefined,
      userLicenses: args.userLicenses,
      addOns: args.addOns || [],
      mrr: total / 100,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { subscriptionId: subscription.id };
  },
});

// Webhook handler for Stripe events
export const handleStripeWebhook = mutation({
  args: {
    event: v.any(),
  },
  handler: async (ctx, args) => {
    const event = args.event;

    switch (event.type) {
      case "customer.subscription.updated":
        // Update subscription status
        const subscription = event.data.object;
        await ctx.db
          .query("subscriptions")
          .withIndex("by_stripe_id", (q) =>
            q.eq("stripeSubscriptionId", subscription.id)
          )
          .first()
          .then((sub) => {
            if (sub) {
              ctx.db.patch(sub._id, {
                status: subscription.status,
                currentPeriodStart: subscription.current_period_start * 1000,
                currentPeriodEnd: subscription.current_period_end * 1000,
                updatedAt: Date.now(),
              });
            }
          });
        break;

      case "customer.subscription.deleted":
        // Mark subscription as cancelled
        const deletedSub = event.data.object;
        await ctx.db
          .query("subscriptions")
          .withIndex("by_stripe_id", (q) =>
            q.eq("stripeSubscriptionId", deletedSub.id)
          )
          .first()
          .then((sub) => {
            if (sub) {
              ctx.db.patch(sub._id, {
                status: "cancelled",
                updatedAt: Date.now(),
              });
            }
          });
        break;

      case "invoice.payment_failed":
        // Send notification, update status
        const failedInvoice = event.data.object;
        // TODO: Send email to billing admin
        break;
    }
  },
});
```

---

## 6. USER ONBOARDING FLOW

### **Self-Service Signup**

1. **Landing Page** → "Start Free Trial"
2. **Company Setup**
   - Company name
   - Industry (Tree Service, Landscaping, etc.)
   - Company size (1-5, 6-10, 11-25, 26-50, 51+)
   - Primary contact info
3. **Owner Account Creation**
   - Email (becomes Clerk user)
   - Password (or Google/Microsoft SSO)
   - Phone for MFA
4. **Stripe Payment Method**
   - Credit card (not charged during trial)
   - Billing address
5. **Invite Team Members**
   - Add emails + assign roles
   - System sends invite links
6. **14-Day Free Trial Starts**
   - Full access to all features
   - Sample data loaded for demo
   - Onboarding checklist

### **Invite Flow (Team Members)**

1. **Receive Email Invitation**
   - "John Doe invited you to join TreeShop Co."
   - Role clearly stated
2. **Click Accept**
   - Create Clerk account
   - Set password + MFA
3. **Redirected to Dashboard**
   - Role-appropriate view
   - Tutorial walkthrough

---

## 7. USAGE ENFORCEMENT

### **License Management**

```typescript
// Before allowing user creation
export const inviteUser = mutation({
  args: {
    email: v.string(),
    role: v.string(),
    tier: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const inviter = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!inviter || !inviter.permissions.users.manage) {
      throw new Error("Insufficient permissions");
    }

    // Get subscription
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", inviter.organizationId)
      )
      .first();

    if (!subscription || subscription.status !== "active") {
      throw new Error("No active subscription");
    }

    // Check license availability
    const currentUsers = await ctx.db
      .query("users")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", inviter.organizationId)
      )
      .collect();

    const tierKey = `tier${args.tier}` as keyof typeof subscription.userLicenses;
    const currentTierUsers = currentUsers.filter(u => u.tier === args.tier).length;
    const licensedTierUsers = subscription.userLicenses[tierKey];

    if (currentTierUsers >= licensedTierUsers) {
      throw new Error(
        `License limit reached for Tier ${args.tier}. ` +
        `Current: ${currentTierUsers}, Licensed: ${licensedTierUsers}. ` +
        `Please upgrade your plan.`
      );
    }

    // Create invitation
    const invitation = await ctx.db.insert("invitations", {
      organizationId: inviter.organizationId,
      email: args.email,
      role: args.role,
      tier: args.tier,
      invitedBy: inviter._id,
      status: "pending",
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: Date.now(),
    });

    // TODO: Send email via Resend.com or similar

    return { invitationId: invitation };
  },
});
```

---

## 8. COMPETITIVE ADVANTAGES

### **Why Companies Choose TreeShopDroid:**

1. **Pay Only for Active Users**
   - Competitors charge per "seat" whether used or not
   - We charge only for active users (logged in last 30 days)

2. **No Data Hostage**
   - Free data export anytime (CSV, JSON, PDF)
   - Competitors lock data behind paywalls

3. **Transparent Pricing**
   - No hidden fees
   - No setup costs
   - Cancel anytime

4. **Modern Tech Stack**
   - Real-time updates (Convex)
   - Offline-first PWA
   - Mobile + Desktop
   - API-first architecture

5. **Industry-Specific**
   - Built FOR tree services BY tree service operators
   - Not generic CRM adapted for trees

6. **Customer Portal Included**
   - Most competitors charge extra for customer portals
   - Ours is free and unlimited

---

## 9. GO-TO-MARKET STRATEGY

### **Target Segments:**

1. **Small Tree Services (1-5 employees)**
   - Pain: Using pen/paper or spreadsheets
   - Offer: Base plan @ $99/month

2. **Growing Operations (6-25 employees)**
   - Pain: Outgrown basic tools, need coordination
   - Offer: Growth plan with volume discount

3. **Enterprise Tree Services (26+ employees)**
   - Pain: Using expensive, complex enterprise software
   - Offer: Custom enterprise plan with migrations

### **Sales Channels:**

- **Self-Service:** Website signup (70% of revenue)
- **Direct Sales:** For 10+ user organizations
- **Partnerships:** Integrate with equipment dealers, ISA
- **Referral Program:** $500 credit per referral

---

## 10. NEXT STEPS

### **Implementation Checklist:**

- [ ] Set up Convex.dev project
- [ ] Integrate Clerk authentication
- [ ] Build user/org/subscription schemas
- [ ] Implement RLS for all tables
- [ ] Create Stripe product catalog
- [ ] Build billing dashboard
- [ ] Add user management UI
- [ ] Implement invite flow
- [ ] Set up audit logging
- [ ] Build customer portal
- [ ] Load testing (1000+ concurrent users)
- [ ] Security audit
- [ ] Beta launch with 10 companies

---

**APPROVED FOR IMPLEMENTATION?**

This strategy provides:
- ✅ Professional multi-tenant architecture
- ✅ Enterprise-grade security
- ✅ Clear billing model
- ✅ Scalable infrastructure
- ✅ Competitive differentiation
- ✅ Path to profitability

Let me know what to adjust or if we're good to start building! 🚀
