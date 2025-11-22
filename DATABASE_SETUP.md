# Database Setup Guide

## Quick Setup

The shop implementation requires a PostgreSQL database. Follow these steps to set it up:

### Option 1: Using Docker (Recommended)

1. Create a `docker-compose.yml` file in the project root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: afya-postgres
    environment:
      POSTGRES_USER: afya
      POSTGRES_PASSWORD: afya_dev_password
      POSTGRES_DB: afya_wellness
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

2. Start the database:

```bash
docker-compose up -d
```

3. Update your `.env.local` file:

```bash
DATABASE_URL="postgresql://afya:afya_dev_password@localhost:5432/afya_wellness"
```

### Option 2: Local PostgreSQL Installation

1. Install PostgreSQL on your system:
   - **macOS**: `brew install postgresql@16`
   - **Ubuntu**: `sudo apt-get install postgresql-16`
   - **Windows**: Download from https://www.postgresql.org/download/

2. Create the database:

```bash
createdb afya_wellness
```

3. Update your `.env.local` file with your connection string:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/afya_wellness"
```

## Running Migrations

After setting up the database, run the migrations:

```bash
# Push the schema to the database
npx prisma db push

# Or create and run migrations
npx prisma migrate dev --name init
```

## Seeding the Database

Populate the database with sample data including products:

```bash
npm run prisma:seed
```

This will create:
- Admin user (admin@theafya.org / admin123)
- 4 Impact areas
- 3 Sample programs
- 2 Testimonials
- 6 Sample products for the shop

## Verify Setup

Check that everything is working:

```bash
# Check migration status
npx prisma migrate status

# Open Prisma Studio to view data
npx prisma studio
```

## Troubleshooting

### "Can't reach database server"

- Ensure PostgreSQL is running
- Check your DATABASE_URL in `.env.local`
- Verify the port is correct (default: 5432)

### "Database does not exist"

```bash
# Create the database
createdb afya_wellness

# Or using psql
psql -U postgres -c "CREATE DATABASE afya_wellness;"
```

### "Role does not exist"

```bash
# Create the user
psql -U postgres -c "CREATE USER afya WITH PASSWORD 'afya_dev_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE afya_wellness TO afya;"
```

## Production Setup

For production, use a managed PostgreSQL service:

- **Vercel**: Vercel Postgres
- **AWS**: RDS PostgreSQL
- **Heroku**: Heroku Postgres
- **Supabase**: Supabase Database
- **Railway**: Railway PostgreSQL

Update your production `DATABASE_URL` environment variable accordingly.
