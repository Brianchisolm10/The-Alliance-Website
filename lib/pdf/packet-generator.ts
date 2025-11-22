/**
 * Packet Auto-Generation Engine
 * 
 * Generates personalized health packets based on:
 * - User population and assessment data
 * - Exercise and nutrition libraries
 * - Population-specific safety rules and constraints
 */

import { prisma } from '@/lib/db/prisma';
import { PacketType, PacketStatus, Population } from '@prisma/client';
import { getUnifiedProfile } from '@/lib/assessments/profile-service';
import { ExerciseLibraryService } from '@/lib/libraries/exercise-service';
import { NutritionLibraryService } from '@/lib/libraries/nutrition-service';
import {
  AnyPacketContent,
  ExerciseData,
  NutritionData,
  GeneralPacketContent,
  NutritionPacketContent,
  TrainingPacketContent,
  AthletePacketContent,
  YouthPacketContent,
  RecoveryPacketContent,
  PregnancyPacketContent,
  PostpartumPacketContent,
  OlderAdultPacketContent,
} from './types';
import { UnifiedClientProfile } from '@/lib/assessments/types';
import { ExerciseLibraryItem, NutritionLibraryItem } from '@/lib/libraries/types';

/**
 * Map population to primary packet type
 */
export function getPacketTypeForPopulation(population: Population): PacketType {
  const mapping: Record<Population, PacketType> = {
    [Population.GENERAL]: PacketType.GENERAL,
    [Population.ATHLETE]: PacketType.ATHLETE_PERFORMANCE,
    [Population.YOUTH]: PacketType.YOUTH,
    [Population.RECOVERY]: PacketType.RECOVERY,
    [Population.PREGNANCY]: PacketType.PREGNANCY,
    [Population.POSTPARTUM]: PacketType.POSTPARTUM,
    [Population.OLDER_ADULT]: PacketType.OLDER_ADULT,
    [Population.CHRONIC_CONDITION]: PacketType.GENERAL,
  };

  return mapping[population];
}

/**
 * Generate packet content based on user profile and population
 */
export async function generatePacketContent(
  userId: string,
  packetType: PacketType
): Promise<AnyPacketContent> {
  // Get user data
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      population: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Get unified profile
  const profile = await getUnifiedProfile(userId);

  // Get exercises and nutrition for population
  const population = user.population || Population.GENERAL;
  const exercises = await getExercisesForPacket(population, profile, packetType);
  const nutrition = await getNutritionForPacket(population, profile, packetType);

  // Generate packet content based on type
  const baseData = {
    id: '', // Will be set when packet is created
    userId: user.id,
    userName: user.name || 'Client',
    userEmail: user.email,
    population,
    generatedAt: new Date(),
    version: 1,
  };

  switch (packetType) {
    case PacketType.GENERAL:
      return generateGeneralPacket(baseData, profile, exercises, nutrition);

    case PacketType.NUTRITION:
      return generateNutritionPacket(baseData, profile, nutrition);

    case PacketType.TRAINING:
      return generateTrainingPacket(baseData, profile, exercises);

    case PacketType.ATHLETE_PERFORMANCE:
      return generateAthletePacket(baseData, profile, exercises, nutrition);

    case PacketType.YOUTH:
      return generateYouthPacket(baseData, profile, exercises, nutrition);

    case PacketType.RECOVERY:
      return generateRecoveryPacket(baseData, profile, exercises);

    case PacketType.PREGNANCY:
      return generatePregnancyPacket(baseData, profile, exercises, nutrition);

    case PacketType.POSTPARTUM:
      return generatePostpartumPacket(baseData, profile, exercises, nutrition);

    case PacketType.OLDER_ADULT:
      return generateOlderAdultPacket(baseData, profile, exercises, nutrition);

    default:
      throw new Error(`Unsupported packet type: ${packetType}`);
  }
}

/**
 * Create a draft packet in the database
 */
export async function createDraftPacket(
  userId: string,
  packetType: PacketType
): Promise<string> {
  // Generate packet content
  const content = await generatePacketContent(userId, packetType);

  // Create packet in database with DRAFT status
  const packet = await prisma.packet.create({
    data: {
      userId,
      type: packetType,
      status: PacketStatus.DRAFT,
      data: content as any,
      version: 1,
    },
  });

  return packet.id;
}

/**
 * Get exercises for packet based on population and profile
 */
