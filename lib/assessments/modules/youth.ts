/**
 * Youth-specific assessment module
 */

import { Population } from '@prisma/client'
import { BaseAssessmentModule } from './base'
import { AssessmentSection, UnifiedClientProfile } from '../types'

export class YouthModule extends BaseAssessmentModule {
  id = 'youth'
  name = 'Youth Assessment'
  description = 'Age-appropriate wellness assessment for youth'
  populations = [Population.YOUTH]
  priority = 10
  category = 'population' as const
  required = true

  sections: AssessmentSection[] = [
    {
      id: 'youth_basics',
      title: 'Basic Information',
      description: 'Tell us about the youth participant',
      questions: [
        {
          id: 'age',
          question: 'What is the participant\'s age?',
          type: 'number',
          min: 5,
          max: 18,
          required: true,
        },
        {
          id: 'age_group',
          question: 'Age group',
          type: 'select',
          options: [
            'Child (5-10 years)',
            'Pre-teen (11-12 years)',
            'Teen (13-18 years)',
          ],
          required: true,
        },
        {
          id: 'growth_stage',
          question: 'Current growth stage (if known)',
          type: 'select',
          options: [
            'Pre-puberty',
            'Early puberty',
            'Mid-puberty',
            'Late puberty',
            'Post-puberty',
            'Not sure',
          ],
        },
        {
          id: 'parental_consent',
          question: 'I confirm that I am the parent/legal guardian and consent to this assessment',
          type: 'checkbox',
          options: ['I consent'],
          required: true,
          validation: (value) => {
            if (!value || !value.includes('I consent')) {
              return 'Parental consent is required'
            }
            return null
          },
        },
      ],
    },
    {
      id: 'activity_level',
      title: 'Activity Level',
      description: 'Current physical activity and sports participation',
      questions: [
        {
          id: 'school_sports',
          question: 'Does the participant play any school sports? (Select all that apply)',
          type: 'checkbox',
          options: [
            'None',
            'Basketball',
            'Soccer',
            'Football',
            'Baseball/Softball',
            'Track & Field',
            'Swimming',
            'Volleyball',
            'Tennis',
            'Other',
          ],
        },
        {
          id: 'other_sports',
          question: 'What other sports or activities does the participant do?',
          type: 'text',
          placeholder: 'e.g., Dance, Martial Arts, Gymnastics',
        },
        {
          id: 'activity_frequency',
          question: 'How many days per week is the participant physically active?',
          type: 'select',
          options: ['0-1', '2-3', '4-5', '6-7'],
          required: true,
        },
        {
          id: 'screen_time',
          question: 'How many hours per day does the participant spend on screens (TV, phone, computer, games)?',
          type: 'select',
          options: [
            'Less than 1 hour',
            '1-2 hours',
            '3-4 hours',
            '5-6 hours',
            'More than 6 hours',
          ],
          required: true,
        },
      ],
    },
    {
      id: 'health_development',
      title: 'Health & Development',
      description: 'Health status and developmental considerations',
      questions: [
        {
          id: 'health_conditions',
          question: 'Does the participant have any health conditions? (Select all that apply)',
          type: 'checkbox',
          options: [
            'None',
            'Asthma',
            'Allergies',
            'Diabetes',
            'Heart condition',
            'Joint problems',
            'ADHD',
            'Autism spectrum',
            'Other',
          ],
        },
        {
          id: 'medications',
          question: 'Does the participant take any regular medications?',
          type: 'radio',
          options: ['No', 'Yes'],
          required: true,
        },
        {
          id: 'injury_history',
          question: 'Has the participant had any injuries?',
          type: 'checkbox',
          options: [
            'None',
            'Sprained ankle',
            'Broken bone',
            'Concussion',
            'Growth plate injury',
            'Overuse injury',
            'Other',
          ],
        },
        {
          id: 'physical_limitations',
          question: 'Are there any physical limitations or concerns?',
          type: 'textarea',
          placeholder: 'Describe any limitations or concerns...',
        },
      ],
    },
    {
      id: 'youth_goals',
      title: 'Goals & Interests',
      description: 'What the participant wants to achieve',
      questions: [
        {
          id: 'primary_goal',
          question: 'What is the primary goal?',
          type: 'select',
          options: [
            'Improve sports performance',
            'Get more active',
            'Build confidence',
            'Make friends',
            'Learn new skills',
            'Improve fitness',
            'Have fun',
          ],
          required: true,
        },
        {
          id: 'interests',
          question: 'What types of activities is the participant interested in? (Select all that apply)',
          type: 'checkbox',
          options: [
            'Team sports',
            'Individual sports',
            'Strength training',
            'Running/cardio',
            'Dance/movement',
            'Outdoor activities',
            'Games and challenges',
            'Skill development',
          ],
        },
        {
          id: 'motivation',
          question: 'What motivates the participant?',
          type: 'checkbox',
          options: [
            'Competition',
            'Achievement/goals',
            'Social interaction',
            'Fun and enjoyment',
            'Praise and recognition',
            'Personal improvement',
            'Variety and novelty',
          ],
        },
        {
          id: 'barriers',
          question: 'What are the biggest barriers to being active? (Select all that apply)',
          type: 'checkbox',
          options: [
            'None',
            'Lack of time',
            'Lack of interest',
            'Too much homework',
            'No transportation',
            'Cost',
            'Lack of confidence',
            'Don\'t know what to do',
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
    const ageGroupMap: Record<string, 'child' | 'adolescent' | 'teen'> = {
      'Child (5-10 years)': 'child',
      'Pre-teen (11-12 years)': 'adolescent',
      'Teen (13-18 years)': 'teen',
    }

    return {
      demographics: {
        age: formData.age,
      },
      populationData: {
        ageGroup: ageGroupMap[formData.age_group] || 'child',
        growthStage: formData.growth_stage,
        schoolSports: formData.school_sports || [],
        parentalConsent: formData.parental_consent?.includes('I consent'),
      },
      movement: {
        exerciseFrequency: parseInt(formData.activity_frequency?.split('-')[1] || '0'),
        exerciseTypes: [...(formData.school_sports || []), formData.other_sports].filter(Boolean),
        injuries: formData.injury_history || [],
        fitnessLevel: formData.activity_frequency,
      },
      goals: {
        primary: formData.primary_goal,
        secondary: formData.interests || [],
        motivation: formData.motivation,
        barriers: formData.barriers || [],
      },
      medical: {
        conditions: formData.health_conditions || [],
      },
    }
  }
}
