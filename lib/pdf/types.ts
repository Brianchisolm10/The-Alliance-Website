/**
 * PDF Generation Types
 * 
 * Type definitions for the modular PDF generation system
 */

import { PacketType, Population } from '@prisma/client';

/**
 * Base packet data structure
 */
export interface PacketData {
  id: string;
  type: PacketType;
  userId: string;
  userName: string;
  userEmail: string;
  population?: Population;
  generatedAt: Date;
  version: number;
}

/**
 * Client profile data from assessments
 */
export interface ClientProfile {
  // Demographics
  age?: number;
  gender?: string;
  
  // Lifestyle
  sleepHours?: number;
  stressLevel?: string;
  hydrationLevel?: string;
  
  // Dietary
  dietaryRestrictions?: string[];
  allergies?: string[];
  mealPreferences?: string[];
  
  // Movement & Equipment
  fitnessLevel?: string;
  injuryHistory?: string[];
  equipmentAccess?: string[];
  
  // Population-specific
  trimester?: number; // Pregnancy
  weeksPostpartum?: number; // Postpartum
  athleteType?: string; // Athlete
  youthAge?: number; // Youth
  functionalLimitations?: string[]; // Elderly
}

/**
 * Exercise data structure
 */
export interface ExerciseData {
  id: string;
  name: string;
  description: string;
  sets?: number;
  reps?: string;
  duration?: string;
  intensity?: string;
  notes?: string;
  videoUrl?: string;
  imageUrl?: string;
  modifications?: string[];
  contraindications?: string[];
}

/**
 * Nutrition data structure
 */
export interface NutritionData {
  id: string;
  mealType: string;
  foods: string[];
  portions?: string[];
  calories?: number;
  macros?: {
    protein?: number;
    carbs?: number;
    fats?: number;
  };
  notes?: string;
  alternatives?: string[];
}

/**
 * General packet content
 */
export interface GeneralPacketContent extends PacketData {
  type: 'GENERAL';
  introduction: string;
  goals: string[];
  recommendations: string[];
  exercises?: ExerciseData[];
  nutrition?: NutritionData[];
  lifestyle?: {
    sleep?: string;
    hydration?: string;
    stress?: string;
  };
}

/**
 * Nutrition packet content
 */
export interface NutritionPacketContent extends PacketData {
  type: 'NUTRITION';
  nutritionGoals: string[];
  mealPlan: NutritionData[];
  guidelines: string[];
  restrictions: string[];
  supplements?: string[];
}

/**
 * Training packet content
 */
export interface TrainingPacketContent extends PacketData {
  type: 'TRAINING';
  trainingGoals: string[];
  program: {
    phase: string;
    duration: string;
    frequency: string;
    exercises: ExerciseData[];
  }[];
  progressionPlan: string[];
  safetyNotes: string[];
}

/**
 * Athlete performance packet content
 */
export interface AthletePacketContent extends PacketData {
  type: 'ATHLETE_PERFORMANCE';
  sport: string;
  position?: string;
  performanceGoals: string[];
  strengthProgram: ExerciseData[];
  conditioningProgram: ExerciseData[];
  recoveryProtocol: string[];
  nutritionStrategy: NutritionData[];
}

/**
 * Youth packet content
 */
export interface YouthPacketContent extends PacketData {
  type: 'YOUTH';
  age: number;
  developmentStage: string;
  goals: string[];
  exercises: ExerciseData[];
  nutrition: NutritionData[];
  parentGuidance: string[];
  safetyGuidelines: string[];
}

/**
 * Recovery packet content
 */
export interface RecoveryPacketContent extends PacketData {
  type: 'RECOVERY';
  injuryType: string;
  recoveryStage: string;
  goals: string[];
  exercises: ExerciseData[];
  contraindications: string[];
  progressionCriteria: string[];
  returnToActivityPlan: string[];
}

/**
 * Pregnancy packet content
 */
export interface PregnancyPacketContent extends PacketData {
  type: 'PREGNANCY';
  trimester: number;
  goals: string[];
  exercises: ExerciseData[];
  nutrition: NutritionData[];
  contraindications: string[];
  warningSign: string[];
  trimesterGuidance: string[];
}

/**
 * Postpartum packet content
 */
export interface PostpartumPacketContent extends PacketData {
  type: 'POSTPARTUM';
  weeksPostpartum: number;
  deliveryType: string;
  goals: string[];
  exercises: ExerciseData[];
  nutrition: NutritionData[];
  coreRehab: string[];
  pelvicFloorGuidance: string[];
  returnToExercise: string[];
}

/**
 * Older adult packet content
 */
export interface OlderAdultPacketContent extends PacketData {
  type: 'OLDER_ADULT';
  functionalGoals: string[];
  exercises: ExerciseData[];
  nutrition: NutritionData[];
  fallPrevention: string[];
  mobilityWork: string[];
  balanceTraining: string[];
  safetyConsiderations: string[];
}

/**
 * Union type for all packet content types
 */
export type AnyPacketContent =
  | GeneralPacketContent
  | NutritionPacketContent
  | TrainingPacketContent
  | AthletePacketContent
  | YouthPacketContent
  | RecoveryPacketContent
  | PregnancyPacketContent
  | PostpartumPacketContent
  | OlderAdultPacketContent;

/**
 * PDF generation options
 */
export interface PDFGenerationOptions {
  includeHeader?: boolean;
  includeFooter?: boolean;
  includeBranding?: boolean;
  colorScheme?: 'default' | 'print' | 'accessible';
}
