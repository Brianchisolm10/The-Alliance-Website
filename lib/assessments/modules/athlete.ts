/**
 * Athlete-specific assessment module
 */

import { Population } from '@prisma/client'
import { BaseAssessmentModule } from './base'
import { AssessmentSection, UnifiedClientProfile } from '../types'

export class AthleteModule extends BaseAssessmentModule {
  id = 'athlete'
  name = 'Athlete Performance Assessment'
  description = 'Sport-specific performance and training assessment'
  populations = [Population.ATHLETE]
  priority = 10
  category = 'population' as const
  required = true

  sections: AssessmentSection[] = [
    {
      id: 'sport_info',
      title: 'Sport Information',
      description: 'Tell us about your sport and competition level',
      questions: [
        {
          id: 'primary_sport',
          question: 'What is your primary sport?',
          type: 'text',
          placeholder: 'e.g., Basketball, Soccer, Track & Field',
          required: true,
        },
        {
          id: 'position',
          question: 'What position do you play (if applicable)?',
          type: 'text',
          placeholder: 'e.g., Point Guard, Midfielder, Sprinter',
        },
        {
          id: 'competition_level',
          question: 'What is your competition level?',
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
          id: 'years_experience',
          question: 'How many years have you been competing in this sport?',
          type: 'number',
          min: 0,
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
      id: 'training_schedule',
      title: 'Training Schedule',
      description: 'Your current training regimen',
      questions: [
        {
          id: 'training_frequency',
          question: 'How many days per week do you train?',
          type: 'select',
          options: ['1-2', '3-4', '5-6', '7 (daily)', 'Multiple sessions per day'],
          required: true,
        },
        {
          id: 'training_types',
          question: 'What types of training do you do? (Select all that apply)',
          type: 'checkbox',
          options: [
            'Sport-specific practice',
            'Strength training',
            'Cardiovascular conditioning',
            'Speed and agility',
            'Plyometrics',
            'Flexibility/mobility',
            'Recovery sessions',
            'Cross-training',
          ],
          required: true,
        },
        {
          id: 'training_hours',
          question: 'How many hours per week do you train (total)?',
          type: 'number',
          min: 0,
          unit: 'hours',
          required: true,
        },
        {
          id: 'strength_training',
          question: 'How many days per week do you do strength training?',
          type: 'select',
          options: ['0', '1', '2', '3', '4', '5+'],
          required: true,
        },
      ],
    },
    {
      id: 'performance_metrics',
      title: 'Performance Metrics',
      description: 'Your current performance benchmarks',
      questions: [
        {
          id: 'performance_goals',
          question: 'What are your primary performance goals? (Select all that apply)',
          type: 'checkbox',
          options: [
            'Increase strength',
            'Improve speed',
            'Enhance endurance',
            'Better agility',
            'Increase power',
            'Improve technique',
            'Injury prevention',
            'Weight management',
            'Mental performance',
          ],
          required: true,
        },
        {
          id: 'performance_areas',
          question: 'Which areas do you want to improve most?',
          type: 'checkbox',
          options: [
            'Explosive power',
            'Top-end speed',
            'Acceleration',
            'Change of direction',
            'Vertical jump',
            'Endurance',
            'Recovery between efforts',
            'Core stability',
            'Upper body strength',
            'Lower body strength',
          ],
        },
        {
          id: 'current_benchmarks',
          question: 'Do you track any performance benchmarks? (e.g., 40-yard dash, vertical jump, max lifts)',
          type: 'textarea',
          placeholder: 'List your current benchmarks and times/weights...',
        },
      ],
    },
    {
      id: 'injury_history',
      title: 'Injury History',
      description: 'Past and current injuries',
      questions: [
        {
          id: 'injury_history',
          question: 'Have you had any significant injuries?',
          type: 'radio',
          options: ['No', 'Yes, fully recovered', 'Yes, currently managing'],
          required: true,
        },
        {
          id: 'past_injuries',
          question: 'What injuries have you experienced? (Select all that apply)',
          type: 'checkbox',
          options: [
            'None',
            'Ankle sprain',
            'Knee injury (ACL, MCL, meniscus)',
            'Hamstring strain',
            'Groin strain',
            'Shoulder injury',
            'Concussion',
            'Stress fracture',
            'Back injury',
            'Other',
          ],
          condition: (data) => data.injury_history !== 'No',
        },
        {
          id: 'current_pain',
          question: 'Do you currently have any pain or discomfort?',
          type: 'checkbox',
          options: [
            'None',
            'Knee',
            'Ankle',
            'Hip',
            'Back',
            'Shoulder',
            'Elbow',
            'Wrist',
            'Other',
          ],
        },
        {
          id: 'injury_concerns',
          question: 'Do you have any concerns about injury risk?',
          type: 'textarea',
          placeholder: 'Describe any concerns...',
        },
      ],
    },
    {
      id: 'recovery_nutrition',
      title: 'Recovery & Nutrition',
      description: 'Your recovery and nutrition practices',
      questions: [
        {
          id: 'sleep_hours',
          question: 'How many hours of sleep do you get per night on average?',
          type: 'number',
          min: 0,
          max: 24,
          unit: 'hours',
          required: true,
        },
        {
          id: 'recovery_methods',
          question: 'What recovery methods do you use? (Select all that apply)',
          type: 'checkbox',
          options: [
            'None',
            'Stretching',
            'Foam rolling',
            'Ice baths',
            'Massage',
            'Physical therapy',
            'Active recovery',
            'Compression garments',
            'Adequate sleep',
          ],
        },
        {
          id: 'nutrition_focus',
          question: 'Do you follow a specific nutrition plan for your sport?',
          type: 'radio',
          options: [
            'Yes, with a nutritionist',
            'Yes, self-guided',
            'Somewhat',
            'No',
          ],
          required: true,
        },
        {
          id: 'hydration',
          question: 'How would you rate your hydration habits?',
          type: 'select',
          options: [
            'Excellent - always well hydrated',
            'Good - usually hydrated',
            'Fair - sometimes dehydrated',
            'Poor - often dehydrated',
          ],
          required: true,
        },
      ],
    },
  ]

  extractProfileData(formData: Record<string, any>): Partial<UnifiedClientProfile> {
    return {
      populationData: {
        sport: formData.primary_sport,
        position: formData.position,
        competitionLevel: formData.competition_level,
        trainingFrequency: parseInt(formData.training_frequency?.split('-')[0] || '0'),
        performanceGoals: formData.performance_goals || [],
      },
      movement: {
        exerciseFrequency: parseInt(formData.training_frequency?.split('-')[0] || '0'),
        exerciseTypes: formData.training_types || [],
        injuries: formData.past_injuries || [],
        painAreas: formData.current_pain || [],
        fitnessLevel: formData.competition_level,
      },
      lifestyle: {
        sleepHours: formData.sleep_hours,
        hydration: formData.hydration,
      },
      goals: {
        primary: formData.performance_goals?.[0],
        secondary: formData.performance_areas || [],
      },
    }
  }
}
