# AFYA Wellness Platform - Architecture Overview

**Visual guide to understanding how everything works together.**

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js 14 App Router + React 18 + TypeScript       │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │   Public   │  │   Client   │  │   Admin    │     │  │
│  │  │   Pages    │  │   Portal   │  │  Dashboard │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  │                                                        │  │
│  │  Tailwind CSS + Custom Components + Lucide Icons     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND LAYER                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js Server Actions + API Routes                 │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │   Auth     │  │  Business  │  │    API     │     │  │
│  │  │  Actions   │  │   Logic    │  │   Routes   │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  │                                                        │  │
│  │  NextAuth.js + Zod Validation + Error Handling       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Prisma ORM + PostgreSQL                             │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │   Users    │  │ Assessments│  │  Packets   │     │  │
│  │  │  Products  │  │   Orders   │  │ Libraries  │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  │                                                        │  │
│  │  Connection Pooling + Caching + Migrations           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Stripe  │  │  Resend  │  │  Vercel  │  │ Calendly │   │
│  │ Payments │  │  Email   │  │   Blob   │  │Scheduling│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────┐                                               │
│  │  Sentry  │  (Optional - Error Tracking)                 │
│  └──────────┘                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow

### Read Data (Server Component)
```
User Request
    ↓
Next.js Server Component
    ↓
Prisma Query → PostgreSQL
    ↓
Data returned to component
    ↓
HTML rendered on server
    ↓
Sent to browser
```

### Write Data (Client Component)
```
User Action (button click)
    ↓
Client Component calls Server Action
    ↓
Server Action validates with Zod
    ↓
Prisma writes to PostgreSQL
    ↓
Server Action revalidates cache
    ↓
UI updates automatically
```

---

## 🔐 Authentication Flow

```
1. User enters credentials
        ↓
2. Login form validates with Zod
        ↓
3. NextAuth.js checks credentials
        ↓
4. Prisma queries User table
        ↓
5. bcrypt verifies password
        ↓
6. JWT token created
        ↓
7. Session stored in cookie
        ↓
8. User redirected to dashboard
        ↓
9. Middleware protects routes
        ↓
10. Session checked on each request
```

---

## 📄 PDF Generation Flow

```
1. User completes assessment
        ↓
2. Assessment data saved to database
        ↓
3. Admin clicks "Generate Packet"
        ↓
4. Server Action fetches assessment data
        ↓
5. Queries exercise/nutrition libraries
        ↓
6. Selects appropriate PDF template
        ↓
7. @react-pdf/renderer creates PDF
        ↓
8. PDF uploaded to Vercel Blob
        ↓
9. URL saved to Packet table
        ↓
10. User can download PDF
```

---

## 💳 Payment Flow

```
1. User adds items to cart
        ↓
2. Clicks checkout
        ↓
3. Server Action creates Stripe session
        ↓
4. User redirected to Stripe
        ↓
5. User completes payment
        ↓
6. Stripe sends webhook
        ↓
7. Webhook handler verifies signature
        ↓
8. Order created in database
        ↓
9. Email confirmation sent via Resend
        ↓
10. User redirected to success page
```

---

## 🗂 File Structure by Layer

### Frontend Layer
```
app/
├── (portal)/          # Client portal pages
├── admin/             # Admin dashboard pages
├── about/             # Public pages
├── programs/
├── tools/
├── shop/
├── impact/
├── contact/
└── login/

components/
├── ui/                # Base components
├── forms/             # Form components
├── layouts/           # Layout components
└── [feature]/         # Feature components
```

### Backend Layer
```
app/
├── actions/           # Server Actions
│   ├── auth.ts
│   ├── user-management.ts
│   ├── packet-generation.ts
│   └── ...
└── api/               # API Routes
    ├── auth/
    ├── checkout/
    ├── webhooks/
    └── ...

lib/
├── auth/              # Auth config
├── db/                # Database utilities
├── pdf/               # PDF generation
├── email/             # Email service
├── stripe/            # Stripe integration
├── validations/       # Zod schemas
└── utils/             # Helper functions
```

### Database Layer
```
prisma/
├── schema.prisma      # Database schema
├── migrations/        # Migration history
├── seed.ts            # Seed data
└── seed-libraries.ts  # Library seed data
```

---

## 🔄 Component Communication

### Server to Client
```
Server Component (fetches data)
        ↓
Props passed to Client Component
        ↓
Client Component renders with data
```

### Client to Server
```
Client Component (user interaction)
        ↓
Calls Server Action
        ↓
Server Action processes
        ↓
Returns result
        ↓
Client Component updates
```

### Client to Client
```
Parent Component
        ↓
Props to Child Component
        ↓
Child emits event
        ↓
Parent handles event
```

---

## 🎯 Key Architectural Decisions

### Why Next.js App Router?
- ✅ Server Components reduce JavaScript
- ✅ Built-in routing and layouts
- ✅ Server Actions for mutations
- ✅ Excellent performance
- ✅ SEO-friendly

### Why Prisma?
- ✅ Type-safe database access
- ✅ Automatic migrations
- ✅ Great developer experience
- ✅ Connection pooling
- ✅ Query optimization

