/**
 * Equipment availability module
 * Applicable to all populations
 */

import { Population } from '@prisma/client'
import { BaseAssessmentModule } from './base'
import { AssessmentSection, UnifiedClientProfile } from '../types'

export class EquipmentModule extends BaseAssessmentModule {
  id = 'equipment'
  name = 'Equipment & Environment'
  description = 'Available equipment and training environment'
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
  priority = 50
  category = 'equipment' as const
  required = false

  sections: AssessmentSection[] = [
    {
      id: 'training_location',
      title: 'Training Location',
      description: 'Where you plan to exercise',
      questions: [
        {
          id: 'primary_location',
          question: 'Where do you primarily plan to exercise?',
          type: 'select',
          options: [
            'Home',
            'Gym/Fitness center',
            'Both home and gym',
            'Outdoor spaces',
            'Combination of locations',
          ],
          required: true,
        },
        {
          id: 'space_available',
          question: 'How much space do you have available for exercise?',
          type: 'select',
          options: [
            'Very limited (small room)',
            'Moderate (bedroom-sized)',
            'Spacious (large room or garage)',
            'Very spacious (multiple rooms or outdoor)',
          ],
          required: true,
        },
        {
          id: 'environment_preferences',
          question: 'What training environments do you prefer? (Select all that apply)',
          type: 'checkbox',
          options: [
            'Indoor',
            'Outdoor',
            'Gym setting',
            'Home setting',
            'Group classes',
            'Solo training',
            'Virtual/online',
          ],
        },
      ],
    },
    {
      id: 'available_equipment',
      title: 'Available Equipment',
      description: 'Equipment you have access to',
      questions: [
        {
          id: 'equipment_access',
          question: 'What equipment do you have access to? (Select all that apply)',
          type: 'checkbox',
          options: [
            'None (bodyweight only)',
            'Resistance bands',
            'Dumbbells',
            'Kettlebells',
            'Barbell and plates',
            'Pull-up bar',
            'Bench',
            'Squat rack',
            'Cardio machines (treadmill, bike, etc.)',
            'Yoga mat',
            'Foam roller',
            'Medicine ball',
            'TRX/suspension trainer',
            'Full gym access',
          ],
          required: true,
        },
        {
          id: 'equipment_weight_range',
          question: 'If you have dumbbells, what weight range?',
          type: 'select',
          options: [
            'Not applicable',
            'Light (1-10 lbs)',
            'Light to moderate (1-25 lbs)',
            'Moderate (10-50 lbs)',
            'Heavy (25-100+ lbs)',
            'Full range available',
          ],
          condition: (data) => data.equipment_access?.includes('Dumbbells'),
        },
        {
          id: 'equipment_purchase',
          question: 'Are you willing to purchase equipment if needed?',
          type: 'radio',
          options: [
            'Yes, any amount',
            'Yes, up to $50',
            'Yes, up to $100',
            'Yes, up to $200',
            'No, prefer bodyweight only',
          ],
          required: true,
        },
      ],
    },
    {
      id: 'constraints',
      title: 'Constraints & Preferences',
      description: 'Any limitations or preferences',
      questions: [
        {
          id: 'time_availability',
          question: 'How much time can you dedicate to exercise per session?',
          type: 'select',
          options: [
            'Less than 15 minutes',
            '15-30 minutes',
            '30-45 minutes',
            '45-60 minutes',
            'More than 60 minutes',
            'Flexible',
          ],
          required: true,
        },
        {
          id: 'schedule_preference',
          question: 'When do you prefer to exercise?',
          type: 'checkbox',
          options: [
            'Early morning',
            'Mid-morning',
            'Lunch time',
            'Afternoon',
            'Evening',
            'Late night',
            'Flexible',
          ],
        },
        {
          id: 'noise_constraints',
          question: 'Do you have noise constraints? (e.g., apartment, sleeping children)',
          type: 'radio',
          options: [
            'No constraints',
            'Some constraints',
            'Significant constraints (need quiet exercises)',
          ],
          required: true,
        },
        {
          id: 'additional_constraints',
          question: 'Are there any other constraints or preferences we should know about?',
          type: 'textarea',
          placeholder: 'e.g., No jumping exercises, prefer low-impact, need modifications for joint issues...',
        },
      ],
    },
  ]

  extractProfileData(formData: Record<string, any>): Partial<UnifiedClientProfile> {
    return {
      equipment: {
        location: formData.primary_location?.toLowerCase().includes('home')
          ? 'home'
          : formData.primary_location?.toLowerCase().includes('gym')
          ? 'gym'
          : formData.primary_location?.toLowerCase().includes('outdoor')
          ? 'outdoor'
          : 'both',
        availableEquipment: formData.equipment_access || [],
        spaceConstraints: formData.space_available,
        budget: formData.equipment_purchase,
      },
    }
  }
}