async function getExercisesForPacket(
  population: Population,
  profile: UnifiedClientProfile,
  packetType: PacketType
): Promise<ExerciseData[]> {
  // Get available equipment
  const availableEquipment = profile.equipment?.availableEquipment || [];
  
  // Get fitness level
  const fitnessLevel = profile.movement?.fitnessLevel || 'Beginner';
  
  // Map fitness level to difficulty
  const difficultyMap: Record<string, string> = {
    'Beginner': 'Beginner',
    'Intermediate': 'Intermediate',
    'Advanced': 'Advanced',
    'Elite': 'Elite',
  };
  const difficulty = difficultyMap[fitnessLevel] || 'Beginner';

  // Fetch exercises from library
  const libraryExercises = await ExerciseLibraryService.getExercisesForPopulation(
    population,
    {
      difficulty,
      equipment: availableEquipment.length > 0 ? availableEquipment : undefined,
    }
  );

  // Select appropriate exercises based on packet type
  const selectedExercises = selectExercisesForPacketType(
    libraryExercises,
    packetType,
    profile
  );

  // Convert to ExerciseData format with progressions/regressions
  return selectedExercises.map((exercise) => convertToExerciseData(exercise, profile));
}

/**
 * Select exercises appropriate for packet type
 */
function selectExercisesForPacketType(
  exercises: ExerciseLibraryItem[],
  packetType: PacketType,
  profile: UnifiedClientProfile
): ExerciseLibraryItem[] {
  // Filter by category based on packet type
  let filtered = exercises;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  switch (packetType) {
    case PacketType.ATHLETE_PERFORMANCE:
      // Focus on strength and conditioning
      filtered = exercises.filter((e) =>
        ['Strength', 'Plyometric', 'Cardio'].includes(e.category)
      );
      break;

    case PacketType.RECOVERY:
      // Focus on mobility and gentle movement
      filtered = exercises.filter((e) =>
        ['Mobility', 'Flexibility', 'Balance'].includes(e.category)
      );
      break;

    case PacketType.OLDER_ADULT:
      // Focus on balance, mobility, and functional strength
      filtered = exercises.filter((e) =>
        ['Balance', 'Functional', 'Mobility', 'Strength'].includes(e.category)
      );
      break;

    case PacketType.PREGNANCY:
    case PacketType.POSTPARTUM:
      // Focus on core, pelvic floor, and low-impact
      filtered = exercises.filter((e) =>
        ['Core', 'Flexibility', 'Functional', 'Balance'].includes(e.category)
      );
      break;

    case PacketType.YOUTH:
      // Focus on functional movement and skill development
      filtered = exercises.filter((e) =>
        ['Functional', 'Balance', 'Cardio', 'Flexibility'].includes(e.category)
      );
      break;

    default:
      // General training - balanced selection
      break;
  }

  // Apply injury history filters
  if (profile.movement?.injuries && profile.movement.injuries.length > 0) {
    // Contraindications are already filtered by the library service
    // Additional injury-specific filtering could be added here in the future
  }

  // Limit to reasonable number (8-12 exercises per packet)
  const limit = packetType === PacketType.ATHLETE_PERFORMANCE ? 12 : 8;
  return filtered.slice(0, limit);
}

/**
 * Convert library exercise to packet exercise data
 */
function convertToExerciseData(
  exercise: ExerciseLibraryItem,
  profile: UnifiedClientProfile
): ExerciseData {
  // Determine sets and reps based on fitness level and goals
  const fitnessLevel = profile.movement?.fitnessLevel || 'Beginner';
  const primaryGoal = profile.goals?.primary || '';

  let sets = 3;
  let reps = '10-12';

  // Adjust based on fitness level
  if (fitnessLevel === 'Beginner') {
    sets = 2;
    reps = '8-10';
  } else if (fitnessLevel === 'Advanced' || fitnessLevel === 'Elite') {
    sets = 4;
    reps = '12-15';
  }

  // Adjust based on goal
  if (primaryGoal.toLowerCase().includes('strength')) {
    reps = '6-8';
    sets = 4;
  } else if (primaryGoal.toLowerCase().includes('endurance')) {
    reps = '15-20';
    sets = 3;
  }

  return {
    id: exercise.id,
    name: exercise.name,
    description: exercise.description,
    sets,
    reps,
    intensity: exercise.difficulty,
    notes: exercise.instructions,
    videoUrl: exercise.videoUrl,
    imageUrl: exercise.imageUrl,
    modifications: exercise.regressions?.map((r) => r.name) || [],
    contraindications: exercise.contraindications?.map((c) => c.reason) || [],
  };
}

/**
 * Get nutrition items for packet based on population and profile
 */
