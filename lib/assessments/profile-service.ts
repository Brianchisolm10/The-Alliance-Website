/**
 * Unified client profile service
 * Manages storing and retrieving assessment data in a unified structure
 */

import { prisma } from '@/lib/db/prisma'
import { Population } from '@prisma/client'
import { UnifiedClientProfile } from './types'
import { assessmentRegistry } from './registry'

/**
 * Save module data to unified client profile
 */
export async function saveModuleToProfile(
  userId: string,
  moduleId: string,
  formData: Record<string, any>
): Promise<void> {
  const module = assessmentRegistry.getModule(moduleId)
  if (!module) {
    throw new Error(`Module ${moduleId} not found`)
  }

  // Extract profile data from form data
  const profileData = module.extractProfileData(formData)

  // Get existing profile or create new one
  const existingProfile = await getUnifiedProfile(userId)
  
  // Merge new data with existing profile
  const updatedProfile = mergeProfileData(existingProfile, profileData)

  // Store in database as JSON in a dedicated assessment record
  await prisma.assessment.upsert({
    where: {
      userId_type: {
        userId,
        type: 'GENERAL', // Use GENERAL type for unified profile
      },
    },
    create: {
      userId,
      type: 'GENERAL',
      data: updatedProfile,
      completed: false,
    },
    update: {
      data: updatedProfile,
      updatedAt: new Date(),
    },
  })
}

/**
 * Get unified client profile
 */
export async function getUnifiedProfile(userId: string): Promise<UnifiedClientProfile> {
  const assessment = await prisma.assessment.findFirst({
    where: {
      userId,
      type: 'GENERAL',
    },
  })

  if (!assessment) {
    return {}
  }

  return assessment.data as UnifiedClientProfile
}

/**
 * Update unified profile directly
 */
export async function updateUnifiedProfile(
  userId: string,
  profileData: Partial<UnifiedClientProfile>
): Promise<void> {
  const existingProfile = await getUnifiedProfile(userId)
  const updatedProfile = mergeProfileData(existingProfile, profileData)

  await prisma.assessment.upsert({
    where: {
      userId_type: {
        userId,
        type: 'GENERAL',
      },
    },
    create: {
      userId,
      type: 'GENERAL',
      data: updatedProfile,
      completed: false,
    },
    update: {
      data: updatedProfile,
      updatedAt: new Date(),
    },
  })
}

/**
 * Mark profile as complete
 */
export async function markProfileComplete(userId: string): Promise<void> {
  await prisma.assessment.updateMany({
    where: {
      userId,
      type: 'GENERAL',
    },
    data: {
      completed: true,
      updatedAt: new Date(),
    },
  })
}

/**
 * Get completed modules for a user
 */
export async function getCompletedModules(userId: string): Promise<string[]> {
  const assessments = await prisma.assessment.findMany({
    where: {
      userId,
      completed: true,
    },
    select: {
      type: true,
    },
  })

  // Map assessment types to module IDs
  const moduleMap: Record<string, string> = {
    NUTRITION: 'dietary',
    LIFESTYLE: 'lifestyle',
    TRAINING: 'movement',
    PERFORMANCE: 'athlete',
    YOUTH: 'youth',
    RECOVERY: 'recovery',
  }

  return assessments
    .map((a) => moduleMap[a.type])
    .filter(Boolean)
}

/**
 * Get required modules for user based on population
 */
export async function getRequiredModulesForUser(userId: string): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { population: true },
  })

  if (!user?.population) {
    return []
  }

  const modules = assessmentRegistry.getRequiredModules(user.population)
  return modules.map((m) => m.id)
}

/**
 * Check if user has completed all required modules
 */
export async function hasCompletedRequiredModules(userId: string): Promise<boolean> {
  const required = await getRequiredModulesForUser(userId)
  const completed = await getCompletedModules(userId)

  return required.every((moduleId) => completed.includes(moduleId))
}

/**
 * Deep merge profile data
 */
function mergeProfileData(
  existing: UnifiedClientProfile,
  newData: Partial<UnifiedClientProfile>
): UnifiedClientProfile {
  const merged: UnifiedClientProfile = { ...existing }

  // Merge each top-level key
  for (const key of Object.keys(newData) as Array<keyof UnifiedClientProfile>) {
    const existingValue = existing[key]
    const newValue = newData[key]

    if (newValue === undefined) {
      continue
    }

    if (typeof newValue === 'object' && !Array.isArray(newValue) && newValue !== null) {
      // Deep merge objects
      merged[key] = {
        ...(existingValue as any),
        ...newValue,
      } as any
    } else {
      // Replace primitives and arrays
      merged[key] = newValue as any
    }
  }

  return merged
}

/**
 * Get profile completion percentage
 */
export async function getProfileCompletionPercentage(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { population: true },
  })

  if (!user?.population) {
    return 0
  }

  const allModules = assessmentRegistry.getModulesForPopulation(user.population)
  const completed = await getCompletedModules(userId)

  if (allModules.length === 0) {
    return 0
  }

  return Math.round((completed.length / allModules.length) * 100)
}
