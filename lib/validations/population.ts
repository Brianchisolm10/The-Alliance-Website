import { z } from 'zod'

export const populationEnum = z.enum([
  'GENERAL',
  'ATHLETE',
  'YOUTH',
  'RECOVERY',
  'PREGNANCY',
  'POSTPARTUM',
  'OLDER_ADULT',
  'CHRONIC_CONDITION',
])

export const assignPopulationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  population: populationEnum,
  adminNotes: z.string().optional(),
})

export const updatePopulationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  population: populationEnum,
  reason: z.string().optional(),
})

export const convertDiscoverySchema = z.object({
  discoverySubmissionId: z.string().min(1, 'Discovery submission ID is required'),
  population: populationEnum,
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']).optional(),
  notes: z.string().optional(),
})

export type AssignPopulationData = z.infer<typeof assignPopulationSchema>
export type UpdatePopulationData = z.infer<typeof updatePopulationSchema>
export type ConvertDiscoveryData = z.infer<typeof convertDiscoverySchema>
