# Deployment Guide - Correct Setup

## ⚠️ Important: Vercel vs Railway

### ❌ Don't Deploy Backend to Vercel
**Vercel is NOT suitable for NestJS backend** because:
- Vercel is optimized for Next.js **frontends** and serverless functions
- NestJS needs a **long-running Node.js server**
- Vercel has strict timeout limits (10-60 seconds)
- Background jobs and cron jobs won't work on Vercel
- WebSocket connections not properly supported

### ✅ Correct Architecture

```
Frontend (Next.js)  →  Vercel (Perfect match!)
Backend (NestJS)    →  Railway/Render (Node.js servers)
Database            →  Neon (Serverless PostgreSQL)
Cache               →  Upstash (Serverless Redis)
```

---

## 🚀 Step-by-Step Deployment (Free)

### Step 1: Deploy Backend to Railway (5 minutes)

**Why Railway?**
- ✅ Perfect for NestJS/Node.js backends
- ✅ $5 free credit per month (enough for testing)
- ✅ Built-in PostgreSQL and Redis
- ✅ Automatic HTTPS
- ✅ Easy environment variables
- ✅ Supports long-running processes

**Steps:**

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Create New Project** → "Deploy from GitHub repo"
4. **Select your `oley-value` repository**
5. **Add PostgreSQL Database:**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway auto-generates `DATABASE_URL`
6. **Add Redis:**
   - Click "New" → "Database" → "Add Redis"
   - Railway auto-generates `REDIS_URL`
7. **Configure the API service:**
   - Click on your service
   - Go to "Settings"
   - Set **Root Directory**: `apps/api`
   - Set **Build Command**: `pnpm install && pnpm prisma:generate && pnpm build`
   - Set **Start Command**: `pnpm start:prod`
8. **Add Environment Variables:**
   - Click "Variables" tab
   - Add all variables from your `.env` file:
   ```env
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://your-vercel-app.vercel.app
   RENTCAST_API_KEY=your-rentcast-key
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PRO_PLAN_PRICE_ID=price_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email
   SMTP_PASS=your-password
   NODE_ENV=production
   ```
   - ⚠️ **Don't add DATABASE_URL or REDIS_URL** - Railway provides these automatically!
9. **Deploy!**
   - Railway will automatically deploy
   - You'll get a URL like: `https://your-app.up.railway.app`

**Important:** After deployment, run migrations:
- Open Railway terminal (click "..." → "Terminal")
- Run: `pnpm prisma:migrate deploy`

### Step 2: Deploy Frontend to Vercel (2 minutes)

**Why Vercel?**
- ✅ Perfect for Next.js applications
- ✅ Unlimited deployments (free)
- ✅ Automatic HTTPS and CDN
- ✅ Lightning fast

**Steps:**

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up with GitHub**
3. **Click "Add New Project"**
4. **Import your `oley-value` repository**
5. **Configure Build Settings:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `apps/web`
   - Build Command: Leave default or use `cd ../.. && pnpm install && cd apps/web && pnpm build`
   - Output Directory: `.next`
6. **Add Environment Variables:**
   ```env
   NEXT_PUBLIC_API_URL=https://your-railway-api.up.railway.app/api/v1
   NEXTAUTH_URL=https://your-vercel-app.vercel.app
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXT_PUBLIC_GEOAPIFY_API_KEY=your-geoapify-key
   ```
7. **Deploy!**
   - Vercel will build and deploy
   - You'll get a URL like: `https://your-app.vercel.app`

### Step 3: Update CORS (Important!)

After deployment, update your Railway backend:
1. Go to Railway → Your API service → Variables
2. Update `FRONTEND_URL` to your Vercel URL:
   ```env
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Redeploy the service

---

## 🎯 Alternative: Render.com (Also Free)

If you prefer an alternative to Railway:

**Render.com Benefits:**
- ✅ 750 hours/month free
- ✅ Free PostgreSQL database
- ✅ Free Redis instance
- ✅ Good for production

**Steps:**
1. Sign up at [Render.com](https://render.com)
2. Create "Web Service" from GitHub
3. Select `apps/api` as root directory
4. Add PostgreSQL database
5. Add Redis instance
6. Configure environment variables
7. Deploy!

---

## 📋 Cost Breakdown (Free Tier)

| Service | What | Free Tier | Monthly Cost |
|---------|------|-----------|--------------|
| **Railway** | Backend + DB + Redis | $5 credit | **$0** |
| **Vercel** | Frontend | Unlimited | **$0** |
| | | **TOTAL** | **$0** |

**Railway Free Credit Details:**
- $5/month = ~500 hours
- Enough for: Small API + PostgreSQL + Redis
- Perfect for testing and MVP

**When you need to upgrade:**
- Railway: $20/month for more resources
- Vercel: Free tier is usually enough forever
- Neon: $19/month for more storage
- Upstash: $10/month for more Redis

---

## 🔧 Environment Variables Checklist

### Backend (Railway)
```bash
# Auto-provided by Railway (don't set manually)
DATABASE_URL=postgresql://... (auto-generated)
REDIS_URL=redis://... (auto-generated)

