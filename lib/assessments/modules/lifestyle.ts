/**
 * Lifestyle habits module
 * Applicable to all populations
 */

import { Population } from '@prisma/client'
import { BaseAssessmentModule } from './base'
import { AssessmentSection, UnifiedClientProfile } from '../types'

export class LifestyleModule extends BaseAssessmentModule {
  id = 'lifestyle'
  name = 'Lifestyle Habits'
  description = 'Sleep, stress, hydration, and daily habits'
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
  priority = 30
  category = 'lifestyle' as const
  required = false

  sections: AssessmentSection[] = [
    {
      id: 'sleep',
      title: 'Sleep Habits',
      description: 'Your sleep patterns and quality',
      questions: [
        {
          id: 'sleep_hours',
          question: 'How many hours of sleep do you get per night on average?',
          type: 'number',
          min: 0,
          max: 24,
          unit: 'hours',
          required: true,
        },
        {
          id: 'sleep_quality',
          question: 'How would you rate your sleep quality?',
          type: 'select',
          options: [
            'Excellent - wake up refreshed',
            'Good - generally restful',
            'Fair - sometimes restless',
            'Poor - often restless',
            'Very poor - rarely restful',
          ],
          required: true,
        },
        {
          id: 'sleep_issues',
          question: 'Do you experience any sleep issues? (Select all that apply)',
          type: 'checkbox',
          options: [
            'None',
            'Difficulty falling asleep',
            'Waking during the night',
            'Waking too early',
            'Snoring',
            'Sleep apnea',
            'Restless legs',
            'Nightmares',
          ],
        },
      ],
    },
    {
      id: 'hydration',
      title: 'Hydration',
      description: 'Your water intake habits',
      questions: [
        {
          id: 'water_intake',
          question: 'How much water do you drink daily (in ounces)?',
          type: 'number',
          min: 0,
          unit: 'oz',
          placeholder: 'e.g., 64',
          required: true,
        },
        {
          id: 'hydration_awareness',
          question: 'How would you rate your hydration habits?',
          type: 'select',
          options: [
            'Excellent - always well hydrated',
            'Good - usually hydrated',
            'Fair - sometimes dehydrated',
            'Poor - often dehydrated',
          ],
          required: true,
        },
        {
          id: 'beverages',
          question: 'What beverages do you regularly consume? (Select all that apply)',
          type: 'checkbox',
          options: [
            'Water',
            'Coffee',
            'Tea',
            'Soda',
            'Energy drinks',
            'Sports drinks',
            'Juice',
            'Alcohol',
          ],
        },
      ],
    },
    {
      id: 'stress',
      title: 'Stress & Mental Wellness',
      description: 'Your stress levels and coping strategies',
      questions: [
        {
          id: 'stress_level',
          question: 'On a scale of 0-10, what is your average stress level?',
          type: 'range',
          min: 0,
          max: 10,
          step: 1,
          helpText: '0 = No stress, 10 = Extreme stress',
          required: true,
        },
        {
          id: 'stress_sources',
          question: 'What are your main sources of stress? (Select all that apply)',
          type: 'checkbox',
          options: [
            'Work',
            'Family',
            'Finances',
            'Health',
            'Relationships',
            'School',
            'Time management',
            'Other',
          ],
        },
        {
          id: 'stress_management',
          question: 'How do you currently manage stress? (Select all that apply)',
          type: 'checkbox',
          options: [
            'Exercise',
            'Meditation',
            'Yoga',
            'Deep breathing',
            'Talking to friends/family',
            'Therapy/counseling',
            'Hobbies',
            'Time in nature',
            'Don\'t have strategies',
          ],
        },
      ],
    },
    {
      id: 'daily_habits',
      title: 'Daily Habits',
      description: 'Other lifestyle factors',
      questions: [
        {
          id: 'occupation',
          question: 'What is your occupation or primary daily activity?',
          type: 'text',
          placeholder: 'e.g., Office worker, Teacher, Student',
          required: true,
        },
        {
          id: 'activity_level',
          question: 'How would you describe your daily activity level (outside of exercise)?',
          type: 'select',
          options: [
            'Sedentary - mostly sitting',
            'Lightly active - some walking',
            'Moderately active - on feet often',
            'Very active - physical job',
          ],
          required: true,
        },
        {
          id: 'smoking',
          question: 'Do you smoke or use tobacco products?',
          type: 'radio',
          options: ['Never', 'Former smoker', 'Occasionally', 'Regularly'],
          required: true,
        },
        {
          id: 'alcohol',
          question: 'How often do you consume alcohol?',
          type: 'select',
          options: [
            'Never',
            'Rarely (few times per year)',
            'Occasionally (1-2 times per month)',
            'Moderately (1-2 times per week)',
            'Frequently (3+ times per week)',
            'Daily',
          ],
          required: true,
        },
      ],
    },
  ]

  extractProfileData(formData: Record<string, any>): Partial<UnifiedClientProfile> {
    return {
      lifestyle: {
        sleepHours: formData.sleep_hours,
        sleepQuality: formData.sleep_quality,
        stressLevel: formData.stress_level,
        hydration: formData.water_intake,
        alcohol: formData.alcohol,
        smoking: formData.smoking,
        occupation: formData.occupation,
        activityLevel: formData.activity_level,
      },
    }
  }
}
