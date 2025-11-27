# AFYA Wellness Platform - Complete Rebuild Guide

**Last Updated**: November 23, 2025

This is your comprehensive guide to rebuilding the AFYA Wellness Platform from scratch. Everything you need is documented here.

## Table of Contents

1. [Quick Overview](#quick-overview)
2. [Tech Stack](#tech-stack)
3. [Step-by-Step Setup](#step-by-step-setup)
4. [Project Structure](#project-structure)
5. [All Dependencies](#all-dependencies)
6. [Environment Variables](#environment-variables)
7. [Database Schema](#database-schema)
8. [Key Features](#key-features)
9. [Configuration Files](#configuration-files)
10. [Important Implementation Details](#important-implementation-details)

---

## Quick Overview

**What is this?** Full-stack wellness platform with client portal, admin dashboard, assessment system, PDF packet generation, e-commerce, and more.

**Built with:** Next.js 14 + TypeScript + PostgreSQL + Prisma + NextAuth + Stripe + Tailwind CSS

**Time to rebuild:** 2-4 hours (if copying files) or 1-2 weeks (from scratch)

---

## Tech Stack

### Core Framework
- **Next.js 14.2** - React framework with App Router
- **React 18.3** - UI library  
- **TypeScript 5.4** - Type safety
- **Tailwind CSS 3.4** - Styling

### Database
- **PostgreSQL** - Primary database
- **Prisma 7.0** - ORM with type generation

### Authentication
- **NextAuth.js 5.0** (beta.30) - Authentication
- **bcryptjs** - Password hashing

### Payments
- **Stripe** - Payment processing
- **@stripe/stripe-js** - Stripe client

### File Storage
- **@vercel/blob** - PDF and image storage

### PDF Generation
- **@react-pdf/renderer 4.3** - PDF creation

### Email
- **Resend 6.5** - Transactional emails

### Monitoring
- **@sentry/nextjs 10.26** - Error tracking

### Testing
- **Vitest 4.0** - Unit tests
- **@testing-library/react 16.3** - Component tests
- **Playwright 1.56** - E2E tests

### Forms & Validation
- **react-hook-form 7.66** - Form management
- **@hookform/resolvers 5.2** - Form validation
- **Zod 4.1** - Schema validation

### UI
- **lucide-react 0.554** - Icons
- Custom component library

---

## Step-by-Step Setup

### Option 1: Copy Existing Project (Fastest - 30 minutes)

```bash
# 1. Create new directory
mkdir afya-wellness-fresh
cd afya-wellness-fresh

# 2. Copy everything from current project
cp -r ../afya-wellness/* .
cp -r ../afya-wellness/.* . 2>/dev/null || true

# 3. Clean build artifacts
rm -rf .next node_modules

# 4. Install dependencies
npm install

# 5. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your values

# 6. Set up database
npx prisma generate
npx prisma migrate dev
npm run db:seed

# 7. Start development server
npm run dev
```

### Option 2: Fresh Install (2-4 hours)

```bash
# 1. Create Next.js project
npx create-next-app@14.2.0 afya-wellness --typescript --tailwind --app --no-src-dir
cd afya-wellness

# 2. Install all dependencies (see "All Dependencies" section below)

# 3. Copy these directories from old project:
# - app/
# - components/
# - lib/
# - prisma/
# - public/
# - scripts/
# - e2e/
# - .kiro/

# 4. Copy these files from old project:
# - tailwind.config.ts
# - next.config.js
# - tsconfig.json
# - .eslintrc.json
# - postcss.config.js
# - vitest.config.ts
# - playwright.config.ts
# - middleware.ts

# 5. Set up environment variables (see "Environment Variables" section)

# 6. Set up database
npx prisma generate
npx prisma migrate dev
npm run db:seed

# 7. Start development
npm run dev
```

### Option 3: Build From Scratch (1-2 weeks)

Follow the Developer Guide and implement features one by one. Use the existing code as reference.

---

## Project Structure

```
afya-wellness/
├── app/                          # Next.js App Router
│   ├── (portal)/                 # Authenticated client portal
│   │   ├── dashboard/            # Client dashboard
│   │   ├── assessments/          # Assessment pages
│   │   │   ├── modules/          # Modular assessment system
│   │   │   ├── nutrition/
│   │   │   ├── training/
│   │   │   ├── performance/
│   │   │   ├── youth/
│   │   │   ├── recovery/
│   │   │   └── lifestyle/
│   │   ├── packets/              # View wellness packets
│   │   └── saved-tools/          # Saved tool results
│   ├── admin/                    # Admin dashboard
│   │   ├── dashboard/            # Admin overview
│   │   ├── users/                # User management
│   │   ├── clients/              # Client management
│   │   ├── packets/              # Packet editing & publishing
│   │   ├── products/             # Product management
│   │   ├── orders/               # Order management
│   │   ├── content/              # Content management
│   │   │   ├── programs/
│   │   │   ├── testimonials/
│   │   │   └── impact-areas/
│   │   ├── libraries/            # Exercise & nutrition libraries
│   │   │   ├── exercises/
│   │   │   └── nutrition/
│   │   ├── analytics/            # Analytics dashboard
│   │   └── activity-logs/        # Activity logs
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth endpoints
│   │   ├── checkout/             # Stripe checkout
│   │   ├── donate/               # Donation processing
│   │   ├── gear-drive/           # Gear drive submissions
│   │   ├── packets/              # Packet downloads
│   │   ├── webhooks/             # Stripe webhooks
│   │   └── health/               # Health check endpoint
│   ├── actions/                  # Server Actions
│   │   ├── admin-dashboard.ts
│   │   ├── analytics.ts
│   │   ├── activity-logs.ts
│   │   ├── auth.ts
│   │   ├── client-communication.ts
│   │   ├── contact.ts
│   │   ├── content-management.ts
│   │   ├── libraries.ts
│   │   ├── modular-assessments.ts
│   │   ├── order-management.ts
│   │   ├── packet-editing.ts
│   │   ├── packet-generation.ts
│   │   ├── packet-storage.ts
│   │   ├── population.ts
│   │   ├── product-management.ts
│   │   └── user-management.ts
│   ├── about/                    # About page
│   ├── programs/                 # Programs listing
│   ├── tools/                    # Wellness tools
│   │   ├── bmr-tdee/
│   │   ├── plate-builder/
│   │   ├── heart-rate-zones/
│   │   ├── hydration-sleep/
│   │   ├── youth-corner/
│   │   └── recovery-checkin/
│   ├── shop/                     # E-commerce
│   │   └── checkout/
│   ├── impact/                   # Impact initiatives
│   │   ├── donate/
│   │   └── gear-drive/
│   ├── contact/                  # Contact page
│   ├── start/                    # Discovery form
│   ├── login/                    # Login page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   ├── error.tsx                 # Error boundary
│   └── global-error.tsx          # Global error handler
├── components/
│   ├── ui/                       # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   ├── accessible-image.tsx
│   │   └── error-boundary.tsx
│   ├── forms/                    # Form components
│   │   ├── login-form.tsx
│   │   ├── reset-password-form.tsx
│   │   └── setup-account-form.tsx
│   ├── layouts/                  # Layout components
│   │   ├── footer.tsx
│   │   ├── portal-layout.tsx
│   │   └── admin-layout.tsx
│   ├── admin/                    # Admin components
│   │   ├── notifications-center.tsx
│   │   ├── discovery-submissions-list.tsx
│   │   ├── client-notes-section.tsx
│   │   ├── client-assignment-section.tsx
│   │   ├── email-client-section.tsx
│   │   ├── discovery-call-section.tsx
│   │   ├── packet-editor.tsx
│   │   ├── packet-version-history.tsx
│   │   ├── nutrition-editor.tsx
│   │   ├── exercise-swap-dialog.tsx
│   │   ├── exercise-library-form.tsx
│   │   ├── nutrition-library-form.tsx
│   │   ├── population-assignment.tsx
│   │   ├── product-form-dialog.tsx
│   │   └── order-detail-dialog.tsx
│   ├── assessments/              # Assessment components
│   │   └── assessment-form.tsx
│   ├── auth/                     # Auth components
│   │   └── session-timeout-warning.tsx
│   ├── home/                     # Homepage components
│   │   └── testimonials-carousel.tsx
│   ├── about/                    # About page components
│   │   ├── mission-section.tsx
│   │   ├── values-section.tsx
│   │   ├── sdg-section.tsx
│   │   ├── founder-section.tsx
│   │   └── partnerships-section.tsx
│   ├── programs/                 # Program components
│   │   └── mobile-filters.tsx
│   ├── shop/                     # Shop components
│   │   ├── shopping-cart.tsx
│   │   ├── donation-allocation.tsx
│   │   └── order-confirmation.tsx
│   ├── impact/                   # Impact components
│   │   └── donation-confirmation.tsx
│   ├── contact/                  # Contact components
│   │   ├── contact-info.tsx
│   │   ├── contact-form.tsx
│   │   ├── partnerships-section.tsx
│   │   └── wellness-resources-map.tsx
│   └── scheduling/               # Scheduling components
│       └── scheduling-interface.tsx
├── lib/
│   ├── auth/                     # Authentication
│   │   ├── config.ts             # NextAuth config
│   │   └── session.ts            # Session helpers
│   ├── db/                       # Database
│   │   ├── index.ts              # Prisma client
│   │   ├── queries.ts            # Common queries
│   │   └── cached-queries.ts     # Cached queries
│   ├── pdf/                      # PDF generation
│   │   ├── packet-generator.ts
│   │   ├── storage.ts
│   │   ├── types.ts
│   │   ├── components/           # PDF components
│   │   │   ├── base.tsx
│   │   │   └── exercise.tsx
│   │   └── templates/            # PDF templates
│   │       ├── general-packet.tsx
│   │       ├── nutrition-packet.tsx
│   │       ├── training-packet.tsx
│   │       ├── athlete-packet.tsx
│   │       ├── youth-packet.tsx
│   │       ├── recovery-packet.tsx
│   │       ├── pregnancy-packet.tsx
│   │       ├── postpartum-packet.tsx
│   │       └── older-adult-packet.tsx
│   ├── assessments/              # Assessment system
│   │   ├── types.ts
│   │   ├── profile-service.ts
│   │   └── modules/              # Population modules
│   │       ├── pregnancy.ts
│   │       ├── postpartum.ts
│   │       ├── elderly.ts
│   │       ├── athlete.ts
│   │       ├── youth.ts
│   │       ├── recovery.ts
│   │       ├── dietary.ts
│   │       ├── lifestyle.ts
│   │       ├── movement.ts
│   │       └── equipment.ts
│   ├── libraries/                # Exercise & nutrition
│   │   ├── exercise-service.ts
│   │   └── nutrition-service.ts
│   ├── population/               # Population management
│   ├── stripe/                   # Stripe integration
│   │   └── client.ts
│   ├── email/                    # Email service
│   │   └── index.ts
│   ├── storage/                  # File storage
│   │   └── index.ts
│   ├── logging/                  # Activity logging
│   │   └── index.ts
│   ├── security/                 # Security utilities
│   ├── error-tracking/           # Sentry integration
│   │   └── index.ts
│   ├── validations/              # Zod schemas
│   │   ├── auth.ts
│   │   ├── discovery.ts
│   │   └── population.ts
│   ├── utils/                    # Utility functions
│   │   ├── accessibility.ts
│   │   ├── mobile.ts
│   │   └── color-contrast-checker.ts
│   ├── hooks/                    # React hooks
│   │   └── use-keyboard-navigation.ts
│   └── cart/                     # Shopping cart context
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Database seeding
│   ├── seed-libraries.ts         # Library seeding
│   └── migrations/               # Database migrations
├── scripts/
│   ├── create-admin.ts           # Create admin user
│   ├── pre-deploy-check.sh      # Pre-deployment checks
│   └── setup-production-db.sh   # Production DB setup
├── e2e/                          # E2E tests
│   └── navigation.spec.ts
├── .github/
│   └── workflows/
│       └── ci.yml                # CI/CD pipeline
├── public/                       # Static assets
│   └── images/
├── .kiro/                        # Kiro IDE config
│   ├── specs/                    # Project specs
│   └── steering/                 # AI steering rules
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
├── vitest.config.ts
├── playwright.config.ts
├── middleware.ts                 # NextAuth middleware
├── .env.local                    # Environment variables
├── .eslintrc.json
└── .gitignore
```

---

## All Dependencies

### Production Dependencies

```bash
npm install next@14.2.0 react@18.3.0 react-dom@18.3.0
npm install @prisma/client@7.0.0 @prisma/adapter-pg@7.0.0 pg@8.16.3
npm install next-auth@5.0.0-beta.30 bcryptjs@3.0.3
npm install zod@4.1.12
npm install react-hook-form@7.66.1 @hookform/resolvers@5.2.2
npm install stripe@20.0.0 @stripe/stripe-js@8.5.2
npm install @vercel/blob@2.0.0
npm install @react-pdf/renderer@4.3.1
npm install resend@6.5.2
npm install lucide-react@0.554.0
npm install @sentry/nextjs@10.26.0
npm install date-fns@4.1.0
```

### Development Dependencies

```bash
npm install -D typescript@5.4.0
npm install -D @types/node@20.0.0 @types/react@18.3.0 @types/react-dom@18.3.0
npm install -D @types/bcryptjs@2.4.6 @types/pg@8.15.6 @types/react-pdf@6.2.0
npm install -D prisma@7.0.0
npm install -D tailwindcss@3.4.0 autoprefixer@10.4.0 postcss@8.4.0
npm install -D eslint@8.57.0 eslint-config-next@14.2.0
npm install -D prettier@3.2.0
npm install -D vitest@4.0.13 @vitejs/plugin-react@5.1.1 jsdom@27.2.0
npm install -D @testing-library/react@16.3.0 @testing-library/jest-dom@6.9.1 @testing-library/user-event@14.6.1
npm install -D @playwright/test@1.56.1
npm install -D tsx@4.20.6
```

### Complete package.json

```json
{
  "name": "afya-wellness",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "test": "vitest --run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate deploy",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio",
    "db:push": "prisma db push",
    "pre-deploy": "./scripts/pre-deploy-check.sh",
    "setup:prod-db": "./scripts/setup-production-db.sh",
    "postinstall": "prisma generate"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@prisma/adapter-pg": "^7.0.0",
    "@prisma/client": "^7.0.0",
    "@react-pdf/renderer": "^4.3.1",
    "@sentry/nextjs": "^10.26.0",
    "@stripe/stripe-js": "^8.5.2",
    "@vercel/blob": "^2.0.0",
    "bcryptjs": "^3.0.3",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.554.0",
    "next": "^14.2.0",
    "next-auth": "^5.0.0-beta.30",
    "pg": "^8.16.3",
    "prisma": "^7.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-hook-form": "^7.66.1",
    "resend": "^6.5.2",
    "stripe": "^20.0.0",
    "zod": "^4.1.12"
  },
  "devDependencies": {
    "@playwright/test": "^1.56.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20.0.0",
    "@types/pg": "^8.15.6",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@types/react-pdf": "^6.2.0",
    "@vitejs/plugin-react": "^5.1.1",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "jsdom": "^27.2.0",
    "postcss": "^8.4.0",
    "prettier": "^3.2.0",
    "tailwindcss": "^3.4.0",
    "tsx": "^4.20.6",
    "typescript": "^5.4.0",
    "vitest": "^4.0.13"
  }
}
```

---

## Environment Variables

Create `.env.local` file in project root:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/afya_wellness"
DIRECT_URL="postgresql://username:password@localhost:5432/afya_wellness"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-key-here"
# Generate with: openssl rand -base64 32

# Email (Resend)
RESEND_API_KEY="re_your_api_key_here"
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# File Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN="vercel_blob_token_here"

# Calendly (for discovery calls)
NEXT_PUBLIC_CALENDLY_URL="https://calendly.com/your-username/discovery-call"

# Sentry (Optional - for error tracking)
NEXT_PUBLIC_SENTRY_DSN="https://...@sentry.io/..."
SENTRY_AUTH_TOKEN="your_sentry_auth_token"

# AWS S3 (Optional - alternative to Vercel Blob)
AWS_ACCESS_KEY_ID="your_access_key"
AWS_SECRET_ACCESS_KEY="your_secret_key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket-name"

# Node Environment
NODE_ENV="development"
```

### How to Get API Keys

**Database (PostgreSQL)**
- Local: Install PostgreSQL and create database
- Production: Use Vercel Postgres, Supabase, or Railway

**Resend (Email)**
1. Sign up at https://resend.com
2. Get API key from dashboard
3. Verify your domain

**Stripe (Payments)**
1. Sign up at https://stripe.com
2. Get test keys from dashboard
3. Set up webhook endpoint for production

**Vercel Blob (File Storage)**
1. Deploy to Vercel or sign up
2. Create Blob store in dashboard
3. Get read/write token

**Calendly (Scheduling)**
1. Sign up at https://calendly.com
2. Create event type
3. Copy scheduling link

**Sentry (Error Tracking - Optional)**
1. Sign up at https://sentry.io
2. Create new project
3. Get DSN from project settings

---

## Database Schema

The complete Prisma schema is in `prisma/schema.prisma`. Here are the key models:

### Core Models

**User** - Authentication and profiles
- Fields: id, email, name, password, role, status, population
- Roles: USER, ADMIN, SUPER_ADMIN
- Status: PENDING, ACTIVE, INACTIVE, SUSPENDED
- Populations: GENERAL, ATHLETE, YOUTH, RECOVERY, PREGNANCY, POSTPARTUM, OLDER_ADULT, CHRONIC_CONDITION

**Assessment** - User assessments
- Types: GENERAL, NUTRITION, TRAINING, PERFORMANCE, YOUTH, RECOVERY, LIFESTYLE
- Stores JSON data for flexible assessment structure

**Packet** - Wellness packets (PDFs)
- Types: GENERAL, NUTRITION, TRAINING, ATHLETE_PERFORMANCE, YOUTH, RECOVERY, PREGNANCY, POSTPARTUM, OLDER_ADULT
- Status: DRAFT, UNPUBLISHED, PUBLISHED, ARCHIVED
- Version control with PacketVersion model

**ExerciseLibrary** - Exercise database
- Categories, difficulty levels, equipment
- Regressions and progressions
- Population-specific contraindications

**NutritionLibrary** - Nutrition database
- Macros, micronutrients, allergens
- Dietary tags (vegan, gluten-free, etc.)
- Population-specific alternatives

**Program** - Wellness programs
- Types: FITNESS, NUTRITION, WELLNESS, YOUTH, RECOVERY
- Intensity levels: BEGINNER, INTERMEDIATE, ADVANCED, ELITE

**Product** - E-commerce products
- Stripe integration
- Inventory management

**Order** - Purchase orders
- Status: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED
- Includes donation allocation

**DiscoverySubmission** - Discovery form submissions
- Status: SUBMITTED, CALL_SCHEDULED, CALL_COMPLETED, CONVERTED, CLOSED

**ClientNote** - Admin notes on clients

**ClientAssignment** - Assign clients to team members

**ActivityLog** - Audit trail for all actions

**SavedToolResult** - Saved wellness tool results

**Testimonial** - Client testimonials

**ImpactArea** - Impact metrics for donations

**GearDrive** - Gear drive submissions

### Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name description

# Apply migrations (production)
npx prisma migrate deploy

# Seed database
npm run db:seed

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (development only - deletes all data!)
npx prisma migrate reset
```

---

## Key Features

### 1. Authentication System
- NextAuth.js v5 with credentials provider
- Role-based access control (USER, ADMIN, SUPER_ADMIN)
- Password reset flow with email tokens
- Account setup flow for new users
- Session management with JWT
- Protected routes via middleware

### 2. User Management (Admin)
- Create, read, update, delete users
- Assign populations to users
- Manage user status (ACTIVE, PENDING, INACTIVE, SUSPENDED)
- Assign clients to team members
- View user activity logs

### 3. Modular Assessment Framework
- Population-specific assessment modules
- Dynamic form generation based on population
- Unified client profile system
- Progress tracking
- Profile completion percentage
- Modules: Pregnancy, Postpartum, Elderly, Athlete, Youth, Recovery, Dietary, Lifestyle, Movement, Equipment

### 4. PDF Packet Generation
- Template-based system with @react-pdf/renderer
- 9 packet types for different populations
- Exercise library integration
- Nutrition plan integration
- Version control system
- Publishing workflow (DRAFT → UNPUBLISHED → PUBLISHED)
- File storage with Vercel Blob
- Download functionality

### 5. Exercise & Nutrition Libraries
- Exercise library with 100+ exercises
- Categories: Strength, Cardio, Flexibility, Balance, etc.
- Difficulty levels: Beginner, Intermediate, Advanced
- Equipment requirements
- Regressions and progressions
- Nutrition library with meal plans
- Macros and micronutrients
- Allergen information
- Population-specific filtering
- Admin management interface

### 6. E-commerce System
- Product catalog with images
- Shopping cart with React Context
- Stripe integration for payments
- Order management
- Inventory tracking
- Donation system with impact area allocation
- Order status tracking
- Email confirmations

### 7. Programs & Content Management
- Program CRUD operations
- Program types: FITNESS, NUTRITION, WELLNESS, YOUTH, RECOVERY
- Intensity levels
- Featured programs
- Testimonials management
- Impact areas with metrics
- Published/unpublished status

### 8. Wellness Tools (Free, Public)
- **BMR/TDEE Calculator** - Calculate daily calorie needs
- **Plate Builder** - Visual meal planning
- **Heart Rate Zones** - Training zone calculator
- **Hydration & Sleep Tracker** - Daily tracking
- **Youth Corner** - Youth-specific tools
- **Recovery Check-in** - Recovery assessment
- Save tool results to account

### 9. Impact Initiatives
- Donation system with Stripe
- Allocate donations to impact areas
- Gear Drive form for equipment donations
- Impact metrics dashboard
- Success stories

### 10. Admin Dashboard
- KPI overview (users, assessments, packets, revenue)
- Recent activity feed
- Discovery call submissions
- Client management
- Email communication
- Notes system
- Analytics with charts
- Activity logs with filtering

### 11. Contact & Discovery
- Discovery form with goal selection
- Calendly integration for scheduling
- Contact form with subject categories
- Partnerships section
- Wellness resources map
- Email notifications

### 12. Client Portal
- Personalized dashboard
- Assessment progress tracking
- View and download wellness packets
- Access wellness tools
- Save tool results
- Account settings

### 13. Security Features
- CSRF protection (built into Next.js)
- Rate limiting on sensitive endpoints
- Input sanitization with Zod
- SQL injection prevention (Prisma)
- XSS protection
- Security headers
- Password hashing with bcryptjs
- Session timeout warnings
- Activity logging for audit trails

### 14. Performance Optimizations
- Database query caching
- Image optimization with next/image
- Code splitting
- Font optimization with next/font
- Server Components for reduced JavaScript
- Lazy loading
- Optimistic UI updates

### 15. Accessibility Features
- ARIA labels throughout
- Keyboard navigation support
- Screen reader support
- Color contrast checking
- Focus management
- Mobile-first responsive design
- Touch-friendly interfaces
- Accessible forms with error messages

### 16. Mobile Responsiveness
- Fully responsive design
- Mobile-optimized navigation
- Touch gestures
- Mobile-specific components
- Responsive tables
- Mobile filters
- Optimized images for mobile

### 17. Testing
- Unit tests with Vitest
- Component tests with Testing Library
- E2E tests with Playwright
- API route tests
- Validation schema tests
- Accessibility tests

### 18. Monitoring & Error Tracking
- Sentry integration for error tracking
- Activity logs for user actions
- Analytics dashboard
- Health check endpoint
- Performance monitoring

---

## Configuration Files

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['your-blob-storage-domain.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true, // For faster development
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
```

### tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80bfff',
          300: '#4da6ff',
          400: '#1a8cff',
          500: '#0073e6',
          600: '#005bb3',
          700: '#004280',
          800: '#002a4d',
          900: '#00111a',
        },
        secondary: {
          50: '#fff5e6',
          100: '#ffe0b3',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa31a',
          500: '#ff8f00',
          600: '#cc7200',
          700: '#995600',
          800: '#663900',
          900: '#331d00',
        },
        accent: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#4caf50',
          600: '#43a047',
          700: '#388e3c',
          800: '#2e7d32',
          900: '#1b5e20',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### middleware.ts

```typescript
export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/assessments/:path*',
    '/packets/:path*',
    '/saved-tools/:path*',
  ],
};
```

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### .eslintrc.json

```json
{
  "extends": "next/core-web-vitals"
}
```

### postcss.config.js

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

## Important Implementation Details

### 1. Server Actions Pattern

All data mutations use Next.js Server Actions (not API routes). They're in `app/actions/`.

**Why?** 
- Automatic CSRF protection
- Type-safe with TypeScript
- No need to create API routes
- Automatic revalidation

**Example:**
```typescript
'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createUser(data: CreateUserData) {
  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      // ...
    },
  });
  
  revalidatePath('/admin/users');
  return { success: true, user };
}
```

### 2. Client vs Server Components

**Server Components (default):**
- No 'use client' directive
- Can directly access database
- Better performance
- No JavaScript sent to client

**Client Components:**
- Need 'use client' directive
- For interactivity (onClick, useState, etc.)
- Cannot directly access database
- Use Server Actions for mutations

**Rule:** Use Server Components by default, only add 'use client' when needed.

### 3. Authentication Flow

**NextAuth.js v5 Configuration:**
- Config in `lib/auth/config.ts`
- Credentials provider for email/password
- JWT strategy for sessions
- Custom callbacks for role/population

**Session Access:**
```typescript
// In Server Components
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

const session = await getServerSession(authOptions);

// In Client Components
import { useSession } from 'next-auth/react';

const { data: session } = useSession();
```

**Protected Routes:**
- Middleware in `middleware.ts` protects routes
- Helper functions: `requireAuth()`, `requireAdmin()`

### 4. Database Queries

**Direct Prisma:**
```typescript
import { prisma } from '@/lib/db';

const users = await prisma.user.findMany({
  where: { status: 'ACTIVE' },
  include: { packets: true },
});
```

**Cached Queries:**
```typescript
import { getCachedUser } from '@/lib/db/cached-queries';

const user = await getCachedUser(userId);
```

**Why cache?** Reduces database load for frequently accessed data.

### 5. PDF Generation

**System:**
- Uses @react-pdf/renderer
- Templates in `lib/pdf/templates/`
- Components in `lib/pdf/components/`
- Generator in `lib/pdf/packet-generator.ts`

**Flow:**
1. User completes assessment
2. Admin generates packet from assessment data
3. PDF created using template
4. Uploaded to Vercel Blob
5. URL stored in database
6. User can download

**Key Files:**
- `lib/pdf/packet-generator.ts` - Main generator
- `lib/pdf/templates/*.tsx` - PDF templates
- `lib/pdf/storage.ts` - File upload/download

### 6. Form Handling

**Pattern:**
- react-hook-form for form state
- Zod for validation
- @hookform/resolvers to connect them

**Example:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

### 7. Error Handling

**Levels:**
1. **Component-level:** Try-catch in components
2. **Page-level:** error.tsx files
3. **Global:** global-error.tsx
4. **Monitoring:** Sentry for production

**Error Boundaries:**
- `app/error.tsx` - Page-level errors
- `app/global-error.tsx` - App-level errors
- `components/ui/error-boundary.tsx` - Component errors

### 8. Type Safety

**Prisma generates types:**
```typescript
import { User, Packet, Assessment } from '@prisma/client';
```

**Zod for runtime validation:**
```typescript
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
});

type UserInput = z.infer<typeof UserSchema>;
```

### 9. Styling Approach

**Tailwind CSS:**
- Utility-first CSS
- Custom colors in tailwind.config.ts
- Responsive with breakpoints (sm, md, lg, xl)
- Dark mode support (if needed)

**Component Library:**
- Base components in `components/ui/`
- Consistent styling across app
- Accessible by default

### 10. File Structure Conventions

**Naming:**
- Components: PascalCase (UserCard.tsx)
- Utilities: camelCase (formatDate.ts)
- Server Actions: kebab-case files (user-management.ts)
- Pages: kebab-case folders (user-profile/)

**Organization:**
- Group by feature, not by type
- Co-locate related files
- Keep components small and focused

### 11. Environment-Specific Behavior

**Development:**
- Detailed error messages
- Hot reload
- Debug logging

**Production:**
- Minified code
- Error tracking with Sentry
- Performance monitoring
- Security headers

### 12. Data Flow

**Read Data:**
1. Server Component fetches from database
2. Passes data to Client Component as props
3. Client Component renders

**Write Data:**
1. Client Component calls Server Action
2. Server Action validates and writes to database
3. Server Action revalidates cache
4. UI updates automatically

### 13. Testing Strategy

**Unit Tests:**
- Utility functions
- Validation schemas
- Helper functions

**Component Tests:**
- UI components
- Form components
- Interaction testing

**Integration Tests:**
- Server Actions
- API routes
- Database operations

**E2E Tests:**
- Critical user flows
- Authentication
- Purchase flows

### 14. Deployment Checklist

Before deploying:
- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] Build succeeds locally
- [ ] Tests pass
- [ ] No TypeScript errors
- [ ] Security headers configured
- [ ] Error tracking set up
- [ ] Email service configured
- [ ] Payment webhooks configured

### 15. Common Pitfalls to Avoid

**Don't:**
- Import server code in client components
- Forget 'use client' for interactive components
- Expose secrets in client-side code
- Skip input validation
- Forget to revalidate after mutations
- Use any type in TypeScript
- Commit .env.local to git

**Do:**
- Use Server Components by default
- Validate all inputs with Zod
- Use TypeScript strictly
- Handle errors gracefully
- Log important actions
- Test critical flows
- Keep dependencies updated

---

## Quick Reference Commands

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### Database

```bash
# Generate Prisma client
npm run db:generate

# Create migration
npx prisma migrate dev --name your_migration_name

# Apply migrations
npm run db:migrate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio

# Push schema without migration (dev only)
npm run db:push

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Generate coverage report
npm run test:coverage
```

### Deployment

```bash
# Pre-deployment checks
npm run pre-deploy

# Set up production database
npm run setup:prod-db

# Deploy to Vercel
vercel --prod
```

---

## Troubleshooting

### CSS Not Loading

**Symptoms:** Plain text, no colors, no styling

**Causes:**
- Browser cache
- Build cache
- CSS not compiling

**Solutions:**
```bash
# 1. Hard refresh browser
# Mac: Cmd+Shift+R
# Windows: Ctrl+Shift+R

# 2. Clear Next.js cache
rm -rf .next
npm run dev

# 3. Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# 4. Check browser DevTools
# Network tab → Look for CSS files
# Console tab → Check for errors
```

### Database Connection Errors

**Symptoms:** "Can't reach database server"

**Solutions:**
```bash
# 1. Check PostgreSQL is running
# Mac: brew services list
# Linux: sudo systemctl status postgresql

# 2. Verify DATABASE_URL in .env.local
# Should be: postgresql://user:password@localhost:5432/dbname

# 3. Test connection
psql -U username -d dbname

# 4. Regenerate Prisma client
npx prisma generate
```

### Build Errors

**Symptoms:** Build fails with errors

**Common causes:**
- Type errors
- Missing environment variables
- Import issues

**Solutions:**
```bash
# 1. Check TypeScript errors
npm run type-check

# 2. Check for missing env vars
# Ensure all required vars in .env.local

# 3. Clear cache and rebuild
rm -rf .next
npm run build

# 4. Check for server code in client components
# Look for database imports in 'use client' files
```

### Authentication Issues

**Symptoms:** Can't log in, session not persisting

**Solutions:**
```bash
# 1. Verify NEXTAUTH_SECRET is set
echo $NEXTAUTH_SECRET

# 2. Check NEXTAUTH_URL matches your domain
# Development: http://localhost:3000
# Production: https://yourdomain.com

# 3. Clear browser cookies
# DevTools → Application → Cookies → Clear

# 4. Check database for user
npx prisma studio
# Navigate to User table
```

### Stripe Webhook Issues

**Symptoms:** Payments succeed but orders not created

**Solutions:**
```bash
# 1. Verify webhook secret
echo $STRIPE_WEBHOOK_SECRET

# 2. Test webhook locally with Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# 3. Check webhook endpoint in Stripe dashboard
# Should be: https://yourdomain.com/api/webhooks/stripe

# 4. Check webhook logs in Stripe dashboard
```

### Email Not Sending

**Symptoms:** Emails not received

**Solutions:**
```bash
# 1. Verify Resend API key
echo $RESEND_API_KEY

# 2. Check domain verification in Resend dashboard

# 3. Check email logs in Resend dashboard

# 4. Test email sending
# Create test script to send email
```

### PDF Generation Fails

**Symptoms:** Error when generating packets

**Solutions:**
```bash
# 1. Check @react-pdf/renderer is installed
npm list @react-pdf/renderer

# 2. Verify Vercel Blob token
echo $BLOB_READ_WRITE_TOKEN

# 3. Check PDF template syntax
# Look for errors in lib/pdf/templates/

# 4. Test PDF generation locally
# Create test script to generate PDF
```

### Performance Issues

**Symptoms:** Slow page loads, high memory usage

**Solutions:**
```bash
# 1. Check database query performance
# Use Prisma Studio to inspect queries

# 2. Add database indexes
# Check prisma/schema.prisma for @@index

# 3. Enable caching
# Use lib/db/cached-queries.ts

# 4. Optimize images
# Use next/image component

# 5. Check bundle size
npm run build
# Look for large chunks in output
```

---

## Additional Resources

### Documentation Files in Project

- `DEVELOPER_GUIDE.md` - Complete developer documentation
- `ADMIN_USER_GUIDE.md` - Admin panel guide
- `CLIENT_PORTAL_GUIDE.md` - Client portal guide
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `PROJECT_REBUILD_GUIDE.md` - Original rebuild guide
- `DOCUMENTATION_INDEX.md` - All documentation index

### Feature-Specific Guides

- `lib/pdf/PACKET_GENERATION_GUIDE.md` - PDF system
- `lib/assessments/README.md` - Assessment system
- `lib/libraries/README.md` - Exercise/nutrition libraries
- `AUTH_IMPLEMENTATION.md` - Authentication details
- `SECURITY_IMPLEMENTATION.md` - Security features

### External Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [React PDF Docs](https://react-pdf.org)

---

## Contact & Support

**Project:** AFYA Wellness Platform
**Website:** https://theafya.org
**Email:** support@theafya.org
**Instagram:** @the.afya
**TikTok:** @theafya

---

## Final Notes

### Current Status

✅ **Fully functional** - All features implemented and tested
✅ **Production-ready** - Deployed and running
✅ **Well-documented** - Comprehensive documentation
✅ **Type-safe** - Full TypeScript coverage
✅ **Tested** - Unit, integration, and E2E tests
✅ **Secure** - Security best practices implemented
✅ **Accessible** - WCAG 2.1 AA compliant
✅ **Mobile-responsive** - Works on all devices

### What You Get

When you rebuild this project, you get:
- Complete wellness platform
- Admin dashboard
- Client portal
- Assessment system
- PDF packet generation
- E-commerce with Stripe
- Email notifications
- File storage
- Analytics
- Activity logging
- Error tracking
- Testing suite
- CI/CD pipeline
- Comprehensive documentation

### Time Investment

**Copying existing project:** 30 minutes - 2 hours
**Fresh install with existing code:** 2-4 hours
**Building from scratch:** 1-2 weeks

### Recommendation

**Best approach:** Copy the existing project (Option 1) and make modifications as needed. The codebase is well-structured and documented, making it easy to understand and extend.

---

**Last Updated:** November 23, 2025
**Version:** 1.0
**Maintained By:** AFYA Development Team

