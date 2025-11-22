'use client'

import { useState } from 'react'
import { assignPopulation, convertDiscoveryWithPopulation } from '@/app/actions/population'
import { getAllPopulations } from '@/lib/population/routing'
import { useRouter } from 'next/navigation'

type Population = 'GENERAL' | 'ATHLETE' | 'YOUTH' | 'RECOVERY' | 'PREGNANCY' | 'POSTPARTUM' | 'OLDER_ADULT' | 'CHRONIC_CONDITION'

interface PopulationAssignmentProps {
  userId?: string
  discoverySubmissionId?: string
  currentPopulation?: Population | null
  mode: 'assign' | 'convert' | 'update'
  onSuccess?: () => void
}

export function PopulationAssignment({
  userId,
  discoverySubmissionId,
  currentPopulation,
  mode,
  onSuccess,
}: PopulationAssignmentProps) {
  const router = useRouter()
  const [selectedPopulation, setSelectedPopulation] = useState<Population | ''>(
    currentPopulation || ''
  )
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const populations = getAllPopulations()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPopulation) {
      setError('Please select a population')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      let result

      if (mode === 'convert' && discoverySubmissionId) {
        // Convert discovery submission with population
        result = await convertDiscoveryWithPopulation({
          discoverySubmissionId,
          population: selectedPopulation,
          notes,
        })
      } else if (mode === 'assign' && userId) {
        // Assign population to existing user
        result = await assignPopulation({
          userId,
          population: selectedPopulation,
          adminNotes: notes,
        })
      } else if (mode === 'update' && userId) {
        // Update existing population
        const { updateUserPopulation } = await import('@/app/actions/population')
        result = await updateUserPopulation({
          userId,
          population: selectedPopulation,
          reason: notes,
        })
      } else {
        setError('Invalid configuration')
        setIsSubmitting(false)
        return
      }

      if (result.error) {
        setError(result.error)
      } else {
        // Success
        if (onSuccess) {
          onSuccess()
        } else {
          router.refresh()
        }
      }
    } catch (err) {
      console.error('Population assignment error:', err)
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="population" className="block text-sm font-medium text-gray-700 mb-2">
          Select Population <span className="text-red-500">*</span>
        </label>
        <select
          id="population"
          value={selectedPopulation}
          onChange={(e) => setSelectedPopulation(e.target.value as Population)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        >
          <option value="">-- Select Population --</option>
          {populations.map((pop) => (
            <option key={pop.value} value={pop.value}>
              {pop.name} - {pop.description}
            </option>
          ))}
        </select>
        {selectedPopulation && (
          <div className="mt-2 text-sm text-gray-600">
            <p>
              <strong>Required assessments:</strong> {populations.find(p => p.value === selectedPopulation)?.requiredAssessments}
            </p>
            <p>
              <strong>Optional assessments:</strong> {populations.find(p => p.value === selectedPopulation)?.optionalAssessments}
            </p>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          {mode === 'update' ? 'Reason for Change' : 'Notes'}
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder={
            mode === 'update'
              ? 'Why is the population being changed?'
              : 'Add any relevant notes about this population assignment...'
          }
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={isSubmitting || !selectedPopulation}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Processing...' : mode === 'convert' ? 'Create User' : mode === 'update' ? 'Update Population' : 'Assign Population'}
        </button>
      </div>
    </form>
  )
}
