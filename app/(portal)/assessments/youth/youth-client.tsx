'use client'

import * as React from 'react'
import { AssessmentForm, AssessmentSection } from '@/components/assessments/assessment-form'
import { saveAssessment } from '@/app/actions/assessments'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/toast'

const youthSections: AssessmentSection[] = [
  {
    id: 'basic_info',
    title: 'Basic Information',
    description: 'Tell us about yourself',
    questions: [
      {
        id: 'age',
        question: 'How old are you?',
        type: 'number',
        placeholder: 'Enter your age',
        required: true,
      },
      {
        id: 'grade',
        question: 'What grade are you in?',
        type: 'select',
        options: [
          'Elementary (K-5)',
          'Middle School (6-8)',
          'High School (9-12)',
          'Not in school',
        ],
        required: true,
      },
      {
        id: 'parent_involved',
        question: 'Is a parent or guardian helping you with this assessment?',
        type: 'radio',
        options: ['Yes', 'No'],
        required: true,
      },
    ],
  },
  {
    id: 'activity_level',
    title: 'Activity & Sports',
    description: 'Tell us about your physical activities',
    questions: [
      {
        id: 'sports_participation',
        question: 'Do you play any sports?',
        type: 'radio',
        options: ['Yes', 'No'],
        required: true,
      },
      {
        id: 'sports_list',
        question: 'What sports do you play?',
        type: 'textarea',
        placeholder: 'List all sports you participate in...',
        condition: (data) => data.sports_participation === 'Yes',
      },
      {
        id: 'activity_frequency',
        question: 'How many days per week are you physically active?',
        type: 'select',
        options: ['0-1', '2-3', '4-5', '6-7'],
        required: true,
      },
      {
        id: 'favorite_activities',
        question: 'What are your favorite physical activities?',
        type: 'checkbox',
        options: [
          'Running',
          'Swimming',
          'Biking',
          'Dancing',
          'Playing outside',
          'Team sports',
          'Martial arts',
          'Gymnastics',
          'Video games (active)',
        ],
      },
      {
        id: 'screen_time',
        question: 'How much time do you spend on screens per day (TV, phone, computer)?',
        type: 'select',
        options: [
          'Less than 1 hour',
          '1-2 hours',
          '2-4 hours',
          '4-6 hours',
          'More than 6 hours',
        ],
        required: true,
      },
    ],
  },
  {
    id: 'health_habits',
    title: 'Health Habits',
    description: 'Tell us about your daily habits',
    questions: [
      {
        id: 'sleep_hours',
        question: 'How many hours of sleep do you get on school nights?',
        type: 'select',
        options: [
          'Less than 6 hours',
          '6-7 hours',
          '7-8 hours',
          '8-9 hours',
          '9-10 hours',
          'More than 10 hours',
        ],
        required: true,
      },
      {
        id: 'breakfast_habit',
        question: 'Do you eat breakfast before school?',
        type: 'radio',
        options: ['Always', 'Most days', 'Sometimes', 'Rarely', 'Never'],
        required: true,
      },
      {
        id: 'water_intake',
        question: 'How much water do you drink per day?',
        type: 'select',
        options: [
          'Less than 2 cups',
          '2-4 cups',
          '4-6 cups',
          '6-8 cups',
          'More than 8 cups',
        ],
        required: true,
      },
      {
        id: 'fruit_veggie_intake',
        question: 'How many servings of fruits and vegetables do you eat per day?',
        type: 'select',
        options: ['0-1', '2-3', '4-5', '5+'],
        required: true,
      },
      {
        id: 'snack_choices',
        question: 'What are your typical snack choices? (Select all that apply)',
        type: 'checkbox',
        options: [
          'Fresh fruit',
          'Vegetables',
          'Chips',
          'Cookies/candy',
          'Yogurt',
          'Nuts',
          'Crackers',
          'Granola bars',
        ],
      },
    ],
  },
  {
    id: 'goals_interests',
    title: 'Goals & Interests',
    description: 'What do you want to achieve?',
    questions: [
      {
        id: 'fitness_goals',
        question: 'What are your fitness goals? (Select all that apply)',
        type: 'checkbox',
        options: [
          'Get stronger',
          'Run faster',
          'Be more flexible',
          'Have more energy',
          'Be better at my sport',
          'Make new friends',
          'Have fun being active',
          'Learn new skills',
        ],
      },
      {
        id: 'challenges',
        question: 'What makes it hard for you to be active? (Select all that apply)',
        type: 'checkbox',
        options: [
          'Too much homework',
          'Not enough time',
          'Feel tired',
          'Don\'t enjoy it',
          'No one to do it with',
          'Don\'t know what to do',
          'Weather',
          'No challenges',
        ],
      },
      {
        id: 'support_system',
        question: 'Who supports your fitness and health? (Select all that apply)',
        type: 'checkbox',
        options: [
          'Parents/guardians',
          'Siblings',
          'Friends',
          'Coaches',
          'Teachers',
          'Other family members',
        ],
      },
      {
        id: 'additional_info',
        question: 'Is there anything else you want to tell us?',
        type: 'textarea',
        placeholder: 'Share anything else you think is important...',
      },
    ],
  },
]

interface YouthAssessmentClientProps {
  initialData?: Record<string, any>
}

export const YouthAssessmentClient: React.FC<YouthAssessmentClientProps> = ({
  initialData,
}) => {
  const router = useRouter()

  const handleSave = async (data: Record<string, any>, completed: boolean) => {
    try {
      await saveAssessment('YOUTH', data, completed)
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
      await saveAssessment('YOUTH', data, true)
      toast({
        title: 'Assessment completed!',
        description: 'Your youth assessment has been completed successfully.',
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
      sections={youthSections}
      initialData={initialData}
      onSave={handleSave}
      onComplete={handleComplete}
    />
  )
}
