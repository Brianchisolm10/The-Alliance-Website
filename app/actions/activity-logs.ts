'use server'

import { auth } from '@/lib/auth'
import {
  getActivityLogs,
  type LogActionType,
  type LogResourceType,
} from '@/lib/logging'

/**
 * Get activity logs with filtering (admin only)
 */
export async function fetchActivityLogs({
  userId,
  action,
  resource,
  startDate,
  endDate,
  page = 1,
  limit = 50,
}: {
  userId?: string
  action?: LogActionType
  resource?: LogResourceType
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
} = {}) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return { error: 'Unauthorized' }
    }

    const offset = (page - 1) * limit

    const result = await getActivityLogs({
      userId,
      action,
      resource,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit,
      offset,
    })

    return {
      success: true,
      logs: result.logs,
      total: result.total,
      hasMore: result.hasMore,
      page,
      totalPages: Math.ceil(result.total / limit),
    }
  } catch (error) {
    console.error('Failed to fetch activity logs:', error)
    return { error: 'Failed to fetch activity logs' }
  }
}

/**
 * Get activity logs for a specific user (admin only)
 */
export async function fetchUserActivityLogs(
  userId: string,
  page = 1,
  limit = 20
) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return { error: 'Unauthorized' }
    }

    const offset = (page - 1) * limit

    const result = await getActivityLogs({
      userId,
      limit,
      offset,
    })

    return {
      success: true,
      logs: result.logs,
      total: result.total,
      hasMore: result.hasMore,
      page,
      totalPages: Math.ceil(result.total / limit),
    }
  } catch (error) {
    console.error('Failed to fetch user activity logs:', error)
    return { error: 'Failed to fetch user activity logs' }
  }
}

/**
 * Get recent activity logs (admin dashboard)
 */
export async function fetchRecentActivity(limit = 10) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return { error: 'Unauthorized' }
    }

    const result = await getActivityLogs({
      limit,
      offset: 0,
    })

    return {
      success: true,
      logs: result.logs,
    }
  } catch (error) {
    console.error('Failed to fetch recent activity:', error)
    return { error: 'Failed to fetch recent activity' }
  }
}
