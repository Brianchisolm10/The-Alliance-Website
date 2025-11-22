import 'dotenv/config';
import { PrismaClient, Population } from '@prisma/client';

const prisma = new PrismaClient();

async function seedExerciseLibrary() {
  console.log('Seeding Exercise Library...');

  const exercises = [
    {
      name: 'Bodyweight Squat',
      description: 'Fundamental lower body exercise using body weight',
      category: 'Strength',
      targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
      equipment: ['None'],
      difficulty: 'Beginner',
      instructions:
        '1. Stand with feet shoulder-width apart\n2. Lower your body by bending knees and hips\n3. Keep chest up and core engaged\n4. Lower until thighs are parallel to ground\n5. Push through heels to return to start',
      populations: [
        Population.GENERAL,
        Population.ATHLETE,
        Population.YOUTH,
        Population.OLDER_ADULT,
      ],
      progressions: [
        {
          name: 'Goblet Squat',
          description: 'Squat while holding a weight at chest level',
        },
        {
          name: 'Barbell Back Squat',
          description: 'Squat with barbell on upper back',
        },
      ],
    },
    {
      name: 'Push-up',
      description: 'Upper body pressing exercise',
      category: 'Strength',
      targetMuscles: ['Chest', 'Shoulders', 'Triceps', 'Core'],
      equipment: ['None'],
      difficulty: 'Beginner',
      instructions:
        '1. Start in plank position with hands shoulder-width apart\n2. Lower body until chest nearly touches ground\n3. Keep core tight and body in straight line\n4. Push back up to start position',
      populations: [
        Population.GENERAL,
        Population.ATHLETE,
        Population.YOUTH,
        Population.RECOVERY,
      ],
      regressions: [
        {
          name: 'Wall Push-up',
          description: 'Push-up performed against a wall',
        },
        {
          name: 'Incline Push-up',
          description: 'Push-up with hands elevated',
        },
      ],
      progressions: [
        {
          name: 'Diamond Push-up',
          description: 'Push-up with hands close together',
        },
      ],
    },
    {
      name: 'Walking',
      description: 'Low-impact cardiovascular exercise',
      category: 'Cardio',
      targetMuscles: ['Legs', 'Core'],
      equipment: ['None'],
      difficulty: 'Beginner',
      instructions:
        '1. Walk at a comfortable pace\n2. Maintain good posture\n3. Swing arms naturally\n4. Start with 10-15 minutes and gradually increase',
      populations: [
        Population.GENERAL,
        Population.OLDER_ADULT,
        Population.PREGNANCY,
        Population.POSTPARTUM,
        Population.RECOVERY,
      ],
    },
    {
      name: 'Plank',
      description: 'Core stability exercise',
      category: 'Core',
      targetMuscles: ['Core', 'Shoulders', 'Back'],
      equipment: ['None'],
      difficulty: 'Beginner',
      instructions:
        '1. Start in forearm plank position\n2. Keep body in straight line from head to heels\n3. Engage core and glutes\n4. Hold for 20-60 seconds',
      populations: [
        Population.GENERAL,
        Population.ATHLETE,
        Population.YOUTH,
      ],
      contraindications: [
        {
          population: Population.PREGNANCY,
          reason: 'Prone position not recommended after first trimester',
          alternatives: ['Side Plank', 'Standing Core Work'],
        },
      ],
    },
    {
      name: 'Deadlift',
      description: 'Compound posterior chain exercise',
      category: 'Strength',
      targetMuscles: ['Hamstrings', 'Glutes', 'Back', 'Core'],
      equipment: ['Barbell', 'Weights'],
      difficulty: 'Intermediate',
      instructions:
        '1. Stand with feet hip-width apart, barbell over mid-foot\n2. Hinge at hips and grip bar\n3. Keep back flat, chest up\n4. Drive through heels to stand up\n5. Lower bar with control',
      populations: [Population.GENERAL, Population.ATHLETE],
      contraindications: [
        {
          population: Population.PREGNANCY,
          reason: 'Heavy loading and prone position not recommended',
          alternatives: ['Bodyweight Hip Hinge', 'Resistance Band Deadlift'],
        },
        {
          population: Population.RECOVERY,
          reason: 'May aggravate lower back injuries',
          alternatives: ['Romanian Deadlift', 'Single-Leg Deadlift'],
        },
      ],
    },
  ];

  for (const exercise of exercises) {
    await prisma.exerciseLibrary.create({
      data: exercise as any,
    });
  }

  console.log(`Created ${exercises.length} exercises`);
}

