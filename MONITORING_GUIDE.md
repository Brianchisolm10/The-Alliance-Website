# AFYA Wellness Platform - Monitoring Guide

This guide covers monitoring, alerting, and maintenance procedures for the AFYA Wellness Platform in production.

## Table of Contents

1. [Monitoring Overview](#monitoring-overview)
2. [Error Monitoring with Sentry](#error-monitoring-with-sentry)
3. [Performance Monitoring](#performance-monitoring)
4. [Database Monitoring](#database-monitoring)
5. [Application Metrics](#application-metrics)
6. [Alerting and Notifications](#alerting-and-notifications)
7. [Log Management](#log-management)
8. [Health Checks](#health-checks)
9. [User Feedback Monitoring](#user-feedback-monitoring)
10. [Incident Response](#incident-response)

## Monitoring Overview

### Key Metrics to Monitor

**Application Health:**
- Error rates
- Response times
- Uptime/availability
- Request volume

**User Experience:**
- Core Web Vitals (LCP, FID, CLS)
- Page load times
- User journey completion rates
- Form submission success rates

**Business Metrics:**
- User registrations
- Discovery form submissions
- Assessment completions
- Packet generations
- Shop orders
- Donations

**Infrastructure:**
- Database performance
- API response times
- Storage usage
- Build times

## Error Monitoring with Sentry

### Setup

Sentry is already configured in the application. Verify it's working:

1. Check Sentry dashboard: https://sentry.io
2. Verify error events are being received
3. Configure alert rules

### Key Error Metrics

**Critical Errors (Alert Immediately):**
- Payment processing failures
- Database connection errors
- Authentication failures
- Email sending failures

**High Priority (Alert within 1 hour):**
- API endpoint errors (5xx)
- Form submission failures
- PDF generation errors
- File upload failures

**Medium Priority (Daily digest):**
- Client-side JavaScript errors
- Validation errors
- 404 errors (if excessive)

### Sentry Configuration

```javascript
// sentry.server.config.ts
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% of transactions
  beforeSend(event, hint) {
    // Filter out sensitive data
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers?.authorization;
    }
    return event;
  },
});
```

### Alert Rules

Configure these alert rules in Sentry:

1. **Critical Errors**
   - Condition: Any error with level "error" or "fatal"
   - Action: Slack notification + Email
   - Frequency: Immediately

2. **High Error Rate**
   - Condition: Error rate > 5% over 5 minutes
   - Action: Slack notification
   - Frequency: Once per hour

3. **New Error Types**
   - Condition: First occurrence of new error
   - Action: Email notification
   - Frequency: Immediately

## Performance Monitoring

### Vercel Analytics

Enable and monitor Web Vitals:

1. Go to Vercel Dashboard → Analytics
2. Monitor Core Web Vitals:
   - **LCP (Largest Contentful Paint):** < 2.5s
   - **FID (First Input Delay):** < 100ms
   - **CLS (Cumulative Layout Shift):** < 0.1

3. Track page performance:
   - Time to First Byte (TTFB)
   - First Contentful Paint (FCP)
   - Time to Interactive (TTI)

### Performance Targets

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| LCP | < 2.5s | 2.5-4s | > 4s |
| FID | < 100ms | 100-300ms | > 300ms |
| CLS | < 0.1 | 0.1-0.25 | > 0.25 |
| TTFB | < 600ms | 600-1000ms | > 1000ms |
| API Response | < 500ms | 500-1000ms | > 1000ms |

### Lighthouse CI

Run Lighthouse audits on every deployment:

```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run audit
lhci autorun --config=lighthouserc.json
```

Create `lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "url": ["https://theafya.org"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    }
  }
}
```

## Database Monitoring

### Key Metrics

Monitor these database metrics:

1. **Connection Pool:**
   - Active connections
   - Idle connections
   - Connection wait time

2. **Query Performance:**
   - Slow queries (> 100ms)
   - Query volume
   - Failed queries

3. **Database Size:**
   - Total database size
   - Table sizes
   - Index sizes

4. **Replication Lag:**
   - If using read replicas

### Monitoring Queries

```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('afya_wellness_prod'));

-- Find slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
WHERE mean_time > 100
ORDER BY mean_time DESC
LIMIT 10;

-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check connection count
SELECT count(*) FROM pg_stat_activity;

-- Check for locks
SELECT * FROM pg_locks WHERE NOT granted;
```

### Database Alerts

Set up alerts for:

- Connection pool exhaustion (> 80% utilization)
- Slow queries (> 1 second)
- Database size growth (> 10% per day)
- Failed connections
- Replication lag (> 10 seconds)

## Application Metrics

### Custom Metrics

Track these application-specific metrics:

```typescript
// lib/monitoring/metrics.ts
export const metrics = {
  // User metrics
  userRegistrations: 0,
  activeUsers: 0,
  
  // Assessment metrics
  assessmentsStarted: 0,
  assessmentsCompleted: 0,
  
  // Packet metrics
  packetsGenerated: 0,
  packetsDownloaded: 0,
  
  // Commerce metrics
  ordersPlaced: 0,
  orderValue: 0,
  donationsReceived: 0,
  
  // Discovery metrics
  discoveryFormsSubmitted: 0,
  discoveryCallsScheduled: 0,
};

// Increment metric
export function incrementMetric(metric: keyof typeof metrics) {
  metrics[metric]++;
  // Send to analytics service
}
```

### Analytics Dashboard

Create a custom analytics dashboard tracking:

1. **User Engagement:**
   - Daily/weekly/monthly active users
   - Session duration
   - Pages per session
   - Bounce rate

2. **Conversion Funnel:**
   - Discovery form → Call scheduled
   - Assessment started → Completed
   - Shop visit → Purchase
   - Donation page → Donation completed

3. **Feature Usage:**
   - Health tools usage
   - Assessment module popularity
   - Packet downloads
   - Admin actions

## Alerting and Notifications

### Alert Channels

Configure multiple alert channels:

1. **Slack** (Primary)
   - #alerts-critical
   - #alerts-warnings
   - #alerts-info

2. **Email** (Backup)
   - tech-team@theafya.org

3. **PagerDuty** (Critical only)
   - For on-call rotation

### Alert Severity Levels

**P0 - Critical (Immediate response required):**
- Site down
- Payment processing failure
- Database connection failure
- Data breach

**P1 - High (Response within 1 hour):**
- High error rate (> 5%)
- API endpoint failures
- Email sending failures
- Slow response times (> 2s)

**P2 - Medium (Response within 4 hours):**
- Elevated error rate (> 2%)
- Performance degradation
- Failed background jobs

**P3 - Low (Response within 24 hours):**
- Minor bugs
- UI issues
- Non-critical feature failures

### Alert Configuration

```javascript
// Example: Slack webhook for alerts
async function sendAlert(severity, message, details) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  
  const color = {
    critical: '#FF0000',
    high: '#FFA500',
    medium: '#FFFF00',
    low: '#00FF00',
  }[severity];
  
  await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      attachments: [{
        color,
        title: `[${severity.toUpperCase()}] ${message}`,
        text: details,
        footer: 'AFYA Monitoring',
        ts: Math.floor(Date.now() / 1000),
      }],
    }),
  });
}
```

## Log Management

### Log Levels

Use appropriate log levels:

```typescript
// lib/logging/index.ts
export const logger = {
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
    // Send to Sentry
  },
  
  warn: (message: string, context?: any) => {
    console.warn(`[WARN] ${message}`, context);
  },
  
  info: (message: string, context?: any) => {
    console.info(`[INFO] ${message}`, context);
  },
  
  debug: (message: string, context?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, context);
    }
  },
};
```

### Structured Logging

Use structured logs for better searchability:

```typescript
logger.info('User registered', {
  userId: user.id,
  email: user.email,
  timestamp: new Date().toISOString(),
  source: 'registration-flow',
});
```

### Log Retention

- **Production logs:** 30 days
- **Error logs:** 90 days
- **Audit logs:** 1 year
- **Access logs:** 30 days

## Health Checks

### Application Health Endpoint

Create a health check endpoint:

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      database: 'unknown',
      storage: 'unknown',
      email: 'unknown',
    },
  };

  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;
    checks.checks.database = 'healthy';
  } catch (error) {
    checks.checks.database = 'unhealthy';
    checks.status = 'unhealthy';
  }

  // Check storage
  try {
    // Verify storage access
    checks.checks.storage = 'healthy';
  } catch (error) {
    checks.checks.storage = 'unhealthy';
  }

  // Check email service
  try {
    // Verify email service
    checks.checks.email = 'healthy';
  } catch (error) {
    checks.checks.email = 'unhealthy';
  }

  const statusCode = checks.status === 'healthy' ? 200 : 503;
  return NextResponse.json(checks, { status: statusCode });
}
```

### External Monitoring

Use external monitoring services:

1. **UptimeRobot** or **Pingdom**
   - Monitor: https://theafya.org/api/health
   - Frequency: Every 5 minutes
   - Alert on: 3 consecutive failures

2. **StatusPage**
   - Public status page for users
   - Incident communication
   - Maintenance windows

## User Feedback Monitoring

### Feedback Collection

Monitor user feedback from:

1. **Contact Form Submissions**
   - Track volume and response time
   - Categorize by type

2. **Error Reports**
   - User-reported bugs
   - Feature requests

3. **Support Tickets**
   - Response time
   - Resolution time
   - Satisfaction scores

### User Behavior Analytics

Track user behavior patterns:

```typescript
// Track user actions
export function trackEvent(event: string, properties?: any) {
  // Send to analytics service
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, properties);
  }
}

// Usage
trackEvent('assessment_completed', {
  assessmentType: 'nutrition',
  duration: 300, // seconds
  userId: user.id,
});
```

## Incident Response

### Incident Response Plan

1. **Detection**
   - Alert received
   - User report
   - Monitoring system

2. **Assessment**
   - Determine severity
   - Identify affected systems
   - Estimate impact

3. **Response**
   - Assign incident commander
   - Create incident channel
   - Begin investigation

4. **Resolution**
   - Implement fix
   - Verify resolution
   - Monitor for recurrence

5. **Post-Mortem**
   - Document incident
   - Identify root cause
   - Create action items

### Incident Communication

**Internal:**
- Slack incident channel
- Status updates every 30 minutes
- Stakeholder notifications

**External:**
- Status page updates
- User notifications (if needed)
- Social media (if major outage)

### Incident Severity Matrix

| Severity | Impact | Response Time | Example |
|----------|--------|---------------|---------|
| P0 | Complete outage | Immediate | Site down |
| P1 | Major feature down | 1 hour | Payments failing |
| P2 | Minor feature down | 4 hours | Email delays |
| P3 | Cosmetic issue | 24 hours | UI bug |

## Monitoring Checklist

### Daily

- [ ] Review error rates in Sentry
- [ ] Check Vercel Analytics for anomalies
- [ ] Review database performance
- [ ] Check alert notifications
- [ ] Monitor user feedback

### Weekly

- [ ] Review performance trends
- [ ] Analyze user behavior patterns
- [ ] Check database size growth
- [ ] Review slow queries
- [ ] Update monitoring dashboards

### Monthly

- [ ] Review all monitoring metrics
- [ ] Analyze incident trends
- [ ] Update alert thresholds
- [ ] Review and optimize queries
- [ ] Conduct load testing
- [ ] Review backup procedures

### Quarterly

- [ ] Comprehensive performance audit
- [ ] Security audit
- [ ] Disaster recovery drill
- [ ] Review monitoring strategy
- [ ] Update incident response plan

## Tools and Services

### Recommended Tools

1. **Error Monitoring:** Sentry
2. **Performance:** Vercel Analytics, Lighthouse CI
3. **Uptime:** UptimeRobot, Pingdom
4. **Logs:** Vercel Logs, Datadog
5. **Database:** Prisma Studio, pgAdmin
6. **Status Page:** Statuspage.io
7. **Alerts:** Slack, PagerDuty

### Dashboard Setup

Create monitoring dashboards for:

1. **Operations Dashboard**
   - System health
   - Error rates
   - Performance metrics
   - Active incidents

2. **Business Dashboard**
   - User metrics
   - Conversion rates
   - Revenue metrics
   - Feature usage

3. **Technical Dashboard**
   - API performance
   - Database metrics
   - Build times
   - Deployment frequency

## Support

For monitoring issues:

- **Technical Lead:** [Contact]
- **DevOps:** [Contact]
- **On-Call:** [PagerDuty]

---

**Last Updated:** November 23, 2025
**Version:** 1.0.0
