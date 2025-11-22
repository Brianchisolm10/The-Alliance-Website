'use client'

import * as React from 'react'
import { AssessmentForm, AssessmentSection } from '@/components/assessments/assessment-form'
import { saveAssessment } from '@/app/actions/assessments'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/toast'

const nutritionSections: AssessmentSection[] = [
  {
    id: 'basics',
    title: 'Nutrition Basics',
    description: 'Tell us about your current eating habits and goals',
    questions: [
      {
        id: 'primary_goal',
        question: 'What is your primary nutrition goal?',
        type: 'select',
        options: [
          'Weight loss',
          'Muscle gain',
          'Improved energy',
          'Better overall health',
          'Athletic performance',
          'Disease management',
        ],
        required: true,
      },
      {
        id: 'current_diet',
        question: 'How would you describe your current diet?',
        type: 'select',
        options: [
          'Balanced and varied',
          'Mostly healthy with occasional treats',
          'Inconsistent',
          'Fast food heavy',
          'Home-cooked meals',
          'Meal prep focused',
        ],
        required: true,
      },
      {
        id: 'meals_per_day',
        question: 'How many meals do you typically eat per day?',
        type: 'select',
        options: ['1-2', '3', '4-5', '6+'],
        required: true,
      },
      {
        id: 'water_intake',
        question: 'How much water do you drink daily (in ounces)?',
        type: 'number',
        placeholder: 'e.g., 64',
        required: true,
      },
    ],
  },
  {
    id: 'preferences',
    title: 'Dietary Preferences & Restrictions',
    description: 'Help us understand your food preferences and any restrictions',
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
        ],
        required: true,
      },
      {
        id: 'allergies',
        question: 'Do you have any food allergies?',
        type: 'checkbox',
        options: [
          'None',
          'Dairy',
          'Gluten',
          'Nuts',
          'Shellfish',
          'Eggs',
          'Soy',
          'Fish',
        ],
      },
      {
        id: 'dislikes',
        question: 'Are there any foods you strongly dislike or avoid?',
        type: 'textarea',
        placeholder: 'List any foods you prefer not to eat...',
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
    ],
  },
  {
    id: 'habits',
    title: 'Eating Habits & Challenges',
    description: 'Share your eating patterns and any challenges you face',
    questions: [
      {
        id: 'breakfast_habit',
        question: 'Do you typically eat breakfast?',
        type: 'radio',
        options: ['Yes, every day', 'Most days', 'Sometimes', 'Rarely', 'Never'],
        required: true,
      },
      {
        id: 'snacking_frequency',
        question: 'How often do you snack between meals?',
        type: 'select',
        options: [
          'Never',
          '1-2 times per day',
          '3-4 times per day',
          '5+ times per day',
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
      {
        id: 'challenges',
        question: 'What are your biggest nutrition challenges? (Select all that apply)',
        type: 'checkbox',
        options: [
          'Time for meal prep',
          'Emotional eating',
          'Late night snacking',
          'Portion control',
          'Sugar cravings',
          'Eating enough protein',
          'Eating enough vegetables',
          'Staying consistent',
          'Budget constraints',
        ],
      },
      {
        id: 'additional_info',
        question: 'Is there anything else you\'d like us to know about your nutrition?',
        type: 'textarea',
        placeholder: 'Share any additional information that might help us...',
      },
    ],
  },
]

interface NutritionAssessmentClientProps {
  initialData?: Record<string, any>
}

export const NutritionAssessmentClient: React.FC<NutritionAssessmentClientProps> = ({
  initialData,
}) => {
  const router = useRouter()

  const handleSave = async (data: Record<string, any>, completed: boolean) => {
    try {
      await saveAssessment('NUTRITION', data, completed)
      toast({
        title: 'Progress saved',
        description: 'Your assessment progress has been saved.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save progress. Please try again.',
        variant: 'destructive',
      })
      throw error
    }
  }

  const handleComplete = async (data: Record<string, any>) => {
    try {
      await saveAssessment('NUTRITION', data, true)
      toast({
        title: 'Assessment completed!',
        description: 'Your nutrition assessment has been completed successfully.',
      })
      router.push('/assessments')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete assessment. Please try again.',
        variant: 'destructive',
      })
      throw error
    }
  }

  return (
    <AssessmentForm
      sections={nutritionSections}
      initialData={initialData}
      onSave={handleSave}
      onComplete={handleComplete}
    />
  )
}
