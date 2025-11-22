/**
 * Movement readiness and fitness assessment module
 * Applicable to all populations
 */

import { Population } from '@prisma/client'
import { BaseAssessmentModule } from './base'
import { AssessmentSection, UnifiedClientProfile } from '../types'

export class MovementModule extends BaseAssessmentModule {
  id = 'movement'
  name = 'Movement Readiness'
  description = 'Current fitness level, activity, and movement capabilities'
  populations = [
    Population.GENERAL,
    Population.ATHLETE,
    Population.YOUTH,
    Population.RECOVERY,
    Population.PREGNANCY,
    Population.POSTPARTUM,
    Population.OLDER_ADULT,
    Population.CHRONIC_CONDITION,
  ]
  priority = 40
  category = 'lifestyle' as const
  required = false

  sections: AssessmentSection[] = [
    {
      id: 'current_activity',
      title: 'Current Activity Level',
      description: 'Your current exercise and movement habits',
      questions: [
        {
          id: 'exercise_frequency',
          question: 'How many days per week do you currently exercise?',
          type: 'select',
          options: ['0', '1', '2', '3', '4', '5', '6', '7'],
          required: true,
        },
        {
          id: 'exercise_types',
          question: 'What types of exercise do you currently do? (Select all that apply)',
          type: 'checkbox',
          options: [
            'None',
            'Walking',
            'Running',
            'Cycling',
            'Swimming',
            'Strength training',
            'Yoga',
            'Pilates',
            'Sports',
            'Dance',
            'Hiking',
            'Group fitness classes',
          ],
        },
        {
          id: 'exercise_duration',
          question: 'How long is a typical exercise session?',
          type: 'select',
          options: [
            'Less than 15 minutes',
            '15-30 minutes',
            '30-45 minutes',
            '45-60 minutes',
            'More than 60 minutes',
          ],
          condition: (data) => data.exercise_frequency !== '0',
        },
        {
          id: 'fitness_level',
          question: 'How would you rate your current fitness level?',
          type: 'select',
          options: [
            'Beginner - new to exercise',
            'Novice - some experience',
            'Intermediate - regular exerciser',
            'Advanced - very fit',
            'Elite - competitive athlete',
          ],
          required: true,
        },
      ],
    },
    {
      id: 'movement_quality',
      title: 'Movement Quality',
      description: 'How your body moves and feels',
      questions: [
        {
          id: 'pain_areas',
          question: 'Do you experience pain in any areas during movement? (Select all that apply)',
          type: 'checkbox',
          options: [
            'None',
            'Neck',
            'Shoulders',
            'Upper back',
            'Lower back',
            'Hips',
            'Knees',
            'Ankles',
            'Wrists',
            'Other',
          ],
        },
        {
          id: 'mobility_limitations',
          question: 'Do you have any mobility limitations? (Select all that apply)',
          type: 'checkbox',
          options: [
            'None',
            'Limited overhead reach',
            'Difficulty squatting',
            'Tight hamstrings',
            'Tight hips',
            'Limited ankle mobility',
            'Limited shoulder mobility',
            'Balance issues',
            'Coordination challenges',
          ],
        },
        {
          id: 'previous_injuries',
          question: 'Have you had any significant injuries in the past?',
          type: 'checkbox',
          options: [
            'None',
            'Ankle sprain',
            'Knee injury',
            'Back injury',
            'Shoulder injury',
            'Hip injury',
            'Fracture',
            'Surgery',
            'Other',
          ],
        },
      ],
    },
    {
      id: 'movement_goals',
      title: 'Movement Goals',
      description: 'What you want to achieve',
      questions: [
        {
          id: 'primary_goal',
          question: 'What is your primary fitness goal?',
          type: 'select',
          options: [
            'Lose weight',
            'Build muscle',
            'Improve endurance',
            'Increase strength',
            'Improve flexibility',
            'Better balance',
            'Pain reduction',
            'General health',
            'Sport performance',
          ],
          required: true,
        },
        {
          id: 'secondary_goals',
          question: 'What other goals do you have? (Select all that apply)',
          type: 'checkbox',
          options: [
            'More energy',
            'Better sleep',
            'Stress reduction',
            'Improved posture',
            'Injury prevention',
            'Functional fitness',
            'Body composition',
            'Confidence',
          ],
        },
        {
          id: 'timeline',
          question: 'What is your timeline for achieving your goals?',
          type: 'select',
          options: [
            '1-3 months',
            '3-6 months',
            '6-12 months',
            'More than 1 year',
            'Ongoing/lifestyle',
          ],
          required: true,
        },
      ],
    },
  ]

  extractProfileData(formData: Record<string, any>): Partial<UnifiedClientProfile> {
    return {
      movement: {
        currentActivity: formData.fitness_level,
        exerciseFrequency: parseInt(formData.exercise_frequency || '0'),
        exerciseTypes: formData.exercise_types || [],
        injuries: formData.previous_injuries || [],
        painAreas: formData.pain_areas || [],
        mobilityLimitations: formData.mobility_limitations || [],
        fitnessLevel: formData.fitness_level,
      },
      goals: {
        primary: formData.primary_goal,
        secondary: formData.secondary_goals || [],
        timeline: formData.timeline,
      },
    }
  }
}
