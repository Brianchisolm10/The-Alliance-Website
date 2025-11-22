/**
 * Dietary restrictions and preferences module
 * Applicable to all populations
 */

import { Population } from '@prisma/client'
import { BaseAssessmentModule } from './base'
import { AssessmentSection, UnifiedClientProfile } from '../types'

export class DietaryModule extends BaseAssessmentModule {
  id = 'dietary'
  name = 'Dietary Preferences & Restrictions'
  description = 'Food preferences, allergies, and dietary patterns'
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
  priority = 20
  category = 'lifestyle' as const
  required = false

  sections: AssessmentSection[] = [
    {
      id: 'dietary_pattern',
      title: 'Dietary Pattern',
      description: 'Your eating style and preferences',
      questions: [
        {
          id: 'dietary_pattern',
          question: 'Do you follow any specific dietary pattern?',
          type: 'select',
          options: [
            'None',
            'Vegetarian',
            'Vegan',
            'Pescatarian',
            'Keto',
            'Paleo',
            'Mediterranean',
            'Low-carb',
            'Intermittent fasting',
            'Whole30',
            'Other',
          ],
          required: true,
        },
        {
          id: 'cultural_preferences',
          question: 'Do you have any cultural or religious dietary preferences?',
          type: 'checkbox',
          options: [
            'None',
            'Halal',
            'Kosher',
            'Hindu vegetarian',
            'Buddhist vegetarian',
            'Other',
          ],
        },
      ],
    },
    {
      id: 'restrictions',
      title: 'Allergies & Restrictions',
      description: 'Foods you cannot or choose not to eat',
      questions: [
        {
          id: 'food_allergies',
          question: 'Do you have any food allergies? (Select all that apply)',
          type: 'checkbox',
          options: [
            'None',
            'Dairy/Milk',
            'Eggs',
            'Peanuts',
            'Tree nuts',
            'Soy',
            'Wheat/Gluten',
            'Fish',
            'Shellfish',
            'Sesame',
          ],
          required: true,
        },
        {
          id: 'intolerances',
          question: 'Do you have any food intolerances or sensitivities?',
          type: 'checkbox',
          options: [
            'None',
            'Lactose',
            'Gluten',
            'FODMAPs',
            'Histamine',
            'Caffeine',
            'Artificial sweeteners',
            'Other',
          ],
        },
        {
          id: 'dislikes',
          question: 'Are there any foods you strongly dislike or avoid?',
          type: 'textarea',
          placeholder: 'List foods you prefer not to eat...',
        },
      ],
    },
    {
      id: 'eating_habits',
      title: 'Eating Habits',
      description: 'Your typical eating patterns',
      questions: [
        {
          id: 'meals_per_day',
          question: 'How many meals do you typically eat per day?',
          type: 'select',
          options: ['1', '2', '3', '4', '5+'],
          required: true,
        },
        {
          id: 'breakfast_habit',
          question: 'Do you typically eat breakfast?',
          type: 'radio',
          options: ['Yes, every day', 'Most days', 'Sometimes', 'Rarely', 'Never'],
          required: true,
        },
        {
          id: 'cooking_frequency',
          question: 'How often do you cook at home?',
          type: 'select',
          options: [
            'Daily',
            '4-6 times per week',
            '2-3 times per week',
            'Once a week',
            'Rarely',
            'Never',
          ],
          required: true,
        },
        {
          id: 'eating_out',
          question: 'How many times per week do you eat out or order takeout?',
          type: 'select',
          options: ['0-1', '2-3', '4-5', '6-7', '8+'],
          required: true,
        },
      ],
    },
  ]

  extractProfileData(formData: Record<string, any>): Partial<UnifiedClientProfile> {
    return {
      dietary: {
        restrictions: formData.food_allergies || [],
        allergies: formData.food_allergies || [],
        intolerances: formData.intolerances || [],
        dietaryPattern: formData.dietary_pattern,
        culturalPreferences: formData.cultural_preferences || [],
        dislikes: formData.dislikes ? [formData.dislikes] : [],
      },
    }
  }
}
