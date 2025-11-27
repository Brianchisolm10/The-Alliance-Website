import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, apiRateLimiter, RateLimitError } from './rate-limit'

type ApiHandler = (request: NextRequest, context?: any) => Promise<NextResponse>

interface ApiWrapperOptions {
  rateLimit?: boolean
  rateLimiter?: (request: NextRequest, identifier?: string) => Promise<boolean>
}

/**
 * Wrapper for API routes with security features
 */
export function withSecurity(
  handler: ApiHandler,
  options: ApiWrapperOptions = {}
): ApiHandler {
  return async (request: NextRequest, context?: any) => {
    try {
      // Apply rate limiting if enabled
      if (options.rateLimit !== false) {
        const limiter = options.rateLimiter || apiRateLimiter
        await checkRateLimit(request, limiter)
      }

      // Call the actual handler
      return await handler(request, context)
    } catch (error) {
      if (error instanceof RateLimitError) {
        return NextResponse.json(
          { error: error.message },
          { 
            status: 429,
            headers: {
              'Retry-After': '60',
            },
          }
        )
      }

      // Re-throw other errors
      throw error
    }
  }
}
