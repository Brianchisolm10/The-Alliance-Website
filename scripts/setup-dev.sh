#!/bin/bash

# AFYA Wellness Development Setup Script

set -e

echo "🚀 Setting up AFYA Wellness development environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "DATABASE_URL=\"postgresql://afya:afya_dev_password@localhost:5432/afya_wellness\"" >> .env.local
    echo "✅ Created .env.local - Please update with your API keys"
else
    echo "✅ .env.local already exists"
fi

# Start database
echo "🐘 Starting PostgreSQL database..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "📊 Pushing database schema..."
npx prisma db push

# Seed database
echo "🌱 Seeding database with sample data..."
npx prisma db seed

echo ""
echo "✨ Setup complete! You can now:"
echo "   1. Update your .env.local with API keys (Stripe, email, etc.)"
echo "   2. Run 'npm run dev' to start the development server"
echo "   3. Visit http://localhost:3000"
echo ""
echo "📚 Useful commands:"
echo "   - npm run dev          Start development server"
echo "   - npx prisma studio    Open database GUI"
echo "   - docker-compose down  Stop database"
echo ""
