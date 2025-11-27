# AFYA Wellness Platform - Developer Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [Architecture Overview](#architecture-overview)
3. [Development Workflow](#development-workflow)
4. [API Documentation](#api-documentation)
5. [Database Schema](#database-schema)
6. [Authentication & Authorization](#authentication--authorization)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Git

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd afya-wellness
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

   Configure the following required variables in `.env.local`:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/afya"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Email (Resend)
   RESEND_API_KEY="your-resend-api-key"
   RESEND_FROM_EMAIL="noreply@yourdomain.com"
   
   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   
   # Storage (Vercel Blob or AWS S3)
   BLOB_READ_WRITE_TOKEN="your-blob-token"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # Seed the database
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

### Project Structure

```
afya-wellness/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   ├── (portal)/                 # Client portal (authenticated)
│   ├── (public)/                 # Public pages
│   ├── admin/                    # Admin panel
│   ├── actions/                  # Server Actions
│   └── api/                      # API routes
├── components/                   # React components
│   ├── ui/                       # Base UI components
│   ├── forms/                    # Form components
│   ├── admin/                    # Admin-specific components
│   └── [feature]/                # Feature-specific components
├── lib/                          # Utilities and services
│   ├── db/                       # Database client & queries
│   ├── auth/                     # Authentication config
│   ├── email/                    # Email service
│   ├── pdf/                      # PDF generation
│   ├── assessments/              # Assessment modules
│   └── utils/                    # Helper functions
├── prisma/                       # Database schema & migrations
├── public/                       # Static assets
└── types/                        # TypeScript type definitions
```

## Architecture Overview

### Technology Stack

**Frontend**
- Next.js 14+ (App Router with React Server Components)
- TypeScript
- Tailwind CSS
- Radix UI primitives

**Backend**
- Next.js API Routes & Server Actions
- PostgreSQL with Prisma ORM
- NextAuth.js v5 for authentication

**External Services**
- Stripe for payments
- Resend for email
- Vercel Blob for file storage

### Design Principles

1. **Server Components First**: Use React Server Components by default for better performance
2. **Progressive Enhancement**: Core functionality works without JavaScript
3. **Type Safety**: TypeScript throughout the codebase
4. **Modular Architecture**: Independent, composable components
5. **Accessibility First**: WCAG 2.1 AA compliance

### Key Architectural Decisions

**Why Next.js App Router?**
- Server Components reduce client-side JavaScript
- Built-in routing and layouts
- Server Actions for mutations without API routes
- Excellent performance out of the box

**Why Prisma?**
- Type-safe database access
- Automatic migrations
- Great developer experience
- Connection pooling built-in

**Why NextAuth.js?**
- Industry-standard authentication
- Multiple provider support
- Session management
- Security best practices

## Development Workflow

### Branch Strategy

- `main` - Production branch
- `develop` - Development branch
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches

### Commit Convention

Follow conventional commits:
```
feat: add user profile page
fix: resolve login redirect issue
docs: update API documentation
test: add tests for assessment module
refactor: simplify packet generation logic
```

### Code Style

- Use ESLint and Prettier (configured)
- Run before committing:
  ```bash
  npm run lint
  npm run format
  ```

### Adding New Features

1. Create a feature branch
2. Implement the feature
3. Write tests
4. Update documentation
5. Create a pull request
6. Code review
7. Merge to develop

## API Documentation

### Server Actions

Server Actions are the preferred way to handle mutations. They're defined in `app/actions/`.

#### Authentication Actions

**File**: `app/actions/auth.ts`

```typescript
// Login user
async function loginUser(credentials: { email: string; password: string })

// Request password reset
async function requestPasswordReset(email: string)

// Reset password with token
async function resetPassword(token: string, newPassword: string)

// Setup new account
async function setupAccount(token: string, data: SetupData)
```

#### Assessment Actions

**File**: `app/actions/assessments.ts`

```typescript
// Get user assessments
async function getUserAssessments(userId: string)

// Save assessment progress
async function saveAssessment(data: AssessmentData)

// Complete assessment
async function completeAssessment(assessmentId: string)
```

#### Packet Actions

**File**: `app/actions/packet-generation.ts`

```typescript
// Generate packet from assessment
async function generatePacket(assessmentId: string)

// Get user packets
async function getUserPackets(userId: string)
```

#### Admin Actions

**File**: `app/actions/user-management.ts`

```typescript
// Create new user
async function createUser(data: CreateUserData)

// Update user
async function updateUser(userId: string, data: UpdateUserData)

// Get all users
async function getAllUsers(filters?: UserFilters)
```

### REST API Endpoints

#### Public Endpoints

```
GET  /api/programs              # List all programs
GET  /api/programs/[id]         # Get program details
GET  /api/products              # List all products
GET  /api/products/[id]         # Get product details
POST /api/contact               # Submit contact form
POST /api/gear-drive            # Submit gear drive donation
```

#### Authenticated Endpoints

```
GET  /api/packets/[packetId]/download    # Download packet PDF
POST /api/checkout                        # Create Stripe checkout session
```

#### Webhook Endpoints

```
POST /api/webhooks/stripe       # Stripe webhook handler
```

### API Response Format

**Success Response**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "fields": {
      "fieldName": "Field-specific error"
    }
  }
}
```

## Database Schema

### Core Models

#### User
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String
  role          Role      @default(USER)
  status        UserStatus @default(PENDING)
  population    Population?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  assessments   Assessment[]
  packets       Packet[]
  orders        Order[]
  savedTools    SavedTool[]
}

enum Role {
  USER
  ADMIN
  SUPER_ADMIN
}

enum UserStatus {
  PENDING
  ACTIVE
  INACTIVE
  SUSPENDED
}

enum Population {
  GENERAL
  ATHLETE
  YOUTH
  RECOVERY
  PREGNANCY
  POSTPARTUM
  OLDER_ADULT
  CHRONIC_CONDITION
}
```

#### Assessment
```prisma
model Assessment {
  id          String   @id @default(cuid())
  userId      String
  type        AssessmentType
  data        Json
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user        User     @relation(fields: [userId], references: [id])
  packets     Packet[]
}

enum AssessmentType {
  GENERAL
  NUTRITION
  TRAINING
  PERFORMANCE
  YOUTH
  RECOVERY
  LIFESTYLE
}
```

#### Packet
```prisma
model Packet {
  id            String       @id @default(cuid())
  userId        String
  assessmentId  String?
  type          PacketType
  status        PacketStatus @default(DRAFT)
  version       Int          @default(1)
  fileUrl       String?
  data          Json
  publishedAt   DateTime?
  publishedBy   String?
  lastModifiedBy String?
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
  
  user          User         @relation(fields: [userId], references: [id])
  assessment    Assessment?  @relation(fields: [assessmentId], references: [id])
  versions      PacketVersion[]
}

enum PacketStatus {
  DRAFT
  UNPUBLISHED
  PUBLISHED
  ARCHIVED
}
```

### Database Queries

Common queries are in `lib/db/queries.ts` and `lib/db/cached-queries.ts`.

**Example: Get user with packets**
```typescript
import { prisma } from '@/lib/db'

const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    packets: {
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' }
    }
  }
})
```

### Migrations

```bash
# Create a new migration
npx prisma migrate dev --name description_of_changes

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## Authentication & Authorization

### NextAuth Configuration

Configuration is in `lib/auth/config.ts`.

### Session Management

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

// In Server Components or API routes
const session = await getServerSession(authOptions)

if (!session) {
  redirect('/login')
}
```

### Role-Based Access Control

```typescript
import { requireAuth, requireAdmin } from '@/lib/auth/session'

// Require any authenticated user
const user = await requireAuth()

// Require admin role
const admin = await requireAdmin()
```

### Protected Routes

Use middleware for route protection (`middleware.ts`):

```typescript
export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/assessments/:path*'
  ]
}
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run E2E tests
npm run test:e2e

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure

**Unit Tests**: `*.test.ts` or `*.test.tsx` files
- Utility functions
- Helper functions
- Validation schemas

**Component Tests**: `__tests__` directories
- UI components
- Form components
- Feature components

**Integration Tests**: `app/actions/__tests__/`
- Server Actions
- API routes
- Database operations

**E2E Tests**: `e2e/` directory
- Critical user flows
- Authentication flows
- Purchase flows

### Writing Tests

**Example Unit Test**
```typescript
import { describe, it, expect } from 'vitest'
import { validateEmail } from '@/lib/utils/validation'

describe('validateEmail', () => {
  it('should validate correct email', () => {
    expect(validateEmail('test@example.com')).toBe(true)
  })
  
  it('should reject invalid email', () => {
    expect(validateEmail('invalid')).toBe(false)
  })
})
```

**Example Component Test**
```typescript
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

## Deployment

### Vercel Deployment

1. **Connect Repository**
   - Link GitHub repository to Vercel
   - Configure build settings

2. **Environment Variables**
   - Add all production environment variables in Vercel dashboard
   - Ensure `NEXTAUTH_URL` points to production domain

3. **Database**
   - Use Vercel Postgres or external PostgreSQL
   - Run migrations: `npx prisma migrate deploy`

4. **Deploy**
   ```bash
   git push origin main
   ```
   Vercel automatically deploys on push to main

### Environment-Specific Configuration

**Development**: `.env.local`
**Preview**: Vercel preview environment variables
**Production**: Vercel production environment variables

### Post-Deployment Checklist

- [ ] Verify database migrations applied
- [ ] Test authentication flow
- [ ] Test payment processing
- [ ] Verify email sending
- [ ] Check error tracking (Sentry)
- [ ] Monitor performance metrics
- [ ] Test critical user flows

## Troubleshooting

### Common Issues

**Database Connection Errors**
```bash
# Check DATABASE_URL is correct
# Verify database is running
# Regenerate Prisma client
npx prisma generate
```

**Authentication Issues**
```bash
# Verify NEXTAUTH_SECRET is set
# Check NEXTAUTH_URL matches your domain
# Clear browser cookies and try again
```

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Type Errors**
```bash
# Regenerate Prisma types
npx prisma generate

# Check TypeScript
npm run type-check
```

### Debugging

**Enable Debug Logging**
```env
# .env.local
DEBUG=true
NEXTAUTH_DEBUG=true
```

**Check Logs**
- Development: Console output
- Production: Vercel logs or Sentry

### Getting Help

- Check existing documentation
- Search GitHub issues
- Contact the development team
- Review Sentry error reports

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Stripe Documentation](https://stripe.com/docs)

## Contributing

1. Follow the code style guide
2. Write tests for new features
3. Update documentation
4. Submit pull requests for review
5. Ensure CI passes before merging

---

**Last Updated**: November 2025
**Maintainer**: AFYA Development Team
