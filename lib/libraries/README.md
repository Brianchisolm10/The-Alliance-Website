# Exercise and Nutrition Libraries

This module provides comprehensive management of exercise and nutrition content with population-specific constraints, safety rules, and search functionality.

## Overview

The libraries system consists of two main components:

1. **Exercise Library** - Exercises with regressions, progressions, and contraindications
2. **Nutrition Library** - Food items with macros, allergens, and dietary tags

Both libraries support:
- Population-specific filtering
- Safety rules and contraindications
- Advanced search and filtering
- Admin management interfaces

## Exercise Library

### Features

- **Exercise Management**: Create, update, delete exercises
- **Regressions/Progressions**: Link easier and harder variations
- **Safety Rules**: Population-specific contraindications
- **Search & Filter**: By category, difficulty, equipment, target muscles, populations
- **Population Support**: Filter exercises safe for specific populations

### Exercise Structure

```typescript
{
  name: string;
  description: string;
  category: string; // Strength, Cardio, Flexibility, etc.
  targetMuscles: string[];
  equipment: string[];
  difficulty: string; // Beginner, Intermediate, Advanced, Elite
  videoUrl?: string;
  imageUrl?: string;
  instructions: string;
  regressions?: ExerciseRegressionProgression[];
  progressions?: ExerciseRegressionProgression[];
  contraindications?: ExerciseContraindication[];
  populations: Population[];
}
```

### Usage Examples

```typescript
import { ExerciseLibraryService } from '@/lib/libraries';

// Create an exercise
const exercise = await ExerciseLibraryService.createExercise({
  name: 'Barbell Squat',
  description: 'Compound lower body exercise',
  category: 'Strength',
  targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
  equipment: ['Barbell', 'Squat Rack'],
  difficulty: 'Intermediate',
  instructions: '1. Stand with feet shoulder-width apart...',
  populations: [Population.GENERAL, Population.ATHLETE],
  contraindications: [
    {
      population: Population.PREGNANCY,
      reason: 'Heavy loading not recommended during pregnancy',
      alternatives: ['Bodyweight Squat', 'Goblet Squat'],
    },
  ],
});

// Search exercises
const result = await ExerciseLibraryService.searchExercises({
  category: 'Strength',
  difficulty: 'Beginner',
  equipment: ['None'],
});

// Get exercises for a specific population (with safety filtering)
const safeExercises = await ExerciseLibraryService.getExercisesForPopulation(
  Population.PREGNANCY
);
```

## Nutrition Library

### Features

- **Nutrition Management**: Create, update, delete nutrition items
- **Macronutrient Tracking**: Protein, carbs, fats, calories
- **Allergen Management**: Track common allergens
- **Dietary Tags**: Vegan, gluten-free, keto, etc.
- **Population Support**: Filter items safe for specific populations
- **Alternatives**: Suggest alternatives for restricted items

### Nutrition Structure

```typescript
{
  name: string;
  description: string;
  category: string; // Breakfast, Lunch, Protein, etc.
  macros: {
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
  };
  micronutrients?: { [key: string]: { amount: number; unit: string } };
  allergens: string[];
  dietaryTags: string[];
  servingSize: string;
  populations: Population[];
  contraindications?: NutritionContraindication[];
  alternatives?: NutritionAlternative[];
}
```

### Usage Examples

```typescript
import { NutritionLibraryService } from '@/lib/libraries';

// Create a nutrition item
const item = await NutritionLibraryService.createNutritionItem({
  name: 'Grilled Chicken Breast',
  description: 'Lean protein source',
  category: 'Protein',
  macros: {
    protein: 31,
    carbs: 0,
    fats: 3.6,
    calories: 165,
  },
  allergens: [],
  dietaryTags: ['High-Protein', 'Gluten-Free'],
  servingSize: '100g',
  populations: [
    Population.GENERAL,
    Population.ATHLETE,
    Population.PREGNANCY,
  ],
});

// Search nutrition items
const result = await NutritionLibraryService.searchNutritionItems({
  category: 'Protein',
  dietaryTags: ['Vegan'],
  allergens: ['Dairy'], // Exclude items with dairy
});

// Get nutrition items for a specific population
const safeItems = await NutritionLibraryService.getNutritionItemsForPopulation(
  Population.PREGNANCY
);
```

## Population-Specific Safety

Both libraries implement population-specific safety filtering:

### Contraindications

Define which populations should avoid specific items:

```typescript
contraindications: [
  {
    population: Population.PREGNANCY,
    reason: 'High mercury content',
    alternatives: ['Salmon', 'Sardines'],
  },
];
```

### Safe Filtering

When fetching items for a population, contraindicated items are automatically filtered out:

```typescript
// Only returns exercises safe for pregnant clients
const exercises = await ExerciseLibraryService.getExercisesForPopulation(
  Population.PREGNANCY
);

// Only returns nutrition items safe for pregnant clients
const nutrition = await NutritionLibraryService.getNutritionItemsForPopulation(
  Population.PREGNANCY
);
```

## Admin Interface

### Exercise Library Management

Navigate to `/admin/libraries/exercises` to:
- View all exercises
- Search and filter exercises
- Create new exercises
- Edit existing exercises
- Delete exercises
- Manage regressions/progressions
- Set population-specific contraindications

### Nutrition Library Management

Navigate to `/admin/libraries/nutrition` to:
- View all nutrition items
- Search and filter items
- Create new items
- Edit existing items
- Delete items
- Set allergens and dietary tags
- Manage population-specific restrictions

## Server Actions

All library operations are exposed as server actions in `app/actions/libraries.ts`:

### Exercise Actions
- `createExercise(input)`
- `updateExercise(id, input)`
- `deleteExercise(id)`
- `searchExercises(filters, page, limit)`
- `getExerciseById(id)`
- `getExercisesForPopulation(population, filters)`
- `getExerciseCategories()`
- `getExerciseEquipmentTypes()`
- `getExerciseTargetMuscles()`

### Nutrition Actions
- `createNutritionItem(input)`
- `updateNutritionItem(id, input)`
- `deleteNutritionItem(id)`
- `searchNutritionItems(filters, page, limit)`
- `getNutritionItemById(id)`
- `getNutritionItemsForPopulation(population, filters)`
- `getNutritionCategories()`
- `getNutritionDietaryTags()`
- `getNutritionAllergens()`

## Database Schema

The libraries use the following Prisma models:

### ExerciseLibrary
- Stores exercise data with JSON fields for complex structures
- Indexed on category, difficulty, and name
- Supports array fields for populations, equipment, and target muscles

### NutritionLibrary
- Stores nutrition data with JSON fields for macros and micronutrients
- Indexed on category and name
- Supports array fields for populations, allergens, and dietary tags

## Future Enhancements

- **Media Management**: Upload and manage exercise videos/images
- **Exercise Variations**: Link related exercises automatically
- **Meal Planning**: Use nutrition library for automated meal plans
- **Recipe Builder**: Combine nutrition items into recipes
- **Import/Export**: Bulk import from CSV or external sources
- **Version History**: Track changes to library items
- **Usage Analytics**: Track which items are used most in packets
