'use client'

import * as React from 'react'
import { ProgramCard } from './program-card'

interface Program {
  id: string
  name: string
  description: string
  type: string
  intensity: string
  duration: string
  imageUrl: string | null
}

interface ProgramsGridProps {
  programs: Program[]
}

export const ProgramsGrid: React.FC<ProgramsGridProps> = ({ programs }) => {
  const [filteredPrograms, setFilteredPrograms] = React.useState(programs)

  // Listen for filter changes from the filter component
  React.useEffect(() => {
    const handleFilterChange = (event: CustomEvent) => {
      const { type, intensity, duration } = event.detail

      const filtered = programs.filter((program) => {
        const matchesType = !type || type === 'all' || program.type === type
        const matchesIntensity = !intensity || intensity === 'all' || program.intensity === intensity
        const matchesDuration = !duration || duration === 'all' || program.duration.toLowerCase().includes(duration.toLowerCase())

        return matchesType && matchesIntensity && matchesDuration
      })

      setFilteredPrograms(filtered)
    }

    window.addEventListener('filterChange' as any, handleFilterChange)
    return () => window.removeEventListener('filterChange' as any, handleFilterChange)
  }, [programs])

  if (filteredPrograms.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No programs found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your filters to see more results
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredPrograms.length} {filteredPrograms.length === 1 ? 'program' : 'programs'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {filteredPrograms.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>
    </div>
  )
}
