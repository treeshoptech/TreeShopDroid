# TreeShopDroid 🌲

**Enterprise SaaS Platform for Tree Service Companies**

A modern, real-time business management system built with React, Convex, Clerk, and Stripe. Manage leads, proposals, work orders, invoices, and more with a beautiful tactical operator UI.

---

## 🚀 Current Status

**✅ COMPLETE:** Full React frontend with all core features
- 19 custom Tactical UI components
- 4 workflow forms (Lead, Proposal, Work Order, Invoice)
- 7 management pages (Dashboard, Map, Calendar, Customers, Reports, Settings, Help)
- Tactical navigation menu
- Mobile-responsive design

**🔨 IN PROGRESS:** Backend integration
- Convex.dev setup
- Clerk authentication
- Stripe billing

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **CSS Modules** - Styling
- **Tactical Operator Theme** - Custom design system

### Backend (Coming Soon)
- **Convex.dev** - Real-time serverless database
- **Clerk** - Authentication & user management
- **Stripe** - Payment processing
- **TypeScript** - Type safety

---

## 🚦 Quick Start

```bash
cd app
npm install
npm run dev
```

App runs on: **http://localhost:3006**

---

## 🔐 GitHub Setup

To push code to the repository, you need to authenticate:

### Option 1: Personal Access Token

1. Go to GitHub Settings → Developer Settings → Personal Access Tokens
2. Generate token with `repo` scope
3. Configure git:
```bash
git remote set-url origin https://<TOKEN>@github.com/treeshoptech/TreeShopDroid.git
git push origin main
```

### Option 2: SSH Key

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub
# Add to GitHub Settings → SSH Keys
git remote set-url origin git@github.com:treeshoptech/TreeShopDroid.git
git push origin main
```

---

## 📖 Documentation

- **[BUILD_PLAN.md](./BUILD_PLAN.md)** - 10-phase implementation plan
- **[TREESHOP_USER_STRATEGY.md](./TREESHOP_USER_STRATEGY.md)** - Auth & billing strategy

---

**Generated with [Claude Code](https://claude.com/claude-code)**

Co-Authored-By: Claude <noreply@anthropic.com>
