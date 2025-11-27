# AFYA Wellness Platform - Deployment Guide

This guide covers deploying the AFYA Wellness Platform to production on Vercel.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Production Environment Setup](#production-environment-setup)
3. [Database Configuration](#database-configuration)
4. [Environment Variables](#environment-variables)
5. [Vercel Deployment](#vercel-deployment)
6. [Domain and SSL Configuration](#domain-and-ssl-configuration)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Monitoring and Maintenance](#monitoring-and-maintenance)
9. [Rollback Procedures](#rollback-procedures)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying to production, ensure you have:

- [ ] GitHub repository with the latest code
- [ ] Vercel account (free or pro)
- [ ] Production database (Vercel Postgres or external PostgreSQL)
- [ ] Domain name configured (e.g., theafya.org)
- [ ] Stripe account with production keys
- [ ] Resend or SendGrid account for emails
- [ ] Sentry account for error monitoring (optional but recommended)

## Production Environment Setup

### 1. Database Configuration

#### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Navigate to Storage → Create Database → Postgres
3. Select your region (closest to your users)
4. Copy the `DATABASE_URL` connection string
5. The connection string will be automatically added to your environment variables

#### Option B: External PostgreSQL

1. Set up a PostgreSQL database with your provider (AWS RDS, DigitalOcean, etc.)
2. Ensure SSL is enabled
3. Configure connection pooling (recommended: 10-20 connections)
4. Note the connection string format:
   ```
   postgresql://user:password@host:5432/database?sslmode=require&connection_limit=10&pool_timeout=10
   ```

### 2. Run Database Migrations

After setting up your production database:

```bash
# Set the production DATABASE_URL
export DATABASE_URL="your_production_database_url"

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed initial data (optional)
npx prisma db seed
```

### 3. Verify Database Setup

```bash
# Check database connection
npx prisma db pull

# View database in Prisma Studio
npx prisma studio
```

## Environment Variables

### Required Environment Variables

Copy `.env.production.example` and configure the following variables:

#### Authentication
```bash
NEXTAUTH_URL="https://theafya.org"
NEXTAUTH_SECRET="<generate with: openssl rand -base64 32>"
```

#### Database
```bash
DATABASE_URL="postgresql://..."
```

#### Email Service
```bash
EMAIL_FROM="noreply@theafya.org"
RESEND_API_KEY="re_..."
```

#### Stripe Payment Processing
```bash
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

#### File Storage
```bash
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

#### Monitoring
```bash
SENTRY_DSN="https://...@sentry.io/..."
NEXT_PUBLIC_SENTRY_DSN="https://...@sentry.io/..."
```

#### Application
```bash
NEXT_PUBLIC_APP_URL="https://theafya.org"
NEXT_PUBLIC_CALENDLY_URL="https://calendly.com/afya-wellness/discovery-call"
```

### Setting Environment Variables in Vercel

1. Go to your Vercel project settings
2. Navigate to Settings → Environment Variables
3. Add each variable with the appropriate value
4. Select the environment: Production, Preview, or Development
5. Click "Save"

**Important:** Use Vercel's encrypted environment variables for sensitive data.

## Vercel Deployment

### Initial Deployment

#### Step 1: Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the repository: `afya-wellness`

#### Step 2: Configure Build Settings

Vercel will auto-detect Next.js. Verify these settings:

- **Framework Preset:** Next.js
- **Root Directory:** `./` (leave empty if at root)
- **Build Command:** `prisma generate && next build`
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install`

#### Step 3: Add Environment Variables

Add all production environment variables from the previous section.

#### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete (typically 2-5 minutes)
3. Vercel will provide a deployment URL

### Subsequent Deployments

Vercel automatically deploys on every push to your main branch:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### Preview Deployments

Every pull request gets a preview deployment:

1. Create a feature branch
2. Push changes
3. Open a pull request
4. Vercel creates a preview URL
5. Test changes before merging

## Domain and SSL Configuration

### Step 1: Add Custom Domain

1. Go to your Vercel project
2. Navigate to Settings → Domains
3. Add your domain: `theafya.org`
4. Add www subdomain: `www.theafya.org`

### Step 2: Configure DNS

Add these DNS records with your domain provider:

**For apex domain (theafya.org):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: SSL Certificate

Vercel automatically provisions SSL certificates via Let's Encrypt:

- Certificates are auto-renewed
- HTTPS is enforced by default
- HTTP automatically redirects to HTTPS

### Step 4: Verify Domain

1. Wait for DNS propagation (up to 48 hours, usually minutes)
2. Vercel will verify domain ownership
3. SSL certificate will be issued automatically
4. Your site will be live at `https://theafya.org`

## Post-Deployment Verification

### Automated Checks

Run these checks after deployment:

```bash
# Check if site is accessible
curl -I https://theafya.org

# Verify SSL certificate
openssl s_client -connect theafya.org:443 -servername theafya.org

# Check security headers
curl -I https://theafya.org | grep -E "Strict-Transport-Security|X-Frame-Options|X-Content-Type-Options"
```

### Manual Testing Checklist

- [ ] Home page loads correctly
- [ ] Navigation works across all pages
- [ ] User authentication (login/logout)
- [ ] Discovery form submission
- [ ] Assessment completion
- [ ] Packet generation and download
- [ ] Shop checkout flow
- [ ] Donation processing
- [ ] Admin panel access
- [ ] Email notifications
- [ ] Mobile responsiveness
- [ ] Performance (Lighthouse score > 90)

### Database Verification

```bash
# Connect to production database
npx prisma studio --browser none

# Verify tables exist
npx prisma db pull

# Check for any migration issues
npx prisma migrate status
```

### Third-Party Service Verification

- [ ] Stripe webhooks configured and receiving events
- [ ] Email service sending successfully
- [ ] File storage working (upload/download)
- [ ] Sentry receiving error reports
- [ ] Analytics tracking properly

## Monitoring and Maintenance

### Vercel Analytics

1. Enable Vercel Analytics in project settings
2. Monitor Web Vitals:
   - Largest Contentful Paint (LCP)
   - First Input Delay (FID)
   - Cumulative Layout Shift (CLS)
3. Track page views and user behavior

### Sentry Error Monitoring

1. Verify Sentry is receiving errors
2. Set up alerts for critical errors
3. Configure error grouping and filtering
4. Review error trends weekly

### Performance Monitoring

Monitor these metrics:

- **Response Times:** API routes should respond < 500ms
- **Error Rates:** Keep below 1%
- **Database Performance:** Query times < 100ms
- **Build Times:** Should stay under 5 minutes
- **Bundle Size:** Monitor for unexpected increases

### Database Maintenance

```bash
# Weekly: Check database size
npx prisma db execute --stdin <<< "SELECT pg_size_pretty(pg_database_size('afya_wellness_prod'));"

# Monthly: Analyze query performance
# Review slow query logs in your database provider

# Quarterly: Review and optimize indexes
# Check for unused indexes and missing indexes
```

### Backup Strategy

1. **Database Backups:**
   - Automated daily backups (Vercel Postgres includes this)
   - Test restore procedure monthly
   - Keep backups for 30 days minimum

2. **Code Backups:**
   - GitHub serves as primary backup
   - Tag releases: `git tag v1.0.0 && git push --tags`

3. **Environment Variables:**
   - Keep encrypted backup of all environment variables
   - Store securely (1Password, AWS Secrets Manager, etc.)

## Rollback Procedures

### Instant Rollback (Vercel)

If a deployment causes issues:

1. Go to Vercel dashboard
2. Navigate to Deployments
3. Find the last working deployment
4. Click "..." → "Promote to Production"
5. Confirm rollback

### Database Rollback

If a migration causes issues:

```bash
# Revert last migration
npx prisma migrate resolve --rolled-back <migration_name>

# Apply previous migration
npx prisma migrate deploy
```

### Code Rollback (Git)

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit (use with caution)
git reset --hard <commit_hash>
git push --force origin main
```

## Troubleshooting

### Build Failures

**Issue:** Build fails with "Module not found"
```bash
# Solution: Clear cache and rebuild
vercel --force
```

**Issue:** Prisma client generation fails
```bash
# Solution: Ensure DATABASE_URL is set
# Add to build command: prisma generate && next build
```

### Runtime Errors

**Issue:** 500 Internal Server Error
1. Check Vercel logs: `vercel logs`
2. Check Sentry for error details
3. Verify environment variables are set
4. Check database connection

**Issue:** Database connection timeout
1. Verify DATABASE_URL is correct
2. Check connection pool settings
3. Ensure database is accessible from Vercel
4. Review database provider status

### Performance Issues

**Issue:** Slow page loads
1. Check Vercel Analytics for bottlenecks
2. Review database query performance
3. Check for large bundle sizes
4. Verify CDN caching is working

**Issue:** High error rates
1. Check Sentry for error patterns
2. Review recent deployments
3. Check third-party service status
4. Monitor database performance

### SSL/Domain Issues

**Issue:** SSL certificate not provisioning
1. Verify DNS records are correct
2. Wait for DNS propagation (up to 48 hours)
3. Check domain ownership verification
4. Contact Vercel support if persists

**Issue:** Domain not resolving
1. Verify DNS records with `dig theafya.org`
2. Check domain registrar settings
3. Ensure nameservers are correct
4. Wait for DNS propagation

## Security Checklist

Before going live, verify:

- [ ] All environment variables are set correctly
- [ ] NEXTAUTH_SECRET is strong and unique
- [ ] Database uses SSL connections
- [ ] Stripe webhook signatures are verified
- [ ] CSRF protection is enabled
- [ ] Rate limiting is configured
- [ ] Security headers are set (check next.config.js)
- [ ] No sensitive data in logs
- [ ] Admin routes are protected
- [ ] File uploads are validated and sanitized

## Performance Checklist

- [ ] Images optimized with next/image
- [ ] Code splitting implemented
- [ ] Database queries optimized
- [ ] Caching strategies in place
- [ ] CDN configured for static assets
- [ ] Lighthouse score > 90 (desktop and mobile)
- [ ] Core Web Vitals passing
- [ ] Bundle size optimized

## Compliance Checklist

- [ ] WCAG 2.1 AA accessibility compliance
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Cookie consent (if applicable)
- [ ] GDPR compliance (if serving EU users)
- [ ] Data retention policies documented

## Support and Resources

- **Vercel Documentation:** https://vercel.com/docs
- **Next.js Documentation:** https://nextjs.org/docs
- **Prisma Documentation:** https://www.prisma.io/docs
- **Stripe Documentation:** https://stripe.com/docs
- **Sentry Documentation:** https://docs.sentry.io

## Emergency Contacts

- **Technical Lead:** [Contact Information]
- **DevOps:** [Contact Information]
- **Vercel Support:** support@vercel.com
- **Database Provider:** [Support Contact]

---

**Last Updated:** November 23, 2025
**Version:** 1.0.0
