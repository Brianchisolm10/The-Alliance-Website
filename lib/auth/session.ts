import { auth } from './index'

/**
 * Get the current session
 */
export async function getSession() {
  return await auth()
}

/**
 * Check if session is valid and not expired
 */
export async function isSessionValid(): Promise<boolean> {
  const session = await getSession()
  return !!session?.user
}

/**
 * Get session with user details
 */
export async function getSessionUser() {
  const session = await getSession()
  return session?.user || null
}

/**
 * Check if user has required role
 */
export async function hasRole(roles: string[]): Promise<boolean> {
  const session = await getSession()
  if (!session?.user?.role) return false
  return roles.includes(session.user.role)
}

/**
 * Require authentication - throw error if not authenticated
 */
export async function requireAuth() {
  const session = await getSession()
  if (!session?.user) {
    throw new Error('Authentication required')
  }
  return session
}

/**
 * Require specific role - throw error if not authorized
 */
export async function requireRole(roles: string[]) {
  const session = await requireAuth()
  if (!session.user.role || !roles.includes(session.user.role)) {
    throw new Error('Insufficient permissions')
  }
  return session
}
