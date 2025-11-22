/**
 * Population Routing System
 * 
 * This module handles population classification, assignment, and routing logic
 * for the modular assessment system.
 */

import { Population, AssessmentType } from '@prisma/client'

/**
 * Population-specific assessment module configurations
 */
export const POPULATION_ASSESSMENT_MODULES: Record<
  Population,
  {
    required: AssessmentType[]
    optional: AssessmentType[]
    description: string
  }
> = {
  GENERAL: {
    required: ['NUTRITION', 'LIFESTYLE'],
    optional: ['TRAINING', 'RECOVERY'],
    description: 'General wellness and health optimization',
  },
  ATHLETE: {
    required: ['NUTRITION', 'TRAINING', 'PERFORMANCE', 'RECOVERY'],
    optional: ['LIFESTYLE'],
    description: 'Athletic performance and training optimization',
  },
  YOUTH: {
    required: ['YOUTH', 'NUTRITION', 'LIFESTYLE'],
    optional: ['TRAINING', 'PERFORMANCE'],
    description: 'Age-appropriate wellness for young athletes',
  },
  RECOVERY: {
    required: ['RECOVERY', 'NUTRITION', 'LIFESTYLE'],
    optional: ['TRAINING'],
    description: 'Injury recovery and rehabilitation',
  },
  PREGNANCY: {
    required: ['NUTRITION', 'LIFESTYLE', 'RECOVERY'],
    optional: ['TRAINING'],
    description: 'Prenatal wellness and fitness',
  },
  POSTPARTUM: {
    required: ['NUTRITION', 'LIFESTYLE', 'RECOVERY'],
    optional: ['TRAINING'],
    description: 'Postpartum recovery and wellness',
  },
  OLDER_ADULT: {
    required: ['NUTRITION', 'LIFESTYLE', 'RECOVERY'],
    optional: ['TRAINING'],
    description: 'Age-appropriate wellness for older adults',
  },
  CHRONIC_CONDITION: {
    required: ['NUTRITION', 'LIFESTYLE', 'RECOVERY'],
    optional: ['TRAINING'],
    description: 'Wellness management for chronic conditions',
  },
}

/**
 * Get available assessment modules for a specific population
 */
export function getPopulationAssessments(population: Population) {
  return POPULATION_ASSESSMENT_MODULES[population]
}

/**
 * Get all assessment types (required + optional) for a population
 */
export function getAllAssessmentTypes(population: Population): AssessmentType[] {
  const config = POPULATION_ASSESSMENT_MODULES[population]
  return [...config.required, ...config.optional]
}

/**
 * Check if an assessment type is available for a population
 */
export function isAssessmentAvailable(
  population: Population,
  assessmentType: AssessmentType
): boolean {
  const allTypes = getAllAssessmentTypes(population)
  return allTypes.includes(assessmentType)
}

/**
 * Check if an assessment type is required for a population
 */
export function isAssessmentRequired(
  population: Population,
  assessmentType: AssessmentType
): boolean {
  const config = POPULATION_ASSESSMENT_MODULES[population]
  return config.required.includes(assessmentType)
}

/**
 * Classify population based on discovery call data
 * This is a helper function that can be used during the discovery call process
 */
export function classifyPopulation(data: {
  goal?: string
  age?: number
  isAthlete?: boolean
  isYouth?: boolean
  hasInjury?: boolean
  isPregnant?: boolean
  isPostpartum?: boolean
  hasChronicCondition?: boolean
}): Population {
  const { age, isAthlete, isYouth, hasInjury, isPregnant, isPostpartum, hasChronicCondition } = data

  // Priority-based classification
  if (isPregnant) return 'PREGNANCY'
  if (isPostpartum) return 'POSTPARTUM'
  if (isYouth || (age && age < 18)) return 'YOUTH'
  if (age && age >= 65) return 'OLDER_ADULT'
  if (hasChronicCondition) return 'CHRONIC_CONDITION'
  if (hasInjury) return 'RECOVERY'
  if (isAthlete) return 'ATHLETE'

  return 'GENERAL'
}

/**
 * Get population display information
 */
export function getPopulationInfo(population: Population) {
  const config = POPULATION_ASSESSMENT_MODULES[population]
  
  return {
    name: formatPopulationName(population),
    description: config.description,
    requiredAssessments: config.required.length,
    optionalAssessments: config.optional.length,
    totalAssessments: config.required.length + config.optional.length,
  }
}

/**
 * Format population enum to display name
 */
export function formatPopulationName(population: Population): string {
  const names: Record<Population, string> = {
    GENERAL: 'General Wellness',
    ATHLETE: 'Athlete',
    YOUTH: 'Youth',
    RECOVERY: 'Recovery',
    PREGNANCY: 'Pregnancy',
    POSTPARTUM: 'Postpartum',
    OLDER_ADULT: 'Older Adult',
    CHRONIC_CONDITION: 'Chronic Condition',
  }
  return names[population]
}

/**
 * Get all available populations with their info
 */
export function getAllPopulations() {
  return Object.keys(POPULATION_ASSESSMENT_MODULES).map((pop) => {
    const population = pop as Population
    return {
      value: population,
      ...getPopulationInfo(population),
    }
  })
}
