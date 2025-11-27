'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'
import {
  assessmentRegistry,
  saveModuleToProfile,
  getUnifiedProfile,
  markProfileComplete,
  getCompletedModules,
  getRequiredModulesForUser,
  hasCompletedRequiredModules,
  getProfileCompletionPercentage,
} from '@/lib/assessments'

/**
 * Get available modules for the current user based on their population
 */
export async function getAvailableModules() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { population: true },
    })

    if (!user?.population) {
      return {
        required: [],
        optional: [],
      }
    }

    const requiredModules = assessmentRegistry.getRequiredModules(user.population)
    const optionalModules = assessmentRegistry.getOptionalModules(user.population)

    return {
      required: requiredModules.map((m) => ({
        id: m.id,
        name: m.name,
        description: m.description,
        category: m.category,
        priority: m.priority,
      })),
      optional: optionalModules.map((m) => ({
        id: m.id,
        name: m.name,
        description: m.description,
        category: m.category,
        priority: m.priority,
      })),
    }
  } catch (error) {
    console.error('Error fetching available modules:', error)
    throw new Error('Failed to fetch available modules')
  }
}

/**
 * Get a specific module by ID
 */
export async function getModuleById(moduleId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  try {
    const assessmentModule = assessmentRegistry.getModule(moduleId)

    if (!assessmentModule) {
      throw new Error('Module not found')
    }

    // Check if user's population can access this module
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { population: true },
    })

    if (!user?.population || !assessmentModule.isApplicable(user.population)) {
      throw new Error('Module not available for your population')
    }

    return {
      id: assessmentModule.id,
      name: assessmentModule.name,
      description: assessmentModule.description,
      sections: assessmentModule.sections,
      required: assessmentModule.required,
      category: assessmentModule.category,
    }
  } catch (error) {
    console.error('Error fetching module:', error)
    throw error
  }
}

/**
 * Save module data to unified profile
 */
export async function saveModuleData(
  moduleId: string,
  formData: Record<string, any>,
  completed: boolean
) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  try {
    // Save to unified profile
    await saveModuleToProfile(session.user.id, moduleId, formData)

    // Also save raw form data to a module-specific assessment record
    const assessmentModule = assessmentRegistry.getModule(moduleId)
    if (!assessmentModule) {
      throw new Error('Module not found')
    }

    // Map module ID to assessment type
    const typeMap: Record<string, string> = {
      dietary: 'NUTRITION',
      lifestyle: 'LIFESTYLE',
      movement: 'TRAINING',
      athlete: 'PERFORMANCE',
      youth: 'YOUTH',
      recovery: 'RECOVERY',
      pregnancy: 'GENERAL',
      postpartum: 'GENERAL',
      elderly: 'GENERAL',
      equipment: 'GENERAL',
    }

    const assessmentType = typeMap[moduleId] || 'GENERAL'

    await prisma.assessment.upsert({
      where: {
        userId_type: {
          userId: session.user.id,
          type: assessmentType as any,
        },
      },
      create: {
        userId: session.user.id,
        type: assessmentType as any,
        data: formData,
        completed,
      },
      update: {
        data: formData,
        completed,
        updatedAt: new Date(),
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: completed ? 'COMPLETE_MODULE' : 'SAVE_MODULE',
        resource: 'ASSESSMENT_MODULE',
        details: { moduleId, completed },
      },
    })

    revalidatePath('/assessments')
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Error saving module data:', error)
    throw new Error('Failed to save module data')
  }
}

/**
 * Get unified profile for current user
 */
export async function getUserProfile() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  try {
    const profile = await getUnifiedProfile(session.user.id)
    return profile
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw new Error('Failed to fetch user profile')
  }
}

/**
 * Get module data for current user
 */
export async function getModuleData(moduleId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  try {
    // Map module ID to assessment type
    const typeMap: Record<string, string> = {
      dietary: 'NUTRITION',
      lifestyle: 'LIFESTYLE',
      movement: 'TRAINING',
      athlete: 'PERFORMANCE',
      youth: 'YOUTH',
      recovery: 'RECOVERY',
      pregnancy: 'GENERAL',
      postpartum: 'GENERAL',
      elderly: 'GENERAL',
      equipment: 'GENERAL',
    }

    const assessmentType = typeMap[moduleId] || 'GENERAL'

    const assessment = await prisma.assessment.findFirst({
      where: {
        userId: session.user.id,
        type: assessmentType as any,
      },
    })

    return assessment?.data as Record<string, any> || {}
  } catch (error) {
    console.error('Error fetching module data:', error)
    throw new Error('Failed to fetch module data')
  }
}

/**
 * Get assessment progress for current user
 */
export async function getAssessmentProgress() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  try {
    const completedModules = await getCompletedModules(session.user.id)
    const requiredModules = await getRequiredModulesForUser(session.user.id)
    const allCompleted = await hasCompletedRequiredModules(session.user.id)
    const percentage = await getProfileCompletionPercentage(session.user.id)

    return {
      completedModules,
      requiredModules,
      allCompleted,
      percentage,
    }
  } catch (error) {
    console.error('Error fetching assessment progress:', error)
    throw new Error('Failed to fetch assessment progress')
  }
}

/**
 * Mark all assessments as complete
 */
export async function completeAllAssessments() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  try {
    await markProfileComplete(session.user.id)

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'COMPLETE_ALL_ASSESSMENTS',
        resource: 'ASSESSMENT',
        details: {},
      },
    })

    revalidatePath('/assessments')
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Error completing assessments:', error)
    throw new Error('Failed to complete assessments')
  }
}