async function getNutritionForPacket(
  population: Population,
  profile: UnifiedClientProfile,
  packetType: PacketType
): Promise<NutritionData[]> {
  // Get dietary restrictions
  const allergens = profile.dietary?.allergies || [];
  const restrictions = profile.dietary?.restrictions || [];
  
  // Convert restrictions to dietary tags
  const dietaryTags = restrictions.filter((r) =>
    ['Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free'].includes(r)
  );

  // Fetch nutrition items from library
  const libraryItems = await NutritionLibraryService.getNutritionItemsForPopulation(
    population,
    {
      allergens: allergens.length > 0 ? allergens : undefined,
      dietaryTags: dietaryTags.length > 0 ? dietaryTags : undefined,
    }
  );

  // Select items for meal plan
  const selectedItems = selectNutritionForPacketType(
    libraryItems,
    packetType,
    profile
  );

  // Convert to NutritionData format
  return selectedItems.map((item) => convertToNutritionData(item));
}

/**
 * Select nutrition items appropriate for packet type
 */
function selectNutritionForPacketType(
  items: NutritionLibraryItem[],
  _packetType: PacketType,
  _profile: UnifiedClientProfile
): NutritionLibraryItem[] {
  // Group by meal type
  const breakfast = items.filter((i) => i.category === 'Breakfast').slice(0, 2);
  const lunch = items.filter((i) => i.category === 'Lunch').slice(0, 2);
  const dinner = items.filter((i) => i.category === 'Dinner').slice(0, 2);
  const snacks = items.filter((i) => i.category === 'Snack').slice(0, 2);

  return [...breakfast, ...lunch, ...dinner, ...snacks];
}

/**
 * Convert library nutrition item to packet nutrition data
 */
function convertToNutritionData(item: NutritionLibraryItem): NutritionData {
  return {
    id: item.id,
    mealType: item.category,
    foods: [item.name],
    portions: [item.servingSize],
    calories: item.macros.calories,
    macros: {
      protein: item.macros.protein,
      carbs: item.macros.carbs,
      fats: item.macros.fats,
    },
    notes: item.description,
    alternatives: item.alternatives?.map((a) => a.name) || [],
  };
}

/**
 * Generate General Packet
 */
function generateGeneralPacket(
  baseData: any,
  profile: UnifiedClientProfile,
  exercises: ExerciseData[],
  nutrition: NutritionData[]
): GeneralPacketContent {
  const goals = [
    profile.goals?.primary || 'Improve overall health and wellness',
    ...(profile.goals?.secondary || []),
  ].slice(0, 3);

  return {
    ...baseData,
    type: PacketType.GENERAL,
    introduction: `Welcome to your personalized wellness packet! This program is designed to help you achieve your health and fitness goals through a balanced approach to exercise and nutrition.`,
    goals,
    recommendations: [
      'Start with 2-3 workouts per week and gradually increase frequency',
      'Stay hydrated with at least 8 glasses of water daily',
      'Aim for 7-9 hours of quality sleep each night',
      'Listen to your body and rest when needed',
    ],
    exercises: exercises.slice(0, 8),
    nutrition: nutrition.slice(0, 6),
    lifestyle: {
      sleep: `Aim for ${profile.lifestyle?.sleepHours || 8} hours per night`,
      hydration: 'Drink water consistently throughout the day',
      stress: 'Practice stress management techniques daily',
    },
  };
}

/**
 * Generate Nutrition Packet
 */
function generateNutritionPacket(
  baseData: any,
  profile: UnifiedClientProfile,
  nutrition: NutritionData[]
): NutritionPacketContent {
  const restrictions = [
    ...(profile.dietary?.restrictions || []),
    ...(profile.dietary?.allergies || []),
  ];

  return {
    ...baseData,
    type: PacketType.NUTRITION,
    nutritionGoals: [
      'Maintain balanced macronutrient intake',
      'Meet daily micronutrient requirements',
      'Support training and recovery through proper nutrition',
    ],
    mealPlan: nutrition,
    guidelines: [
      'Eat protein with every meal to support muscle recovery',
      'Include colorful vegetables for micronutrient diversity',
      'Stay hydrated before, during, and after exercise',
      'Time meals appropriately around training sessions',
    ],
    restrictions,
    supplements: [],
  };
}

/**
 * Generate Training Packet
 */
