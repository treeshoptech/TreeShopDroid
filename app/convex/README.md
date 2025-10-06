# Convex Backend

This directory contains the Convex serverless backend for TreeShopDroid.

## Structure

```
convex/
├── schema.ts                    # Database schema definitions
├── tsconfig.json               # TypeScript configuration
├── functions/
│   ├── auth.ts                 # Authentication helpers
│   ├── organizations.ts        # Organization CRUD
│   └── users.ts                # User management
└── README.md                   # This file
```

## Database Schema

### Tables

1. **organizations** - Companies using TreeShop
   - Multi-tenant isolation
   - Subscription management
   - License limits

2. **users** - Employees and customers
   - 4-tier permission system
   - Role-based access control
   - Clerk integration

3. **customers** - End clients of tree service companies
   - Contact information
   - Property details

4. **leads** - Sales pipeline
   - Status tracking
   - Assignment management

5. **proposals** - Price quotes
   - Service line items
   - PDF generation

6. **workOrders** - Job scheduling
   - Crew assignment
   - Photo uploads

7. **invoices** - Billing
   - Payment tracking
   - Stripe integration

8. **auditLogs** - Security & compliance
   - Immutable audit trail
   - Change tracking

## User Tiers

- **Tier 1 (Management)**: $49/user - Full access
- **Tier 2 (Operations)**: $35/user - No settings
- **Tier 3 (Field)**: $25/user - Assigned work only
- **Tier 4 (Accountant)**: $15/user - Financial reports only
- **Customer Portal**: Free - Own data only

## Security

- Row-level security enforced in all queries
- Organization isolation
- Permission-based access control
- Audit logging for compliance

## Setup

1. Install Convex:
   ```bash
   npm install convex
   ```

2. Initialize Convex:
   ```bash
   npx convex dev
   ```

3. Deploy schema:
   ```bash
   npx convex deploy
   ```

## Next Steps

- [ ] Run `npx convex dev` to initialize project
- [ ] Create Convex account and link project
- [ ] Add CRUD functions for leads, proposals, work orders, invoices
- [ ] Integrate with Clerk for authentication
- [ ] Set up Stripe webhooks
