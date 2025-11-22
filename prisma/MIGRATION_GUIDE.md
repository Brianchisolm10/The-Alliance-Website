# Database Migration Guide

## Initial Setup

### 1. Set up your database

You have several options for setting up a PostgreSQL database:

#### Option A: Local PostgreSQL
Install PostgreSQL locally and create a database:
```bash
createdb afya_wellness
```

Update `.env.local`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/afya_wellness"
```

#### Option B: Vercel Postgres
1. Go to your Vercel project dashboard
2. Navigate to Storage → Create Database → Postgres
3. Copy the connection string to `.env.local`

#### Option C: Supabase
1. Create a new project at https://supabase.com
2. Go to Settings → Database
3. Copy the connection string (use "Connection pooling" for production)
4. Add to `.env.local`

### 2. Run the initial migration

```bash
npx prisma migrate dev --name init
```

This will:
- Create all tables and relationships
- Generate the Prisma Client
- Apply the schema to your database

### 3. Seed the database (optional)

```bash
npx prisma db seed
```

This will create:
- A super admin account (admin@theafya.org / admin123)
- Sample impact areas
- Sample programs
- Sample testimonials

**⚠️ Important**: Change the admin password after first login!

## Creating New Migrations

When you modify the schema:

1. Update `prisma/schema.prisma`
2. Run migration:
   ```bash
   npx prisma migrate dev --name descriptive_name
   ```
3. Commit both the schema and migration files

## Production Deployment

### Deploy migrations to production:

```bash
npx prisma migrate deploy
```

This command:
- Applies pending migrations
- Does not create new migrations
- Is safe for production use

### Vercel Deployment

Add to your build command in `package.json`:
```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

## Common Commands

### View database in browser
```bash
npx prisma studio
```

### Reset database (⚠️ Development only)
```bash
npx prisma migrate reset
```

### Pull schema from existing database
```bash
npx prisma db pull
```

### Format schema file
```bash
npx prisma format
```

### Validate schema
```bash
npx prisma validate
```

## Troubleshooting

### Migration conflicts
If you have migration conflicts:
```bash
npx prisma migrate resolve --rolled-back <migration_name>
```

### Reset and start fresh (Development)
```bash
npx prisma migrate reset
npx prisma migrate dev
npx prisma db seed
```

### Connection issues
- Verify DATABASE_URL is correct
- Check database is running
- Ensure network access (for cloud databases)
- Check firewall settings

## Best Practices

1. **Always backup production data** before running migrations
2. **Test migrations** in staging environment first
3. **Use descriptive names** for migrations
4. **Never edit migration files** after they've been applied
5. **Commit migrations** with the schema changes
6. **Use transactions** for data migrations when possible

## Schema Changes Workflow

1. Make changes to `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name change_description`
3. Test the migration locally
4. Commit schema + migration files
5. Deploy to staging and test
6. Deploy to production with `prisma migrate deploy`

## Data Migrations

For complex data transformations, create a separate script:

```typescript
// scripts/migrate-data.ts
import { prisma } from '@/lib/db'

async function migrateData() {
  // Your data transformation logic
}

migrateData()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Run with:
```bash
tsx scripts/migrate-data.ts
```
