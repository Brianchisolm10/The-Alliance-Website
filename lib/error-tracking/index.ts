import * as Sentry from '@sentry/nextjs'

/**
 * Log an error to Sentry with additional context
 */
export function logError(
  error: Error,
  context?: {
    user?: {
      id: string
      email?: string
      role?: string
    }
    tags?: Record<string, string>
    extra?: Record<string, any>
  }
) {
  // Don't send to Sentry if DSN is not configured
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.error('Error:', error, context)
    return
  }

  Sentry.captureException(error, {
    user: context?.user,
    tags: context?.tags,
    extra: context?.extra,
  })
}

/**
 * Log a message to Sentry
 */
export function logMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: {
    tags?: Record<string, string>
    extra?: Record<string, any>
  }
) {
  // Don't send to Sentry if DSN is not configured
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.log(`[${level}] ${message}`, context)
    return
  }

  Sentry.captureMessage(message, {
    level,
    tags: context?.tags,
    extra: context?.extra,
  })
}

/**
 * Set user context for error tracking
 */
export function setUserContext(user: {
  id: string
  email?: string
  role?: string
  name?: string
}) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return
  }

  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
    role: user.role,
  })
}

/**
 * Clear user context
 */
export function clearUserContext() {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return
  }

  Sentry.setUser(null)
}

/**
 * Add breadcrumb for tracking user actions
 */
export function addBreadcrumb(
  message: string,
  category: string,
  data?: Record<string, any>
) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return
  }

  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  })
}

/**
 * Wrap an async function with error tracking
 */
export function withErrorTracking<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: {
    name?: string
    tags?: Record<string, string>
  }
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      logError(error as Error, {
        tags: {
          function: context?.name || fn.name,
          ...context?.tags,
        },
        extra: {
          arguments: args,
        },
      })
      throw error
    }
  }) as T
}

/**
 * Create a Sentry span for performance monitoring
 */
export function startSpan<T>(
  name: string,
  op: string,
  callback: () => T
): T {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return callback()
  }

  return Sentry.startSpan(
    {
      name,
      op,
    },
    callback
  )
}
