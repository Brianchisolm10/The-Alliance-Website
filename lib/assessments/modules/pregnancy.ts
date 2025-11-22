/**
 * Pregnancy-specific assessment module
 */

import { Population } from '@prisma/client'
import { BaseAssessmentModule } from './base'
import { AssessmentSection, UnifiedClientProfile } from '../types'

export class PregnancyModule extends BaseAssessmentModule {
  id = 'pregnancy'
  name = 'Pregnancy Assessment'
  description = 'Trimester-specific health and fitness assessment'
  populations = [Population.PREGNANCY]
  priority = 10
  category = 'population' as const
  required = true

  sections: AssessmentSection[] = [
    {
      id: 'pregnancy_basics',
      title: 'Pregnancy Information',
      description: 'Tell us about your pregnancy',
      questions: [
        {
          id: 'trimester',
          question: 'Which trimester are you currently in?',
          type: 'select',
          options: ['First (Weeks 1-12)', 'Second (Weeks 13-26)', 'Third (Weeks 27-40)'],
          required: true,
        },
        {
          id: 'due_date',
          question: 'What is your due date?',
          type: 'date',
          required: true,
        },
        {
          id: 'previous_pregnancies',
          question: 'How many previous pregnancies have you had?',
          type: 'number',
          min: 0,
          required: true,
        },
        {
          id: 'pregnancy_complications',
          question: 'Are you experiencing any pregnancy complications? (Select all that apply)',
          type: 'checkbox',
          options: [
            'None',
            'Gestational diabetes',
            'High blood pressure',
            'Preeclampsia',
            'Placenta previa',
            'Multiple pregnancy (twins, triplets, etc.)',
            'Other',
          ],
        },
        {
          id: 'complications_other',
          question: 'Please describe other complications',
          type: 'textarea',
          condition: (data) => data.pregnancy_complications?.includes('Other'),
        },
      ],
    },
    {
      id: 'pregnancy_activity',
      title: 'Physical Activity During Pregnancy',
      description: 'Your current activity level and exercise history',
      questions: [
        {
          id: 'pre_pregnancy_activity',
          question: 'What was your activity level before pregnancy?',
          type: 'select',
          options: [
            'Sedentary (little to no exercise)',
            'Lightly active (1-2 days/week)',
            'Moderately active (3-4 days/week)',
            'Very active (5-6 days/week)',
            'Extremely active (daily intense exercise)',
          ],
          required: true,
        },
        {
          id: 'current_activity',
          question: 'What is your current activity level?',
          type: 'select',
          options: [
            'Sedentary (little to no exercise)',
            'Lightly active (1-2 days/week)',
            'Moderately active (3-4 days/week)',
            'Very active (5-6 days/week)',
          ],
          required: true,
        },
        {
          id: 'exercise_clearance',
          question: 'Has your healthcare provider cleared you for exercise?',
          type: 'radio',
          options: ['Yes', 'No', 'Not discussed yet'],
          required: true,
        },
        {
          id: 'pregnancy_symptoms',
          question: 'Which symptoms are you currently experiencing? (Select all that apply)',
          type: 'checkbox',
          options: [
            'None',
            'Nausea/morning sickness',
            'Fatigue',
            'Back pain',
            'Pelvic pain',
            'Swelling',
            'Shortness of breath',
            'Dizziness',
            'Heartburn',
          ],
        },
        {
          id: 'exercise_concerns',
          question: 'Do you have any concerns about exercising during pregnancy?',
          type: 'textarea',
          placeholder: 'Share any concerns or questions...',
        },
      ],
    },
    {
      id: 'pregnancy_goals',
      title: 'Pregnancy Wellness Goals',
      description: 'What you hope to achieve',
      questions: [
        {
          id: 'primary_goal',
          question: 'What is your primary wellness goal during pregnancy?',
          type: 'select',
          options: [
            'Maintain fitness level',
            'Prepare for labor and delivery',
            'Manage weight gain',
            'Reduce discomfort and pain',
            'Improve energy levels',
            'Stay active and healthy',
          ],
          required: true,
        },
        {
          id: 'specific_concerns',
          question: 'Are there specific areas you want to focus on? (Select all that apply)',
          type: 'checkbox',
          options: [
            'Core strength',
            'Pelvic floor health',
            'Back pain relief',
            'Posture improvement',
            'Stress reduction',
            'Sleep quality',
            'Nutrition guidance',
          ],
        },
      ],
    },
  ]

  extractProfileData(formData: Record<string, any>): Partial<UnifiedClientProfile> {
    const trimesterMap: Record<string, number> = {
      'First (Weeks 1-12)': 1,
      'Second (Weeks 13-26)': 2,
      'Third (Weeks 27-40)': 3,
    }

    return {
      populationData: {
        trimester: trimesterMap[formData.trimester] || 1,
        dueDate: formData.due_date,
        previousPregnancies: formData.previous_pregnancies,
        complications: formData.pregnancy_complications || [],
      },
      movement: {
        currentActivity: formData.current_activity,
        fitnessLevel: formData.pre_pregnancy_activity,
        painAreas: formData.pregnancy_symptoms || [],
      },
      goals: {
        primary: formData.primary_goal,
        secondary: formData.specific_concerns || [],
      },
      medical: {
        doctorClearance: formData.exercise_clearance === 'Yes',
      },
    }
  }
}
