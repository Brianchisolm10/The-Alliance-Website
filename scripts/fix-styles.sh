#!/bin/bash

# Script to fix styling issues by clearing Next.js cache and rebuilding

echo "🔧 Fixing styling issues..."
echo ""

# Stop any running dev servers
echo "1. Checking for running processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
echo "✓ Cleared port 3000"
echo ""

# Remove Next.js cache
echo "2. Clearing Next.js cache..."
rm -rf .next
echo "✓ Removed .next directory"
echo ""

# Remove node_modules/.cache
echo "3. Clearing node_modules cache..."
rm -rf node_modules/.cache
echo "✓ Removed node_modules/.cache"
echo ""

# Reinstall dependencies (optional, uncomment if needed)
# echo "4. Reinstalling dependencies..."
# npm install
# echo "✓ Dependencies reinstalled"
# echo ""

echo "✅ Done! Now run: npm run dev"
echo ""
