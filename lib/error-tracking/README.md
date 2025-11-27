# Error Tracking with Sentry

This directory contains utilities for error tracking and monitoring using Sentry.

## Setup

1. **Install Sentry** (already done):
   ```bash
   npm install @sentry/nextjs
   ```

2. **Configure Environment Variables**:
   Add your Sentry DSN to `.env.local`:
   ```
   NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
   ```

3. **Sentry Configuration Files**:
   - `sentry.client.config.ts` - Client-side error tracking
   - `sentry.server.config.ts` - Server-side error tracking
   - `sentry.edge.config.ts` - Edge runtime error tracking

## Usage

### Automatic Error Tracking

Errors are automatically captured in:
- React components (via Error Boundaries)
- API routes
- Server actions
- Edge functions

### Manual Error Logging

```typescript
import { logError, logMessage } from '@/lib/error-tracking'

// Log an error with context
try {
  // Your code
} catch (error) {
  logError(error as Error, {
    user: {
      id: userId,
      email: userEmail,
      role: userRole,
    },
    tags: {
      feature: 'authentication',
      action: 'login',
    },
    extra: {
      attemptCount: 3,
    },
  })
}

// Log a message
logMessage('User completed onboarding', 'info', {
  tags: { feature: 'onboarding' },
  extra: { userId: '123' },
})
```

### Set User Context

```typescript
import { setUserContext, clearUserContext } from '@/lib/error-tracking'

// After login
setUserContext({
  id: user.id,
  email: user.email,
  role: user.role,
  name: user.name,
})

// After logout
clearUserContext()
```

### Add Breadcrumbs

```typescript
import { addBreadcrumb } from '@/lib/error-tracking'

addBreadcrumb('User clicked submit button', 'user-action', {
  formId: 'discovery-form',
})
```

### Wrap Functions with Error Tracking

```typescript
import { withErrorTracking } from '@/lib/error-tracking'

const myFunction = withErrorTracking(
  async (userId: string) => {
    // Your code
  },
  {
    name: 'myFunction',
    tags: { feature: 'user-management' },
  }
)
```

### Performance Monitoring

```typescript
import { startSpan } from '@/lib/error-tracking'

const result = startSpan('Load User Data', 'http.request', () => {
  // Your code here
  return data
})
```

## Error Boundaries

Use the `ErrorBoundary` component to catch React errors:

```tsx
import { ErrorBoundary } from '@/components/ui/error-boundary'

function MyComponent() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  )
}
```

## Global Error Pages

- `app/error.tsx` - Catches errors in route segments
- `app/global-error.tsx` - Catches errors in the root layout

## Data Privacy

The Sentry configuration automatically filters sensitive data:
- Passwords
- Tokens
- API keys
- Authorization headers
- Cookies

## Environment-Specific Behavior

- **Development**: Errors are logged to console and Sentry (if DSN is configured)
- **Production**: Errors are sent to Sentry with reduced sample rates for performance

## Sample Rates

- **Traces**: 10% in production, 100% in development
- **Replays**: 10% of sessions, 100% of error sessions

## Monitoring Dashboard

Access your Sentry dashboard at: https://sentry.io/organizations/your-org/projects/

## Best Practices

1. Always provide context when logging errors
2. Use appropriate log levels (info, warning, error)
3. Set user context after authentication
4. Clear user context after logout
5. Add breadcrumbs for important user actions
6. Use error boundaries for React components
7. Don't log sensitive information (passwords, tokens, etc.)
