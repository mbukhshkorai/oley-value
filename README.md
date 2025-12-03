# ValuPro - Home Valuation SaaS Platform

> **Professional home valuation tool for real estate professionals**

ValuPro is a comprehensive SaaS platform that enables realtors to offer branded home valuation services, capture qualified leads, and generate professional PDF reports through embeddable widgets.

---

## 🎯 Project Overview

**Target Users:** Real Estate Professionals (USA)
**Business Model:** Freemium SaaS (Free & Pro plans)
**Development Status:** Planning Phase Complete ✓

### Core Features (V1)

- 🏠 **Property Valuation Engine** - Powered by Rentcast API with address autocomplete
- 📊 **Lead Management System** - Capture and nurture potential clients
- 📄 **Professional PDF Reports** - Branded valuation reports with charts and maps
- 💳 **Subscription Management** - Stripe-powered billing with Free and Pro tiers
- 🎨 **Embeddable Widgets** - JavaScript widgets for realtor websites
- 📧 **Email System** - Custom SMTP integration + automated email delivery
- 📈 **Analytics Dashboard** - Track valuations, leads, and opportunity value
- 🔒 **Secure Authentication** - NextAuth.js with 2FA support

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand + React Query
- **Forms:** React Hook Form + Zod

### Backend
- **Framework:** NestJS 10+
- **Language:** TypeScript
- **ORM:** Prisma 5+
- **Database:** Neon PostgreSQL
- **Cache:** Redis (Railway)

### Infrastructure
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Railway
- **Storage:** AWS S3
- **Payments:** Stripe
- **Email:** Resend + Nodemailer
- **PDF Generation:** Puppeteer

### Monorepo
- **Package Manager:** pnpm
- **Build System:** Turborepo

---

## 📁 Project Structure

```
/oley-value
├── /apps
│   ├── /web           # Next.js Frontend
│   └── /api           # NestJS Backend
├── /packages
│   ├── /ui            # Shared UI components
│   ├── /types         # Shared TypeScript types
│   ├── /utils         # Shared utilities
│   └── /config        # Shared configurations
├── /docs              # Documentation
│   ├── TECHNICAL_PLAN.md
│   ├── DESIGN_TOKENS.md
│   └── PLANNING_SUMMARY.md
├── README.md
└── package.json
```

---

## 📋 Planning Documents

| Document | Description |
|----------|-------------|
| **[TECHNICAL_PLAN.md](./TECHNICAL_PLAN.md)** | Complete 12-week development blueprint with architecture, database schema, API endpoints, and roadmap |
| **[DESIGN_TOKENS.md](./DESIGN_TOKENS.md)** | Design system with color palette, typography (Manrope), spacing, and component styles |
| **[PLANNING_SUMMARY.md](./PLANNING_SUMMARY.md)** | Executive summary with key decisions, timeline, and next steps |

---

## 💰 Pricing Plans

### Free Plan
- **Price:** $0/month (permanent)
- **Valuations:** 5 per month
- **Features:** Basic widget, lead manager, email reports, SMTP integration
- **No credit card required**

### Pro Plan
- **Price:** $29/month
- **Valuations:** 100 per month
- **Features:** Everything in Free + advanced customization, unlimited widgets, analytics
- **Add-on:** $15 for 50 additional valuations (pay-as-you-go)

---

## 🚀 Development Timeline

**Total Duration:** 12 weeks (3 months)

| Phase | Weeks | Deliverables |
|-------|-------|--------------|
| **Foundation** | 1-2 | Monorepo, design system, database, authentication |
| **Core Features** | 3-6 | Dashboard, valuation engine, lead management, PDFs |
| **Advanced Features** | 7-9 | Billing, widgets, email system |
| **Polish & Launch** | 10-12 | Testing, deployment, monitoring |

**Milestones:**
- ✅ Week 0: Planning Complete
- ⏳ Week 4: MVP Demo
- ⏳ Week 8: Beta Release
- ⏳ Week 12: Production Launch

---

## 🎨 Design System

### Color Palette
- **Primary:** Blue (#3B82F6 family)
- **Status Colors:** Green (Qualified), Orange (Contacted), Blue (New), Red (Lost)

### Typography
- **Font:** Manrope (400, 500, 600, 700, 800)
- **Scale:** 12px - 48px (responsive)

### Components
- Cards, Buttons, Forms, Tables, Badges, Navigation
- Mobile-first responsive design
- WCAG AA accessibility compliant

---

## 🔐 Security Features

- ✅ HTTPS enforcement
- ✅ JWT authentication with httpOnly cookies
- ✅ Password hashing (bcrypt)
- ✅ Two-factor authentication (TOTP)
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection (React + CSP headers)
- ✅ CSRF tokens
- ✅ Rate limiting
- ✅ reCAPTCHA v3
- ✅ Input validation and sanitization

---

## 🧪 Testing Strategy

- **Unit Tests:** Jest (services, utilities)
- **Integration Tests:** Supertest (API endpoints)
- **E2E Tests:** Playwright (user workflows)
- **Security Tests:** Authentication, authorization, injection attacks

---

## 📊 Key Integrations

| Service | Purpose |
|---------|---------|
| **Rentcast** | Property valuation data |
| **Geoapify** | Address autocomplete (US) |
| **Stripe** | Payment processing |
| **AWS S3** | File storage (PDFs, images) |
| **Resend** | System email delivery |
| **Google Maps** | Map rendering in PDFs |
| **reCAPTCHA** | Spam protection |

---

## 🚦 Current Status

**Phase:** Planning Complete ✓

**Next Steps:**
1. Obtain additional UI designs (signup, forms, lead pages)
2. Confirm third-party account setup (Stripe, AWS)
3. Begin monorepo initialization
4. Start Phase 1 development

---

## 📞 Contact & Support

For questions or feedback during development, please refer to:
- Technical specifications: `TECHNICAL_PLAN.md`
- Design guidelines: `DESIGN_TOKENS.md`
- Project summary: `PLANNING_SUMMARY.md`

---

## 📄 License

Proprietary - All rights reserved

---

**Built with ❤️ for real estate professionals**

Ready to transform home valuations into qualified leads.
