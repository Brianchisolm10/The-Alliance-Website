'use client'

import * as React from 'react'
import { AssessmentForm, AssessmentSection } from '@/components/assessments/assessment-form'
import { saveAssessment } from '@/app/actions/assessments'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/toast'

const performanceSections: AssessmentSection[] = [
  {
    id: 'athletic_background',
    title: 'Athletic Background',
    description: 'Tell us about your sport and competitive experience',
    questions: [
      {
        id: 'primary_sport',
        question: 'What is your primary sport?',
        type: 'text',
        placeholder: 'e.g., Basketball, Soccer, Track & Field...',
        required: true,
      },
      {
        id: 'position',
        question: 'What position do you play (if applicable)?',
        type: 'text',
        placeholder: 'e.g., Point Guard, Midfielder, Sprinter...',
      },
      {
        id: 'competition_level',
        question: 'What is your current competition level?',
        type: 'select',
        options: [
          'Recreational',
          'High School',
          'College/University',
          'Semi-Professional',
          'Professional',
          'Elite/Olympic',
        ],
        required: true,
      },
      {
        id: 'years_competing',
        question: 'How many years have you been competing?',
        type: 'select',
        options: [
          'Less than 1 year',
          '1-2 years',
          '3-5 years',
          '6-10 years',
          '10+ years',
        ],
        required: true,
      },
      {
        id: 'season_status',
        question: 'What is your current season status?',
        type: 'select',
        options: [
          'In-season',
          'Off-season',
          'Pre-season',
          'Post-season',
          'Year-round',
        ],
        required: true,
      },
    ],
  },
  {
    id: 'performance_metrics',
    title: 'Performance Metrics',
    description: 'Share your current performance benchmarks',
    questions: [
      {
        id: 'strength_metrics',
        question: 'What are your current strength metrics? (if known)',
        type: 'textarea',
        placeholder: 'e.g., Squat: 225lbs, Bench: 185lbs, Deadlift: 315lbs...',
      },
      {
        id: 'speed_metrics',
        question: 'What are your speed/agility metrics? (if known)',
        type: 'textarea',
        placeholder: 'e.g., 40-yard dash: 4.8s, Vertical jump: 28 inches...',
      },
      {
        id: 'endurance_metrics',
        question: 'What are your endurance metrics? (if known)',
        type: 'textarea',
        placeholder: 'e.g., Mile time: 6:30, VO2 max: 55...',
      },
      {
        id: 'sport_specific_metrics',
        question: 'Any sport-specific performance metrics?',
        type: 'textarea',
        placeholder: 'e.g., Batting average, shooting percentage, race times...',
      },
    ],
  },
  {
    id: 'performance_goals',
    title: 'Performance Goals',
    description: 'What performance improvements are you targeting?',
    questions: [
      {
        id: 'primary_performance_goal',
        question: 'What is your primary performance goal?',
        type: 'select',
        options: [
          'Increase strength',
          'Improve speed/agility',
          'Build endurance',
          'Enhance power output',
          'Improve sport-specific skills',
          'Reduce injury risk',
          'Optimize body composition',
        ],
        required: true,
      },
      {
        id: 'specific_targets',
        question: 'What specific targets do you want to hit?',
        type: 'textarea',
        placeholder: 'e.g., Squat 300lbs, run sub-5 minute mile, increase vertical by 4 inches...',
        required: true,
      },
      {
        id: 'competition_goals',
        question: 'Do you have upcoming competitions or events?',
        type: 'textarea',
        placeholder: 'List any important dates or competitions...',
      },
    ],
  },
  {
    id: 'training_schedule',
    title: 'Training Schedule',
    description: 'Help us understand your current training routine',
    questions: [
      {
        id: 'practice_frequency',
        question: 'How many days per week do you practice your sport?',
        type: 'select',
        options: ['1-2', '3-4', '5-6', '7'],
        required: true,
      },
      {
        id: 'strength_training_frequency',
        question: 'How many days per week do you do strength training?',
        type: 'select',
        options: ['0', '1-2', '3-4', '5-6', '7'],
        required: true,
      },
      {
        id: 'conditioning_frequency',
        question: 'How many days per week do you do conditioning work?',
        type: 'select',
        options: ['0', '1-2', '3-4', '5-6', '7'],
        required: true,
      },
      {
        id: 'recovery_practices',
        question: 'What recovery practices do you currently use? (Select all that apply)',
        type: 'checkbox',
        options: [
          'Stretching',
          'Foam rolling',
          'Massage',
          'Ice baths',
          'Contrast therapy',
          'Sleep optimization',
          'Active recovery',
          'None',
        ],
      },
      {
        id: 'additional_info',
        question: 'Is there anything else you\'d like us to know about your performance goals?',
        type: 'textarea',
        placeholder: 'Share any additional information...',
      },
    ],
  },
]

interface PerformanceAssessmentClientProps {
  initialData?: Record<string, any>
}

export const PerformanceAssessmentClient: React.FC<PerformanceAssessmentClientProps> = ({
  initialData,
}) => {
  const router = useRouter()

  const handleSave = async (data: Record<string, any>, completed: boolean) => {
    try {
      await saveAssessment('PERFORMANCE', data, completed)
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
      await saveAssessment('PERFORMANCE', data, true)
      toast({
        title: 'Assessment completed!',
        description: 'Your performance assessment has been completed successfully.',
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
      sections={performanceSections}
      initialData={initialData}
      onSave={handleSave}
      onComplete={handleComplete}
    />
  )
}
