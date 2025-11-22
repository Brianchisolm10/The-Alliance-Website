import { prisma } from '@/lib/db';
import { Population } from '@prisma/client';
import {
  ExerciseLibraryItem,
  CreateExerciseInput,
  ExerciseSearchFilters,
} from './types';

export class ExerciseLibraryService {
  /**
   * Create a new exercise in the library
   */
  static async createExercise(
    input: CreateExerciseInput
  ): Promise<ExerciseLibraryItem> {
    const exercise = await prisma.exerciseLibrary.create({
      data: {
        name: input.name,
        description: input.description,
        category: input.category,
        targetMuscles: input.targetMuscles,
        equipment: input.equipment,
        difficulty: input.difficulty,
        videoUrl: input.videoUrl,
        imageUrl: input.imageUrl,
        instructions: input.instructions,
        regressions: input.regressions || [],
        progressions: input.progressions || [],
        contraindications: input.contraindications || [],
        populations: input.populations,
      },
    });

    return this.mapToExerciseItem(exercise);
  }

  /**
   * Get exercise by ID
   */
  static async getExerciseById(
    id: string
  ): Promise<ExerciseLibraryItem | null> {
    const exercise = await prisma.exerciseLibrary.findUnique({
      where: { id },
    });

    return exercise ? this.mapToExerciseItem(exercise) : null;
  }

  /**
   * Update an exercise
   */
  static async updateExercise(
    id: string,
    input: Partial<CreateExerciseInput>
  ): Promise<ExerciseLibraryItem> {
    const exercise = await prisma.exerciseLibrary.update({
      where: { id },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.description && { description: input.description }),
        ...(input.category && { category: input.category }),
        ...(input.targetMuscles && { targetMuscles: input.targetMuscles }),
        ...(input.equipment && { equipment: input.equipment }),
        ...(input.difficulty && { difficulty: input.difficulty }),
        ...(input.videoUrl !== undefined && { videoUrl: input.videoUrl }),
        ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl }),
        ...(input.instructions && { instructions: input.instructions }),
        ...(input.regressions !== undefined && {
          regressions: input.regressions,
        }),
        ...(input.progressions !== undefined && {
          progressions: input.progressions,
        }),
        ...(input.contraindications !== undefined && {
          contraindications: input.contraindications,
        }),
        ...(input.populations && { populations: input.populations }),
      },
    });

    return this.mapToExerciseItem(exercise);
  }

  /**
   * Delete an exercise
   */
  static async deleteExercise(id: string): Promise<void> {
    await prisma.exerciseLibrary.delete({
      where: { id },
    });
  }

  /**
   * Search and filter exercises
   */
  static async searchExercises(
    filters: ExerciseSearchFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<{ exercises: ExerciseLibraryItem[]; total: number }> {
    const where: any = {};

    // Text search
    if (filters.query) {
      where.OR = [
        { name: { contains: filters.query, mode: 'insensitive' } },
        { description: { contains: filters.query, mode: 'insensitive' } },
      ];
    }

    // Category filter
    if (filters.category) {
      where.category = filters.category;
    }

    // Difficulty filter
    if (filters.difficulty) {
      where.difficulty = filters.difficulty;
    }

    // Equipment filter
    if (filters.equipment && filters.equipment.length > 0) {
      where.equipment = {
        hasSome: filters.equipment,
      };
    }

    // Target muscles filter
    if (filters.targetMuscles && filters.targetMuscles.length > 0) {
      where.targetMuscles = {
        hasSome: filters.targetMuscles,
      };
    }

    // Population filter
    if (filters.populations && filters.populations.length > 0) {
      where.populations = {
        hasSome: filters.populations,
      };
    }

    const [exercises, total] = await Promise.all([
      prisma.exerciseLibrary.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.exerciseLibrary.count({ where }),
    ]);

    return {
      exercises: exercises.map(this.mapToExerciseItem),
      total,
    };
  }

  /**
   * Get exercises for a specific population with safety checks
   */
  static async getExercisesForPopulation(
    population: Population,
    filters?: Omit<ExerciseSearchFilters, 'populations'>
  ): Promise<ExerciseLibraryItem[]> {
    const result = await this.searchExercises(
      {
        ...filters,
        populations: [population],
      },
      1,
      1000 // Get all for population
    );

    // Filter out exercises with contraindications for this population
    return result.exercises.filter((exercise) => {
      if (!exercise.contraindications) return true;

      const hasContraindication = exercise.contraindications.some(
        (c) => c.population === population
      );

      return !hasContraindication;
    });
  }

  /**
   * Get all exercise categories
   */
  static async getCategories(): Promise<string[]> {
    const exercises = await prisma.exerciseLibrary.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    return exercises.map((e) => e.category).sort();
  }

  /**
   * Get all equipment types
   */
  static async getEquipmentTypes(): Promise<string[]> {
    const exercises = await prisma.exerciseLibrary.findMany({
      select: { equipment: true },
    });

    const equipmentSet = new Set<string>();
    exercises.forEach((e) => {
      e.equipment.forEach((eq) => equipmentSet.add(eq));
    });

    return Array.from(equipmentSet).sort();
  }

  /**
   * Get all target muscles
   */
  static async getTargetMuscles(): Promise<string[]> {
    const exercises = await prisma.exerciseLibrary.findMany({
      select: { targetMuscles: true },
    });

    const musclesSet = new Set<string>();
    exercises.forEach((e) => {
      e.targetMuscles.forEach((m) => musclesSet.add(m));
    });

    return Array.from(musclesSet).sort();
  }

  /**
   * Map database model to ExerciseLibraryItem
   */
  private static mapToExerciseItem(exercise: any): ExerciseLibraryItem {
    return {
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      category: exercise.category,
      targetMuscles: exercise.targetMuscles,
      equipment: exercise.equipment,
      difficulty: exercise.difficulty,
      videoUrl: exercise.videoUrl,
      imageUrl: exercise.imageUrl,
      instructions: exercise.instructions,
      regressions: exercise.regressions as any,
      progressions: exercise.progressions as any,
      contraindications: exercise.contraindications as any,
      populations: exercise.populations,
      createdAt: exercise.createdAt,
      updatedAt: exercise.updatedAt,
    };
  }
}
