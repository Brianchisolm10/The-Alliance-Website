# Exercise and Nutrition Libraries Setup

## Overview

The exercise and nutrition libraries have been implemented with full CRUD operations, search/filter functionality, population-specific safety rules, and admin management interfaces.

## What's Included

### 1. Database Models
- `ExerciseLibrary` - Stores exercises with regressions, progressions, and contraindications
- `NutritionLibrary` - Stores nutrition items with macros, allergens, and dietary tags

### 2. Service Layer
- `ExerciseLibraryService` - Business logic for exercise management
- `NutritionLibraryService` - Business logic for nutrition management

### 3. Server Actions
- `app/actions/libraries.ts` - Server actions for both libraries with admin authentication

### 4. Admin UI Components
- `ExerciseLibraryForm` - Form for creating/editing exercises
- `NutritionLibraryForm` - Form for creating/editing nutrition items

### 5. Admin Pages
- `/admin/libraries` - Main libraries dashboard
- `/admin/libraries/exercises` - Exercise library management
- `/admin/libraries/nutrition` - Nutrition library management

## Setup Instructions

### 1. Ensure Database is Running

Make sure your PostgreSQL database is running:

```bash
# If using Docker Compose
docker-compose up -d

# Or check if database is accessible
psql $DATABASE_URL -c "SELECT 1"
```

### 2. Seed Sample Data (Optional)

To populate the libraries with sample exercises and nutrition items:

```bash
# Load environment variables and run seed script
npx tsx prisma/seed-libraries.ts
```

This will create:
- 5 sample exercises (Bodyweight Squat, Push-up, Walking, Plank, Deadlift)
- 7 sample nutrition items (Chicken, Rice, Salmon, Yogurt, Spinach, Oatmeal, Almonds)

### 3. Access Admin Interface

1. Log in as an admin user
2. Navigate to `/admin/libraries`
3. Choose either Exercise Library or Nutrition Library
4. Start adding your content!

## Features

### Exercise Library

**Search & Filter:**
- Text search by name/description
- Filter by category (Strength, Cardio, Flexibility, etc.)
- Filter by difficulty (Beginner, Intermediate, Advanced, Elite)
- Filter by equipment
- Filter by target muscles
- Filter by population

**Exercise Management:**
- Create exercises with full details
- Add regressions (easier variations)
- Add progressions (harder variations)
- Set population-specific contraindications
- Add video and image URLs
- Detailed step-by-step instructions

**Safety Features:**
- Population-specific contraindications
- Alternative exercise suggestions
- Automatic filtering for safe exercises per population

### Nutrition Library

**Search & Filter:**
- Text search by name/description
- Filter by category (Breakfast, Lunch, Protein, etc.)
- Filter by dietary tags (Vegan, Gluten-Free, etc.)
- Exclude by allergens
- Filter by population

**Nutrition Management:**
- Create items with complete macro breakdown
- Add micronutrient information
- Tag allergens (Dairy, Eggs, Fish, etc.)
- Add dietary tags (Vegan, Keto, Paleo, etc.)
- Set population-specific contraindications
- Suggest alternatives for restricted items

**Safety Features:**
- Population-specific contraindications
- Allergen tracking
- Alternative food suggestions
- Automatic filtering for safe items per population

## Usage in Packet Generation

When implementing packet generation (Task 14.6), you can use these libraries:

```typescript
import { ExerciseLibraryService, NutritionLibraryService } from '@/lib/libraries';
import { Population } from '@prisma/client';

// Get safe exercises for a pregnant client
const exercises = await ExerciseLibraryService.getExercisesForPopulation(
  Population.PREGNANCY,
  {
    category: 'Strength',
    difficulty: 'Beginner',
  }
);

// Get safe nutrition items for an athlete
const nutrition = await NutritionLibraryService.getNutritionItemsForPopulation(
  Population.ATHLETE,
  {
    category: 'Protein',
    dietaryTags: ['High-Protein'],
  }
);
```

## API Reference

### Exercise Library Service

```typescript
// Create
ExerciseLibraryService.createExercise(input: CreateExerciseInput)

// Read
ExerciseLibraryService.getExerciseById(id: string)
ExerciseLibraryService.searchExercises(filters, page, limit)
ExerciseLibraryService.getExercisesForPopulation(population, filters)

// Update
ExerciseLibraryService.updateExercise(id, input)

// Delete
ExerciseLibraryService.deleteExercise(id)

// Metadata
ExerciseLibraryService.getCategories()
ExerciseLibraryService.getEquipmentTypes()
ExerciseLibraryService.getTargetMuscles()
```

### Nutrition Library Service

```typescript
// Create
NutritionLibraryService.createNutritionItem(input: CreateNutritionInput)

// Read
NutritionLibraryService.getNutritionItemById(id: string)
NutritionLibraryService.searchNutritionItems(filters, page, limit)
NutritionLibraryService.getNutritionItemsForPopulation(population, filters)

// Update
NutritionLibraryService.updateNutritionItem(id, input)

// Delete
NutritionLibraryService.deleteNutritionItem(id)

// Metadata
NutritionLibraryService.getCategories()
NutritionLibraryService.getDietaryTags()
NutritionLibraryService.getAllergens()
```

## Troubleshooting

### Database Connection Issues

If you see "DATABASE_URL is not set" errors:

1. Check your `.env` file has `DATABASE_URL` set
2. Ensure the database is running
3. Test connection: `psql $DATABASE_URL -c "SELECT 1"`

### Seed Script Fails

If the seed script fails:

1. Ensure database is running
2. Run migrations: `npx prisma migrate dev`
3. Generate Prisma client: `npx prisma generate`
4. Try seed again: `npx tsx prisma/seed-libraries.ts`

### Admin Pages Not Accessible

1. Ensure you're logged in as an admin user
2. Check user role is `ADMIN` or `SUPER_ADMIN`
3. Check the admin layout includes library navigation

## Next Steps

After setting up the libraries:

1. **Populate Content**: Add exercises and nutrition items relevant to your populations
2. **Test Safety Rules**: Verify contraindications work correctly
3. **Integrate with Packets**: Use libraries in packet generation (Task 14.6)
4. **Add Media**: Upload exercise videos and images
5. **Build Progressions**: Link related exercises for client progression

## Support

For questions or issues:
- Check the main README: `lib/libraries/README.md`
- Review the types: `lib/libraries/types.ts`
- Examine the services: `lib/libraries/exercise-service.ts` and `nutrition-service.ts`
