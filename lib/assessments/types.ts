/**
 * Core types for the modular assessment framework
 */

import { Population } from '@prisma/client'

export type QuestionType = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'date' | 'range'

export interface AssessmentQuestion {
  id: string
  question: string
  type: QuestionType
  options?: string[]
  required?: boolean
  placeholder?: string
  min?: number
  max?: number
  step?: number
  unit?: string
  helpText?: string
  condition?: (data: Record<string, any>) => boolean
  validation?: (value: any, data: Record<string, any>) => string | null
}

export interface AssessmentSection {
  id: string
  title: string
  description?: string
  questions: AssessmentQuestion[]
  condition?: (data: Record<string, any>) => boolean
}

export interface AssessmentModule {
  id: string
  name: string
  description: string
  populations: Population[]
  sections: AssessmentSection[]
  priority: number // Lower number = higher priority in display order
  required: boolean
  category: 'core' | 'population' | 'lifestyle' | 'medical' | 'equipment'
  
  // Methods
  isApplicable(population: Population): boolean
  getActiveSections(data: Record<string, any>): AssessmentSection[]
  validate(data: Record<string, any>): { valid: boolean; errors: Record<string, string> }
  extractProfileData(formData: Record<string, any>): Partial<UnifiedClientProfile>
}

export interface UnifiedClientProfile {
  // Core demographics
  demographics?: {
    age?: number
    gender?: string
    height?: number
    weight?: number
    heightUnit?: 'cm' | 'inches'
    weightUnit?: 'kg' | 'lbs'
  }

  // Population-specific data
  populationData?: {
    // Pregnancy
    trimester?: number
    dueDate?: string
    complications?: string[]
    previousPregnancies?: number

    // Postpartum
    deliveryDate?: string
    deliveryType?: 'vaginal' | 'cesarean'
    postpartumWeeks?: number
    breastfeeding?: boolean

    // Elderly
    functionalScreening?: {
      mobility?: string
      balance?: string
      strength?: string
      flexibility?: string
    }
    chronicConditions?: string[]
    medications?: string[]
    fallHistory?: boolean

    // Athlete
    sport?: string
    position?: string
    competitionLevel?: string
    trainingFrequency?: number
    performanceGoals?: string[]

    // Youth
    ageGroup?: 'child' | 'adolescent' | 'teen'
    growthStage?: string
    schoolSports?: string[]
    parentalConsent?: boolean

    // Recovery/Injury
    injuryType?: string
    injuryDate?: string
    surgeryDate?: string
    currentPainLevel?: number
    mobilityRestrictions?: string[]
    clearanceStatus?: string
  }

  // Dietary restrictions and preferences
  dietary?: {
    restrictions?: string[]
    allergies?: string[]
    intolerances?: string[]
    dietaryPattern?: string
    culturalPreferences?: string[]
    dislikes?: string[]
  }

  // Lifestyle habits
  lifestyle?: {
    sleepHours?: number
    sleepQuality?: string
    stressLevel?: number
    hydration?: number
    alcohol?: string
    smoking?: string
    occupation?: string
    activityLevel?: string
  }

  // Movement readiness
  movement?: {
    currentActivity?: string
    exerciseFrequency?: number
    exerciseTypes?: string[]
    injuries?: string[]
    painAreas?: string[]
    mobilityLimitations?: string[]
    fitnessLevel?: string
  }

  // Equipment availability
  equipment?: {
    location?: 'home' | 'gym' | 'both' | 'outdoor'
    availableEquipment?: string[]
    spaceConstraints?: string
    budget?: string
  }

  // Goals and preferences
  goals?: {
    primary?: string
    secondary?: string[]
    timeline?: string
    motivation?: string
    barriers?: string[]
  }

  // Medical history
  medical?: {
    conditions?: string[]
    medications?: string[]
    surgeries?: string[]
    familyHistory?: string[]
    doctorClearance?: boolean
  }
}
