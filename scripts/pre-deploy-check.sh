#!/bin/bash

# Pre-Deployment Checklist Script
# Run this script before deploying to production

set -e

echo "🚀 AFYA Wellness - Pre-Deployment Checklist"
echo "==========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track failures
FAILURES=0

# Function to check command
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is not installed"
        FAILURES=$((FAILURES + 1))
        return 1
    fi
}

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1 not found"
        FAILURES=$((FAILURES + 1))
        return 1
    fi
}

# Function to check environment variable
check_env() {
    if [ -z "${!1}" ]; then
        echo -e "${YELLOW}⚠${NC} $1 is not set"
        return 1
    else
        echo -e "${GREEN}✓${NC} $1 is set"
        return 0
    fi
}

echo "1. Checking Prerequisites..."
echo "----------------------------"
check_command "node"
check_command "npm"
check_command "git"
check_command "npx"
echo ""

echo "2. Checking Project Files..."
echo "----------------------------"
check_file "package.json"
check_file "next.config.js"
check_file "prisma/schema.prisma"
check_file ".env.example"
check_file "vercel.json"
echo ""

echo "3. Running Type Check..."
echo "------------------------"
if npm run type-check; then
    echo -e "${GREEN}✓${NC} TypeScript compilation successful"
else
    echo -e "${RED}✗${NC} TypeScript compilation failed"
    FAILURES=$((FAILURES + 1))
fi
echo ""

echo "4. Running Linter..."
echo "--------------------"
if npm run lint; then
    echo -e "${GREEN}✓${NC} Linting passed"
else
    echo -e "${RED}✗${NC} Linting failed"
    FAILURES=$((FAILURES + 1))
fi
echo ""

echo "5. Running Tests..."
echo "-------------------"
if npm run test; then
    echo -e "${GREEN}✓${NC} All tests passed"
else
    echo -e "${RED}✗${NC} Some tests failed"
    FAILURES=$((FAILURES + 1))
fi
echo ""

echo "6. Checking Build..."
echo "--------------------"
if npm run build; then
    echo -e "${GREEN}✓${NC} Build successful"
else
    echo -e "${RED}✗${NC} Build failed"
    FAILURES=$((FAILURES + 1))
fi
echo ""

echo "7. Checking Git Status..."
echo "-------------------------"
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✓${NC} Working directory clean"
else
    echo -e "${YELLOW}⚠${NC} Uncommitted changes detected"
    git status --short
fi
echo ""

echo "8. Checking Git Branch..."
echo "-------------------------"
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
    echo -e "${GREEN}✓${NC} On main branch: $CURRENT_BRANCH"
else
    echo -e "${YELLOW}⚠${NC} Not on main branch: $CURRENT_BRANCH"
fi
echo ""

echo "9. Production Environment Variables Check..."
echo "--------------------------------------------"
echo "Note: These should be set in Vercel, not locally"
echo ""
echo "Required variables:"
echo "  - DATABASE_URL"
echo "  - NEXTAUTH_URL"
echo "  - NEXTAUTH_SECRET"
echo "  - EMAIL_FROM"
echo "  - RESEND_API_KEY"
echo "  - NEXT_PUBLIC_STRIPE_PUBLIC_KEY"
echo "  - STRIPE_SECRET_KEY"
echo "  - STRIPE_WEBHOOK_SECRET"
echo "  - BLOB_READ_WRITE_TOKEN"
echo "  - NEXT_PUBLIC_APP_URL"
echo ""

echo "10. Security Checklist..."
echo "-------------------------"
echo "Manual verification required:"
echo "  [ ] NEXTAUTH_SECRET is strong and unique"
echo "  [ ] Database uses SSL connections"
echo "  [ ] Stripe webhook signatures configured"
echo "  [ ] CSRF protection enabled"
echo "  [ ] Rate limiting configured"
echo "  [ ] Security headers set in next.config.js"
echo "  [ ] No sensitive data in logs"
echo "  [ ] Admin routes protected"
echo ""

echo "11. Performance Checklist..."
echo "----------------------------"
echo "Manual verification required:"
echo "  [ ] Images optimized with next/image"
echo "  [ ] Code splitting implemented"
echo "  [ ] Database queries optimized"
echo "  [ ] Caching strategies in place"
echo "  [ ] Lighthouse score > 90"
echo ""

echo "12. Accessibility Checklist..."
echo "-------------------------------"
echo "Manual verification required:"
echo "  [ ] WCAG 2.1 AA compliance verified"
echo "  [ ] Keyboard navigation tested"
echo "  [ ] Screen reader compatibility tested"
echo "  [ ] Color contrast ratios meet standards"
echo ""

echo "==========================================="
if [ $FAILURES -eq 0 ]; then
    echo -e "${GREEN}✓ All automated checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review manual checklists above"
    echo "2. Ensure all environment variables are set in Vercel"
    echo "3. Run database migrations on production"
    echo "4. Deploy to Vercel"
    echo ""
    exit 0
else
    echo -e "${RED}✗ $FAILURES check(s) failed${NC}"
    echo ""
    echo "Please fix the issues above before deploying."
    echo ""
    exit 1
fi
