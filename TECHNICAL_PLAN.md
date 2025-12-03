# ValuPro - Technical Implementation Plan
## Version 1.0 | Complete Development Blueprint

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Tech Stack & Architecture](#tech-stack--architecture)
3. [Design System](#design-system)
4. [Database Schema](#database-schema)
5. [Authentication & Authorization](#authentication--authorization)
6. [Feature Implementation Plan](#feature-implementation-plan)
7. [API Architecture](#api-architecture)
8. [Third-Party Integrations](#third-party-integrations)
9. [Development Roadmap](#development-roadmap)
10. [Deployment Strategy](#deployment-strategy)

---

## 🎯 PROJECT OVERVIEW

**Product Name:** ValuPro - Home Valuation Tool
**Target Users:** Real Estate Professionals (USA)
**Business Model:** Freemium SaaS with Pro subscription
**Development Approach:** Monorepo, V1 MVP with all core features

### Core Value Proposition
Enable realtors to offer branded home valuation services, capture qualified leads, and generate professional PDF reports through embeddable widgets.

---

## 🏗️ TECH STACK & ARCHITECTURE

### Monorepo Structure
```
/oley-value
├── /apps
│   ├── /web           # Next.js Frontend (Vercel)
│   └── /api           # NestJS Backend (Railway)
├── /packages
│   ├── /ui            # Shared UI components
│   ├── /types         # Shared TypeScript types
│   ├── /utils         # Shared utilities
│   └── /config        # Shared configurations
├── /docs              # Documentation
└── package.json       # Root package.json (workspace)
```

### Technology Stack

#### Frontend (`/apps/web`)
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript 5+
- **Styling:** Tailwind CSS 3+ with custom design tokens
- **UI Components:** shadcn/ui (Radix UI primitives)
- **State Management:** Zustand + React Query
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts or Chart.js
- **PDF Rendering:** react-pdf for viewing
- **Authentication:** NextAuth.js v5 (Auth.js)
- **HTTP Client:** Axios with interceptors

#### Backend (`/apps/api`)
- **Framework:** NestJS 10+
- **Language:** TypeScript 5+
- **Database ORM:** Prisma 5+
- **Database:** Neon PostgreSQL (serverless)
- **Authentication:** JWT + Passport strategies
- **Validation:** class-validator + class-transformer
- **Email:** Nodemailer (SMTP) + Resend (system fallback)
- **PDF Generation:** Puppeteer (headless Chrome)
- **File Storage:** AWS S3 (PDFs, realtor assets)
- **Payment Processing:** Stripe SDK (Elements + Webhooks)
- **Caching:** Redis (Railway addon) - for Rentcast responses
- **Rate Limiting:** @nestjs/throttler
- **API Documentation:** Swagger/OpenAPI

#### DevOps & Infrastructure
- **Hosting (Frontend):** Vercel (CDN, Edge functions)
- **Hosting (Backend):** Railway (auto-scaling)
- **Database:** Neon PostgreSQL (serverless, auto-scaling)
- **Storage:** AWS S3 (CloudFront CDN)
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry (error tracking)
- **Analytics:** Vercel Analytics + custom event tracking
- **Environment Management:** Vercel Env + Railway Env

#### Package Manager & Monorepo
- **Tool:** pnpm with workspaces
- **Build System:** Turborepo (caching, parallel builds)

---

## 🎨 DESIGN SYSTEM

### Color Palette (Extracted from Dashboard UI)

#### Primary Colors
```css
--primary-50: #EFF6FF;    /* Light blue background */
--primary-100: #DBEAFE;
--primary-200: #BFDBFE;
--primary-300: #93C5FD;
--primary-400: #60A5FA;
--primary-500: #3B82F6;   /* Main brand blue */
--primary-600: #2563EB;   /* Darker blue (buttons, links) */
--primary-700: #1D4ED8;
--primary-800: #1E40AF;
--primary-900: #1E3A8A;
```

#### Neutral/Gray Scale
```css
--gray-50: #F9FAFB;       /* Light background */
--gray-100: #F3F4F6;      /* Card backgrounds */
--gray-200: #E5E7EB;      /* Borders */
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;      /* Muted text */
--gray-500: #6B7280;      /* Secondary text */
--gray-600: #4B5563;      /* Body text */
--gray-700: #374151;
--gray-800: #1F2937;      /* Headings */
--gray-900: #111827;      /* Darkest text */
```

#### Status Colors
```css
--success-50: #F0FDF4;
--success-500: #22C55E;   /* Green - Qualified status */
--success-600: #16A34A;

--warning-50: #FFFBEB;
--warning-500: #F59E0B;   /* Orange - Contacted status */
--warning-600: #D97706;

--info-50: #EFF6FF;
--info-500: #3B82F6;      /* Blue - New status */
--info-600: #2563EB;

--error-50: #FEF2F2;
--error-500: #EF4444;     /* Red - Lost/Error status */
--error-600: #DC2626;
```

#### Semantic Colors
```css
--background: #FFFFFF;
--foreground: #111827;
--card: #FFFFFF;
--card-foreground: #111827;
--border: #E5E7EB;
--input: #F9FAFB;
--ring: #3B82F6;
--radius: 0.5rem;         /* 8px border radius */
```

### Typography

#### Font Family
- **Primary Font:** Manrope (Google Fonts)
- **Weights:** 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), 800 (Extrabold)
- **Fallback:** system-ui, -apple-system, sans-serif

#### Font Scale
```css
--text-xs: 0.75rem;      /* 12px - Small labels */
--text-sm: 0.875rem;     /* 14px - Secondary text */
--text-base: 1rem;       /* 16px - Body text */
--text-lg: 1.125rem;     /* 18px - Large body */
--text-xl: 1.25rem;      /* 20px - Section headers */
--text-2xl: 1.5rem;      /* 24px - Page titles */
--text-3xl: 1.875rem;    /* 30px - Large values */
--text-4xl: 2.25rem;     /* 36px - Hero text */
```

### Spacing System
Based on 4px base unit:
```
2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96
```

### Component Patterns
- **Cards:** White background, subtle shadow, rounded corners
- **Buttons:** Primary (blue), Secondary (outline), Ghost (text only)
- **Status Badges:** Colored backgrounds with matching text
- **Tables:** Striped rows, hover states, sticky headers
- **Forms:** Floating labels, inline validation, error states
- **Charts:** Minimalist design, brand colors, tooltips

---

## 🗄️ DATABASE SCHEMA

### Prisma Schema Structure

```prisma
// /apps/api/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== USER MANAGEMENT ====================

enum AccountType {
  INDIVIDUAL_AGENT
  TEAM
  BROKERAGE
}

enum SubscriptionPlan {
  FREE
  PRO
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  PAST_DUE
  TRIALING
}

model User {
  id                String            @id @default(cuid())
  email             String            @unique
  passwordHash      String            @map("password_hash")
  firstName         String            @map("first_name")
  lastName          String            @map("last_name")
  phone             String?
  accountType       AccountType       @default(INDIVIDUAL_AGENT) @map("account_type")

  // Profile details
  headshotUrl       String?           @map("headshot_url")
  company           String?
  licenseNumber     String?           @map("license_number")
  websiteUrl        String?           @map("website_url")

  // Security
  emailVerified     DateTime?         @map("email_verified")
  twoFactorEnabled  Boolean           @default(false) @map("two_factor_enabled")
  twoFactorSecret   String?           @map("two_factor_secret")

  // Metadata
  createdAt         DateTime          @default(now()) @map("created_at")
  updatedAt         DateTime          @updatedAt @map("updated_at")
  lastLoginAt       DateTime?         @map("last_login_at")

  // Relations
  subscription      Subscription?
  valuations        Valuation[]
  leads             Lead[]
  widgets           Widget[]
  smtpConfig        SmtpConfig?

  @@map("users")
}

// ==================== BILLING & SUBSCRIPTIONS ====================

model Subscription {
  id                    String              @id @default(cuid())
  userId                String              @unique @map("user_id")
  user                  User                @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Stripe details
  stripeCustomerId      String?             @unique @map("stripe_customer_id")
  stripeSubscriptionId  String?             @unique @map("stripe_subscription_id")
  stripePriceId         String?             @map("stripe_price_id")
  stripeCurrentPeriodEnd DateTime?          @map("stripe_current_period_end")

  // Plan details
  plan                  SubscriptionPlan    @default(FREE)
  status                SubscriptionStatus  @default(ACTIVE)

  // Credits (monthly valuations)
  monthlyCredits        Int                 @default(5) @map("monthly_credits") // 5 for FREE, 100 for PRO
  usedCredits           Int                 @default(0) @map("used_credits")
  additionalCredits     Int                 @default(0) @map("additional_credits") // Pay-as-you-go credits (no expiry)

  // Billing cycle
  billingAnchorDate     DateTime            @default(now()) @map("billing_anchor_date") // Anniversary billing
  lastResetDate         DateTime            @default(now()) @map("last_reset_date")

  // Metadata
  createdAt             DateTime            @default(now()) @map("created_at")
  updatedAt             DateTime            @updatedAt @map("updated_at")

  @@map("subscriptions")
}

// ==================== VALUATIONS ====================

enum ValuationSource {
  DASHBOARD  // Created by realtor in dashboard
  WIDGET     // Created by end-user via widget
}

model Valuation {
  id                String            @id @default(cuid())
  userId            String            @map("user_id")
  user              User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Property details
  address           String
  fullAddress       Json              @map("full_address") // Structured address from Geoapify
  beds              Int?
  baths             Int?
  sqft              Int?

  // Valuation data (from Rentcast)
  estimatedValue    Decimal           @map("estimated_value") @db.Decimal(12, 2)
  valueLow          Decimal?          @map("value_low") @db.Decimal(12, 2)
  valueHigh         Decimal?          @map("value_high") @db.Decimal(12, 2)
  confidenceScore   Decimal?          @map("confidence_score") @db.Decimal(3, 2)
  comparables       Json?             // Array of comparable properties

  // Rentcast response cache
  rentcastData      Json?             @map("rentcast_data") // Full API response for regeneration

  // PDF & Sharing
  pdfUrl            String?           @map("pdf_url")
  publicShareUrl    String?           @unique @map("public_share_url") // Shareable link

  // Source tracking
  source            ValuationSource   @default(DASHBOARD)
  widgetId          String?           @map("widget_id")
  widget            Widget?           @relation(fields: [widgetId], references: [id])

  // Metadata
  createdAt         DateTime          @default(now()) @map("created_at")
  updatedAt         DateTime          @updatedAt @map("updated_at")

  // Relations
  lead              Lead?

  @@index([userId, createdAt])
  @@map("valuations")
}

// ==================== LEAD MANAGEMENT ====================

enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  LOST
}

model Lead {
  id                String            @id @default(cuid())
  userId            String            @map("user_id")
  user              User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  valuationId       String            @unique @map("valuation_id")
  valuation         Valuation         @relation(fields: [valuationId], references: [id], onDelete: Cascade)

  // Contact details
  firstName         String            @map("first_name")
  lastName          String            @map("last_name")
  email             String
  phone             String?

  // Lead management
  status            LeadStatus        @default(NEW)
  customStatus      String?           @map("custom_status") // User-defined status label
  statusColor       String?           @map("status_color") // Hex color for custom status
  statusBgColor     String?           @map("status_bg_color") // Background color for badge

  opportunityValue  Decimal           @map("opportunity_value") @db.Decimal(12, 2) // Default: property value * 2%
  notes             String?           @db.Text

  // Email consent
  emailOptIn        Boolean           @default(false) @map("email_opt_in")

  // Metadata
  createdAt         DateTime          @default(now()) @map("created_at")
  updatedAt         DateTime          @updatedAt @map("updated_at")
  lastContactedAt   DateTime?         @map("last_contacted_at")

  @@index([userId, status, createdAt])
  @@index([email])
  @@map("leads")
}

// ==================== WIDGETS ====================

model Widget {
  id                String            @id @default(cuid())
  userId            String            @map("user_id")
  user              User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Widget configuration
  name              String            @default("Default Widget")

  // Customization
  primaryColor      String            @default("#3B82F6") @map("primary_color")
  secondaryColor    String?           @map("secondary_color")
  textColor         String            @default("#111827") @map("text_color")
  backgroundColor   String            @default("#FFFFFF") @map("background_color")
  fontFamily        String            @default("Manrope") @map("font_family")

  logoUrl           String?           @map("logo_url")
  customMessage     String?           @map("custom_message") @db.Text
  successMessage    String?           @map("success_message") @db.Text
  redirectUrl       String?           @map("redirect_url") // After successful submission

  // Embed code
  embedCode         String            @unique @map("embed_code") // Generated JavaScript snippet

  // Analytics
  impressions       Int               @default(0) // Widget loads
  submissions       Int               @default(0) // Form submissions
  conversionRate    Decimal           @default(0) @map("conversion_rate") @db.Decimal(5, 2) // %

  // Status
  isActive          Boolean           @default(true) @map("is_active")

  // Metadata
  createdAt         DateTime          @default(now()) @map("created_at")
  updatedAt         DateTime          @updatedAt @map("updated_at")

  // Relations
  valuations        Valuation[]

  @@index([userId, isActive])
  @@map("widgets")
}

// ==================== EMAIL CONFIGURATION ====================

enum SmtpProvider {
  GMAIL
  OUTLOOK
  CUSTOM
}

model SmtpConfig {
  id                String            @id @default(cuid())
  userId            String            @unique @map("user_id")
  user              User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  provider          SmtpProvider

  // SMTP credentials (encrypted at application level)
  host              String
  port              Int
  username          String
  password          String            // Encrypted
  fromEmail         String            @map("from_email")
  fromName          String?           @map("from_name")

  // OAuth tokens (for Gmail/Outlook one-click)
  accessToken       String?           @map("access_token") @db.Text
  refreshToken      String?           @map("refresh_token") @db.Text
  tokenExpiry       DateTime?         @map("token_expiry")

  // Status
  isVerified        Boolean           @default(false) @map("is_verified")
  isActive          Boolean           @default(true) @map("is_active")

  // Metadata
  createdAt         DateTime          @default(now()) @map("created_at")
  updatedAt         DateTime          @updatedAt @map("updated_at")
  lastTestedAt      DateTime?         @map("last_tested_at")

  @@map("smtp_configs")
}

// ==================== ANALYTICS & TRACKING ====================

model AnalyticsEvent {
  id                String            @id @default(cuid())
  userId            String?           @map("user_id")

  eventType         String            @map("event_type") // widget_impression, widget_submission, pdf_download, etc.
  eventData         Json?             @map("event_data")

  // Session tracking
  sessionId         String?           @map("session_id")
  ipAddress         String?           @map("ip_address")
  userAgent         String?           @map("user_agent")

  // Widget tracking
  widgetId          String?           @map("widget_id")

  createdAt         DateTime          @default(now()) @map("created_at")

  @@index([userId, eventType, createdAt])
  @@index([widgetId, eventType, createdAt])
  @@map("analytics_events")
}

// ==================== AUDIT LOG ====================

model AuditLog {
  id                String            @id @default(cuid())
  userId            String?           @map("user_id")

  action            String            // login, subscription_upgrade, lead_status_change, etc.
  entityType        String?           @map("entity_type") // User, Lead, Valuation, etc.
  entityId          String?           @map("entity_id")

  oldValue          Json?             @map("old_value")
  newValue          Json?             @map("new_value")

  ipAddress         String?           @map("ip_address")
  userAgent         String?           @map("user_agent")

  createdAt         DateTime          @default(now()) @map("created_at")

  @@index([userId, createdAt])
  @@index([entityType, entityId])
  @@map("audit_logs")
}
```

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### Authentication Strategy: NextAuth.js v5 (Auth.js)

#### Why NextAuth.js?
- ✅ Seamless Next.js integration
- ✅ Built-in session management
- ✅ Support for OAuth (Gmail, Outlook for SMTP)
- ✅ JWT + database sessions
- ✅ CSRF protection
- ✅ Secure by default

#### Authentication Flow

**1. Signup Flow**
```
User fills form → Validate inputs → Hash password (bcrypt) → Create user record
→ Send verification email → Redirect to email verification page
→ User clicks link → Mark email as verified → Redirect to plan selection
```

**2. Login Flow**
```
User enters credentials → Validate → Check email verified → Generate JWT
→ Create session → Set httpOnly cookie → Redirect to dashboard
```

**3. Two-Factor Authentication (2FA)**
```
User enables 2FA → Generate TOTP secret (speakeasy) → Show QR code
→ User scans with authenticator app → Verify code → Save secret
→ On login: Request 2FA code → Validate → Grant access
```

### Session Management
- **Session Storage:** Database (Prisma)
- **Session Duration:** 30 days
- **Token Refresh:** Auto-refresh on activity
- **Cookie Settings:** httpOnly, secure, sameSite: lax

### Authorization Rules

| Role | Access |
|------|--------|
| **Realtor (Free)** | 5 valuations/month, basic dashboard, 1 widget, lead manager, profile |
| **Realtor (Pro)** | 100 valuations/month, unlimited widgets, advanced customization, analytics |
| **End User** | No authentication required, can submit valuation via widget |

### API Security
- Rate limiting: 100 requests/15min per IP (public endpoints)
- Rate limiting: 1000 requests/15min per user (authenticated endpoints)
- CORS: Whitelist realtor domains for widget embedding
- CAPTCHA: reCAPTCHA v3 on valuation forms (score-based)
- Input sanitization: All inputs validated and sanitized

---

## 🚀 FEATURE IMPLEMENTATION PLAN

### Phase 1: Foundation & Infrastructure (Week 1-2)

#### 1.1 Project Setup
- ✅ Initialize monorepo with Turborepo
- ✅ Setup Next.js app (`/apps/web`)
- ✅ Setup NestJS app (`/apps/api`)
- ✅ Configure Tailwind + shadcn/ui
- ✅ Setup Prisma with Neon PostgreSQL
- ✅ Create shared packages (`/packages/ui`, `/packages/types`)

#### 1.2 Design System Implementation
- ✅ Configure Tailwind with custom theme (colors, fonts)
- ✅ Import Manrope font from Google Fonts
- ✅ Create base UI components (Button, Input, Card, Badge, etc.)
- ✅ Setup responsive layouts

#### 1.3 Database & ORM
- ✅ Define complete Prisma schema
- ✅ Setup migrations
- ✅ Create seed data for development
- ✅ Setup Prisma Client in NestJS

---

### Phase 2: Authentication & User Management (Week 2-3)

#### 2.1 Authentication System
- ✅ Implement NextAuth.js configuration
- ✅ Create signup API (NestJS)
- ✅ Create login API
- ✅ Email verification system
- ✅ Password reset flow
- ✅ JWT token generation and validation

#### 2.2 User Onboarding
- ✅ Signup form (first name, last name, email, password, phone, account type)
- ✅ Email verification page
- ✅ Plan selection page (Free vs Pro)
- ✅ Complete profile page (headshot upload, company, license)

#### 2.3 Profile Management
- ✅ View/edit profile page
- ✅ Change password
- ✅ Enable/disable 2FA
- ✅ Upload headshot (S3)
- ✅ SMTP configuration

---

### Phase 3: Dashboard & Analytics (Week 3-4)

#### 3.1 Dashboard Layout
- ✅ Sidebar navigation
- ✅ Top header (search, notifications, profile dropdown)
- ✅ Responsive mobile menu

#### 3.2 Dashboard Widgets
- ✅ Valuation Usage card (X/Y credits with progress bar)
- ✅ Total Leads card
- ✅ Opportunity Value card (sum of active leads)
- ✅ Total Portfolio Value card (sum of all property valuations)
- ✅ Date range filter (affects all dashboard data)

#### 3.3 Recent Lead Opportunities Table
- ✅ Sortable table (status, name, address, value, time)
- ✅ Status badges with colors
- ✅ Quick actions (download PDF, view details)
- ✅ Pagination

#### 3.4 Quick Actions & Widgets
- ✅ Create New Valuation button
- ✅ Manage Leads button
- ✅ Manage Widgets button
- ✅ View Billing & Plans button
- ✅ Widget stats (active widgets, leads generated, conversion rate)

---

### Phase 4: Valuation Engine (Week 4-5)

#### 4.1 Rentcast API Integration (NestJS)
- ✅ Create Rentcast service
- ✅ API client with error handling
- ✅ Response caching (Redis) - cache for 24 hours
- ✅ Fallback/queue system for API downtime
- ✅ Rate limiting protection

#### 4.2 Geoapify Address Autocomplete
- ✅ Frontend autocomplete component
- ✅ US-only address validation
- ✅ Structured address parsing

#### 4.3 Internal Valuation Form (Dashboard)
- ✅ Address input with autocomplete
- ✅ Optional: beds, baths, sqft
- ✅ Submit and get instant results
- ✅ Display estimated value with range
- ✅ Show comparable properties
- ✅ Map integration (Google Maps or Mapbox)
- ✅ Generate PDF button
- ✅ Send email button

#### 4.4 Public Valuation Form (Widget)
- ✅ Multi-step form:
  - Step 1: Address entry
  - Step 2: User info (name, email, phone)
  - Step 3: Email opt-in consent
- ✅ Form validation
- ✅ reCAPTCHA v3 integration
- ✅ Submit to API
- ✅ Results page with charts
- ✅ Auto-send PDF via email
- ✅ Custom redirect URL (configurable per widget)

---

### Phase 5: Lead Management System (Week 5-6)

#### 5.1 Lead Capture
- ✅ Automatically create lead on widget submission
- ✅ Calculate default opportunity value (property value * 2%)
- ✅ Email notification to realtor

#### 5.2 Lead Manager Page
- ✅ Filterable/searchable lead table
- ✅ Filter by status, date range
- ✅ Bulk actions (export, delete)
- ✅ Lead count and total opportunity value stats

#### 5.3 Lead Detail Page
- ✅ Contact information display
- ✅ Property details and valuation
- ✅ Status dropdown (New, Contacted, Qualified, Lost)
- ✅ Custom status creation (label + colors)
- ✅ Editable opportunity value
- ✅ Notes section (add/edit/delete notes)
- ✅ Activity timeline
- ✅ Email lead directly (if SMTP configured)
- ✅ Download PDF
- ✅ View valuation details

---

### Phase 6: PDF Generation & Sharing (Week 6)

#### 6.1 PDF Template Design
- ✅ Header: Realtor branding (logo, headshot, name, contact)
- ✅ Property details section
- ✅ Estimated value with confidence score
- ✅ Value range chart (visual)
- ✅ Comparable properties table (up to 10)
- ✅ Map with property pin
- ✅ Footer: Realtor contact info, disclaimer
- ✅ Professional styling matching brand

#### 6.2 PDF Generation (Puppeteer)
- ✅ Create HTML template (React component)
- ✅ Puppeteer service in NestJS
- ✅ Generate PDF from HTML
- ✅ Upload to S3
- ✅ Return public URL

#### 6.3 PDF Sharing
- ✅ Public shareable link (unique ID)
- ✅ Download button on results page
- ✅ Email PDF automatically (widget submissions)
- ✅ Manual email sending (dashboard)
- ✅ Social sharing buttons (optional)

---

### Phase 7: Billing & Subscriptions (Week 7-8)

#### 7.1 Stripe Integration (NestJS)
- ✅ Initialize Stripe SDK
- ✅ Create customer on signup
- ✅ Setup webhook endpoint
- ✅ Handle subscription events (created, updated, canceled, payment_failed)

#### 7.2 Plan Management
- ✅ Free Plan: 5 valuations/month, no payment required
- ✅ Pro Plan: $29/month for 100 valuations
- ✅ Pay-as-you-go: $15 for 50 additional credits (Pro only)

#### 7.3 Subscription Lifecycle
- ✅ Plan selection on onboarding
- ✅ Upgrade from Free to Pro (Stripe Checkout)
- ✅ Downgrade from Pro to Free (schedule for end of period)
- ✅ Mid-month upgrades (immediate, prorated)
- ✅ Mid-month downgrades (no refund, applies at period end)

#### 7.4 Credit Management
- ✅ Track monthly credits and usage
- ✅ Reset credits on billing anniversary
- ✅ Additional credits (pay-as-you-go, no expiry)
- ✅ Credit consumption logic:
  1. Use monthly credits first
  2. Then use additional credits
- ✅ Credit exhaustion handling:
  - Realtor: Show upgrade/buy credits prompt
  - End-user: Show "contact realtor" message

#### 7.5 Billing Page
- ✅ Current plan details
- ✅ Usage statistics (credits used/remaining)
- ✅ Next billing date
- ✅ Payment method management
- ✅ Upgrade/downgrade buttons
- ✅ Buy additional credits button (Pro only)
- ✅ Invoice history
- ✅ Cancel subscription

---

### Phase 8: Embeddable Widget System (Week 8-9)

#### 8.1 Widget Configuration
- ✅ Create new widget
- ✅ Widget name
- ✅ Customization options:
  - Primary color (color picker)
  - Secondary color
  - Text color
  - Background color
  - Font family
  - Logo upload
  - Custom success message
  - Redirect URL
- ✅ Real-time preview
- ✅ Save configuration

#### 8.2 Widget Embed Code Generation
- ✅ Generate unique widget ID
- ✅ Create JavaScript snippet:
  ```javascript
  <script src="https://valupro.com/widget.js" data-widget-id="xxx"></script>
  ```
- ✅ Copy to clipboard functionality
- ✅ Installation instructions

#### 8.3 Widget Rendering
- ✅ Standalone widget page (widget.valupro.com/{widgetId})
- ✅ JavaScript loader that injects iframe
- ✅ Responsive design (adapts to container)
- ✅ Apply custom styling from configuration
- ✅ Multi-step form (same as public form)
- ✅ Submit to API with widget ID tracking

#### 8.4 Widget Analytics
- ✅ Track impressions (widget loads)
- ✅ Track submissions (form completions)
- ✅ Calculate conversion rate
- ✅ Display stats on dashboard
- ✅ Per-widget analytics on widget management page

---

### Phase 9: Email System (Week 9)

#### 9.1 SMTP Configuration
- ✅ One-click Gmail OAuth integration
- ✅ One-click Outlook OAuth integration
- ✅ Custom SMTP configuration (host, port, username, password)
- ✅ Test email functionality
- ✅ Verify and save configuration

#### 9.2 System Email Service (Resend)
- ✅ Setup Resend account
- ✅ Configure sender domain
- ✅ Fallback service when realtor SMTP fails
- ✅ System emails (welcome, billing, notifications)

#### 9.3 Email Templates
- ✅ Welcome email (on signup)
- ✅ Email verification
- ✅ Password reset
- ✅ Valuation PDF email (to end-user)
- ✅ New lead notification (to realtor)
- ✅ Credit exhausted notification
- ✅ Billing reminders
- ✅ Subscription renewal/cancellation

#### 9.4 Email Sending Logic
- ✅ Widget submissions: Auto-send PDF to end-user
- ✅ Dashboard submissions: Manual send option
- ✅ Use realtor's SMTP if configured
- ✅ Fallback to system email if SMTP fails
- ✅ Email queue for reliable delivery
- ✅ Retry logic for failed sends

---

### Phase 10: History & Past Valuations (Week 10)

#### 10.1 Valuation History Page
- ✅ List all past valuations
- ✅ Filter by date range
- ✅ Filter by source (dashboard vs widget)
- ✅ Search by address
- ✅ Sort by date, value, address
- ✅ Pagination

#### 10.2 Valuation Detail Page
- ✅ Full property details
- ✅ Estimated value with range
- ✅ Comparable properties
- ✅ Map view
- ✅ Associated lead (if exists)
- ✅ Download PDF
- ✅ Regenerate PDF (if data updated)
- ✅ Share link
- ✅ Delete valuation

---

### Phase 11: Testing & Quality Assurance (Week 11)

#### 11.1 Unit Tests
- ✅ NestJS service tests (Jest)
- ✅ API endpoint tests (Supertest)
- ✅ Frontend component tests (React Testing Library)
- ✅ Utility function tests

#### 11.2 Integration Tests
- ✅ Authentication flow
- ✅ Valuation creation flow
- ✅ Stripe webhook handling
- ✅ Email sending
- ✅ PDF generation

#### 11.3 E2E Tests (Playwright)
- ✅ Complete user signup → create valuation → view dashboard
- ✅ Widget submission flow
- ✅ Lead management workflow
- ✅ Billing and subscription changes

#### 11.4 Security Testing
- ✅ Authentication bypass attempts
- ✅ SQL injection tests
- ✅ XSS vulnerability tests
- ✅ CSRF protection validation
- ✅ Rate limiting verification

---

### Phase 12: Deployment & Launch (Week 12)

#### 12.1 Production Environment Setup
- ✅ Vercel project (frontend)
- ✅ Railway project (backend)
- ✅ Neon production database
- ✅ AWS S3 buckets
- ✅ Redis instance
- ✅ Environment variables configuration

#### 12.2 CI/CD Pipeline
- ✅ GitHub Actions workflows
- ✅ Automated testing on PR
- ✅ Automated deployment on merge to main
- ✅ Database migration automation

#### 12.3 Monitoring & Analytics
- ✅ Sentry error tracking
- ✅ Vercel Analytics
- ✅ Custom event tracking
- ✅ Performance monitoring
- ✅ Uptime monitoring

#### 12.4 Documentation
- ✅ API documentation (Swagger)
- ✅ Widget integration guide
- ✅ Admin documentation
- ✅ Troubleshooting guide

---

## 🔌 API ARCHITECTURE

### REST API Structure (NestJS)

#### Base URL
- **Development:** `http://localhost:3001/api/v1`
- **Production:** `https://api.valupro.com/api/v1`

#### Authentication
- **Headers:** `Authorization: Bearer {JWT_TOKEN}`

#### Endpoints Overview

```
/api/v1
├── /auth
│   ├── POST   /signup
│   ├── POST   /login
│   ├── POST   /logout
│   ├── POST   /verify-email
│   ├── POST   /resend-verification
│   ├── POST   /forgot-password
│   ├── POST   /reset-password
│   ├── POST   /enable-2fa
│   ├── POST   /verify-2fa
│   └── GET    /me
│
├── /users
│   ├── GET    /profile
│   ├── PUT    /profile
│   ├── PUT    /password
│   ├── POST   /upload-headshot
│   └── DELETE /account
│
├── /subscriptions
│   ├── GET    /current
│   ├── POST   /upgrade
│   ├── POST   /downgrade
│   ├── POST   /buy-credits
│   ├── GET    /invoices
│   └── POST   /cancel
│
├── /valuations
│   ├── POST   /create (authenticated - dashboard)
│   ├── POST   /widget/:widgetId (public - widget submission)
│   ├── GET    / (list with filters)
│   ├── GET    /:id
│   ├── GET    /:id/pdf
│   ├── POST   /:id/regenerate-pdf
│   ├── POST   /:id/send-email
│   ├── GET    /share/:publicId (public share link)
│   └── DELETE /:id
│
├── /leads
│   ├── GET    / (list with filters)
│   ├── GET    /:id
│   ├── PUT    /:id
│   ├── PUT    /:id/status
│   ├── POST   /:id/notes
│   ├── GET    /:id/notes
│   ├── POST   /:id/email
│   ├── GET    /export (CSV/Excel)
│   └── DELETE /:id
│
├── /widgets
│   ├── POST   /create
│   ├── GET    / (list user's widgets)
│   ├── GET    /:id
│   ├── PUT    /:id
│   ├── GET    /:id/analytics
│   ├── DELETE /:id
│   └── GET    /:id/embed-code
│
├── /smtp
│   ├── POST   /configure
│   ├── GET    /current
│   ├── POST   /test
│   ├── POST   /oauth/gmail
│   ├── POST   /oauth/outlook
│   └── DELETE /disconnect
│
├── /analytics
│   ├── GET    /dashboard (dashboard stats)
│   ├── POST   /track (track custom events)
│   └── GET    /widget/:widgetId (widget-specific analytics)
│
├── /webhooks
│   └── POST   /stripe (Stripe webhook events)
│
└── /health
    └── GET    / (API health check)
```

---

## 🔗 THIRD-PARTY INTEGRATIONS

### 1. Rentcast API
- **Purpose:** Property valuation data
- **Endpoint:** `https://api.rentcast.io/v1/value-estimate`
- **API Key:** `15a824dd8382447083dc6f93fb169255`
- **Caching:** 24 hours in Redis
- **Rate Limit:** Monitor usage, implement queue if needed

### 2. Geoapify
- **Purpose:** Address autocomplete (US only)
- **Plan:** Free tier
- **Integration:** Frontend component

### 3. Stripe
- **Purpose:** Payment processing
- **Products:**
  - Pro Plan: $29/month recurring
  - Additional Credits: $15 one-time (50 credits)
- **Webhooks:** Handle subscription lifecycle events
- **Test Mode:** Use for development

### 4. AWS S3
- **Purpose:** File storage (PDFs, realtor assets)
- **Buckets:**
  - `valupro-pdfs-prod`
  - `valupro-assets-prod`
- **CDN:** CloudFront for fast delivery
- **Access:** Presigned URLs for secure downloads

### 5. Resend
- **Purpose:** System email sending (fallback)
- **Use Cases:**
  - Welcome emails
  - Password resets
  - Billing notifications
  - Fallback when realtor SMTP fails

### 6. Google Maps / Mapbox
- **Purpose:** Map rendering in PDFs and valuation results
- **Choice:** TBD (Mapbox recommended for customization)

### 7. reCAPTCHA v3
- **Purpose:** Bot protection on valuation forms
- **Score-based:** No user interaction, invisible
- **Threshold:** 0.5 (adjustable)

---

## 📅 DEVELOPMENT ROADMAP

### Timeline: 12 Weeks (3 Months)

| Week | Phase | Deliverables |
|------|-------|--------------|
| **1-2** | Foundation | Monorepo setup, design system, database schema |
| **2-3** | Authentication | Signup, login, email verification, 2FA, profile |
| **3-4** | Dashboard | Layout, widgets, analytics, date filtering |
| **4-5** | Valuation Engine | Rentcast integration, forms, results display |
| **5-6** | Lead Management | Lead capture, lead manager, lead detail pages |
| **6** | PDF Generation | Template design, Puppeteer integration, S3 storage |
| **7-8** | Billing | Stripe integration, plans, credit management |
| **8-9** | Widgets | Configuration, embed code, analytics |
| **9** | Email System | SMTP config, templates, sending logic |
| **10** | History | Past valuations, valuation details |
| **11** | Testing | Unit, integration, E2E, security tests |
| **12** | Deployment | Production setup, CI/CD, monitoring, launch |

### Milestones

- **Week 4:** MVP Demo (Authentication + Dashboard + Basic Valuation)
- **Week 8:** Beta Release (All core features, testing with pilot users)
- **Week 12:** Production Launch (V1 Complete)

---

## 🚀 DEPLOYMENT STRATEGY

### Development Environment
```bash
# Frontend: http://localhost:3000
cd apps/web
pnpm dev

# Backend: http://localhost:3001
cd apps/api
pnpm start:dev
```

### Staging Environment
- **Frontend:** `https://staging.valupro.com` (Vercel preview)
- **Backend:** `https://api-staging.valupro.com` (Railway)
- **Database:** Neon staging branch

### Production Environment
- **Frontend:** `https://valupro.com` (Vercel)
- **Backend:** `https://api.valupro.com` (Railway)
- **Database:** Neon production
- **Widget:** `https://valupro.com/widget/{widgetId}`

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    - Run linting
    - Run unit tests
    - Run integration tests

  deploy-frontend:
    - Vercel automatic deployment

  deploy-backend:
    - Railway automatic deployment
    - Run database migrations
```

---

## 📊 PERFORMANCE TARGETS

- **Page Load:** < 2 seconds (Lighthouse 90+)
- **API Response:** < 500ms average
- **Valuation Generation:** < 3 seconds (including Rentcast call)
- **PDF Generation:** < 5 seconds
- **Widget Load:** < 1 second
- **Uptime:** 99.9%
- **Concurrent Users:** 500+ (initial scale)

---

## 🔒 SECURITY CHECKLIST

- ✅ HTTPS everywhere
- ✅ JWT with secure httpOnly cookies
- ✅ Password hashing (bcrypt, cost factor 12)
- ✅ SQL injection protection (Prisma parameterized queries)
- ✅ XSS protection (React auto-escaping + CSP headers)
- ✅ CSRF tokens
- ✅ Rate limiting on all public endpoints
- ✅ Input validation and sanitization
- ✅ Secrets management (environment variables, never in code)
- ✅ SMTP credentials encryption at rest
- ✅ Regular dependency updates
- ✅ Security headers (Helmet.js)
- ✅ CORS configuration
- ✅ reCAPTCHA on forms

---

## 📝 NEXT STEPS

### Immediate Actions
1. ✅ Get approval on this technical plan
2. ✅ Obtain additional UI designs (signup, forms, lead pages, etc.)
3. ✅ Initialize monorepo structure
4. ✅ Setup design system with Tailwind
5. ✅ Create database schema and migrations
6. ✅ Begin Phase 1 development

### Questions for Client
1. Do you have logo assets ready?
2. Do you have a domain name registered? (valupro.com?)
3. Do you have AWS account for S3 setup?
4. Any specific branding guidelines beyond the UI design?
5. Target launch date?

---

**Document Version:** 1.0
**Last Updated:** 2025-12-03
**Author:** Development Team
**Status:** Awaiting Approval

---

This technical plan serves as the single source of truth for the ValuPro development project. All architectural decisions, feature specifications, and implementation details are documented here for reference throughout the development lifecycle.
