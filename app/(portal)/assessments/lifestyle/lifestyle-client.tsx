'use client'

import * as React from 'react'
import { AssessmentForm, AssessmentSection } from '@/components/assessments/assessment-form'
import { saveAssessment } from '@/app/actions/assessments'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/toast'

const lifestyleSections: AssessmentSection[] = [
  {
    id: 'sleep',
    title: 'Sleep Habits',
    description: 'Tell us about your sleep patterns and quality',
    questions: [
      {
        id: 'sleep_hours',
        question: 'How many hours of sleep do you get per night on average?',
        type: 'select',
        options: [
          'Less than 5 hours',
          '5-6 hours',
          '6-7 hours',
          '7-8 hours',
          '8-9 hours',
          'More than 9 hours',
        ],
        required: true,
      },
      {
        id: 'sleep_quality',
        question: 'How would you rate your sleep quality?',
        type: 'select',
        options: [
          'Excellent',
          'Good',
          'Fair',
          'Poor',
          'Very poor',
        ],
        required: true,
      },
      {
        id: 'sleep_consistency',
        question: 'Do you go to bed and wake up at consistent times?',
        type: 'radio',
        options: ['Yes, very consistent', 'Mostly consistent', 'Somewhat inconsistent', 'Very inconsistent'],
        required: true,
      },
      {
        id: 'sleep_issues',
        question: 'Do you experience any sleep issues? (Select all that apply)',
        type: 'checkbox',
        options: [
          'Difficulty falling asleep',
          'Waking up during the night',
          'Waking up too early',
          'Snoring',
          'Sleep apnea',
          'Restless legs',
          'Nightmares',
          'None',
        ],
      },
      {
        id: 'bedtime_routine',
        question: 'Do you have a consistent bedtime routine?',
        type: 'radio',
        options: ['Yes', 'No'],
        required: true,
      },
      {
        id: 'screen_before_bed',
        question: 'How much time do you spend on screens before bed?',
        type: 'select',
        options: [
          'None',
          'Less than 30 minutes',
          '30-60 minutes',
          '1-2 hours',
          'More than 2 hours',
        ],
        required: true,
      },
    ],
  },
  {
    id: 'hydration',
    title: 'Hydration Habits',
    description: 'Tell us about your daily water intake',
    questions: [
      {
        id: 'water_intake',
        question: 'How much water do you drink per day (in ounces)?',
        type: 'select',
        options: [
          'Less than 32 oz (4 cups)',
          '32-48 oz (4-6 cups)',
          '48-64 oz (6-8 cups)',
          '64-80 oz (8-10 cups)',
          'More than 80 oz (10+ cups)',
        ],
        required: true,
      },
      {
        id: 'hydration_consistency',
        question: 'Do you drink water consistently throughout the day?',
        type: 'radio',
        options: ['Yes', 'No'],
        required: true,
      },
      {
        id: 'other_beverages',
        question: 'What other beverages do you regularly consume? (Select all that apply)',
        type: 'checkbox',
        options: [
          'Coffee',
          'Tea',
          'Soda',
          'Energy drinks',
          'Sports drinks',
          'Juice',
          'Alcohol',
          'None',
        ],
      },
      {
        id: 'caffeine_intake',
        question: 'How much caffeine do you consume per day?',
        type: 'select',
        options: [
          'None',
          '1 serving (1 cup coffee/tea)',
          '2-3 servings',
          '4-5 servings',
          'More than 5 servings',
        ],
        required: true,
      },
      {
        id: 'hydration_during_exercise',
        question: 'Do you hydrate adequately during exercise?',
        type: 'radio',
        options: ['Yes', 'No', 'Not applicable'],
        required: true,
      },
    ],
  },
  {
    id: 'stress',
    title: 'Stress & Mental Health',
    description: 'Help us understand your stress levels and mental wellbeing',
    questions: [
      {
        id: 'stress_level',
        question: 'How would you rate your current stress level (1-10)?',
        type: 'select',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        required: true,
      },
      {
        id: 'stress_sources',
        question: 'What are your main sources of stress? (Select all that apply)',
        type: 'checkbox',
        options: [
          'Work',
          'School',
          'Finances',
          'Relationships',
          'Health',
          'Family',
          'Time management',
          'Other',
        ],
      },
      {
        id: 'stress_management',
        question: 'What stress management techniques do you use? (Select all that apply)',
        type: 'checkbox',
        options: [
          'Exercise',
          'Meditation',
          'Deep breathing',
          'Yoga',
          'Journaling',
          'Talking to friends/family',
          'Therapy/counseling',
          'Hobbies',
          'None',
        ],
      },
      {
        id: 'mental_health',
        question: 'How would you rate your overall mental health?',
        type: 'select',
        options: [
          'Excellent',
          'Good',
          'Fair',
          'Poor',
          'Very poor',
        ],
        required: true,
      },
      {
        id: 'mental_health_support',
        question: 'Are you currently working with a mental health professional?',
        type: 'radio',
        options: ['Yes', 'No'],
        required: true,
      },
    ],
  },
  {
    id: 'daily_habits',
    title: 'Daily Habits & Lifestyle',
    description: 'Tell us about your daily routines and habits',
    questions: [
      {
        id: 'work_schedule',
        question: 'What is your typical work/school schedule?',
        type: 'select',
        options: [
          'Regular 9-5',
          'Shift work',
          'Irregular hours',
          'Part-time',
          'Student',
          'Retired',
          'Unemployed',
        ],
        required: true,
      },
      {
        id: 'sitting_time',
        question: 'How many hours per day do you spend sitting?',
        type: 'select',
        options: [
          'Less than 2 hours',
          '2-4 hours',
          '4-6 hours',
          '6-8 hours',
          'More than 8 hours',
        ],
        required: true,
      },
      {
        id: 'commute_time',
        question: 'How long is your daily commute (round trip)?',
        type: 'select',
        options: [
          'No commute',
          'Less than 30 minutes',
          '30-60 minutes',
          '1-2 hours',
          'More than 2 hours',
        ],
        required: true,
      },
      {
        id: 'social_connections',
        question: 'How often do you engage in social activities?',
        type: 'select',
        options: [
          'Daily',
          'Several times per week',
          'Once a week',
          'A few times per month',
          'Rarely',
        ],
        required: true,
      },
      {
        id: 'hobbies',
        question: 'What hobbies or activities do you enjoy outside of work/fitness?',
        type: 'textarea',
        placeholder: 'List your hobbies and interests...',
      },
      {
        id: 'health_priorities',
        question: 'What health and wellness areas are most important to you? (Select all that apply)',
        type: 'checkbox',
        options: [
          'Physical fitness',
          'Mental health',
          'Nutrition',
          'Sleep quality',
          'Stress management',
          'Social connections',
          'Work-life balance',
          'Personal growth',
        ],
      },
      {
        id: 'additional_info',
        question: 'Is there anything else you\'d like us to know about your lifestyle?',
        type: 'textarea',
        placeholder: 'Share any additional information...',
      },
    ],
  },
]

interface LifestyleAssessmentClientProps {
  initialData?: Record<string, any>
}

export const LifestyleAssessmentClient: React.FC<LifestyleAssessmentClientProps> = ({
  initialData,
}) => {
  const router = useRouter()

  const handleSave = async (data: Record<string, any>, completed: boolean) => {
    try {
      await saveAssessment('LIFESTYLE', data, completed)
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
      await saveAssessment('LIFESTYLE', data, true)
      toast({
        title: 'Assessment completed!',
        description: 'Your lifestyle assessment has been completed successfully.',
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
      sections={lifestyleSections}
      initialData={initialData}
      onSave={handleSave}
      onComplete={handleComplete}
    />
  )
}
