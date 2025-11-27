import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Filter out sensitive data
  beforeSend(event, _hint) {
    // Don't send events if DSN is not configured
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
      return null
    }
    
    // Filter out sensitive information from breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
        if (breadcrumb.data) {
          // Remove sensitive fields
          const sensitiveFields = ['password', 'token', 'apiKey', 'secret']
          sensitiveFields.forEach((field) => {
            if (breadcrumb.data && field in breadcrumb.data) {
              breadcrumb.data[field] = '[Filtered]'
            }
          })
        }
        return breadcrumb
      })
    }
    
    return event
  },
  
  // Set environment
  environment: process.env.NODE_ENV,
})
