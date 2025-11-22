'use client'

import * as React from 'react'
import { AssessmentForm } from './assessment-form'
import { BaseAssessmentModule } from '@/lib/assessments/modules/base'
import { toast } from '@/components/ui/toast'
import { useRouter } from 'next/navigation'

interface ModularAssessmentProps {
  module: BaseAssessmentModule
  initialData?: Record<string, any>
  onSave: (moduleId: string, data: Record<string, any>, completed: boolean) => Promise<void>
  onComplete: (moduleId: string, data: Record<string, any>) => Promise<void>
}

/**
 * Component for rendering a modular assessment
 * Dynamically loads and displays assessment modules based on population
 */
export const ModularAssessment: React.FC<ModularAssessmentProps> = ({
  module,
  initialData = {},
  onSave,
  onComplete,
}) => {
  const router = useRouter()

  const handleSave = async (data: Record<string, any>, completed: boolean) => {
    try {
      // Validate data
      const validation = module.validate(data)
      if (!validation.valid && completed) {
        // Show validation errors
        const errorMessages = Object.values(validation.errors).join(', ')
        toast({
          title: 'Validation Error',
          description: errorMessages,
          variant: 'destructive',
        })
        throw new Error('Validation failed')
      }

      await onSave(module.id, data, completed)
      
      if (!completed) {
        toast({
          title: 'Progress saved',
          description: 'Your assessment progress has been saved.',
        })
      }
    } catch (error) {
      if ((error as Error).message !== 'Validation failed') {
        toast({
          title: 'Error',
          description: 'Failed to save progress. Please try again.',
          variant: 'destructive',
        })
      }
      throw error
    }
  }

  const handleComplete = async (data: Record<string, any>) => {
    try {
      // Validate data
      const validation = module.validate(data)
      if (!validation.valid) {
        const errorMessages = Object.values(validation.errors).join(', ')
        toast({
          title: 'Validation Error',
          description: errorMessages,
          variant: 'destructive',
        })
        throw new Error('Validation failed')
      }

      await onComplete(module.id, data)
      
      toast({
        title: 'Assessment completed!',
        description: `Your ${module.name} has been completed successfully.`,
      })
      
      router.push('/assessments')
    } catch (error) {
      if ((error as Error).message !== 'Validation failed') {
        toast({
          title: 'Error',
          description: 'Failed to complete assessment. Please try again.',
          variant: 'destructive',
        })
      }
      throw error
    }
  }

  // Get active sections based on current data
  const activeSections = module.getActiveSections(initialData)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{module.name}</h1>
        <p className="mt-2 text-gray-600">{module.description}</p>
        {module.required && (
          <p className="mt-1 text-sm text-blue-600">* Required assessment</p>
        )}
      </div>

      <AssessmentForm
        sections={activeSections}
        initialData={initialData}
        onSave={handleSave}
        onComplete={handleComplete}
      />
    </div>
  )
}
