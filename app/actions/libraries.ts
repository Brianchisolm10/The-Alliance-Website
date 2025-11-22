'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { ExerciseLibraryService } from '@/lib/libraries/exercise-service';
import { NutritionLibraryService } from '@/lib/libraries/nutrition-service';
import {
  CreateExerciseInput,
  CreateNutritionInput,
  ExerciseSearchFilters,
  NutritionSearchFilters,
} from '@/lib/libraries/types';
import { Population } from '@prisma/client';

// Helper to check admin access
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}

// Exercise Library Actions

export async function createExercise(input: CreateExerciseInput) {
  try {
    await requireAdmin();
    const exercise = await ExerciseLibraryService.createExercise(input);
    revalidatePath('/admin/libraries/exercises');
    return { success: true, data: exercise };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateExercise(
  id: string,
  input: Partial<CreateExerciseInput>
) {
  try {
    await requireAdmin();
    const exercise = await ExerciseLibraryService.updateExercise(id, input);
    revalidatePath('/admin/libraries/exercises');
    return { success: true, data: exercise };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteExercise(id: string) {
  try {
    await requireAdmin();
    await ExerciseLibraryService.deleteExercise(id);
    revalidatePath('/admin/libraries/exercises');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function searchExercises(
  filters: ExerciseSearchFilters,
  page: number = 1,
  limit: number = 20
) {
  try {
    const result = await ExerciseLibraryService.searchExercises(
      filters,
      page,
      limit
    );
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getExerciseById(id: string) {
  try {
    const exercise = await ExerciseLibraryService.getExerciseById(id);
    if (!exercise) {
      return { success: false, error: 'Exercise not found' };
    }
    return { success: true, data: exercise };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getExercisesForPopulation(
  population: Population,
  filters?: Omit<ExerciseSearchFilters, 'populations'>
) {
  try {
    const exercises = await ExerciseLibraryService.getExercisesForPopulation(
      population,
      filters
    );
    return { success: true, data: exercises };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getExerciseCategories() {
  try {
    const categories = await ExerciseLibraryService.getCategories();
    return { success: true, data: categories };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getExerciseEquipmentTypes() {
  try {
    const equipment = await ExerciseLibraryService.getEquipmentTypes();
    return { success: true, data: equipment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getExerciseTargetMuscles() {
  try {
    const muscles = await ExerciseLibraryService.getTargetMuscles();
    return { success: true, data: muscles };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Nutrition Library Actions

export async function createNutritionItem(input: CreateNutritionInput) {
  try {
    await requireAdmin();
    const item = await NutritionLibraryService.createNutritionItem(input);
    revalidatePath('/admin/libraries/nutrition');
    return { success: true, data: item };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateNutritionItem(
  id: string,
  input: Partial<CreateNutritionInput>
) {
  try {
    await requireAdmin();
    const item = await NutritionLibraryService.updateNutritionItem(id, input);
    revalidatePath('/admin/libraries/nutrition');
    return { success: true, data: item };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteNutritionItem(id: string) {
  try {
    await requireAdmin();
    await NutritionLibraryService.deleteNutritionItem(id);
    revalidatePath('/admin/libraries/nutrition');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function searchNutritionItems(
  filters: NutritionSearchFilters,
  page: number = 1,
  limit: number = 20
) {
  try {
    const result = await NutritionLibraryService.searchNutritionItems(
      filters,
      page,
      limit
    );
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getNutritionItemById(id: string) {
  try {
    const item = await NutritionLibraryService.getNutritionItemById(id);
    if (!item) {
      return { success: false, error: 'Nutrition item not found' };
    }
    return { success: true, data: item };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getNutritionItemsForPopulation(
  population: Population,
  filters?: Omit<NutritionSearchFilters, 'populations'>
) {
  try {
    const items =
      await NutritionLibraryService.getNutritionItemsForPopulation(
        population,
        filters
      );
    return { success: true, data: items };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getNutritionCategories() {
  try {
    const categories = await NutritionLibraryService.getCategories();
    return { success: true, data: categories };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getNutritionDietaryTags() {
  try {
    const tags = await NutritionLibraryService.getDietaryTags();
    return { success: true, data: tags };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getNutritionAllergens() {
  try {
    const allergens = await NutritionLibraryService.getAllergens();
    return { success: true, data: allergens };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