function generateTrainingPacket(
  baseData: any,
  profile: UnifiedClientProfile,
  exercises: ExerciseData[]
): TrainingPacketContent {
  return {
    ...baseData,
    type: PacketType.TRAINING,
    trainingGoals: [
      profile.goals?.primary || 'Build strength and endurance',
      ...(profile.goals?.secondary || []).slice(0, 2),
    ],
    program: [
      {
        phase: 'Foundation Phase',
        duration: '4 weeks',
        frequency: '3x per week',
        exercises: exercises.slice(0, 6),
      },
      {
        phase: 'Progressive Phase',
        duration: '4 weeks',
        frequency: '4x per week',
        exercises: exercises.slice(3, 9),
      },
    ],
    progressionPlan: [
      'Increase weight by 5-10% when you can complete all sets with good form',
      'Add 1-2 reps per set every 2 weeks',
      'Progress to more challenging exercise variations',
    ],
    safetyNotes: [
      'Always warm up for 5-10 minutes before training',
      'Use proper form over heavy weight',
      'Rest 48 hours between training the same muscle groups',
      'Stop if you experience sharp pain',
    ],
  };
}

/**
 * Generate Athlete Performance Packet
 */
function generateAthletePacket(
  baseData: any,
  profile: UnifiedClientProfile,
  exercises: ExerciseData[],
  nutrition: NutritionData[]
): AthletePacketContent {
  const sport = profile.populationData?.sport || 'Athletics';
  const position = profile.populationData?.position;

  return {
    ...baseData,
    type: PacketType.ATHLETE_PERFORMANCE,
    sport,
    position,
    performanceGoals: profile.populationData?.performanceGoals || [
      'Improve sport-specific strength',
      'Enhance power and explosiveness',
      'Optimize recovery and performance',
    ],
    strengthProgram: exercises.filter((e) => e.intensity !== 'Cardio').slice(0, 8),
    conditioningProgram: exercises.filter((e) => 
      ['Cardio', 'Plyometric'].some(cat => e.description.includes(cat))
    ).slice(0, 4),
    recoveryProtocol: [
      'Active recovery sessions on off days',
      'Foam rolling and mobility work daily',
      'Ice baths or contrast therapy post-training',
      'Adequate sleep (8-10 hours) for optimal recovery',
    ],
    nutritionStrategy: nutrition,
  };
}

/**
 * Generate Youth Packet
 */
function generateYouthPacket(
  baseData: any,
  profile: UnifiedClientProfile,
  exercises: ExerciseData[],
  nutrition: NutritionData[]
): YouthPacketContent {
  const age = profile.demographics?.age || 12;
  const developmentStage = age < 13 ? 'Pre-adolescent' : age < 18 ? 'Adolescent' : 'Young Adult';

  return {
    ...baseData,
    type: PacketType.YOUTH,
    age,
    developmentStage,
    goals: [
      'Develop fundamental movement skills',
      'Build confidence through physical activity',
      'Establish healthy habits for life',
    ],
    exercises: exercises.slice(0, 6),
    nutrition: nutrition.slice(0, 6),
    parentGuidance: [
      'Supervise all exercise sessions',
      'Encourage fun and variety in activities',
      'Focus on skill development over performance',
      'Ensure adequate rest and recovery',
    ],
    safetyGuidelines: [
      'Use age-appropriate equipment and weights',
      'Emphasize proper form and technique',
      'Avoid specialization in single sport too early',
      'Monitor for signs of overtraining or burnout',
    ],
  };
}

/**
 * Generate Recovery Packet
 */
function generateRecoveryPacket(
  baseData: any,
  profile: UnifiedClientProfile,
  exercises: ExerciseData[]
): RecoveryPacketContent {
  const injuryType = profile.populationData?.injuryType || 'General injury';
  const recoveryStage = profile.populationData?.clearanceStatus || 'Early rehabilitation';

  return {
    ...baseData,
    type: PacketType.RECOVERY,
    injuryType,
    recoveryStage,
    goals: [
      'Restore pain-free range of motion',
      'Rebuild strength and stability',
      'Return to full activity safely',
    ],
    exercises: exercises.slice(0, 6),
    contraindications: profile.populationData?.mobilityRestrictions || [
      'Avoid movements that cause pain',
      'Do not progress too quickly',
    ],
    progressionCriteria: [
      'Pain-free movement through full range of motion',
      'Strength within 90% of uninjured side',
      'Clearance from healthcare provider',
    ],
    returnToActivityPlan: [
      'Phase 1: Pain-free mobility (2-4 weeks)',
      'Phase 2: Strength building (4-6 weeks)',
      'Phase 3: Functional training (4-6 weeks)',
      'Phase 4: Sport-specific training (2-4 weeks)',
    ],
  };
}

/**
 * Generate Pregnancy Packet
 */
