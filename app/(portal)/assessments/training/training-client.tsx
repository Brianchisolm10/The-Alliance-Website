'use client'

import * as React from 'react'
import { AssessmentForm, AssessmentSection } from '@/components/assessments/assessment-form'
import { saveAssessment } from '@/app/actions/assessments'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/toast'

const trainingSections: AssessmentSection[] = [
  {
    id: 'experience',
    title: 'Training Experience',
    description: 'Help us understand your fitness background',
    questions: [
      {
        id: 'experience_level',
        question: 'How would you describe your training experience?',
        type: 'select',
        options: [
          'Complete beginner (never trained)',
          'Beginner (less than 6 months)',
          'Intermediate (6 months - 2 years)',
          'Advanced (2-5 years)',
          'Expert (5+ years)',
        ],
        required: true,
      },
      {
        id: 'current_training',
        question: 'Are you currently following a training program?',
        type: 'radio',
        options: ['Yes', 'No'],
        required: true,
      },
      {
        id: 'current_program_details',
        question: 'Please describe your current training program',
        type: 'textarea',
        placeholder: 'What does your typical week look like?',
        condition: (data) => data.current_training === 'Yes',
      },
      {
        id: 'training_frequency',
        question: 'How many days per week do you currently train?',
        type: 'select',
        options: ['0', '1-2', '3-4', '5-6', '7'],
        required: true,
      },
      {
        id: 'session_duration',
        question: 'How long is your typical training session?',
        type: 'select',
        options: [
          'Less than 30 minutes',
          '30-45 minutes',
          '45-60 minutes',
          '60-90 minutes',
          'More than 90 minutes',
        ],
        required: true,
      },
    ],
  },
  {
    id: 'goals',
    title: 'Training Goals',
    description: 'What do you want to achieve with your training?',
    questions: [
      {
        id: 'primary_goal',
        question: 'What is your primary training goal?',
        type: 'select',
        options: [
          'Build muscle/strength',
          'Lose fat/weight',
          'Improve endurance',
          'Increase athletic performance',
          'General fitness',
          'Rehabilitation/injury recovery',
          'Maintain current fitness',
        ],
        required: true,
      },
      {
        id: 'specific_goals',
        question: 'Do you have any specific performance goals?',
        type: 'textarea',
        placeholder: 'e.g., Run a 5K, bench press 200lbs, complete a triathlon...',
      },
      {
        id: 'timeline',
        question: 'What is your timeline for achieving your goals?',
        type: 'select',
        options: [
          '1-3 months',
          '3-6 months',
          '6-12 months',
          '1+ years',
          'No specific timeline',
        ],
        required: true,
      },
    ],
  },
  {
    id: 'preferences',
    title: 'Training Preferences',
    description: 'Tell us about your training preferences and constraints',
    questions: [
      {
        id: 'training_location',
        question: 'Where do you prefer to train?',
        type: 'select',
        options: [
          'Commercial gym',
          'Home gym',
          'Outdoors',
          'Mix of locations',
          'No preference',
        ],
        required: true,
      },
      {
        id: 'equipment_access',
        question: 'What equipment do you have access to? (Select all that apply)',
        type: 'checkbox',
        options: [
          'Full gym equipment',
          'Dumbbells',
          'Barbells',
          'Resistance bands',
          'Kettlebells',
          'Pull-up bar',
          'Cardio machines',
          'Bodyweight only',
        ],
      },
      {
        id: 'training_style',
        question: 'What training styles interest you? (Select all that apply)',
        type: 'checkbox',
        options: [
          'Strength training',
          'Powerlifting',
          'Olympic weightlifting',
          'Bodybuilding',
          'CrossFit',
          'HIIT',
          'Cardio/running',
          'Yoga/mobility',
          'Sports-specific',
        ],
      },
      {
        id: 'time_constraints',
        question: 'Do you have any time constraints for training?',
        type: 'textarea',
        placeholder: 'e.g., Can only train in the morning, limited to 30-minute sessions...',
      },
    ],
  },
  {
    id: 'health',
    title: 'Health & Limitations',
    description: 'Help us ensure your training program is safe and effective',
    questions: [
      {
        id: 'injuries',
        question: 'Do you have any current or past injuries?',
        type: 'radio',
        options: ['Yes', 'No'],
        required: true,
      },
      {
        id: 'injury_details',
        question: 'Please describe your injuries and any limitations',
        type: 'textarea',
        placeholder: 'Include any movements or exercises you need to avoid...',
        condition: (data) => data.injuries === 'Yes',
      },
      {
        id: 'medical_conditions',
        question: 'Do you have any medical conditions we should be aware of?',
        type: 'radio',
        options: ['Yes', 'No'],
        required: true,
      },
      {
        id: 'medical_details',
        question: 'Please describe your medical conditions',
        type: 'textarea',
        placeholder: 'Include any relevant medical information...',
        condition: (data) => data.medical_conditions === 'Yes',
      },
      {
        id: 'clearance',
        question: 'Have you been cleared by a doctor to exercise?',
        type: 'radio',
        options: ['Yes', 'No', 'Not applicable'],
        required: true,
      },
      {
        id: 'additional_info',
        question: 'Is there anything else you\'d like us to know about your training?',
        type: 'textarea',
        placeholder: 'Share any additional information...',
      },
    ],
  },
]

interface TrainingAssessmentClientProps {
  initialData?: Record<string, any>
}

export const TrainingAssessmentClient: React.FC<TrainingAssessmentClientProps> = ({
  initialData,
}) => {
  const router = useRouter()

  const handleSave = async (data: Record<string, any>, completed: boolean) => {
    try {
      await saveAssessment('TRAINING', data, completed)
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
      await saveAssessment('TRAINING', data, true)
      toast({
        title: 'Assessment completed!',
        description: 'Your training assessment has been completed successfully.',
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
      sections={trainingSections}
      initialData={initialData}
      onSave={handleSave}
      onComplete={handleComplete}
    />
  )
}
