import { z } from 'zod'

// Discovery form schema
export const discoveryFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  goal: z.string().min(10, 'Please provide at least 10 characters describing your goal'),
  notes: z.string().optional(),
})

export type DiscoveryFormData = z.infer<typeof discoveryFormSchema>

// Update scheduling status schema
export const updateSchedulingSchema = z.object({
  submissionId: z.string().min(1, 'Submission ID is required'),
  callScheduled: z.boolean(),
  callDate: z.date().nullable(),
})

export type UpdateSchedulingData = z.infer<typeof updateSchedulingSchema>

// Update discovery status schema (for admin)
export const updateDiscoveryStatusSchema = z.object({
  submissionId: z.string().min(1, 'Submission ID is required'),
  status: z.enum(['SUBMITTED', 'CALL_SCHEDULED', 'CALL_COMPLETED', 'CONVERTED', 'CLOSED']),
})

export type UpdateDiscoveryStatusData = z.infer<typeof updateDiscoveryStatusSchema>