function generatePregnancyPacket(
  baseData: any,
  profile: UnifiedClientProfile,
  exercises: ExerciseData[],
  nutrition: NutritionData[]
): PregnancyPacketContent {
  const trimester = profile.populationData?.trimester || 1;

  return {
    ...baseData,
    type: PacketType.PREGNANCY,
    trimester,
    goals: [
      'Maintain fitness safely throughout pregnancy',
      'Prepare body for labor and delivery',
      'Support healthy fetal development',
    ],
    exercises: exercises.slice(0, 6),
    nutrition: nutrition.slice(0, 6),
    contraindications: [
      'Avoid exercises lying flat on back after first trimester',
      'No contact sports or activities with fall risk',
      'Avoid overheating and dehydration',
      'Do not exercise to exhaustion',
    ],
    warningSign: [
      'Vaginal bleeding or fluid leakage',
      'Dizziness or feeling faint',
      'Chest pain or difficulty breathing',
      'Severe headache or visual changes',
      'Contractions or abdominal pain',
    ],
    trimesterGuidance: [
      `Trimester ${trimester}: ${getTrimesterGuidance(trimester)}`,
    ],
  };
}

/**
 * Generate Postpartum Packet
 */
function generatePostpartumPacket(
  baseData: any,
  profile: UnifiedClientProfile,
  exercises: ExerciseData[],
  nutrition: NutritionData[]
): PostpartumPacketContent {
  const weeksPostpartum = profile.populationData?.postpartumWeeks || 6;
  const deliveryType = profile.populationData?.deliveryType || 'vaginal';

  return {
    ...baseData,
    type: PacketType.POSTPARTUM,
    weeksPostpartum,
    deliveryType,
    goals: [
      'Restore core and pelvic floor function',
      'Rebuild strength safely',
      'Support recovery and healing',
    ],
    exercises: exercises.slice(0, 6),
    nutrition: nutrition.slice(0, 6),
    coreRehab: [
      'Begin with diaphragmatic breathing',
      'Progress to gentle core activation',
      'Avoid crunches and planks until cleared',
      'Focus on functional core stability',
    ],
    pelvicFloorGuidance: [
      'Practice pelvic floor exercises (Kegels) daily',
      'Coordinate breathing with pelvic floor activation',
      'Avoid heavy lifting until strength returns',
      'Consider pelvic floor physical therapy if needed',
    ],
    returnToExercise: [
      'Weeks 0-6: Walking and gentle movement only',
      'Weeks 6-12: Gradual return to low-impact exercise',
      'Weeks 12+: Progress to higher intensity with clearance',
      `${deliveryType === 'cesarean' ? 'Allow extra time for incision healing' : 'Monitor for pelvic floor symptoms'}`,
    ],
  };
}

/**
 * Generate Older Adult Packet
 */
function generateOlderAdultPacket(
  baseData: any,
  _profile: UnifiedClientProfile,
  exercises: ExerciseData[],
  nutrition: NutritionData[]
): OlderAdultPacketContent {
  return {
    ...baseData,
    type: PacketType.OLDER_ADULT,
    functionalGoals: [
      'Maintain independence in daily activities',
      'Improve balance and reduce fall risk',
      'Preserve muscle mass and bone density',
      'Enhance mobility and flexibility',
    ],
    exercises: exercises.slice(0, 8),
    nutrition: nutrition.slice(0, 6),
    fallPrevention: [
      'Practice balance exercises daily',
      'Strengthen lower body muscles',
      'Improve home safety (remove tripping hazards)',
      'Use assistive devices when needed',
    ],
    mobilityWork: [
      'Gentle stretching daily',
      'Range of motion exercises',
      'Walking program',
      'Chair-based exercises as needed',
    ],
    balanceTraining: [
      'Single-leg stands with support',
      'Heel-to-toe walking',
      'Sit-to-stand exercises',
      'Tai Chi or similar practices',
    ],
    safetyConsiderations: [
      'Exercise in safe environment with support nearby',
      'Start slowly and progress gradually',
      'Stay hydrated and avoid overheating',
      'Consult healthcare provider before starting',
      'Monitor for dizziness or unusual symptoms',
    ],
  };
}

/**
 * Get trimester-specific guidance
 */
function getTrimesterGuidance(trimester: number): string {
  const guidance = {
    1: 'Focus on maintaining current fitness level. Listen to your body and rest when needed.',
    2: 'Modify exercises as your center of gravity changes. Avoid lying flat on back.',
    3: 'Reduce intensity and focus on comfort. Prepare for labor with breathing and pelvic floor work.',
  };

  return guidance[trimester as keyof typeof guidance] || guidance[1];
}
