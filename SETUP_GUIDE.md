# TreeShopDroid Setup Guide

Complete setup instructions for backend integration.

---

## Phase 1: Convex Backend Setup

### 1. Create Convex Account

1. Go to [convex.dev](https://convex.dev)
2. Sign up with GitHub (recommended) or email
3. Verify your email

### 2. Initialize Convex Project

Since `npx convex dev` requires interactive input, follow these steps:

1. **Visit Convex Dashboard**: https://dashboard.convex.dev
2. **Create New Project**: Click "New Project"
3. **Project Name**: `treeshop-droid`
4. **Copy Deployment URL**: You'll get a URL like `https://your-project.convex.cloud`

### 3. Configure Environment Variables

1. Create `.env.local` in `/app` directory:
   ```bash
   cp .env.local.example .env.local
   ```

2. Add your Convex URL:
   ```
   VITE_CONVEX_URL=https://your-project.convex.cloud
   ```

### 4. Deploy Convex Functions

```bash
cd app
npx convex deploy --prod
```

This will push the schema and functions to Convex.

---

## Phase 2: Clerk Authentication Setup

### 1. Create Clerk Account

1. Go to [clerk.com](https://clerk.com)
2. Sign up for free account
3. Create a new application

### 2. Configure Clerk Application

1. **Application Name**: TreeShopDroid
2. **Enable Sign-in Methods**:
   - ✅ Email
   - ✅ Google OAuth (optional)
   - ✅ Password

3. **Enable Organizations** (IMPORTANT):
   - Go to "Organizations" in sidebar
   - Enable "Organizations feature"
   - This provides multi-tenant support

### 3. Get Clerk API Keys

1. Go to "API Keys" in Clerk Dashboard
2. Copy **Publishable Key** (starts with `pk_test_...`)
3. Copy **Secret Key** (starts with `sk_test_...`)

### 4. Add to Environment Variables

Update `.env.local`:
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 5. Configure Clerk + Convex Integration

In Clerk Dashboard:
1. Go to "JWT Templates"
2. Create new template: "Convex"
3. Add this to the template:
   ```json
   {
     "aud": "convex",
     "exp": "{{token.exp}}",
     "iat": "{{token.iat}}",
     "iss": "{{token.iss}}",
     "sub": "{{user.id}}"
   }
   ```
4. Copy the **Issuer URL** (looks like `https://your-app.clerk.accounts.dev`)

In Convex Dashboard:
1. Go to Settings → Authentication
2. Click "Add Auth Provider"
3. Select "Clerk"
4. Paste the Issuer URL
5. Save

---

## Phase 3: Stripe Setup (Optional for MVP)

### 1. Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Sign up for account
3. Activate test mode

### 2. Get Stripe Keys

1. Go to Developers → API Keys
2. Copy **Publishable Key** (`pk_test_...`)
3. Copy **Secret Key** (`sk_test_...`)

### 3. Add to Environment Variables

Update `.env.local`:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### 4. Set Up Products & Prices

Create these products in Stripe Dashboard:

1. **Base Plan**: $99/month
2. **Management User**: $49/user/month
3. **Operations User**: $35/user/month
4. **Field User**: $25/user/month
5. **Accountant User**: $15/user/month

---

## Phase 4: Install Frontend Dependencies

```bash
cd app
npm install @clerk/clerk-react convex-helpers
```

---

## Phase 5: Verification

### Check Convex
```bash
npx convex dashboard
```
Should show your deployed functions.

### Check Clerk
Visit: https://your-app.clerk.accounts.dev
Should show login screen.

### Run App
```bash
npm run dev
```
Visit: http://localhost:3006

---

## Troubleshooting

### Convex deployment fails
- Make sure you're logged in: `npx convex login`
- Check project URL is correct in `.env.local`

### Clerk not working
- Verify publishable key starts with `pk_test_`
- Check Organizations feature is enabled
- Verify JWT template is configured

### Environment variables not loading
- Restart dev server after changing `.env.local`
- Make sure file is named exactly `.env.local` (not `.env`)

---

## Security Checklist

- [ ] `.env.local` is in `.gitignore` (already done)
- [ ] Never commit API keys to GitHub
- [ ] Use test keys for development
- [ ] Rotate production keys regularly
- [ ] Enable Clerk MFA for production
- [ ] Set up Stripe webhook signature verification

---

## Next Steps

After completing setup:
1. Test user registration flow
2. Test organization creation
3. Test CRUD operations
4. Connect frontend forms to Convex
5. Test row-level security

See [BUILD_PLAN.md](./BUILD_PLAN.md) for full roadmap.