### Why NextAuth.js?
- ✅ Industry standard
- ✅ Multiple providers
- ✅ Session management
- ✅ Security best practices
- ✅ Easy integration

### Why Server Actions?
- ✅ No API routes needed
- ✅ Automatic CSRF protection
- ✅ Type-safe
- ✅ Automatic revalidation
- ✅ Simpler code

### Why Tailwind CSS?
- ✅ Utility-first approach
- ✅ Fast development
- ✅ Consistent styling
- ✅ Small bundle size
- ✅ Easy customization

---

## 🔒 Security Layers

```
┌─────────────────────────────────────┐
│  1. Input Validation (Zod)         │
├─────────────────────────────────────┤
│  2. Authentication (NextAuth)      │
├─────────────────────────────────────┤
│  3. Authorization (Role checks)    │
├─────────────────────────────────────┤
│  4. CSRF Protection (Next.js)      │
├─────────────────────────────────────┤
│  5. SQL Injection Prevention       │
│     (Prisma parameterized queries) │
├─────────────────────────────────────┤
│  6. XSS Protection (React escaping)│
├─────────────────────────────────────┤
│  7. Security Headers (Next.js)     │
├─────────────────────────────────────┤
│  8. Rate Limiting (API routes)     │
├─────────────────────────────────────┤
│  9. Activity Logging (Audit trail) │
├─────────────────────────────────────┤
│  10. Error Tracking (Sentry)       │
└─────────────────────────────────────┘
```

---

## 📈 Performance Optimizations

### Frontend
- ✅ Server Components (less JavaScript)
- ✅ Code splitting (automatic)
- ✅ Image optimization (next/image)
- ✅ Font optimization (next/font)
- ✅ Lazy loading components

### Backend
- ✅ Database query caching
- ✅ Connection pooling
- ✅ Efficient Prisma queries
- ✅ Server-side rendering
- ✅ Static generation where possible

### Database
- ✅ Indexes on frequently queried fields
- ✅ Efficient relations
- ✅ Query optimization
- ✅ Connection pooling
- ✅ Caching layer

---

## 🧪 Testing Strategy

```
┌─────────────────────────────────────┐
│  E2E Tests (Playwright)             │
│  - Critical user flows              │
│  - Authentication flows             │
│  - Purchase flows                   │
├─────────────────────────────────────┤
│  Integration Tests (Vitest)         │
│  - Server Actions                   │
│  - API routes                       │
│  - Database operations              │
├─────────────────────────────────────┤
│  Component Tests (Testing Library)  │
│  - UI components                    │
│  - Form components                  │
│  - User interactions                │
├─────────────────────────────────────┤
│  Unit Tests (Vitest)                │
│  - Utility functions                │
│  - Validation schemas               │
│  - Helper functions                 │
└─────────────────────────────────────┘
```

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────┐
│  GitHub Repository                  │
│  (Source code)                      │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Vercel                             │
│  - Automatic builds                 │
│  - Preview deployments              │
│  - Production deployment            │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Production Environment             │
│  ┌───────────────────────────────┐ │
│  │  Next.js App (Vercel)         │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │  PostgreSQL (Vercel/External) │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │  Vercel Blob (File Storage)   │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 📊 Database Schema Overview

```
User ──────────┬─────────── Assessment
               │
               ├─────────── Packet
               │
               ├─────────── Order
               │
               ├─────────── SavedToolResult
               │
               ├─────────── ClientNote (as client)
               │
               ├─────────── ClientNote (as author)
               │
               ├─────────── ClientAssignment (as client)
               │
               ├─────────── ClientAssignment (as assigned to)
               │
               └─────────── ActivityLog

Assessment ──── Packet

Order ────────── OrderItem ────────── Product

Packet ───────── PacketVersion

ExerciseLibrary (standalone)
NutritionLibrary (standalone)
Program (standalone)
Testimonial (standalone)
ImpactArea (standalone)
DiscoverySubmission (standalone)
GearDrive (standalone)
ContactSubmission (standalone)
```

---

## 🎨 UI Component Hierarchy

```
App Layout
├── Header/Navigation
├── Main Content
│   ├── Public Pages
│   │   ├── Home
│   │   ├── About
│   │   ├── Programs
│   │   ├── Tools
│   │   ├── Shop
│   │   ├── Impact
│   │   └── Contact
│   ├── Client Portal (authenticated)
│   │   ├── Dashboard
│   │   ├── Assessments
│   │   ├── Packets
│   │   └── Saved Tools
│   └── Admin Dashboard (admin only)
│       ├── Dashboard
│       ├── Users
│       ├── Clients
│       ├── Packets
│       ├── Products
│       ├── Orders
│       ├── Content
│       ├── Libraries
│       ├── Analytics
│       └── Activity Logs
└── Footer
```

---

**This architecture is designed for:**
- ✅ Scalability
- ✅ Maintainability
- ✅ Performance
- ✅ Security
- ✅ Developer experience

**Ready to dive deeper?** Check out `DEVELOPER_GUIDE.md` for implementation details!
