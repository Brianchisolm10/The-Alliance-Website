#!/bin/bash

# Bundle Size Analysis Script
# Analyzes Next.js bundle size and provides optimization recommendations

echo "🔍 Analyzing bundle size..."
echo ""

# Check if build exists
if [ ! -d ".next" ]; then
  echo "❌ No build found. Running production build..."
  npm run build
fi

echo "📊 Bundle Size Report"
echo "===================="
echo ""

# Get build output
BUILD_OUTPUT=$(npm run build 2>&1)

# Extract key metrics
echo "📦 JavaScript Bundles:"
echo "$BUILD_OUTPUT" | grep -E "\.js.*kB" | head -10

echo ""
echo "🎨 CSS Bundles:"
echo "$BUILD_OUTPUT" | grep -E "\.css.*kB"

echo ""
echo "📈 Page Sizes:"
echo "$BUILD_OUTPUT" | grep -E "○|●|λ" | head -15

echo ""
echo "💡 Optimization Tips:"
echo "===================="
echo ""

# Check for large bundles
LARGE_BUNDLES=$(echo "$BUILD_OUTPUT" | grep -E "\.js.*[0-9]{3,} kB")
if [ ! -z "$LARGE_BUNDLES" ]; then
  echo "⚠️  Large bundles detected (>100KB):"
  echo "$LARGE_BUNDLES"
  echo ""
  echo "   Consider:"
  echo "   - Dynamic imports for heavy components"
  echo "   - Code splitting by route"
  echo "   - Removing unused dependencies"
  echo ""
fi

# Check for duplicate dependencies
echo "🔍 Checking for duplicate dependencies..."
if command -v npx &> /dev/null; then
  DUPLICATES=$(npx npm-check-duplicates 2>/dev/null || echo "")
  if [ ! -z "$DUPLICATES" ]; then
    echo "⚠️  Duplicate dependencies found:"
    echo "$DUPLICATES"
    echo ""
  else
    echo "✅ No duplicate dependencies found"
    echo ""
  fi
fi

# Size recommendations
echo "📏 Size Targets:"
echo "   - Initial JS: < 200KB (gzipped)"
echo "   - CSS: < 50KB (gzipped)"
echo "   - Total page: < 1MB"
echo ""

# Performance recommendations
echo "🚀 Performance Recommendations:"
echo "   1. Use dynamic imports for non-critical components"
echo "   2. Optimize images with next/image"
echo "   3. Enable compression (gzip/brotli)"
echo "   4. Implement code splitting"
echo "   5. Remove unused dependencies"
echo "   6. Use tree-shaking friendly imports"
echo ""

echo "✅ Analysis complete!"
echo ""
echo "For detailed analysis, run:"
echo "   npm install -g @next/bundle-analyzer"
echo "   ANALYZE=true npm run build"