async function seedNutritionLibrary() {
  console.log('Seeding Nutrition Library...');

  const nutritionItems = [
    {
      name: 'Grilled Chicken Breast',
      description: 'Lean protein source, versatile and easy to prepare',
      category: 'Protein',
      macros: {
        protein: 31,
        carbs: 0,
        fats: 3.6,
        calories: 165,
      },
      allergens: [],
      dietaryTags: ['High-Protein', 'Gluten-Free', 'Dairy-Free'],
      servingSize: '100g (3.5 oz)',
      populations: [
        Population.GENERAL,
        Population.ATHLETE,
        Population.PREGNANCY,
        Population.POSTPARTUM,
        Population.YOUTH,
      ],
    },
    {
      name: 'Brown Rice',
      description: 'Whole grain carbohydrate source with fiber',
      category: 'Carbohydrate',
      macros: {
        protein: 2.6,
        carbs: 23,
        fats: 0.9,
        calories: 111,
      },
      allergens: [],
      dietaryTags: ['Gluten-Free', 'Vegan', 'Whole-Grain'],
      servingSize: '100g cooked',
      populations: [
        Population.GENERAL,
        Population.ATHLETE,
        Population.PREGNANCY,
        Population.POSTPARTUM,
        Population.YOUTH,
        Population.OLDER_ADULT,
      ],
    },
    {
      name: 'Salmon',
      description: 'Fatty fish rich in omega-3 fatty acids',
      category: 'Protein',
      macros: {
        protein: 20,
        carbs: 0,
        fats: 13,
        calories: 208,
      },
      allergens: ['Fish'],
      dietaryTags: ['High-Protein', 'Omega-3', 'Gluten-Free'],
      servingSize: '100g',
      populations: [
        Population.GENERAL,
        Population.ATHLETE,
        Population.PREGNANCY,
        Population.POSTPARTUM,
        Population.OLDER_ADULT,
      ],
      contraindications: [
        {
          population: Population.PREGNANCY,
          reason: 'Limit to 2-3 servings per week due to mercury concerns',
          alternatives: ['Sardines', 'Anchovies', 'Trout'],
        },
      ],
    },
    {
      name: 'Greek Yogurt',
      description: 'High-protein dairy product with probiotics',
      category: 'Protein',
      macros: {
        protein: 10,
        carbs: 3.6,
        fats: 0.4,
        calories: 59,
      },
      allergens: ['Dairy'],
      dietaryTags: ['High-Protein', 'Probiotic', 'Gluten-Free'],
      servingSize: '100g',
      populations: [
        Population.GENERAL,
        Population.ATHLETE,
        Population.PREGNANCY,
        Population.POSTPARTUM,
        Population.YOUTH,
      ],
      alternatives: [
        {
          name: 'Coconut Yogurt',
          reason: 'Dairy-free alternative',
          populations: [Population.GENERAL],
        },
      ],
    },
    {
      name: 'Spinach',
      description: 'Nutrient-dense leafy green vegetable',
      category: 'Vegetable',
      macros: {
        protein: 2.9,
        carbs: 3.6,
        fats: 0.4,
        calories: 23,
      },
      micronutrients: {
        iron: { amount: 2.7, unit: 'mg' },
        calcium: { amount: 99, unit: 'mg' },
        vitaminA: { amount: 9377, unit: 'IU' },
        folate: { amount: 194, unit: 'mcg' },
      },
      allergens: [],
      dietaryTags: ['Vegan', 'Gluten-Free', 'Low-Carb'],
      servingSize: '100g',
      populations: [
        Population.GENERAL,
        Population.ATHLETE,
        Population.PREGNANCY,
        Population.POSTPARTUM,
        Population.YOUTH,
        Population.OLDER_ADULT,
      ],
    },
    {
      name: 'Oatmeal',
      description: 'Whole grain breakfast option with fiber',
      category: 'Breakfast',
      macros: {
        protein: 2.4,
        carbs: 12,
        fats: 1.4,
        calories: 71,
      },
      allergens: [],
      dietaryTags: ['Whole-Grain', 'Vegan', 'High-Fiber'],
      servingSize: '100g cooked',
      populations: [
        Population.GENERAL,
        Population.ATHLETE,
        Population.PREGNANCY,
        Population.POSTPARTUM,
        Population.YOUTH,
        Population.OLDER_ADULT,
      ],
    },
    {
      name: 'Almonds',
      description: 'Nutrient-dense nuts with healthy fats',
      category: 'Healthy Fat',
      macros: {
        protein: 21,
        carbs: 22,
        fats: 49,
        calories: 579,
      },
      allergens: ['Tree Nuts'],
      dietaryTags: ['Vegan', 'Gluten-Free', 'High-Protein'],
      servingSize: '100g (about 23 almonds)',
      populations: [
        Population.GENERAL,
        Population.ATHLETE,
        Population.PREGNANCY,
        Population.POSTPARTUM,
        Population.OLDER_ADULT,
      ],
      contraindications: [
        {
          population: Population.YOUTH,
          reason: 'Choking hazard for young children under 4',
          alternatives: ['Almond Butter', 'Sunflower Seed Butter'],
        },
      ],
    },
  ];

  for (const item of nutritionItems) {
    await prisma.nutritionLibrary.create({
      data: item as any,
    });
  }

  console.log(`Created ${nutritionItems.length} nutrition items`);
}

async function main() {
  try {
    await seedExerciseLibrary();
    await seedNutritionLibrary();
    console.log('Library seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding libraries:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
