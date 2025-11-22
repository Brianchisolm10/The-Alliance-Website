'use client'

import * as React from 'react'
import { AssessmentForm, AssessmentSection } from '@/components/assessments/assessment-form'
import { saveAssessment } from '@/app/actions/assessments'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/toast'

const recoverySections: AssessmentSection[] = [
  {
    id: 'injury_history',
    title: 'Injury History',
    description: 'Tell us about your current or past injuries',
    questions: [
      {
        id: 'current_injury',
        question: 'Do you currently have an injury?',
        type: 'radio',
        options: ['Yes', 'No'],
        required: true,
      },
      {
        id: 'injury_type',
        question: 'What type of injury do you have?',
        type: 'select',
        options: [
          'Muscle strain/tear',
          'Ligament sprain/tear',
          'Tendon injury',
          'Fracture/broken bone',
          'Joint injury',
          'Back/spine injury',
          'Concussion',
          'Overuse injury',
          'Other',
        ],
        condition: (data) => data.current_injury === 'Yes',
      },
      {
        id: 'injury_location',
        question: 'Where is your injury located?',
        type: 'text',
        placeholder: 'e.g., Right knee, Lower back, Left shoulder...',
        condition: (data) => data.current_injury === 'Yes',
      },
      {
        id: 'injury_date',
        question: 'When did the injury occur?',
        type: 'text',
        placeholder: 'e.g., 2 weeks ago, 3 months ago...',
        condition: (data) => data.current_injury === 'Yes',
      },
      {
        id: 'injury_cause',
        question: 'How did the injury happen?',
        type: 'textarea',
        placeholder: 'Describe how the injury occurred...',
        condition: (data) => data.current_injury === 'Yes',
      },
      {
        id: 'past_injuries',
        question: 'Have you had any significant injuries in the past?',
        type: 'radio',
        options: ['Yes', 'No'],
        required: true,
      },
      {
        id: 'past_injuries_details',
        question: 'Please describe your past injuries',
        type: 'textarea',
        placeholder: 'Include injury type, location, and when it occurred...',
        condition: (data) => data.past_injuries === 'Yes',
      },
    ],
  },
  {
    id: 'medical_care',
    title: 'Medical Care & Treatment',
    description: 'Tell us about your medical care and treatment',
    questions: [
      {
        id: 'medical_diagnosis',
        question: 'Have you received a medical diagnosis for your injury?',
        type: 'radio',
        options: ['Yes', 'No', 'Not applicable'],
        required: true,
      },
      {
        id: 'diagnosis_details',
        question: 'What was the diagnosis?',
        type: 'textarea',
        placeholder: 'Describe the medical diagnosis...',
        condition: (data) => data.medical_diagnosis === 'Yes',
      },
      {
        id: 'healthcare_providers',
        question: 'Are you currently working with any healthcare providers? (Select all that apply)',
        type: 'checkbox',
        options: [
          'Physical therapist',
          'Orthopedic doctor',
          'Sports medicine doctor',
          'Chiropractor',
          'Athletic trainer',
          'Massage therapist',
          'None',
        ],
      },
      {
        id: 'treatment_plan',
        question: 'Do you have a treatment or rehabilitation plan?',
        type: 'radio',
        options: ['Yes', 'No'],
        required: true,
      },
      {
        id: 'treatment_details',
        question: 'Please describe your treatment plan',
        type: 'textarea',
        placeholder: 'Include exercises, restrictions, timeline...',
        condition: (data) => data.treatment_plan === 'Yes',
      },
      {
        id: 'clearance_status',
        question: 'Have you been cleared to exercise or return to activity?',
        type: 'select',
        options: [
          'Fully cleared',
          'Partially cleared with restrictions',
          'Not yet cleared',
          'Not applicable',
        ],
        required: true,
      },
    ],
  },
  {
    id: 'current_status',
    title: 'Current Status',
    description: 'Help us understand your current condition',
    questions: [
      {
        id: 'pain_level',
        question: 'What is your current pain level (0-10, where 0 is no pain)?',
        type: 'select',
        options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        required: true,
      },
      {
        id: 'pain_frequency',
        question: 'How often do you experience pain?',
        type: 'select',
        options: [
          'Constantly',
          'Most of the time',
          'Sometimes',
          'Rarely',
          'Never',
        ],
        required: true,
      },
      {
        id: 'pain_triggers',
        question: 'What activities or movements trigger pain?',
        type: 'textarea',
        placeholder: 'Describe what makes the pain worse...',
      },
      {
        id: 'mobility_limitations',
        question: 'Do you have any mobility limitations?',
        type: 'textarea',
        placeholder: 'Describe any movements or activities you cannot do...',
      },
      {
        id: 'current_activity_level',
        question: 'What is your current activity level compared to before injury?',
        type: 'select',
        options: [
          '0% (completely inactive)',
          '25% (very limited activity)',
          '50% (moderate activity)',
          '75% (near normal activity)',
          '100% (full activity)',
        ],
        required: true,
      },
    ],
  },
  {
    id: 'recovery_goals',
    title: 'Recovery Goals',
    description: 'What are your recovery and return-to-activity goals?',
    questions: [
      {
        id: 'primary_goal',
        question: 'What is your primary recovery goal?',
        type: 'select',
        options: [
          'Pain reduction',
          'Restore full range of motion',
          'Regain strength',
          'Return to sport/activity',
          'Prevent re-injury',
          'Improve overall function',
        ],
        required: true,
      },
      {
        id: 'return_timeline',
        question: 'What is your target timeline for return to full activity?',
        type: 'select',
        options: [
          'Less than 1 month',
          '1-3 months',
          '3-6 months',
          '6-12 months',
          'More than 1 year',
          'Uncertain',
        ],
        required: true,
      },
      {
        id: 'specific_goals',
        question: 'What specific activities do you want to return to?',
        type: 'textarea',
        placeholder: 'e.g., Running, playing basketball, lifting weights...',
        required: true,
      },
      {
        id: 'concerns',
        question: 'What are your biggest concerns about recovery?',
        type: 'checkbox',
        options: [
          'Re-injury',
          'Chronic pain',
          'Loss of performance',
          'Long recovery time',
          'Not returning to previous level',
          'Cost of treatment',
          'No concerns',
        ],
      },
      {
        id: 'additional_info',
        question: 'Is there anything else you\'d like us to know about your recovery?',
        type: 'textarea',
        placeholder: 'Share any additional information...',
      },
    ],
  },
]

interface RecoveryAssessmentClientProps {
  initialData?: Record<string, any>
}

export const RecoveryAssessmentClient: React.FC<RecoveryAssessmentClientProps> = ({
  initialData,
}) => {
  const router = useRouter()

  const handleSave = async (data: Record<string, any>, completed: boolean) => {
    try {
      await saveAssessment('RECOVERY', data, completed)
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
      await saveAssessment('RECOVERY', data, true)
      toast({
        title: 'Assessment completed!',
        description: 'Your recovery assessment has been completed successfully.',
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
      sections={recoverySections}
      initialData={initialData}
      onSave={handleSave}
      onComplete={handleComplete}
    />
  )
}
