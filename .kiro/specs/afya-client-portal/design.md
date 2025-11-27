# Design Document

## Overview

The AFYA Wellness Website is a Next.js-based full-stack application designed with a "build like lego" philosophy - simple, modular components that work independently and can be composed into complex features. The platform emphasizes stability, performance, and maintainability through clean architecture patterns and progressive enhancement.

### Design Principles

1. **Simplicity First**: Start with minimal, working implementations before adding complexity
2. **Modular Architecture**: Independent components that can be developed, tested, and deployed separately
3. **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with interactivity
4. **Performance by Default**: Optimized for speed with code splitting, lazy loading, and caching
5. **Type Safety**: TypeScript throughout for compile-time error detection
6. **Accessibility First**: WCAG 2.1 AA compliance built into every component

## Architecture

### Technology Stack

**Frontend**
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives + custom components
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context + Server Components (minimize client state)

**Backend**
- **API**: Next.js API Routes + Server Actions
- **Database**: PostgreSQL (via Supabase or Vercel Postgres)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5 (Auth.js)
- **File Storage**: Vercel Blob or AWS S3
- **Email**: Resend or SendGrid

**Payments & Commerce**
- **Payment Processing**: Stripe
- **Product Management**: Stripe Products or custom database

**Infrastructure**
- **Hosting**: Vercel
- **CDN**: Vercel Edge Network
- **Monitoring**: Vercel Analytics + Sentry
- **CI/CD**: GitHub Actions + Vercel


### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Public Pages │  │ Auth Pages   │  │ Portal/Admin │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js Application                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              App Router (RSC)                        │   │
│  │  • Server Components (default)                       │   │
│  │  • Client Components (interactive)                   │   │
│  │  • Server Actions (mutations)                        │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Layer                               │   │
│  │  • REST endpoints (/api/*)                           │   │
│  │  • Webhooks (Stripe, etc.)                           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data & Services Layer                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │PostgreSQL│  │  Stripe  │  │  Email   │  │  Storage │   │
│  │(Prisma)  │  │          │  │ Service  │  │  (Blob)  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Application Structure

```
afya-wellness/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes (no auth)
│   │   ├── page.tsx              # Home page
│   │   ├── about/
│   │   ├── programs/
│   │   ├── tools/
│   │   ├── shop/
│   │   ├── impact/
│   │   └── start/                # Discovery form
│   ├── (auth)/                   # Auth routes
│   │   ├── login/
│   │   ├── setup/[token]/
│   │   └── reset-password/
│   ├── (portal)/                 # Client portal (auth required)
│   │   ├── dashboard/
│   │   ├── assessments/
│   │   ├── packets/
│   │   └── tools/
│   ├── (admin)/                  # Admin panel (admin auth)
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── content/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── communications/
│   │   └── analytics/
│   ├── api/                      # API routes
│   │   ├── auth/[...nextauth]/
│   │   ├── webhooks/
│   │   └── **/
│   └── layout.tsx                # Root layout
├── components/                   # React components
│   ├── ui/                       # Base UI components
│   ├── forms/                    # Form components
│   ├── layouts/                  # Layout components
│   └── features/                 # Feature-specific components
├── lib/                          # Utilities and configs
│   ├── db/                       # Database client & queries
│   ├── auth/                     # Auth configuration
│   ├── email/                    # Email templates & sender
│   ├── stripe/                   # Stripe integration
│   ├── pdf/                      # PDF generation
│   └── utils/                    # Helper functions
├── prisma/                       # Database schema
│   ├── schema.prisma
│   └── migrations/
├── public/                       # Static assets
└── types/                        # TypeScript types
```

## Components and Interfaces

### Core Component Categories

#### 1. Public Website Components

**HomePage**
- Hero section with mission statement
- Community stats counter (real-time)
- Featured programs carousel
- Impact showcase
- Testimonials
- CTA sections

**ProgramsPage**
- Program cards grid
- Filter sidebar (type, intensity, duration)
- Program detail modal/page
- "Get Started" flow integration

**ToolsPage**
- Tool cards grid
- Individual tool interfaces:
  - BMR/TDEE Calculator
  - Plate Builder
  - Heart Rate Zones
  - Hydration & Sleep Snapshot
  - Youth Corner
  - Recovery Check-in

**ShopPage**
- Product grid with filters
- Shopping cart (persistent)
- Checkout flow with Stripe
- Optional donation allocation

**ImpactPage**
- Impact areas showcase
- Donation forms
- Gear drive form
- Impact metrics visualization

#### 2. Discovery & Onboarding Components

**DiscoveryForm**
- Simple 4-field form (name, email, goal, notes)
- Validation with Zod
- Submission → scheduling redirect
- Email confirmation

**SchedulingInterface**
- Calendar integration (Calendly embed or custom)
- Time slot selection
- Confirmation flow

#### 3. Authentication Components

**LoginForm**
- Email/password fields
- NextAuth integration
- Password reset link
- Error handling

**SetupForm**
- Token validation
- Password creation
- Profile completion
- Welcome flow

#### 4. Client Portal Components

**ClientDashboard**
- Welcome section
- Quick stats
- Recent packets
- Saved tools
- Notifications

**AssessmentModules**
- Modular assessment forms:
  - Nutrition
  - Training
  - Performance
  - Youth
  - Recovery
  - Lifestyle
- Progress indicators
- Save & resume functionality
- Dynamic branching logic

**PacketViewer**
- PDF preview
- Download functionality
- Packet history
- Regeneration options

#### 5. Admin Panel Components

**AdminDashboard**
- KPI cards (users, revenue, engagement)
- Recent activity feed
- Quick actions
- System health indicators
- Notifications center

**UserManagement**
- User table with search/filter
- User detail view
- Create/edit user forms
- Bulk actions
- Activity logs

**ClientCommunication**
- Client list with status
- Internal notes interface
- Email composer
- Assignment management
- Discovery call tracking

**ContentManagement**
- Program CRUD interface
- Testimonial approval
- Impact area editor
- Rich text editor integration

**ProductManagement**
- Product CRUD
- Inventory tracking
- Order processing
- Status updates

**Analytics**
- Charts and graphs (Chart.js or Recharts)
- Date range filters
- Export functionality
- Custom reports

### Shared Components

**Navigation**
- Public nav (simplified one-word)
- Portal nav (authenticated)
- Admin nav (role-based)
- Mobile responsive menu

**Forms**
- Input components (text, email, textarea, select, etc.)
- Validation feedback
- Loading states
- Error boundaries

**UI Primitives**
- Button
- Card
- Modal/Dialog
- Toast notifications
- Loading spinners
- Empty states
- Error states


## Data Models

### Core Entities

**User**
- id, email, name, password (hashed)
- role (USER, ADMIN, SUPER_ADMIN)
- status (PENDING, ACTIVE, INACTIVE, SUSPENDED)
- Relations: assessments, packets, orders, notes

**DiscoverySubmission**
- id, name, email, goal, notes
- callScheduled, callDate, status
- Tracks initial discovery form submissions

**Assessment**
- id, userId, type, data (JSON), completed
- Types: GENERAL, NUTRITION, TRAINING, PERFORMANCE, YOUTH, RECOVERY, LIFESTYLE
- Flexible JSON storage for assessment responses

**Packet**
- id, userId, assessmentId, type, fileUrl, data (JSON)
- Generated PDFs from assessments
- Types match assessment types

**Program**
- id, name, description, type, intensity, duration
- imageUrl, published

**Product**
- id, name, description, price, imageUrl, inventory
- stripeProductId, stripePriceId, published

**Order**
- id, userId, email, status, total
- stripePaymentId, donationAmount, donationArea
- Relations: orderItems

**Donation**
- id, email, amount, allocation (JSON)
- stripePaymentId

**GearDrive**
- id, name, email, items (JSON), condition, preference, status

**ClientNote**
- id, clientId, authorId, content
- Internal admin notes on clients

**ActivityLog**
- id, userId, action, resource, details (JSON), ipAddress
- Audit trail for all significant actions

### Database Technology

**PostgreSQL via Prisma ORM**
- Type-safe database access
- Automatic migrations
- Query optimization
- Connection pooling

## API Design

### REST Endpoints

**Public APIs**
```
GET  /api/programs              # List programs with filters
GET  /api/programs/[id]         # Get program details
POST /api/discovery             # Submit discovery form
POST /api/contact               # Submit contact form
GET  /api/products              # List products
GET  /api/products/[id]         # Get product details
```

**Authenticated APIs**
```
GET  /api/user/profile          # Get user profile
PUT  /api/user/profile          # Update profile
GET  /api/assessments           # List user assessments
POST /api/assessments           # Create assessment
PUT  /api/assessments/[id]      # Update assessment
GET  /api/packets               # List user packets
GET  /api/packets/[id]          # Get packet details
POST /api/packets/generate      # Generate packet from assessment
```

**Admin APIs**
```
GET  /api/admin/users           # List users
POST /api/admin/users           # Create user
PUT  /api/admin/users/[id]      # Update user
GET  /api/admin/analytics       # Get analytics data
POST /api/admin/notes           # Create client note
GET  /api/admin/discovery       # List discovery submissions
PUT  /api/admin/discovery/[id]  # Update discovery status
```

**Commerce APIs**
```
POST /api/cart                  # Add to cart
POST /api/checkout              # Create checkout session
POST /api/webhooks/stripe       # Stripe webhook handler
```

### Server Actions

Server Actions for mutations (preferred over API routes for form submissions):

```typescript
// app/actions/discovery.ts
'use server'
export async function submitDiscoveryForm(data: DiscoveryFormData) {
  // Validate, save to DB, send email
}

// app/actions/assessment.ts
'use server'
export async function saveAssessment(data: AssessmentData) {
  // Save assessment progress
}

// app/actions/admin.ts
'use server'
export async function createUser(data: CreateUserData) {
  // Create user, send setup email
}
```

## Error Handling

### Error Handling Strategy

1. **Client-Side Validation**: Zod schemas for all forms
2. **Server-Side Validation**: Validate again on server
3. **Error Boundaries**: React Error Boundaries for component errors
4. **API Error Responses**: Consistent error format
5. **User-Friendly Messages**: Never expose technical details
6. **Logging**: All errors logged to Sentry with context

### Error Response Format

```typescript
{
  error: {
    code: "VALIDATION_ERROR",
    message: "Please check your input",
    fields: {
      email: "Invalid email format"
    }
  }
}
```

## Testing Strategy

### Testing Approach

1. **Unit Tests**: Utility functions, helpers (Vitest)
2. **Component Tests**: React components (React Testing Library)
3. **Integration Tests**: API routes, Server Actions (Vitest)
4. **E2E Tests**: Critical user flows (Playwright)
5. **Manual Testing**: UI/UX, accessibility

### Test Coverage Goals

- Utilities: 90%+
- Components: 70%+
- API Routes: 80%+
- E2E: Critical paths only

### Testing Tools

- **Vitest**: Unit and integration tests
- **React Testing Library**: Component tests
- **Playwright**: E2E tests
- **MSW**: API mocking

## Security Considerations

### Authentication & Authorization

- NextAuth.js for authentication
- Role-based access control (RBAC)
- Session management with secure cookies
- Password hashing with bcrypt (cost factor 12)
- Token-based account setup and password reset

### Data Protection

- TLS 1.3 for all connections
- CSRF protection on all forms
- Input validation and sanitization
- SQL injection prevention (Prisma ORM)
- XSS prevention (React escaping + CSP headers)
- Rate limiting on API routes
- Session timeout (30 minutes)

### Payment Security

- PCI compliance via Stripe
- No card data stored locally
- Webhook signature verification
- Idempotency keys for payments

## Performance Optimization

### Frontend Optimization

- Server Components by default (reduce JS bundle)
- Code splitting and lazy loading
- Image optimization (next/image)
- Font optimization (next/font)
- CSS optimization (Tailwind JIT)
- Prefetching critical routes
- Caching strategies

### Backend Optimization

- Database query optimization
- Connection pooling
- Caching with Redis (if needed)
- CDN for static assets
- Edge functions for global performance

### Monitoring

- Vercel Analytics for Web Vitals
- Sentry for error tracking
- Database query monitoring
- API response time tracking

## Deployment Strategy

### Environments

1. **Development**: Local development
2. **Preview**: Vercel preview deployments (per PR)
3. **Staging**: Pre-production testing
4. **Production**: Live site

### CI/CD Pipeline

1. Push to GitHub
2. Run tests (Vitest, Playwright)
3. Type checking (TypeScript)
4. Linting (ESLint)
5. Build (Next.js)
6. Deploy to Vercel
7. Run smoke tests
8. Notify team

### Database Migrations

- Prisma migrations
- Migration review process
- Rollback strategy
- Backup before migrations

## Future Enhancements

### Phase 2 Features

- AI-powered packet generation (AFYA Studio)
- Real-time chat support
- Mobile app (React Native)
- Advanced analytics dashboard
- Subscription tiers
- Educational content library
- Community features

### Scalability Considerations

- Microservices architecture (if needed)
- Message queue for async tasks
- Read replicas for database
- Horizontal scaling
- Multi-region deployment

## Conclusion

This design provides a solid foundation for the AFYA platform with emphasis on simplicity, modularity, and scalability. Each component is designed to work independently while integrating seamlessly with the overall system. The architecture supports the "build like lego" philosophy by allowing incremental development and testing of features.
