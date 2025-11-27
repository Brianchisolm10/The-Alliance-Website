import { prisma } from '@/lib/db'
import { LogAction, LogResource, type LogActionType, type LogResourceType } from './types'

// Re-export types for convenience
export { LogAction, LogResource, type LogActionType, type LogResourceType }

/**
 * Get client IP address from request headers
 * Note: This should be called from server actions/routes where headers are available
 */
export function getClientIp(headersList?: Headers): string | null {
  try {
    if (!headersList) return null
    
    // Check various headers for IP address
    const forwardedFor = headersList.get('x-forwarded-for')
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim()
    }
    
    const realIp = headersList.get('x-real-ip')
    if (realIp) {
      return realIp
    }
    
    return null
  } catch (error) {
    // Headers might not be available in all contexts
    return null
  }
}

/**
 * Log an activity to the database
 */
export async function logActivity({
  userId,
  action,
  resource,
  details,
  ipAddress,
}: {
  userId?: string | null
  action: LogActionType
  resource: LogResourceType
  details?: Record<string, any>
  ipAddress?: string | null
}): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        userId: userId || null,
        action,
        resource,
        details: details ? JSON.parse(JSON.stringify(details)) : null,
        ipAddress: ipAddress || null,
      },
    })
  } catch (error) {
    // Log to console but don't throw - logging failures shouldn't break the app
    console.error('Failed to log activity:', error)
  }
}

/**
 * Log authentication events
 */
export async function logAuth(
  action: Extract<LogActionType, 'LOGIN' | 'LOGOUT' | 'PASSWORD_RESET_REQUEST' | 'PASSWORD_RESET_COMPLETE' | 'ACCOUNT_SETUP_COMPLETE'>,
  userId: string,
  details?: Record<string, any>
): Promise<void> {
  await logActivity({
    userId,
    action,
    resource: LogResource.AUTH,
    details,
  })
}

/**
 * Log form submission events
 */
export async function logFormSubmission(
  action: Extract<LogActionType, 'DISCOVERY_FORM_SUBMIT' | 'CONTACT_FORM_SUBMIT' | 'ASSESSMENT_SUBMIT' | 'GEAR_DRIVE_SUBMIT'>,
  userId: string | null,
  details?: Record<string, any>
): Promise<void> {
  const resourceMap = {
    DISCOVERY_FORM_SUBMIT: LogResource.DISCOVERY,
    CONTACT_FORM_SUBMIT: LogResource.CONTACT,
    ASSESSMENT_SUBMIT: LogResource.ASSESSMENT,
    GEAR_DRIVE_SUBMIT: LogResource.GEAR_DRIVE,
  }
  
  await logActivity({
    userId,
    action,
    resource: resourceMap[action],
    details,
  })
}

/**
 * Log transaction events
 */
export async function logTransaction(
  action: Extract<LogActionType, 'ORDER_CREATED' | 'ORDER_UPDATED' | 'PAYMENT_COMPLETED' | 'PAYMENT_FAILED' | 'DONATION_COMPLETED'>,
  userId: string | null,
  details?: Record<string, any>
): Promise<void> {
  const resourceMap = {
    ORDER_CREATED: LogResource.ORDER,
    ORDER_UPDATED: LogResource.ORDER,
    PAYMENT_COMPLETED: LogResource.PAYMENT,
    PAYMENT_FAILED: LogResource.PAYMENT,
    DONATION_COMPLETED: LogResource.DONATION,
  }
  
  await logActivity({
    userId,
    action,
    resource: resourceMap[action],
    details,
  })
}

/**
 * Log admin actions
 */
export async function logAdminAction(
  action: LogActionType,
  adminId: string,
  resource: LogResourceType,
  details?: Record<string, any>
): Promise<void> {
  await logActivity({
    userId: adminId,
    action,
    resource,
    details,
  })
}

/**
 * Get activity logs with filtering and pagination
 */
export async function getActivityLogs({
  userId,
  action,
  resource,
  startDate,
  endDate,
  limit = 50,
  offset = 0,
}: {
  userId?: string
  action?: LogActionType
  resource?: LogResourceType
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
} = {}) {
  const where: any = {}
  
  if (userId) {
    where.userId = userId
  }
  
  if (action) {
    where.action = action
  }
  
  if (resource) {
    where.resource = resource
  }
  
  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) {
      where.createdAt.gte = startDate
    }
    if (endDate) {
      where.createdAt.lte = endDate
    }
  }
  
  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    }),
    prisma.activityLog.count({ where }),
  ])
  
  return {
    logs,
    total,
    hasMore: offset + logs.length < total,
  }
}
