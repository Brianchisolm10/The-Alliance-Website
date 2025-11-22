'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { Population } from '@prisma/client'
import { revalidatePath } from 'next/cache'

/**
 * Assign population to a user
 * This is typically done by an admin after a discovery call
 */
export async function assignPopulation(data: {
  userId: string
  population: Population
  adminNotes?: string
}) {
  try {
    const session = await auth()

    // Only admins can assign populations
    if (!session?.user?.role || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return { error: 'Unauthorized' }
    }

    const { userId, population, adminNotes } = data

    // Update user population
    const user = await prisma.user.update({
      where: { id: userId },
      data: { population },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'POPULATION_ASSIGNED',
        resource: 'USER',
        details: {
          targetUserId: userId,
          population,
          adminNotes,
        },
      },
    })

    // Create admin note if provided
    if (adminNotes) {
      await prisma.clientNote.create({
        data: {
          clientId: userId,
          authorId: session.user.id,
          content: `Population assigned: ${population}. ${adminNotes}`,
        },
      })
    }

    revalidatePath('/admin/users')
    revalidatePath(`/admin/users/${userId}`)

    return { success: true, user }
  } catch (error) {
    console.error('Assign population error:', error)
    return { error: 'Failed to assign population' }
  }
}

/**
 * Update user population
 * Allows switching population for multi-classification clients
 */
export async function updateUserPopulation(data: {
  userId: string
  population: Population
  reason?: string
}) {
  try {
    const session = await auth()

    // Only admins can update populations
    if (!session?.user?.role || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return { error: 'Unauthorized' }
    }

    const { userId, population, reason } = data

    // Get current population
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { population: true },
    })

    if (!currentUser) {
      return { error: 'User not found' }
    }

    // Update user population
    const user = await prisma.user.update({
      where: { id: userId },
      data: { population },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'POPULATION_UPDATED',
        resource: 'USER',
        details: {
          targetUserId: userId,
          previousPopulation: currentUser.population,
          newPopulation: population,
          reason,
        },
      },
    })

    // Create admin note
    await prisma.clientNote.create({
      data: {
        clientId: userId,
        authorId: session.user.id,
        content: `Population changed from ${currentUser.population || 'none'} to ${population}. ${reason || 'No reason provided.'}`,
      },
    })

    revalidatePath('/admin/users')
    revalidatePath(`/admin/users/${userId}`)
    revalidatePath('/assessments')

    return { success: true, user }
  } catch (error) {
    console.error('Update population error:', error)
    return { error: 'Failed to update population' }
  }
}

/**
 * Get user's current population
 */
export async function getUserPopulation() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { error: 'Not authenticated' }
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { population: true },
    })

    if (!user) {
      return { error: 'User not found' }
    }

    return { success: true, population: user.population }
  } catch (error) {
    console.error('Get user population error:', error)
    return { error: 'Failed to get population' }
  }
}

/**
 * Assign population during discovery call conversion
 * This combines user creation with population assignment
 */
export async function convertDiscoveryWithPopulation(data: {
  discoverySubmissionId: string
  population: Population
  role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  notes?: string
}) {
  try {
    const session = await auth()

    // Only admins can convert discovery submissions
    if (!session?.user?.role || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return { error: 'Unauthorized' }
    }

    const { discoverySubmissionId, population, role = 'USER', notes } = data

    // Get discovery submission
    const submission = await prisma.discoverySubmission.findUnique({
      where: { id: discoverySubmissionId },
    })

    if (!submission) {
      return { error: 'Discovery submission not found' }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: submission.email },
    })

    if (existingUser) {
      return { error: 'User with this email already exists' }
    }

    // Generate setup token
    const setupToken = crypto.randomUUID()
    const setupTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    // Create user with population
    const user = await prisma.user.create({
      data: {
        email: submission.email,
        name: submission.name,
        role,
        population,
        setupToken,
        setupTokenExpiry,
        status: 'PENDING',
      },
    })

    // Update discovery submission status
    await prisma.discoverySubmission.update({
      where: { id: discoverySubmissionId },
      data: { status: 'CONVERTED' },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'DISCOVERY_CONVERTED',
        resource: 'USER',
        details: {
          discoverySubmissionId,
          newUserId: user.id,
          population,
          email: user.email,
        },
      },
    })

    // Create admin note
    if (notes) {
      await prisma.clientNote.create({
        data: {
          clientId: user.id,
          authorId: session.user.id,
          content: `User created from discovery call. Population: ${population}. ${notes}`,
        },
      })
    }

    revalidatePath('/admin/discovery')
    revalidatePath('/admin/users')

    // TODO: Send setup email with token
    console.log(`Setup email should be sent to ${user.email} with token: ${setupToken}`)

    return { success: true, user, setupToken }
  } catch (error) {
    console.error('Convert discovery with population error:', error)
    return { error: 'Failed to convert discovery submission' }
  }
}
