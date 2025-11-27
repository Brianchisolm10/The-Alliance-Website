import { describe, it, expect } from 'vitest'
import {
  populationEnum,
  assignPopulationSchema,
  updatePopulationSchema,
  convertDiscoverySchema,
} from '../population'

describe('Population Validations', () => {
  describe('populationEnum', () => {
    it('should accept valid population values', () => {
      const validPopulations = [
        'GENERAL',
        'ATHLETE',
        'YOUTH',
        'RECOVERY',
        'PREGNANCY',
        'POSTPARTUM',
        'OLDER_ADULT',
        'CHRONIC_CONDITION',
      ]

      validPopulations.forEach((pop) => {
        const result = populationEnum.safeParse(pop)
        expect(result.success).toBe(true)
      })
    })

    it('should reject invalid population values', () => {
      const result = populationEnum.safeParse('INVALID')
      expect(result.success).toBe(false)
    })
  })

  describe('assignPopulationSchema', () => {
    it('should validate correct assignment data', () => {
      const data = {
        userId: 'user-123',
        population: 'ATHLETE',
        adminNotes: 'Competitive runner',
      }
      const result = assignPopulationSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate without optional admin notes', () => {
      const data = {
        userId: 'user-123',
        population: 'GENERAL',
      }
      const result = assignPopulationSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject missing user ID', () => {
      const data = {
        userId: '',
        population: 'ATHLETE',
      }
      const result = assignPopulationSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject invalid population', () => {
      const data = {
        userId: 'user-123',
        population: 'INVALID',
      }
      const result = assignPopulationSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('updatePopulationSchema', () => {
    it('should validate correct update data', () => {
      const data = {
        userId: 'user-123',
        population: 'RECOVERY',
        reason: 'Recent injury',
      }
      const result = updatePopulationSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate without optional reason', () => {
      const data = {
        userId: 'user-123',
        population: 'YOUTH',
      }
      const result = updatePopulationSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('convertDiscoverySchema', () => {
    it('should validate correct conversion data', () => {
      const data = {
        discoverySubmissionId: 'disc-123',
        population: 'ATHLETE',
        role: 'USER',
        notes: 'Converted from discovery call',
      }
      const result = convertDiscoverySchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate with minimal data', () => {
      const data = {
        discoverySubmissionId: 'disc-123',
        population: 'GENERAL',
      }
      const result = convertDiscoverySchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject missing discovery submission ID', () => {
      const data = {
        discoverySubmissionId: '',
        population: 'ATHLETE',
      }
      const result = convertDiscoverySchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject invalid role', () => {
      const data = {
        discoverySubmissionId: 'disc-123',
        population: 'ATHLETE',
        role: 'INVALID_ROLE',
      }
      const result = convertDiscoverySchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })
})
