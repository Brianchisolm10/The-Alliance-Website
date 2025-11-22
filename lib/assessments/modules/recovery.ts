/**
 * Recovery/Injury-specific assessment module
 */

import { Population } from '@prisma/client'
import { BaseAssessmentModule } from './base'
import { AssessmentSection, UnifiedClientProfile } from '../types'

export class RecoveryModule extends BaseAssessmentModule {
  id = 'recovery'
  name = 'Recovery & Injury Assessment'
  description = 'Assessment for injury recovery and rehabilitation'
  populations = [Population.RECOVERY]
  priority = 10
  category = 'population' as const
  required = true

  sections: AssessmentSection[] = [
    {
      id: 'injury_details',
      title: 'Injury Information',
      description: 'Tell us about your injury',
      questions: [
        {
          id: 'injury_type',
          question: 'What type of injury are you recovering from?',
          type: 'select',
          options: [
            'Muscle strain',
            'Ligament sprain',
            'Tendon injury',
            'Fracture',
            'Joint injury',
            'Back injury',
            'Post-surgery',
            'Chronic pain',
            'Other',
          ],
          required: true,
        },
        {
          id: 'injury_location',
          question: 'Where is the injury located?',
          type: 'select',
          options: [
            'Ankle',
            'Knee',
            'Hip',
            'Lower back',
            'Upper back',
            'Shoulder',
            'Elbow',
            'Wrist/hand',
            'Neck',
            'Other',
          ],
          required: true,
        },
        {
          id: 'injury_date',
          question: 'When did the injury occur?',
          type: 'date',
          required: true,
        },
        {
          id: 'injury_cause',
          question: 'How did the injury occur?',
          type: 'select',
          options: [
            'Sports injury',
            'Accident/fall',
            'Overuse',
            'Work-related',
            'Auto accident',
            'Gradual onset',
            'Unknown',
          ],
          required: true,
        },
        {
          id: 'surgery',
          question: 'Did you have surgery for this injury?',
          type: 'radio',
          options: ['No', 'Yes'],
          required: true,
        },
        {
          id: 'surgery_date',
          question: 'When was the surgery?',
          type: 'date',
          condition: (data) => data.surgery === 'Yes',
          required: true,
        },
      ],
    },
    {
      id: 'current_status',
      title: 'Current Recovery Status',
      description: 'Your current condition and symptoms',
      questions: [
        {
          id: 'pain_level',
          question: 'What is your current pain level at rest?',
          type: 'range',
          min: 0,
          max: 10,
          step: 1,
          helpText: '0 = No pain, 10 = Worst pain',
          required: true,
        },
        {
          id: 'pain_with_activity',
          question: 'What is your pain level with activity?',
          type: 'range',
          min: 0,
          max: 10,
          step: 1,
          helpText: '0 = No pain, 10 = Worst pain',
          required: true,
        },
        {
          id: 'pain_frequency',
          question: 'How often do you experience pain?',
          type: 'select',
          options: [
            'Constant',
            'Most of the time',
            'Intermittent',
            'Only with certain activities',
            'Rarely',
          ],
          required: true,
        },
        {
          id: 'swelling',
          question: 'Do you have swelling?',
          type: 'radio',
          options: ['No', 'Mild', 'Moderate', 'Severe'],
          required: true,
        },
        {
          id: 'range_of_motion',
          question: 'How is your range of motion?',
          type: 'select',
          options: [
            'Normal',
            'Slightly limited',
            'Moderately limited',
            'Severely limited',
          ],
          required: true,
        },
        {
          id: 'mobility_restrictions',
          question: 'What activities are you currently unable to do? (Select all that apply)',
          type: 'checkbox',
          options: [
            'None',
            'Walking',
            'Climbing stairs',
            'Running',
            'Jumping',
            'Lifting',
            'Reaching overhead',
            'Bending',
            'Twisting',
            'Sitting for long periods',
            'Standing for long periods',
          ],
        },
      ],
    },
    {
      id: 'treatment_history',
      title: 'Treatment History',
      description: 'What treatments you\'ve received',
      questions: [
        {
          id: 'current_treatment',
          question: 'What treatments are you currently receiving? (Select all that apply)',
          type: 'checkbox',
          options: [
            'None',
            'Physical therapy',
            'Chiropractic care',
            'Massage therapy',
            'Acupuncture',
            'Pain medication',
            'Anti-inflammatory medication',
            'Injections',
            'Other',
          ],
        },
        {
          id: 'pt_frequency',
          question: 'If doing physical therapy, how often?',
          type: 'select',
          options: [
            'Not applicable',
            '1x per week',
            '2x per week',
            '3x per week',
            'More than 3x per week',
            'Completed PT',
          ],
          condition: (data) => data.current_treatment?.includes('Physical therapy'),
        },
        {
          id: 'clearance_status',
          question: 'What is your clearance status from your healthcare provider?',
          type: 'select',
          options: [
            'Full clearance for all activities',
            'Cleared with restrictions',
            'Cleared for light activity only',
            'Not yet cleared',
            'Haven\'t discussed yet',
          ],
          required: true,
        },
        {
          id: 'restrictions',
          question: 'What restrictions has your provider given you?',
          type: 'textarea',
          placeholder: 'List any restrictions or precautions...',
          condition: (data) => data.clearance_status?.includes('restrictions'),
        },
      ],
    },
    {
      id: 'recovery_goals',
      title: 'Recovery Goals',
      description: 'What you hope to achieve',
      questions: [
        {
          id: 'primary_goal',
          question: 'What is your primary recovery goal?',
          type: 'select',
          options: [
            'Return to sport',
            'Return to work',
            'Pain-free daily activities',
            'Regain full range of motion',
            'Rebuild strength',
            'Prevent re-injury',
            'Improve function',
          ],
          required: true,
        },
        {
          id: 'timeline',
          question: 'What is your expected recovery timeline?',
          type: 'select',
          options: [
            'Less than 1 month',
            '1-3 months',
            '3-6 months',
            '6-12 months',
            'More than 1 year',
            'Ongoing/chronic',
          ],
          required: true,
        },
        {
          id: 'return_to_activity',
          question: 'What activities do you want to return to? (Select all that apply)',
          type: 'checkbox',
          options: [
            'Sports/athletics',
            'Gym workouts',
            'Running',
            'Recreational activities',
            'Work duties',
            'Daily activities',
            'Playing with kids',
            'Hobbies',
          ],
        },
        {
          id: 'concerns',
          question: 'What are your biggest concerns about recovery?',
          type: 'checkbox',
          options: [
            'Re-injury',
            'Chronic pain',
            'Loss of function',
            'Taking too long',
            'Not returning to previous level',
            'Cost of treatment',
            'Time commitment',
          ],
        },
        {
          id: 'additional_info',
          question: 'Is there anything else you\'d like us to know about your injury or recovery?',
          type: 'textarea',
          placeholder: 'Share any additional information...',
        },
      ],
    },
  ]

  extractProfileData(formData: Record<string, any>): Partial<UnifiedClientProfile> {
    return {
      populationData: {
        injuryType: formData.injury_type,
        injuryDate: formData.injury_date,
        surgeryDate: formData.surgery === 'Yes' ? formData.surgery_date : undefined,
        currentPainLevel: formData.pain_level,
        mobilityRestrictions: formData.mobility_restrictions || [],
        clearanceStatus: formData.clearance_status,
      },
      movement: {
        painAreas: [formData.injury_location],
        mobilityLimitations: formData.mobility_restrictions || [],
      },
      goals: {
        primary: formData.primary_goal,
        timeline: formData.timeline,
        secondary: formData.return_to_activity || [],
        barriers: formData.concerns || [],
      },
      medical: {
        conditions: [formData.injury_type],
        surgeries: formData.surgery === 'Yes' ? [formData.injury_type] : [],
        doctorClearance: formData.clearance_status === 'Full clearance for all activities',
      },
    }
  }
}