# You must set these:
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-app.vercel.app
RENTCAST_API_KEY=your-rentcast-api-key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRO_PLAN_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@valupro.com
NODE_ENV=production
PORT=3001
```

### Frontend (Vercel)
```bash
NEXT_PUBLIC_API_URL=https://your-railway-app.up.railway.app/api/v1
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=different-secret-than-jwt
NEXT_PUBLIC_GEOAPIFY_API_KEY=your-geoapify-key
```

---

## 🧪 Testing Your Deployment

After deployment:

1. **Test Backend:**
   ```bash
   curl https://your-railway-app.up.railway.app/api/v1
   ```
   Should return API info

2. **Test Frontend:**
   - Visit: `https://your-app.vercel.app`
   - Try to sign up
   - Create a valuation

3. **Check Logs:**
   - Railway: Click on service → "Logs" tab
   - Vercel: Project → "Deployments" → Click deployment → "Logs"

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Errors
**Problem:** Frontend can't connect to backend
**Solution:** Make sure `FRONTEND_URL` in Railway matches your Vercel URL exactly

### Issue 2: Database Connection Failed
**Problem:** Backend can't connect to database
**Solution:**
- Check if Railway PostgreSQL is running
- Make sure `DATABASE_URL` is automatically set by Railway
- Run migrations: `pnpm prisma:migrate deploy` in Railway terminal

### Issue 3: 500 Internal Server Error
**Problem:** Backend crashes on startup
**Solution:**
- Check Railway logs
- Make sure all environment variables are set
- Run `pnpm prisma:generate` in Railway terminal

### Issue 4: Prisma Client Not Generated
**Problem:** "Cannot find module '@prisma/client'"
**Solution:** Update build command in Railway:
```bash
pnpm install && pnpm prisma:generate && pnpm build
```

### Issue 5: Stripe Webhook Not Working
**Problem:** Payments process but subscription doesn't update
**Solution:**
- Go to Stripe Dashboard → Webhooks
- Add endpoint: `https://your-railway-app.up.railway.app/api/v1/billing/webhook`
- Select events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`
- Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

---

## 📊 Monitoring Your App

### Railway Dashboard
- **Metrics:** CPU, Memory, Network usage
- **Logs:** Real-time application logs
- **Deployments:** History and rollback

### Vercel Dashboard
- **Analytics:** Page views, performance
- **Logs:** Build and runtime logs
- **Deployments:** Instant rollbacks

---

## 🚀 Production Checklist

Before going live:

- [ ] Update all secrets (JWT_SECRET, NEXTAUTH_SECRET)
- [ ] Switch Stripe to production mode
- [ ] Configure Stripe webhooks
- [ ] Set up custom domain on Vercel
- [ ] Enable SSL (automatic on both platforms)
- [ ] Set up error monitoring (Sentry)
- [ ] Configure database backups
- [ ] Test all payment flows
- [ ] Test email deliverability
- [ ] Load test your API
- [ ] Set up uptime monitoring

---

## 💡 Tips for Free Tier

**To stay within Railway's $5 credit:**
1. Use sleep mode for dev environments
2. Optimize queries (reduce database load)
3. Use Redis caching effectively
4. Deploy only when needed (not on every commit)

**To stay within Vercel's free tier:**
1. You'll almost never hit limits!
2. 100GB bandwidth/month is generous
3. Unlimited deployments

---

## 🎓 Summary

**Correct Architecture:**
```
User → Vercel (Frontend) → Railway (Backend) → Neon (Database)
                                             ↓
                                      Upstash (Redis)
```

**Why This Works:**
- Each service is hosted on a platform optimized for it
- Frontend gets CDN + fast static hosting
- Backend gets long-running server + cron jobs
- Database gets reliable PostgreSQL
- Redis gets fast in-memory caching

**Total Cost:** $0/month for testing! 🎉

---

Need help? Check Railway logs first, then Vercel logs. Both platforms have excellent debugging tools!
