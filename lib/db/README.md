# Database Setup

This directory contains the database configuration and utilities for the AFYA Wellness platform.

## Setup

### 1. Configure Database URL

Set your `DATABASE_URL` in `.env.local`:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/afya_wellness"
```

### 2. Run Migrations

To create the database schema:

```bash
npx prisma migrate dev --name init
```

This will:
- Create the database if it doesn't exist
- Apply all migrations
- Generate the Prisma Client

### 3. Seed Database (Optional)

To populate the database with initial data:

```bash
npx prisma db seed
```

## Usage

### Import Prisma Client

```typescript
import { prisma } from '@/lib/db'

// Use prisma client
const users = await prisma.user.findMany()
```

### Use Query Helpers

```typescript
import { userQueries, assessmentQueries } from '@/lib/db'

// Find user by email
const user = await userQueries.findByEmail('user@example.com')

// Create assessment
const assessment = await assessmentQueries.create({
  userId: user.id,
  type: 'NUTRITION',
  data: { /* assessment data */ },
  completed: false
})
```

## Database Schema

The schema includes the following main entities:

- **User**: User accounts with role-based access
- **DiscoverySubmission**: Initial discovery form submissions
- **Assessment**: Modular assessment data
- **Packet**: Generated health packets (PDFs)
- **Program**: Wellness programs
- **Product**: Shop products
- **Order**: E-commerce orders
- **Donation**: Monetary donations
- **GearDrive**: Physical gear donations
- **ClientNote**: Internal admin notes
- **ActivityLog**: Audit trail
- **SavedToolResult**: Saved health tool calculations
- **Testimonial**: Client testimonials
- **ImpactArea**: Impact area information
- **ContactSubmission**: Contact form submissions

## Prisma Commands

### Generate Client
```bash
npx prisma generate
```

### Create Migration
```bash
npx prisma migrate dev --name migration_name
```

### Apply Migrations (Production)
```bash
npx prisma migrate deploy
```

### Reset Database (Development)
```bash
npx prisma migrate reset
```

### Open Prisma Studio
```bash
npx prisma studio
```

## Connection Pooling

The Prisma client is configured with connection pooling using `@prisma/adapter-pg` for optimal performance in serverless environments.

## Development Tips

- Use `prisma.user.findUnique()` for single record queries
- Use `prisma.user.findMany()` for multiple records
- Always use transactions for operations that modify multiple tables
- Use the query helpers in `queries.ts` for common operations
- Check the Prisma documentation for advanced queries: https://www.prisma.io/docs
