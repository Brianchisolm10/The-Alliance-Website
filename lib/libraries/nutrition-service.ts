import { prisma } from '@/lib/db';
import { Population } from '@prisma/client';
import {
  NutritionLibraryItem,
  CreateNutritionInput,
  NutritionSearchFilters,
} from './types';

export class NutritionLibraryService {
  /**
   * Create a new nutrition item in the library
   */
  static async createNutritionItem(
    input: CreateNutritionInput
  ): Promise<NutritionLibraryItem> {
    const item = await prisma.nutritionLibrary.create({
      data: {
        name: input.name,
        description: input.description,
        category: input.category,
        macros: input.macros as any,
        micronutrients: input.micronutrients || {},
        allergens: input.allergens,
        dietaryTags: input.dietaryTags,
        servingSize: input.servingSize,
        populations: input.populations,
        contraindications: (input.contraindications || []) as any,
        alternatives: (input.alternatives || []) as any,
      },
    });

    return this.mapToNutritionItem(item);
  }

  /**
   * Get nutrition item by ID
   */
  static async getNutritionItemById(
    id: string
  ): Promise<NutritionLibraryItem | null> {
    const item = await prisma.nutritionLibrary.findUnique({
      where: { id },
    });

    return item ? this.mapToNutritionItem(item) : null;
  }

  /**
   * Update a nutrition item
   */
  static async updateNutritionItem(
    id: string,
    input: Partial<CreateNutritionInput>
  ): Promise<NutritionLibraryItem> {
    const item = await prisma.nutritionLibrary.update({
      where: { id },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.description && { description: input.description }),
        ...(input.category && { category: input.category }),
        ...(input.macros && { macros: input.macros as any }),
        ...(input.micronutrients !== undefined && {
          micronutrients: input.micronutrients,
        }),
        ...(input.allergens && { allergens: input.allergens }),
        ...(input.dietaryTags && { dietaryTags: input.dietaryTags }),
        ...(input.servingSize && { servingSize: input.servingSize }),
        ...(input.populations && { populations: input.populations }),
        ...(input.contraindications !== undefined && {
          contraindications: input.contraindications as any,
        }),
        ...(input.alternatives !== undefined && {
          alternatives: input.alternatives as any,
        }),
      },
    });

    return this.mapToNutritionItem(item);
  }

  /**
   * Delete a nutrition item
   */
  static async deleteNutritionItem(id: string): Promise<void> {
    await prisma.nutritionLibrary.delete({
      where: { id },
    });
  }

  /**
   * Search and filter nutrition items
   */
  static async searchNutritionItems(
    filters: NutritionSearchFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<{ items: NutritionLibraryItem[]; total: number }> {
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

    // Allergen filter (exclude items with these allergens)
    if (filters.allergens && filters.allergens.length > 0) {
      where.allergens = {
        hasEvery: [],
      };
      where.NOT = {
        allergens: {
          hasSome: filters.allergens,
        },
      };
    }

    // Dietary tags filter
    if (filters.dietaryTags && filters.dietaryTags.length > 0) {
      where.dietaryTags = {
        hasSome: filters.dietaryTags,
      };
    }

    // Population filter
    if (filters.populations && filters.populations.length > 0) {
      where.populations = {
        hasSome: filters.populations,
      };
    }

    const [items, total] = await Promise.all([
      prisma.nutritionLibrary.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.nutritionLibrary.count({ where }),
    ]);

    return {
      items: items.map(this.mapToNutritionItem),
      total,
    };
  }

  /**
   * Get nutrition items for a specific population with safety checks
   */
  static async getNutritionItemsForPopulation(
    population: Population,
    filters?: Omit<NutritionSearchFilters, 'populations'>
  ): Promise<NutritionLibraryItem[]> {
    const result = await this.searchNutritionItems(
      {
        ...filters,
        populations: [population],
      },
      1,
      1000 // Get all for population
    );

    // Filter out items with contraindications for this population
    return result.items.filter((item) => {
      if (!item.contraindications) return true;

      const hasContraindication = item.contraindications.some(
        (c) => c.population === population
      );

      return !hasContraindication;
    });
  }

  /**
   * Get all nutrition categories
   */
  static async getCategories(): Promise<string[]> {
    const items = await prisma.nutritionLibrary.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    return items.map((i) => i.category).sort();
  }

  /**
   * Get all dietary tags
   */
  static async getDietaryTags(): Promise<string[]> {
    const items = await prisma.nutritionLibrary.findMany({
      select: { dietaryTags: true },
    });

    const tagsSet = new Set<string>();
    items.forEach((i) => {
      i.dietaryTags.forEach((tag) => tagsSet.add(tag));
    });

    return Array.from(tagsSet).sort();
  }

  /**
   * Get all allergens
   */
  static async getAllergens(): Promise<string[]> {
    const items = await prisma.nutritionLibrary.findMany({
      select: { allergens: true },
    });

    const allergensSet = new Set<string>();
    items.forEach((i) => {
      i.allergens.forEach((allergen) => allergensSet.add(allergen));
    });

    return Array.from(allergensSet).sort();
  }

  /**
   * Map database model to NutritionLibraryItem
   */
  private static mapToNutritionItem(item: any): NutritionLibraryItem {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      category: item.category,
      macros: item.macros as any,
      micronutrients: item.micronutrients as any,
      allergens: item.allergens,
      dietaryTags: item.dietaryTags,
      servingSize: item.servingSize,
      populations: item.populations,
      contraindications: item.contraindications as any,
      alternatives: item.alternatives as any,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
