#!/bin/bash

# Production Database Setup Script
# Run this script to set up the production database

set -e

echo "🗄️  AFYA Wellness - Production Database Setup"
echo "============================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}Error: DATABASE_URL environment variable is not set${NC}"
    echo ""
    echo "Please set your production database URL:"
    echo "  export DATABASE_URL='postgresql://user:password@host:5432/database'"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓${NC} DATABASE_URL is set"
echo ""

# Confirm production database
echo -e "${YELLOW}⚠ WARNING: This will modify your production database${NC}"
echo ""
echo "Database URL: ${DATABASE_URL:0:30}..."
echo ""
read -p "Are you sure you want to continue? (yes/no): " -r
echo ""

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Aborted."
    exit 1
fi

echo "1. Generating Prisma Client..."
echo "-------------------------------"
npx prisma generate
echo -e "${GREEN}✓${NC} Prisma Client generated"
echo ""

echo "2. Running Database Migrations..."
echo "----------------------------------"
npx prisma migrate deploy
echo -e "${GREEN}✓${NC} Migrations completed"
echo ""

echo "3. Checking Migration Status..."
echo "--------------------------------"
npx prisma migrate status
echo ""

# Ask if user wants to seed the database
read -p "Do you want to seed the database with initial data? (yes/no): " -r
echo ""

if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "4. Seeding Database..."
    echo "----------------------"
    npx prisma db seed
    echo -e "${GREEN}✓${NC} Database seeded"
    echo ""
fi

echo "5. Verifying Database Connection..."
echo "------------------------------------"
if npx prisma db pull --force; then
    echo -e "${GREEN}✓${NC} Database connection verified"
else
    echo -e "${RED}✗${NC} Database connection failed"
    exit 1
fi
echo ""

echo "============================================="
echo -e "${GREEN}✓ Production database setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Verify tables in Prisma Studio: npx prisma studio"
echo "2. Test database connection from your application"
echo "3. Configure database backups"
echo "4. Set up monitoring and alerts"
echo ""
