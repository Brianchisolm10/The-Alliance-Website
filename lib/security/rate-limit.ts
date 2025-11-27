import { NextRequest } from 'next/server'

export class RateLimitError extends Error {
  constructor(message: string = 'Too many requests') {
    super(message)
    this.name = 'RateLimitError'
  }
}

interface RateLimitConfig {
  interval: number // Time window in milliseconds
  maxRequests: number // Maximum requests per interval
}

interface RateLimitStore {
  count: number
  resetTime: number
}

// In-memory store for rate limiting
// In production, use Redis or similar distributed cache
const rateLimitStore = new Map<string, RateLimitStore>()

/**
 * Clean up expired entries periodically
 */
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean up every minute

/**
 * Get client identifier from request
 */
function getClientId(request: NextRequest): string {
  // Try to get IP from various headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'
  
  return ip
}

/**
 * Rate limiter factory
 */
export function rateLimiter(config: RateLimitConfig) {
  return async (request: NextRequest, identifier?: string): Promise<boolean> => {
    const clientId = identifier || getClientId(request)
    const key = `${request.nextUrl.pathname}:${clientId}`
    const now = Date.now()
    
    const record = rateLimitStore.get(key)
    
    if (!record || record.resetTime < now) {
      // Create new record
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.interval,
      })
      return true
    }
    
    if (record.count >= config.maxRequests) {
      return false
    }
    
    // Increment count
    record.count++
    rateLimitStore.set(key, record)
    return true
  }
}

/**
 * Predefined rate limiters
 */

// Strict rate limit for authentication endpoints
export const authRateLimiter = rateLimiter({
  interval: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
})

// Standard rate limit for API endpoints
export const apiRateLimiter = rateLimiter({
  interval: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
})

// Relaxed rate limit for public endpoints
export const publicRateLimiter = rateLimiter({
  interval: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
})

// Strict rate limit for form submissions
export const formRateLimiter = rateLimiter({
  interval: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 submissions per minute
})

/**
 * Check rate limit and throw error if exceeded
 */
export async function checkRateLimit(
  request: NextRequest,
  limiter: (request: NextRequest, identifier?: string) => Promise<boolean>,
  identifier?: string
): Promise<void> {
  const allowed = await limiter(request, identifier)
  
  if (!allowed) {
    throw new RateLimitError('Too many requests. Please try again later.')
  }
}
