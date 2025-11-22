/**
 * Postpartum-specific assessment module
 */

import { Population } from '@prisma/client'
import { BaseAssessmentModule } from './base'
import { AssessmentSection, UnifiedClientProfile } from '../types'

export class PostpartumModule extends BaseAssessmentModule {
  id = 'postpartum'
  name = 'Postpartum Assessment'
  description = 'Recovery and wellness assessment for postpartum period'
  populations = [Population.POSTPARTUM]
  priority = 10
  category = 'population' as const
  required = true

  sections: AssessmentSection[] = [
    {
      id: 'postpartum_basics',
      title: 'Postpartum Information',
      description: 'Tell us about your postpartum journey',
      questions: [
        {
          id: 'delivery_date',
          question: 'When did you give birth?',
          type: 'date',
          required: true,
        },
        {
          id: 'delivery_type',
          question: 'What type of delivery did you have?',
          type: 'radio',
          options: ['Vaginal delivery', 'Cesarean section (C-section)', 'Assisted delivery (forceps/vacuum)'],
          required: true,
        },
        {
          id: 'delivery_complications',
          question: 'Did you experience any delivery complications?',
          type: 'checkbox',
          options: [
            'None',
            'Excessive bleeding',
            'Tearing/episiotomy',
            'Infection',
            'Emergency C-section',
            'Other',
          ],
        },
        {
          id: 'breastfeeding',
          question: 'Are you currently breastfeeding?',
          type: 'radio',
          options: ['Yes, exclusively', 'Yes, combination feeding', 'No'],
          required: true,
        },
      ],
    },
    {
      id: 'postpartum_recovery',
      title: 'Recovery Status',
      description: 'How you are recovering',
      questions: [
        {
          id: 'postpartum_checkup',
          question: 'Have you had your postpartum checkup with your healthcare provider?',
          type: 'radio',
          options: ['Yes', 'No, scheduled', 'No, not yet scheduled'],
          required: true,
        },
        {
          id: 'exercise_clearance',
          question: 'Has your healthcare provider cleared you to exercise?',
          type: 'radio',
          options: ['Yes', 'No', 'Not discussed yet'],
          required: true,
        },
        {
          id: 'current_symptoms',
          question: 'What symptoms are you currently experiencing? (Select all that apply)',
          type: 'checkbox',
          options: [
            'None',
            'Fatigue',
            'Back pain',
            'Pelvic pain',
            'Abdominal separation (diastasis recti)',
            'Pelvic floor weakness',
            'Incontinence',
            'Pain at incision site (C-section)',
            'Mood changes',
          ],
        },
        {
          id: 'pain_level',
          question: 'On a scale of 0-10, what is your current pain level?',
          type: 'range',
          min: 0,
          max: 10,
          step: 1,
          required: true,
        },
        {
          id: 'sleep_hours',
          question: 'How many hours of sleep are you getting per night (total, including interrupted sleep)?',
          type: 'number',
          min: 0,
          max: 24,
          unit: 'hours',
          required: true,
        },
      ],
    },
    {
      id: 'postpartum_goals',
      title: 'Postpartum Wellness Goals',
      description: 'What you hope to achieve',
      questions: [
        {
          id: 'primary_goal',
          question: 'What is your primary wellness goal postpartum?',
          type: 'select',
          options: [
            'Regain core strength',
            'Heal diastasis recti',
            'Strengthen pelvic floor',
            'Return to pre-pregnancy fitness',
            'Lose pregnancy weight',
            'Increase energy levels',
            'Reduce pain and discomfort',
          ],
          required: true,
        },
        {
          id: 'timeline',
          question: 'What is your timeline for returning to exercise?',
          type: 'select',
          options: [
            'Just starting (0-6 weeks)',
            'Early recovery (6-12 weeks)',
            'Gradual return (3-6 months)',
            'Full return (6+ months)',
          ],
          required: true,
        },
        {
          id: 'barriers',
          question: 'What are your biggest challenges right now? (Select all that apply)',
          type: 'checkbox',
          options: [
            'Lack of time',
            'Fatigue',
            'Pain or discomfort',
            'Lack of childcare',
            'Not sure where to start',
            'Fear of injury',
            'Low motivation',
          ],
        },
        {
          id: 'additional_info',
          question: 'Is there anything else you\'d like us to know about your postpartum journey?',
          type: 'textarea',
          placeholder: 'Share any additional information...',
        },
      ],
    },
  ]

  extractProfileData(formData: Record<string, any>): Partial<UnifiedClientProfile> {
    const deliveryDate = new Date(formData.delivery_date)
    const now = new Date()
    const postpartumWeeks = Math.floor((now.getTime() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24 * 7))

    return {
      populationData: {
        deliveryDate: formData.delivery_date,
        deliveryType: formData.delivery_type?.includes('Cesarean') ? 'cesarean' : 'vaginal',
        postpartumWeeks,
        breastfeeding: formData.breastfeeding?.includes('Yes'),
      },
      movement: {
        painAreas: formData.current_symptoms || [],
        mobilityLimitations: formData.current_symptoms || [],
      },
      lifestyle: {
        sleepHours: formData.sleep_hours,
      },
      goals: {
        primary: formData.primary_goal,
        timeline: formData.timeline,
        barriers: formData.barriers || [],
      },
      medical: {
        doctorClearance: formData.exercise_clearance === 'Yes',
      },
    }
  }
}
