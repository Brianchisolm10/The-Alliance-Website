/**
 * Older adult functional screening module
 */

import { Population } from '@prisma/client'
import { BaseAssessmentModule } from './base'
import { AssessmentSection, UnifiedClientProfile } from '../types'

export class ElderlyModule extends BaseAssessmentModule {
  id = 'elderly'
  name = 'Older Adult Functional Assessment'
  description = 'Functional screening and wellness assessment for older adults'
  populations = [Population.OLDER_ADULT]
  priority = 10
  category = 'population' as const
  required = true

  sections: AssessmentSection[] = [
    {
      id: 'functional_screening',
      title: 'Functional Screening',
      description: 'Assessment of your current functional abilities',
      questions: [
        {
          id: 'mobility',
          question: 'How would you describe your current mobility?',
          type: 'select',
          options: [
            'Independent - no assistance needed',
            'Independent with assistive device (cane, walker)',
            'Need occasional assistance',
            'Need frequent assistance',
            'Limited mobility',
          ],
          required: true,
        },
        {
          id: 'balance',
          question: 'How is your balance?',
          type: 'select',
          options: [
            'Excellent - very stable',
            'Good - mostly stable',
            'Fair - occasionally unsteady',
            'Poor - frequently unsteady',
            'Very poor - need support',
          ],
          required: true,
        },
        {
          id: 'fall_history',
          question: 'Have you experienced any falls in the past year?',
          type: 'radio',
          options: ['No falls', '1 fall', '2-3 falls', '4 or more falls'],
          required: true,
        },
        {
          id: 'fall_fear',
          question: 'Do you have a fear of falling?',
          type: 'radio',
          options: ['Not at all', 'Slightly concerned', 'Moderately concerned', 'Very concerned'],
          required: true,
        },
        {
          id: 'strength',
          question: 'How would you rate your overall strength?',
          type: 'select',
          options: [
            'Strong - can do most activities easily',
            'Adequate - can do daily activities',
            'Weak - struggle with some activities',
            'Very weak - difficulty with most activities',
          ],
          required: true,
        },
        {
          id: 'flexibility',
          question: 'How would you rate your flexibility?',
          type: 'select',
          options: [
            'Very flexible',
            'Moderately flexible',
            'Somewhat stiff',
            'Very stiff',
          ],
          required: true,
        },
      ],
    },
    {
      id: 'daily_activities',
      title: 'Activities of Daily Living',
      description: 'Your ability to perform everyday tasks',
      questions: [
        {
          id: 'adl_independence',
          question: 'Which activities can you do independently? (Select all that apply)',
          type: 'checkbox',
          options: [
            'Bathing',
            'Dressing',
            'Eating',
            'Walking',
            'Using the toilet',
            'Getting in/out of bed or chair',
            'Climbing stairs',
            'Carrying groceries',
            'Light housework',
            'Meal preparation',
          ],
          required: true,
        },
        {
          id: 'difficulty_activities',
          question: 'Which activities do you find most difficult?',
          type: 'checkbox',
          options: [
            'None',
            'Getting up from a chair',
            'Climbing stairs',
            'Reaching overhead',
            'Bending down',
            'Walking long distances',
            'Carrying objects',
            'Standing for long periods',
          ],
        },
      ],
    },
    {
      id: 'health_conditions',
      title: 'Health Conditions',
      description: 'Your current health status',
      questions: [
        {
          id: 'chronic_conditions',
          question: 'Do you have any of the following conditions? (Select all that apply)',
          type: 'checkbox',
          options: [
            'None',
            'Arthritis',
            'Osteoporosis',
            'Heart disease',
            'High blood pressure',
            'Diabetes',
            'COPD or lung disease',
            'Stroke history',
            'Parkinson\'s disease',
            'Dementia or cognitive impairment',
            'Other',
          ],
        },
        {
          id: 'medications',
          question: 'How many prescription medications do you take daily?',
          type: 'select',
          options: ['None', '1-2', '3-5', '6-10', 'More than 10'],
          required: true,
        },
        {
          id: 'pain_areas',
          question: 'Do you experience pain in any of these areas? (Select all that apply)',
          type: 'checkbox',
          options: [
            'None',
            'Neck',
            'Shoulders',
            'Back',
            'Hips',
            'Knees',
            'Ankles/feet',
            'Hands/wrists',
          ],
        },
        {
          id: 'pain_level',
          question: 'On average, what is your daily pain level?',
          type: 'range',
          min: 0,
          max: 10,
          step: 1,
          helpText: '0 = No pain, 10 = Worst pain',
          required: true,
        },
      ],
    },
    {
      id: 'elderly_goals',
      title: 'Wellness Goals',
      description: 'What you hope to achieve',
      questions: [
        {
          id: 'primary_goal',
          question: 'What is your primary wellness goal?',
          type: 'select',
          options: [
            'Improve balance and prevent falls',
            'Increase strength and independence',
            'Reduce pain',
            'Improve flexibility and mobility',
            'Maintain current function',
            'Improve cardiovascular health',
            'Social engagement and activity',
          ],
          required: true,
        },
        {
          id: 'motivation',
          question: 'What motivates you to stay active?',
          type: 'checkbox',
          options: [
            'Maintain independence',
            'Spend time with family',
            'Reduce pain',
            'Improve health',
            'Social interaction',
            'Enjoy activities I love',
            'Doctor recommendation',
          ],
        },
        {
          id: 'additional_info',
          question: 'Is there anything else you\'d like us to know?',
          type: 'textarea',
          placeholder: 'Share any additional information...',
        },
      ],
    },
  ]

  extractProfileData(formData: Record<string, any>): Partial<UnifiedClientProfile> {
    return {
      populationData: {
        functionalScreening: {
          mobility: formData.mobility,
          balance: formData.balance,
          strength: formData.strength,
          flexibility: formData.flexibility,
        },
        fallHistory: formData.fall_history !== 'No falls',
        chronicConditions: formData.chronic_conditions || [],
        medications: formData.medications ? [formData.medications] : [],
      },
      movement: {
        painAreas: formData.pain_areas || [],
        mobilityLimitations: formData.difficulty_activities || [],
        fitnessLevel: formData.strength,
      },
      goals: {
        primary: formData.primary_goal,
        motivation: formData.motivation,
      },
    }
  }
}
