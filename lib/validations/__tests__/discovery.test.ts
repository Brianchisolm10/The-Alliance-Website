import { describe, it, expect } from 'vitest'
import {
  discoveryFormSchema,
  updateSchedulingSchema,
  updateDiscoveryStatusSchema,
} from '../discovery'

describe('Discovery Validations', () => {
  describe('discoveryFormSchema', () => {
    it('should validate correct discovery form data', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        goal: 'I want to improve my overall fitness and health',
        notes: 'I have some knee issues',
      }
      const result = discoveryFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate without optional notes', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        goal: 'I want to improve my overall fitness',
      }
      const result = discoveryFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject missing name', () => {
      const data = {
        name: '',
        email: 'john@example.com',
        goal: 'I want to improve my fitness',
      }
      const result = discoveryFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject invalid email', () => {
      const data = {
        name: 'John Doe',
        email: 'invalid-email',
        goal: 'I want to improve my fitness',
      }
      const result = discoveryFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject goal that is too short', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        goal: 'fitness',
      }
      const result = discoveryFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('updateSchedulingSchema', () => {
    it('should validate scheduling update with date', () => {
      const data = {
        submissionId: 'sub-123',
        callScheduled: true,
        callDate: new Date('2025-12-01'),
      }
      const result = updateSchedulingSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate scheduling update without date', () => {
      const data = {
        submissionId: 'sub-123',
        callScheduled: false,
        callDate: null,
      }
      const result = updateSchedulingSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject missing submission ID', () => {
      const data = {
        submissionId: '',
        callScheduled: true,
        callDate: new Date(),
      }
      const result = updateSchedulingSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('updateDiscoveryStatusSchema', () => {
    it('should validate status update with valid status', () => {
      const statuses = [
        'SUBMITTED',
        'CALL_SCHEDULED',
        'CALL_COMPLETED',
        'CONVERTED',
        'CLOSED',
      ]

      statuses.forEach((status) => {
        const data = {
          submissionId: 'sub-123',
          status,
        }
        const result = updateDiscoveryStatusSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })

    it('should reject invalid status', () => {
      const data = {
        submissionId: 'sub-123',
        status: 'INVALID_STATUS',
      }
      const result = updateDiscoveryStatusSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject missing submission ID', () => {
      const data = {
        submissionId: '',
        status: 'SUBMITTED',
      }
      const result = updateDiscoveryStatusSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })
})
