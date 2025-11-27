'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { UserRole, UserStatus } from '@prisma/client'
import { logAdminAction, LogResource } from '@/lib/logging'

export async function getUsers(params?: {
  search?: string
  status?: UserStatus
  role?: UserRole
  page?: number
  limit?: number
}) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    const page = params?.page || 1
    const limit = params?.limit || 20
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (params?.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        { name: { contains: params.search, mode: 'insensitive' } },
      ]
    }

    if (params?.status) {
      where.status = params.status
    }

    if (params?.role) {
      where.role = params.role
    }

    // Fetch users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          population: true,
          createdAt: true,
          lastLoginAt: true,
          _count: {
            select: {
              assessments: true,
              packets: true,
              orders: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ])

    return {
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { success: false, error: 'Failed to fetch users' }
  }
}

export async function getUserById(userId: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        assessments: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        packets: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        clientNotes: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        activityLogs: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: {
          select: {
            assessments: true,
            packets: true,
            orders: true,
            clientNotes: true,
            activityLogs: true,
          },
        },
      },
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    return {
      success: true,
      data: user,
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    return { success: false, error: 'Failed to fetch user' }
  }
}

export async function createUser(data: {
  email: string
  name: string
  role: UserRole
  population?: string
}) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return { success: false, error: 'Email already exists' }
    }

    // Generate setup token
    const crypto = require('crypto')
    const setupToken = crypto.randomBytes(32).toString('hex')
    const setupTokenExpiry = new Date()
    setupTokenExpiry.setDate(setupTokenExpiry.getDate() + 7) // 7 days

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: data.role,
        population: data.population as any,
        setupToken,
        setupTokenExpiry,
        status: UserStatus.PENDING,
      },
    })

    // Send setup email
    const { sendAccountSetupEmail } = await import('@/lib/email')
    const emailResult = await sendAccountSetupEmail(
      user.email,
      user.name || 'User',
      setupToken
    )

    if (!emailResult.success) {
      console.error('Failed to send setup email:', emailResult.error)
      // Don't fail the user creation if email fails
    }

    // Log activity
    await logAdminAction('USER_CREATED', session.user.id, LogResource.USER, {
      createdUserId: user.id,
      email: user.email,
      role: user.role,
    })

    return {
      success: true,
      data: user,
    }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: 'Failed to create user' }
  }
}

export async function updateUser(
  userId: string,
  data: {
    name?: string
    role?: UserRole
    status?: UserStatus
    population?: string | null
  }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    // Get current user data
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!currentUser) {
      return { success: false, error: 'User not found' }
    }

    // Permission check: Only SUPER_ADMIN can modify other admins
    if (
      (currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN') &&
      session.user.role !== 'SUPER_ADMIN'
    ) {
      return {
        success: false,
        error: 'Only super admins can modify admin accounts',
      }
    }

    // Prevent self-demotion
    if (userId === session.user.id && data.role && data.role !== currentUser.role) {
      return {
        success: false,
        error: 'You cannot change your own role',
      }
    }

    // Prevent self-suspension
    if (userId === session.user.id && data.status && data.status !== currentUser.status) {
      return {
        success: false,
        error: 'You cannot change your own status',
      }
    }

    // Update user
    const updateData: any = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.role !== undefined) updateData.role = data.role
    if (data.status !== undefined) updateData.status = data.status
    if (data.population !== undefined) {
      updateData.population = data.population || null
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    // Log activity
    await logAdminAction('USER_UPDATED', session.user.id, LogResource.USER, {
      updatedUserId: userId,
      changes: updateData,
    })

    return {
      success: true,
      data: updatedUser,
    }
  } catch (error) {
    console.error('Error updating user:', error)
    return { success: false, error: 'Failed to update user' }
  }
}

export async function bulkUpdateUsers(
  userIds: string[],
  updates: {
    status?: UserStatus
    role?: UserRole
  }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    if (userIds.length === 0) {
      return { success: false, error: 'No users selected' }
    }

    // Prevent self-modification in bulk actions
    if (userIds.includes(session.user.id)) {
      return {
        success: false,
        error: 'You cannot modify your own account in bulk actions',
      }
    }

    // Get all users to check permissions
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, role: true },
    })

    // Check if trying to modify admins without SUPER_ADMIN permission
    const hasAdmins = users.some(
      (u) => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN'
    )

    if (hasAdmins && session.user.role !== 'SUPER_ADMIN') {
      return {
        success: false,
        error: 'Only super admins can modify admin accounts',
      }
    }

    // Build update data
    const updateData: any = {}
    if (updates.status !== undefined) updateData.status = updates.status
    if (updates.role !== undefined) updateData.role = updates.role

    // Perform bulk update
    const result = await prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: updateData,
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'BULK_UPDATE_USERS',
        resource: 'USER',
        details: {
          userIds,
          updates: updateData,
          count: result.count,
        },
      },
    })

    return {
      success: true,
      data: {
        count: result.count,
      },
    }
  } catch (error) {
    console.error('Error bulk updating users:', error)
    return { success: false, error: 'Failed to update users' }
  }
}
