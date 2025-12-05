# Quick Start Guide - 5 Minutes to Running App

## Fastest Way to Preview Locally

### Step 1: Install Dependencies (1 min)
```bash
pnpm install
```

### Step 2: Set Up Free Database (2 min)

1. **Go to [Neon.tech](https://neon.tech)** (Free PostgreSQL)
   - Sign up with GitHub
   - Click "Create Project"
   - Copy the connection string

2. **Go to [Upstash.com](https://upstash.com)** (Free Redis)
   - Sign up with GitHub
   - Create Redis database
   - Copy the Redis URL

### Step 3: Create Environment Files (1 min)

**Create `apps/api/.env`:**
```env
DATABASE_URL="paste-neon-connection-string-here"
REDIS_URL="paste-upstash-redis-url-here"
JWT_SECRET="my-super-secret-jwt-key-123"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:3000"
RENTCAST_API_KEY="test-key-get-real-one-later"
PORT=3001
NODE_ENV="development"
```

**Create `apps/web/.env.local`:**
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="my-nextauth-secret-456"
```

### Step 4: Initialize Database (1 min)
```bash
cd apps/api
pnpm prisma:generate
pnpm prisma:migrate
cd ../..
```

### Step 5: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd apps/api && pnpm dev
```

**Terminal 2 - Frontend:**
```bash
cd apps/web && pnpm dev
```

### Step 6: Open Browser
Go to http://localhost:3000 and sign up!

---

## Deploy to Free Hosting (10 Minutes)

### Option 1: Vercel (Easiest)

1. **Push code to GitHub** (if not already)
2. **Go to [Vercel.com](https://vercel.com)**
3. **Click "Add New Project"**
4. **Import your repository**
5. **Configure:**
   - Root Directory: `apps/web`
   - Framework: Next.js
   - Add environment variables from `apps/web/.env.local`
6. **Deploy!**

Your frontend will be live at: `https://your-app.vercel.app`

### Option 2: Railway (Backend + DB)

1. **Go to [Railway.app](https://railway.app)**
2. **Click "New Project"**
3. **Choose "Deploy from GitHub repo"**
4. **Add PostgreSQL** (click "New" → "Database" → "PostgreSQL")
5. **Add Redis** (click "New" → "Database" → "Redis")
6. **Set Root Directory**: `apps/api`
7. **Add all environment variables**
8. **Deploy!**

---

## Free Hosting Summary

| Service | What | Free Tier | Best For |
|---------|------|-----------|----------|
| **Vercel** | Frontend | Unlimited | Production-ready |
| **Railway** | Backend + DB | $5/month credit | Full stack |
| **Neon** | PostgreSQL | 0.5 GB storage | Database |
| **Upstash** | Redis | 10K commands/day | Caching |
| **Render** | Alternative all-in-one | 750 hrs/month | Testing |

---

## Recommended Setup for Testing

### For Local Testing:
- Neon (database)
- Upstash (Redis)
- Run locally on http://localhost:3000

### For Demo/Sharing:
- Vercel (frontend) - Gets you a public URL instantly
- Railway (backend + database)
- Upstash (Redis)

**Total Cost: $0** ✨

---

## Get Real API Keys Later

When ready to test real features:

1. **Rentcast** - https://developers.rentcast.io (50 free requests/month)
2. **Stripe** - https://stripe.com (Free test mode forever)
3. **Geoapify** - https://www.geoapify.com (3K free requests/day)

---

## What Can You Test Without API Keys?

✅ **Works without keys:**
- User signup/login
- Dashboard UI
- Create mock valuations
- Lead management
- Widget configuration UI
- All page navigation

❌ **Needs API keys:**
- Real property valuations (needs Rentcast)
- Payment processing (needs Stripe)
- Address autocomplete (needs Geoapify)
- Email sending (needs SMTP)

---

## Need Help?

Common issues:
- **Port in use**: Change PORT in .env
- **Database error**: Check DATABASE_URL format
- **Module not found**: Run `pnpm install` again
- **Prisma error**: Run `pnpm prisma:generate`

Check SETUP.md for detailed troubleshooting!
