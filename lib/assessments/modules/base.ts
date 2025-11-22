/**
 * Base assessment module interface and utilities
 */

import { AssessmentModule, AssessmentSection, UnifiedClientProfile } from '../types'
import { Population } from '@prisma/client'

/**
 * Base class for assessment modules
 */
export abstract class BaseAssessmentModule implements AssessmentModule {
  abstract id: string
  abstract name: string
  abstract description: string
  abstract populations: Population[]
  abstract sections: AssessmentSection[]
  abstract priority: number
  abstract category: 'core' | 'population' | 'lifestyle' | 'medical' | 'equipment'
  
  required: boolean = false

  /**
   * Check if this module should be shown for a given population
   */
  isApplicable(population: Population): boolean {
    return this.populations.includes(population)
  }

  /**
   * Get sections that should be displayed based on current data
   */
  getActiveSections(data: Record<string, any>): AssessmentSection[] {
    return this.sections.filter(section => {
      if (!section.condition) return true
      return section.condition(data)
    })
  }

  /**
   * Validate module data
   */
  validate(data: Record<string, any>): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {}

    for (const section of this.sections) {
      for (const question of section.questions) {
        // Skip if question has condition and it's not met
        if (question.condition && !question.condition(data)) {
          continue
        }

        const value = data[question.id]

        // Check required fields
        if (question.required && (value === undefined || value === null || value === '')) {
          errors[question.id] = `${question.question} is required`
          continue
        }

        // Run custom validation if provided
        if (question.validation && value !== undefined && value !== null && value !== '') {
          const error = question.validation(value, data)
          if (error) {
            errors[question.id] = error
          }
        }
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    }
  }

  /**
   * Extract data from form responses into unified profile structure
   */
  abstract extractProfileData(formData: Record<string, any>): Partial<UnifiedClientProfile>
}

/**
 * Module registry for managing all assessment modules
 */
export class AssessmentModuleRegistry {
  private modules: Map<string, BaseAssessmentModule> = new Map()

  register(module: BaseAssessmentModule): void {
    this.modules.set(module.id, module)
  }

  getModule(id: string): BaseAssessmentModule | undefined {
    return this.modules.get(id)
  }

  getAllModules(): BaseAssessmentModule[] {
    return Array.from(this.modules.values())
  }

  getModulesForPopulation(population: Population): BaseAssessmentModule[] {
    return this.getAllModules()
      .filter(module => module.isApplicable(population))
      .sort((a, b) => a.priority - b.priority)
  }

  getRequiredModules(population: Population): BaseAssessmentModule[] {
    return this.getModulesForPopulation(population).filter(module => module.required)
  }

  getOptionalModules(population: Population): BaseAssessmentModule[] {
    return this.getModulesForPopulation(population).filter(module => !module.required)
  }
}

// Global registry instance
export const assessmentRegistry = new AssessmentModuleRegistry()
