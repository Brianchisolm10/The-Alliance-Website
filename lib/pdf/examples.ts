/**
 * PDF Generation Examples
 * 
 * Example content objects for each packet type
 */

import { PacketType } from '@prisma/client';
import {
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

/**
 * Example General Packet Content
 */
export const exampleGeneralPacket: GeneralPacketContent = {
  id: 'packet-general-001',
  type: PacketType.GENERAL,
  userId: 'user-001',
  userName: 'John Doe',
  userEmail: 'john.doe@example.com',
  generatedAt: new Date(),
  version: 1,
  introduction:
    'Welcome to your personalized wellness journey! This packet has been created based on your goals and current fitness level. Follow the recommendations at your own pace and remember that consistency is key to achieving lasting results.',
  goals: [
    'Improve cardiovascular endurance',
    'Build functional strength',
    'Develop healthy eating habits',
    'Improve sleep quality',
  ],
  recommendations: [
    'Exercise 3-4 times per week for 30-45 minutes',
    'Drink at least 8 glasses of water daily',
    'Aim for 7-9 hours of quality sleep each night',
    'Include protein with every meal',
    'Practice stress management techniques daily',
  ],
  exercises: [
    {
      id: 'ex-001',
      name: 'Bodyweight Squats',
      description:
        'Stand with feet shoulder-width apart, lower your hips back and down as if sitting in a chair, then return to standing.',
      sets: 3,
      reps: '12-15',
      notes: 'Keep your chest up and knees tracking over your toes',
    },
    {
      id: 'ex-002',
      name: 'Push-ups',
      description:
        'Start in a plank position, lower your chest to the ground, then push back up.',
      sets: 3,
      reps: '8-12',
      modifications: ['Knee push-ups', 'Wall push-ups', 'Incline push-ups'],
    },
    {
      id: 'ex-003',
      name: 'Walking',
      description: 'Brisk walking at a moderate pace',
      duration: '20-30 minutes',
      intensity: 'Moderate - able to talk but not sing',
    },
  ],
  nutrition: [
    {
      id: 'meal-001',
      mealType: 'Breakfast',
      foods: ['2 eggs', 'Whole grain toast', 'Avocado', 'Berries'],
      macros: { protein: 20, carbs: 35, fats: 15 },
      calories: 350,
    },
    {
      id: 'meal-002',
      mealType: 'Lunch',
      foods: ['Grilled chicken breast', 'Quinoa', 'Mixed vegetables', 'Olive oil'],
      macros: { protein: 35, carbs: 40, fats: 12 },
      calories: 420,
    },
  ],
  lifestyle: {
    sleep: 'Aim for 7-9 hours per night. Establish a consistent bedtime routine and avoid screens 1 hour before bed.',
    hydration: 'Drink at least 8 glasses (64oz) of water daily. Increase intake during exercise.',
    stress: 'Practice 10 minutes of deep breathing or meditation daily. Consider journaling or gentle yoga.',
  },
};

/**
 * Example Nutrition Packet Content
 */
export const exampleNutritionPacket: NutritionPacketContent = {
  id: 'packet-nutrition-001',
  type: PacketType.NUTRITION,
  userId: 'user-002',
  userName: 'Jane Smith',
  userEmail: 'jane.smith@example.com',
  generatedAt: new Date(),
  version: 1,
  nutritionGoals: [
    'Increase protein intake to support muscle growth',
    'Reduce processed sugar consumption',
    'Eat more vegetables and fiber',
    'Maintain consistent meal timing',
  ],
  mealPlan: [
    {
      id: 'meal-001',
      mealType: 'Breakfast (7:00 AM)',
      foods: ['Greek yogurt (1 cup)', 'Mixed berries (1/2 cup)', 'Granola (1/4 cup)', 'Honey (1 tsp)'],
      portions: ['1 cup', '1/2 cup', '1/4 cup', '1 tsp'],
      macros: { protein: 25, carbs: 45, fats: 8 },
      calories: 350,
      notes: 'High protein breakfast to start your day strong',
    },
    {
      id: 'meal-002',
      mealType: 'Mid-Morning Snack (10:00 AM)',
      foods: ['Apple', 'Almond butter (2 tbsp)'],
      macros: { protein: 7, carbs: 30, fats: 16 },
      calories: 280,
    },
    {
      id: 'meal-003',
      mealType: 'Lunch (12:30 PM)',
      foods: ['Grilled salmon (6oz)', 'Brown rice (1 cup)', 'Steamed broccoli (2 cups)', 'Lemon juice'],
      macros: { protein: 40, carbs: 45, fats: 15 },
      calories: 480,
      alternatives: ['Chicken breast', 'Tofu', 'Lean beef'],
    },
  ],
  guidelines: [
    'Eat every 3-4 hours to maintain stable blood sugar',
    'Include protein with every meal and snack',
    'Fill half your plate with vegetables at lunch and dinner',
    'Drink water before, during, and after meals',
    'Limit processed foods and added sugars',
  ],
  restrictions: ['Dairy-free alternatives available', 'Gluten-free options provided'],
  supplements: ['Vitamin D3 (2000 IU daily)', 'Omega-3 fish oil (1000mg daily)'],
};

/**
 * Example Training Packet Content
 */
export const exampleTrainingPacket: TrainingPacketContent = {
  id: 'packet-training-001',
  type: PacketType.TRAINING,
  userId: 'user-003',
  userName: 'Mike Johnson',
  userEmail: 'mike.johnson@example.com',
  generatedAt: new Date(),
  version: 1,
  trainingGoals: [
    'Build overall strength and muscle mass',
    'Improve movement patterns and technique',
    'Increase training volume progressively',
  ],
  program: [
    {
      phase: 'Foundation Phase',
      duration: '4 weeks',
      frequency: '3 days per week',
      exercises: [
        {
          id: 'ex-001',
          name: 'Barbell Back Squat',
          description: 'Compound lower body exercise',
          sets: 4,
          reps: '8-10',
          intensity: '70% 1RM',
          notes: 'Focus on depth and control',
        },
        {
          id: 'ex-002',
          name: 'Bench Press',
          description: 'Compound upper body push',
          sets: 4,
          reps: '8-10',
          intensity: '70% 1RM',
        },
        {
          id: 'ex-003',
          name: 'Bent-Over Rows',
          description: 'Compound upper body pull',
          sets: 4,
          reps: '10-12',
          intensity: 'Moderate',
        },
      ],
    },
    {
      phase: 'Strength Building Phase',
      duration: '4 weeks',
      frequency: '4 days per week',
      exercises: [
        {
          id: 'ex-004',
          name: 'Barbell Back Squat',
          description: 'Compound lower body exercise',
          sets: 5,
          reps: '5-6',
          intensity: '80% 1RM',
          notes: 'Increase weight from foundation phase',
        },
        {
          id: 'ex-005',
          name: 'Deadlift',
          description: 'Full body compound movement',
          sets: 4,
          reps: '5-6',
          intensity: '80% 1RM',
        },
      ],
    },
  ],
  progressionPlan: [
    'Increase weight by 2.5-5lbs when you can complete all sets with good form',
    'Add 1 rep per set before increasing weight',
    'Deload every 4th week by reducing weight by 10%',
    'Track all workouts in a training log',
  ],
  safetyNotes: [
    'Always warm up for 5-10 minutes before lifting',
    'Use a spotter for heavy compound lifts',
    'Stop immediately if you feel sharp pain',
    'Maintain proper form over heavy weight',
  ],
};

/**
 * Example Youth Packet Content
 */
export const exampleYouthPacket: YouthPacketContent = {
  id: 'packet-youth-001',
  type: PacketType.YOUTH,
  userId: 'user-004',
  userName: 'Emma Wilson',
  userEmail: 'parent@example.com',
  age: 12,
  developmentStage: 'Early Adolescence',
  generatedAt: new Date(),
  version: 1,
  goals: [
    'Develop fundamental movement skills',
    'Build confidence in physical activity',
    'Establish healthy habits',
    'Have fun while being active',
  ],
  parentGuidance: [
    'Supervise all activities and ensure proper form',
    'Encourage effort and improvement, not perfection',
    'Make exercise fun and varied to maintain interest',
    'Ensure adequate rest and recovery between sessions',
    'Watch for signs of overtraining or burnout',
  ],
  exercises: [
    {
      id: 'ex-001',
      name: 'Animal Walks',
      description: 'Bear crawls, crab walks, and frog jumps across the room',
      duration: '2-3 minutes',
      notes: 'Great for coordination and making exercise fun!',
      modifications: ['Slower pace', 'Shorter distance', 'Add races for motivation'],
    },
    {
      id: 'ex-002',
      name: 'Jump Rope',
      description: 'Basic jump rope practice',
      sets: 3,
      duration: '30 seconds',
      notes: 'Start with basic jumps, progress to tricks as skill improves',
    },
  ],
  nutrition: [
    {
      id: 'meal-001',
      mealType: 'After-School Snack',
      foods: ['Apple slices', 'Peanut butter', 'Whole grain crackers'],
      notes: 'Provides energy for homework and activities',
    },
  ],
  safetyGuidelines: [
    'Always warm up before activities',
    'Drink water before, during, and after exercise',
    'Stop if feeling dizzy, very tired, or in pain',
    'Use appropriate equipment and safe surfaces',
    'Never exercise alone without adult supervision',
  ],
};

/**
 * Example Athlete Performance Packet Content
 */
export const exampleAthletePacket: AthletePacketContent = {
  id: 'packet-athlete-001',
  type: PacketType.ATHLETE_PERFORMANCE,
  userId: 'user-005',
  userName: 'Alex Rodriguez',
  userEmail: 'alex.rodriguez@example.com',
  generatedAt: new Date(),
  version: 1,
  sport: 'Soccer',
  position: 'Midfielder',
  performanceGoals: [
    'Increase sprint speed and acceleration',
    'Improve agility and change of direction',
    'Build lower body power for jumping',
    'Enhance endurance for 90-minute matches',
  ],
  strengthProgram: [
    {
      id: 'ex-001',
      name: 'Barbell Back Squat',
      description: 'Build lower body strength and power',
      sets: 4,
      reps: '6-8',
      intensity: '75-80% 1RM',
      notes: 'Focus on explosive concentric phase',
    },
    {
      id: 'ex-002',
      name: 'Romanian Deadlift',
      description: 'Strengthen hamstrings and posterior chain',
      sets: 3,
      reps: '8-10',
      intensity: 'Moderate-Heavy',
    },
    {
      id: 'ex-003',
      name: 'Single-Leg Box Step-Ups',
      description: 'Unilateral leg strength and stability',
      sets: 3,
      reps: '10 each leg',
      notes: 'Use 20-24 inch box',
    },
  ],
  conditioningProgram: [
    {
      id: 'cond-001',
      name: 'Sprint Intervals',
      description: '30-second sprints with 90-second recovery',
      sets: 8,
      duration: '30 seconds',
      intensity: 'Maximum effort',
      notes: 'Simulate game-speed running',
    },
    {
      id: 'cond-002',
      name: 'Shuttle Runs',
      description: 'Change of direction conditioning',
      sets: 6,
      duration: '20 seconds',
      notes: '5-10-5 yard pattern',
    },
  ],
  recoveryProtocol: [
    'Ice bath or cold water immersion after intense training',
    'Foam rolling and stretching daily',
    'Sleep 8-9 hours per night',
    'Active recovery on rest days (light jogging, swimming)',
    'Massage therapy weekly during season',
  ],
  nutritionStrategy: [
    {
      id: 'meal-001',
      mealType: 'Pre-Game Meal (3 hours before)',
      foods: ['Grilled chicken', 'White rice', 'Steamed vegetables', 'Banana'],
      macros: { protein: 40, carbs: 80, fats: 10 },
      calories: 550,
      notes: 'Easy to digest, high carb for energy',
    },
    {
      id: 'meal-002',
      mealType: 'Post-Game Recovery',
      foods: ['Protein shake', 'Sweet potato', 'Berries'],
      macros: { protein: 30, carbs: 60, fats: 8 },
      calories: 420,
      notes: 'Consume within 30 minutes of game end',
    },
  ],
};

/**
 * Example Recovery Packet Content
 */
export const exampleRecoveryPacket: RecoveryPacketContent = {
  id: 'packet-recovery-001',
  type: PacketType.RECOVERY,
  userId: 'user-006',
  userName: 'Sarah Martinez',
  userEmail: 'sarah.martinez@example.com',
  generatedAt: new Date(),
  version: 1,
  injuryType: 'ACL Reconstruction',
  recoveryStage: 'Phase 2 - Strength Building (Weeks 6-12)',
  goals: [
    'Restore full range of motion',
    'Build quadriceps and hamstring strength',
    'Improve balance and proprioception',
    'Progress to functional movements',
  ],
  exercises: [
    {
      id: 'ex-001',
      name: 'Quad Sets',
      description: 'Isometric quadriceps contractions',
      sets: 3,
      reps: '15',
      duration: '5 second hold',
      notes: 'Focus on muscle activation',
    },
    {
      id: 'ex-002',
      name: 'Straight Leg Raises',
      description: 'Lying on back, lift straight leg to 45 degrees',
      sets: 3,
      reps: '12-15',
      notes: 'Keep knee locked, control the movement',
    },
    {
      id: 'ex-003',
      name: 'Single-Leg Balance',
      description: 'Stand on affected leg',
      sets: 3,
      duration: '30-60 seconds',
      modifications: ['Use wall for support', 'Progress to unstable surface'],
    },
  ],
  contraindications: [
    'No pivoting or twisting movements',
    'Avoid impact activities (running, jumping)',
    'No deep squats below 90 degrees',
    'Stop if experiencing sharp pain or swelling',
  ],
  progressionCriteria: [
    'Full range of motion without pain',
    'Quad strength at least 70% of uninjured leg',
    'No swelling after exercise',
    'Able to perform single-leg balance for 60 seconds',
    'Clearance from physical therapist',
  ],
  returnToActivityPlan: [
    'Phase 3 (Weeks 12-16): Begin light jogging and agility drills',
    'Phase 4 (Weeks 16-20): Progress to sport-specific movements',
    'Phase 5 (Weeks 20-24): Return to full practice with clearance',
    'Continue strengthening exercises throughout return',
  ],
};

/**
 * Example Pregnancy Packet Content
 */
export const examplePregnancyPacket: PregnancyPacketContent = {
  id: 'packet-pregnancy-001',
  type: PacketType.PREGNANCY,
  userId: 'user-007',
  userName: 'Maria Garcia',
  userEmail: 'maria.garcia@example.com',
  generatedAt: new Date(),
  version: 1,
  trimester: 2,
  goals: [
    'Maintain fitness and strength safely',
    'Prepare body for labor and delivery',
    'Manage pregnancy discomforts',
    'Support healthy weight gain',
  ],
  exercises: [
    {
      id: 'ex-001',
      name: 'Prenatal Squats',
      description: 'Bodyweight squats with wider stance',
      sets: 3,
      reps: '10-12',
      notes: 'Use chair for support if needed',
      modifications: ['Wall squats', 'Partial depth'],
    },
    {
      id: 'ex-002',
      name: 'Modified Side Plank',
      description: 'Side plank from knees',
      sets: 3,
      duration: '15-30 seconds each side',
      notes: 'Maintain neutral spine, avoid sagging',
    },
    {
      id: 'ex-003',
      name: 'Prenatal Walking',
      description: 'Low-impact cardiovascular exercise',
      duration: '20-30 minutes',
      intensity: 'Moderate - able to hold conversation',
    },
  ],
  nutrition: [
    {
      id: 'meal-001',
      mealType: 'Breakfast',
      foods: ['Oatmeal with berries', 'Greek yogurt', 'Walnuts', 'Orange juice'],
      macros: { protein: 20, carbs: 55, fats: 12 },
      calories: 400,
      notes: 'High in fiber and folate',
    },
  ],
  contraindications: [
    'No exercises lying flat on back after first trimester',
    'Avoid contact sports and activities with fall risk',
    'No hot yoga or overheating',
    'Avoid exercises that cause abdominal coning or doming',
    'No heavy lifting or Valsalva maneuver',
  ],
  warningSign: [
    'Vaginal bleeding or fluid leakage',
    'Dizziness or feeling faint',
    'Chest pain or difficulty breathing',
    'Severe headache',
    'Contractions or abdominal pain',
    'Decreased fetal movement',
  ],
  trimesterGuidance: [
    'Second trimester is often the most comfortable for exercise',
    'Energy levels typically improve',
    'Modify exercises as belly grows',
    'Focus on posture and pelvic floor exercises',
    'Stay hydrated and avoid overheating',
  ],
};

/**
 * Example Postpartum Packet Content
 */
export const examplePostpartumPacket: PostpartumPacketContent = {
  id: 'packet-postpartum-001',
  type: PacketType.POSTPARTUM,
  userId: 'user-008',
  userName: 'Jennifer Lee',
  userEmail: 'jennifer.lee@example.com',
  generatedAt: new Date(),
  version: 1,
  weeksPostpartum: 8,
  deliveryType: 'Vaginal',
  goals: [
    'Restore core and pelvic floor function',
    'Gradually return to pre-pregnancy fitness',
    'Address diastasis recti if present',
    'Build strength for baby care activities',
  ],
  exercises: [
    {
      id: 'ex-001',
      name: 'Diaphragmatic Breathing',
      description: 'Deep belly breathing to reconnect with core',
      sets: 3,
      reps: '10 breaths',
      notes: 'Practice throughout the day',
    },
    {
      id: 'ex-002',
      name: 'Pelvic Floor Contractions (Kegels)',
      description: 'Gentle pelvic floor lifts',
      sets: 3,
      reps: '10',
      duration: '5 second hold',
      notes: 'Coordinate with breathing',
    },
    {
      id: 'ex-003',
      name: 'Modified Glute Bridges',
      description: 'Lying on back, lift hips',
      sets: 3,
      reps: '10-12',
      notes: 'Exhale as you lift, engage core',
    },
  ],
  nutrition: [
    {
      id: 'meal-001',
      mealType: 'Nutrient-Dense Snack',
      foods: ['Lactation cookies', 'Almonds', 'Dates', 'Water'],
      notes: 'Support milk production and energy',
    },
  ],
  coreRehab: [
    'Check for diastasis recti before starting ab exercises',
    'Focus on transverse abdominis activation',
    'Avoid crunches and sit-ups until cleared',
    'Practice proper breathing patterns',
    'Progress gradually based on healing',
  ],
  pelvicFloorGuidance: [
    'Pelvic floor exercises are essential for recovery',
    'Consider seeing a pelvic floor physical therapist',
    'Address any incontinence or prolapse symptoms',
    'Coordinate pelvic floor with core exercises',
    'Be patient - healing takes time',
  ],
  returnToExercise: [
    'Weeks 0-6: Walking and gentle stretching only',
    'Weeks 6-12: Add core rehab and light strength training',
    'Weeks 12-16: Progress to moderate intensity exercise',
    'Months 4-6: Gradually return to high-impact activities',
    'Always listen to your body and get medical clearance',
  ],
};

/**
 * Example Older Adult Packet Content
 */
export const exampleOlderAdultPacket: OlderAdultPacketContent = {
  id: 'packet-older-adult-001',
  type: PacketType.OLDER_ADULT,
  userId: 'user-009',
  userName: 'Robert Thompson',
  userEmail: 'robert.thompson@example.com',
  generatedAt: new Date(),
  version: 1,
  functionalGoals: [
    'Maintain independence in daily activities',
    'Improve balance and reduce fall risk',
    'Preserve muscle mass and bone density',
    'Enhance mobility and flexibility',
  ],
  exercises: [
    {
      id: 'ex-001',
      name: 'Chair Squats',
      description: 'Sit-to-stand from chair',
      sets: 3,
      reps: '10-12',
      notes: 'Use arms for assistance if needed',
      modifications: ['Higher chair', 'Use armrests'],
    },
    {
      id: 'ex-002',
      name: 'Wall Push-Ups',
      description: 'Push-ups against wall',
      sets: 3,
      reps: '10-15',
      notes: 'Maintain straight body line',
    },
    {
      id: 'ex-003',
      name: 'Heel-to-Toe Walk',
      description: 'Walk in straight line, heel touching toe',
      duration: '20 steps',
      sets: 3,
      notes: 'Use wall for support if needed',
    },
  ],
  nutrition: [
    {
      id: 'meal-001',
      mealType: 'Protein-Rich Lunch',
      foods: ['Salmon', 'Quinoa', 'Leafy greens', 'Olive oil'],
      macros: { protein: 35, carbs: 40, fats: 15 },
      calories: 450,
      notes: 'High in omega-3s and calcium',
    },
  ],
  fallPrevention: [
    'Remove tripping hazards from home',
    'Install grab bars in bathroom',
    'Ensure adequate lighting',
    'Wear proper footwear with good traction',
    'Practice balance exercises daily',
  ],
  mobilityWork: [
    'Gentle stretching daily for 10-15 minutes',
    'Focus on hips, shoulders, and spine',
    'Use foam roller for tight muscles',
    'Consider tai chi or yoga classes',
  ],
  balanceTraining: [
    'Single-leg stands (hold onto chair)',
    'Tandem walking (heel-to-toe)',
    'Weight shifts side to side',
    'Practice getting up from floor safely',
  ],
  safetyConsiderations: [
    'Always have support nearby when exercising',
    'Start slowly and progress gradually',
    'Stay hydrated throughout the day',
    'Monitor blood pressure if on medications',
    'Stop if experiencing dizziness or chest pain',
    'Get medical clearance before starting new exercises',
  ],
};

// Export all examples
export const PACKET_EXAMPLES = {
  GENERAL: exampleGeneralPacket,
  NUTRITION: exampleNutritionPacket,
  TRAINING: exampleTrainingPacket,
  ATHLETE_PERFORMANCE: exampleAthletePacket,
  YOUTH: exampleYouthPacket,
  RECOVERY: exampleRecoveryPacket,
  PREGNANCY: examplePregnancyPacket,
  POSTPARTUM: examplePostpartumPacket,
  OLDER_ADULT: exampleOlderAdultPacket,
};
