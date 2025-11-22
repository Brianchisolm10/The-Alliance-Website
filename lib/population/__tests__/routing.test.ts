import { describe, it, expect } from 'vitest'
import {
  classifyPopulation,
  getPopulationAssessments,
  getAllAssessmentTypes,
  isAssessmentAvailable,
  isAssessmentRequired,
  formatPopulationName,
  getAllPopulations,
} from '../routing'

describe('Population Routing', () => {
  describe('classifyPopulation', () => {
    it('should classify as PREGNANCY when isPregnant is true', () => {
      const result = classifyPopulation({ isPregnant: true })
      expect(result).toBe('PREGNANCY')
    })

    it('should classify as POSTPARTUM when isPostpartum is true', () => {
      const result = classifyPopulation({ isPostpartum: true })
      expect(result).toBe('POSTPARTUM')
    })

    it('should classify as YOUTH when isYouth is true', () => {
      const result = classifyPopulation({ isYouth: true })
      expect(result).toBe('YOUTH')
    })

    it('should classify as YOUTH when age is under 18', () => {
      const result = classifyPopulation({ age: 16 })
      expect(result).toBe('YOUTH')
    })

    it('should classify as OLDER_ADULT when age is 65 or above', () => {
      const result = classifyPopulation({ age: 65 })
      expect(result).toBe('OLDER_ADULT')
    })

    it('should classify as RECOVERY when hasInjury is true', () => {
      const result = classifyPopulation({ hasInjury: true, age: 30 })
      expect(result).toBe('RECOVERY')
    })

    it('should classify as ATHLETE when isAthlete is true', () => {
      const result = classifyPopulation({ isAthlete: true, age: 25 })
      expect(result).toBe('ATHLETE')
    })

    it('should classify as GENERAL by default', () => {
      const result = classifyPopulation({ age: 30 })
      expect(result).toBe('GENERAL')
    })
  })

  describe('getPopulationAssessments', () => {
    it('should return correct assessments for ATHLETE', () => {
      const config = getPopulationAssessments('ATHLETE')
      expect(config.required).toContain('NUTRITION')
      expect(config.required).toContain('TRAINING')
      expect(config.required).toContain('PERFORMANCE')
      expect(config.required).toContain('RECOVERY')
      expect(config.optional).toContain('LIFESTYLE')
    })

    it('should return correct assessments for GENERAL', () => {
      const config = getPopulationAssessments('GENERAL')
      expect(config.required).toContain('NUTRITION')
      expect(config.required).toContain('LIFESTYLE')
      expect(config.optional).toContain('TRAINING')
      expect(config.optional).toContain('RECOVERY')
    })
  })

  describe('getAllAssessmentTypes', () => {
    it('should return all assessment types for a population', () => {
      const types = getAllAssessmentTypes('ATHLETE')
      expect(types).toHaveLength(5)
      expect(types).toContain('NUTRITION')
      expect(types).toContain('TRAINING')
      expect(types).toContain('PERFORMANCE')
      expect(types).toContain('RECOVERY')
      expect(types).toContain('LIFESTYLE')
    })
  })

  describe('isAssessmentAvailable', () => {
    it('should return true for available assessments', () => {
      expect(isAssessmentAvailable('ATHLETE', 'NUTRITION')).toBe(true)
      expect(isAssessmentAvailable('ATHLETE', 'TRAINING')).toBe(true)
    })

    it('should return false for unavailable assessments', () => {
      expect(isAssessmentAvailable('ATHLETE', 'YOUTH')).toBe(false)
    })
  })

  describe('isAssessmentRequired', () => {
    it('should return true for required assessments', () => {
      expect(isAssessmentRequired('ATHLETE', 'NUTRITION')).toBe(true)
      expect(isAssessmentRequired('ATHLETE', 'TRAINING')).toBe(true)
    })

    it('should return false for optional assessments', () => {
      expect(isAssessmentRequired('ATHLETE', 'LIFESTYLE')).toBe(false)
    })

    it('should return false for unavailable assessments', () => {
      expect(isAssessmentRequired('ATHLETE', 'YOUTH')).toBe(false)
    })
  })

  describe('formatPopulationName', () => {
    it('should format population names correctly', () => {
      expect(formatPopulationName('GENERAL')).toBe('General Wellness')
      expect(formatPopulationName('ATHLETE')).toBe('Athlete')
      expect(formatPopulationName('OLDER_ADULT')).toBe('Older Adult')
    })
  })

  describe('getAllPopulations', () => {
    it('should return all populations with info', () => {
      const populations = getAllPopulations()
      expect(populations).toHaveLength(8)
      expect(populations[0]).toHaveProperty('value')
      expect(populations[0]).toHaveProperty('name')
      expect(populations[0]).toHaveProperty('description')
      expect(populations[0]).toHaveProperty('requiredAssessments')
      expect(populations[0]).toHaveProperty('optionalAssessments')
    })
  })
})
