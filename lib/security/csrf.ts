import { randomBytes, createHash } from 'crypto'
import { cookies } from 'next/headers'

const CSRF_TOKEN_LENGTH = 32
const CSRF_COOKIE_NAME = 'csrf-token'
const CSRF_HEADER_NAME = 'x-csrf-token'

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  return randomBytes(CSRF_TOKEN_LENGTH).toString('hex')
}

/**
 * Hash a CSRF token for storage
 */
function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/**
 * Set CSRF token in cookie
 */
export async function setCsrfToken(): Promise<string> {
  const token = generateCsrfToken()
  const hashedToken = hashToken(token)
  
  const cookieStore = await cookies()
  cookieStore.set(CSRF_COOKIE_NAME, hashedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
  
  return token
}

/**
 * Get CSRF token from cookie
 */
export async function getCsrfToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(CSRF_COOKIE_NAME)?.value
}

/**
 * Validate CSRF token from request
 */
export async function validateCsrfToken(token: string | null): Promise<boolean> {
  if (!token) {
    return false
  }
  
  const storedToken = await getCsrfToken()
  if (!storedToken) {
    return false
  }
  
  const hashedToken = hashToken(token)
  return hashedToken === storedToken
}

/**
 * Extract CSRF token from request headers or body
 */
export function extractCsrfToken(request: Request): string | null {
  // Try header first
  const headerToken = request.headers.get(CSRF_HEADER_NAME)
  if (headerToken) {
    return headerToken
  }
  
  // For form submissions, token will be in body
  return null
}

/**
 * Middleware to validate CSRF token
 */
export async function validateCsrfMiddleware(request: Request): Promise<boolean> {
  // Only validate for state-changing methods
  const method = request.method
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return true
  }
  
  const token = extractCsrfToken(request)
  return await validateCsrfToken(token)
}
