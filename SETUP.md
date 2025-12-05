# ValuPro - Setup Guide

## Prerequisites

- Node.js 18+ and pnpm installed
- Git installed
- Free accounts on:
  - [Neon](https://neon.tech) - PostgreSQL database (Free tier)
  - [Railway](https://railway.app) - API hosting (Free $5 credit/month)
  - [Vercel](https://vercel.com) - Frontend hosting (Free unlimited)
  - [Upstash](https://upstash.com) - Redis cache (Free 10K commands/day)
  - [Rentcast](https://developers.rentcast.io) - Property data API
  - [Stripe](https://stripe.com) - Payment processing (Free test mode)

## Local Development Setup

### 1. Install Dependencies

```bash
# Install all dependencies
pnpm install
```

### 2. Environment Configuration

#### Backend API (.env file location: `apps/api/.env`)

Create `apps/api/.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"

# Rentcast API
RENTCAST_API_KEY="your-rentcast-api-key"

# Redis Cache
REDIS_URL="redis://localhost:6379"
# OR for Upstash:
# REDIS_URL="rediss://default:your-password@your-redis.upstash.io:6379"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PRO_PLAN_PRICE_ID="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# SMTP (Optional - for default email sending)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@valupro.com"

# Server
PORT=3001
NODE_ENV="development"
```

#### Frontend Web (.env file location: `apps/web/.env.local`)

Create `apps/web/.env.local`:

```env
# API URL
NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-change-this"

# Geoapify (for address autocomplete)
NEXT_PUBLIC_GEOAPIFY_API_KEY="your-geoapify-api-key"
```

### 3. Database Setup

```bash
# Navigate to API directory
cd apps/api

# Generate Prisma Client
pnpm prisma:generate

# Run database migrations
pnpm prisma:migrate

# (Optional) Open Prisma Studio to view database
pnpm prisma:studio
```

### 4. Run Development Servers

Open 3 terminal windows:

**Terminal 1 - API Backend:**
```bash
cd apps/api
pnpm dev
```
API will run on http://localhost:3001
API Docs: http://localhost:3001/api/docs

**Terminal 2 - Frontend Web:**
```bash
cd apps/web
pnpm dev
```
Web will run on http://localhost:3000

**Terminal 3 - Redis (if running locally):**
```bash
redis-server
```
Or skip this if using Upstash Redis

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs
- **Database Studio**: Run `pnpm prisma:studio` in apps/api

### 6. Create Test User

Visit http://localhost:3000/signup and create an account.

---

## Free Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend + DB)

#### Deploy Backend to Railway

1. **Sign up at [Railway.app](https://railway.app)**
2. **Create New Project** → "Deploy from GitHub repo"
3. **Select your repository**
4. **Add PostgreSQL database**:
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will auto-create DATABASE_URL
5. **Add Redis**:
   - Click "New" → "Database" → "Add Redis"
   - Railway will auto-create REDIS_URL
6. **Configure environment variables** in Railway dashboard:
   - Add all variables from `apps/api/.env`
7. **Set root directory**: `/apps/api`
8. **Deploy!**

Railway Free Tier:
- $5 credit per month
- 500 hours execution time
- Perfect for testing

#### Deploy Frontend to Vercel

1. **Sign up at [Vercel.com](https://vercel.com)**
2. **Import Git Repository**
3. **Configure build settings**:
   - Framework Preset: Next.js
   - Root Directory: `apps/web`
   - Build Command: `cd ../.. && pnpm install && cd apps/web && pnpm build`
   - Output Directory: `.next`
4. **Add environment variables** from `apps/web/.env.local`
5. **Deploy!**

Vercel Free Tier:
- Unlimited deployments
- 100GB bandwidth/month
- Automatic HTTPS
- Perfect for production

### Option 2: All-in-One on Railway

Deploy both frontend and backend on Railway:
1. Create separate services for API and Web
2. Follow same steps as above for each service

### Option 3: Render.com (Alternative to Railway)

Free tier includes:
- 750 hours/month
- PostgreSQL database
- Redis instance

---

## Getting API Keys (All Free)

### 1. Neon PostgreSQL (Database)
- Sign up: https://neon.tech
- Create project → Copy connection string
- Paste as `DATABASE_URL`

### 2. Upstash Redis (Cache)
- Sign up: https://upstash.com
- Create Redis database
- Copy Redis URL → Paste as `REDIS_URL`

### 3. Rentcast API (Property Valuations)
- Sign up: https://developers.rentcast.io
- Free tier: 50 requests/month
- Get API key → Paste as `RENTCAST_API_KEY`

### 4. Stripe (Payments)
- Sign up: https://stripe.com
- Use test mode (free forever)
- Get test secret key: `sk_test_...`
- Create product "PRO Plan" at $29/month
- Copy price ID: `price_...`

### 5. Geoapify (Address Autocomplete)
- Sign up: https://www.geoapify.com
- Free tier: 3,000 requests/day
- Get API key → Paste as `NEXT_PUBLIC_GEOAPIFY_API_KEY`

### 6. Gmail SMTP (Email Sending - Optional)
- Use your Gmail account
- Enable 2FA: https://myaccount.google.com/security
- Create App Password: https://myaccount.google.com/apppasswords
- Use app password as `SMTP_PASS`

---

## Testing the Application

### 1. Create Account
- Go to `/signup`
- Fill in details
- You'll start with FREE plan (5 credits/month)

### 2. Test Valuation
- Go to "New Valuation"
- Enter address: `123 Main St, San Francisco, CA`
- Fill in property details
- Submit to get valuation

### 3. Test Widgets
- Go to "Widgets"
- Create new widget
- Copy embed code
- Test on external website

### 4. Test Billing (Stripe Test Mode)
- Go to "Billing & Plans"
- Click "Upgrade to PRO"
- Use test card: `4242 4242 4242 4242`
- Any future date, any CVC

### 5. Test Email
- Configure SMTP in settings
- Send valuation report via email

---

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
cd apps/api
pnpm prisma:studio
```

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Prisma Client Issues
```bash
cd apps/api
pnpm prisma:generate
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
rm -rf apps/*/node_modules
rm pnpm-lock.yaml
pnpm install
```

---

## Production Checklist

Before deploying to production:

- [ ] Change all secrets (JWT_SECRET, NEXTAUTH_SECRET)
- [ ] Use production Stripe keys
- [ ] Enable Stripe webhooks
- [ ] Configure custom domain
- [ ] Set up SSL certificates (auto with Vercel/Railway)
- [ ] Enable production error tracking (Sentry)
- [ ] Set up backups for database
- [ ] Configure rate limiting
- [ ] Review CORS settings
- [ ] Test all payment flows
- [ ] Test email deliverability

---

## Support

For issues:
1. Check API logs: http://localhost:3001
2. Check browser console
3. Check Prisma Studio for database
4. Review environment variables

## Next Steps

1. ✅ Set up local development
2. ✅ Get API keys
3. ✅ Test all features locally
4. ✅ Deploy to free hosting
5. ✅ Share test link with stakeholders
6. ✅ Collect feedback
7. ✅ Launch! 🚀
