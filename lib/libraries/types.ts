import { Population } from '@prisma/client';

// Exercise Library Types
export interface ExerciseRegressionProgression {
  id?: string;
  name: string;
  description: string;
}

export interface ExerciseContraindication {
  population: Population;
  reason: string;
  alternatives?: string[];
}

export interface ExerciseLibraryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  targetMuscles: string[];
  equipment: string[];
  difficulty: string;
  videoUrl?: string;
  imageUrl?: string;
  instructions: string;
  regressions?: ExerciseRegressionProgression[];
  progressions?: ExerciseRegressionProgression[];
  contraindications?: ExerciseContraindication[];
  populations: Population[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExerciseInput {
  name: string;
  description: string;
  category: string;
  targetMuscles: string[];
  equipment: string[];
  difficulty: string;
  videoUrl?: string;
  imageUrl?: string;
  instructions: string;
  regressions?: ExerciseRegressionProgression[];
  progressions?: ExerciseRegressionProgression[];
  contraindications?: ExerciseContraindication[];
  populations: Population[];
}

// Nutrition Library Types
export interface NutritionMacros {
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
}

export interface NutritionMicronutrients {
  [key: string]: {
    amount: number;
    unit: string;
  };
}

export interface NutritionContraindication {
  population: Population;
  reason: string;
  alternatives?: string[];
}

export interface NutritionAlternative {
  name: string;
  reason: string;
  populations: Population[];
}

export interface NutritionLibraryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  macros: NutritionMacros;
  micronutrients?: NutritionMicronutrients;
  allergens: string[];
  dietaryTags: string[];
  servingSize: string;
  populations: Population[];
  contraindications?: NutritionContraindication[];
  alternatives?: NutritionAlternative[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNutritionInput {
  name: string;
  description: string;
  category: string;
  macros: NutritionMacros;
  micronutrients?: NutritionMicronutrients;
  allergens: string[];
  dietaryTags: string[];
  servingSize: string;
  populations: Population[];
  contraindications?: NutritionContraindication[];
  alternatives?: NutritionAlternative[];
}

// Search and Filter Types
export interface ExerciseSearchFilters {
  query?: string;
  category?: string;
  difficulty?: string;
  equipment?: string[];
  targetMuscles?: string[];
  populations?: Population[];
}

export interface NutritionSearchFilters {
  query?: string;
  category?: string;
  allergens?: string[];
  dietaryTags?: string[];
  populations?: Population[];
}

// Constants
export const EXERCISE_CATEGORIES = [
  'Strength',
  'Cardio',
  'Flexibility',
  'Balance',
  'Mobility',
  'Core',
  'Plyometric',
  'Functional',
] as const;

export const EXERCISE_DIFFICULTIES = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Elite',
] as const;

export const NUTRITION_CATEGORIES = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snack',
  'Protein',
  'Carbohydrate',
  'Vegetable',
  'Fruit',
  'Healthy Fat',
  'Beverage',
] as const;

export const COMMON_ALLERGENS = [
  'Dairy',
  'Eggs',
  'Fish',
  'Shellfish',
  'Tree Nuts',
  'Peanuts',
  'Wheat',
  'Soy',
  'Sesame',
] as const;

export const DIETARY_TAGS = [
  'Vegan',
  'Vegetarian',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Low-Carb',
  'High-Protein',
  'Keto',
  'Paleo',
  'Whole30',
] as const;
