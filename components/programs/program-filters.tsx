'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'

export const ProgramFilters: React.FC = () => {
  const [selectedType, setSelectedType] = React.useState<string>('all')
  const [selectedIntensity, setSelectedIntensity] = React.useState<string>('all')
  const [selectedDuration, setSelectedDuration] = React.useState<string>('all')

  const programTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'FITNESS', label: 'Fitness' },
    { value: 'NUTRITION', label: 'Nutrition' },
    { value: 'WELLNESS', label: 'Wellness' },
    { value: 'YOUTH', label: 'Youth' },
    { value: 'RECOVERY', label: 'Recovery' },
  ]

  const intensityLevels = [
    { value: 'all', label: 'All Levels' },
    { value: 'BEGINNER', label: 'Beginner' },
    { value: 'INTERMEDIATE', label: 'Intermediate' },
    { value: 'ADVANCED', label: 'Advanced' },
    { value: 'ELITE', label: 'Elite' },
  ]

  const durations = [
    { value: 'all', label: 'Any Duration' },
    { value: '4', label: '4 weeks or less' },
    { value: '8', label: '8 weeks' },
    { value: '12', label: '12 weeks or more' },
  ]

  // Emit filter changes
  React.useEffect(() => {
    const event = new CustomEvent('filterChange', {
      detail: {
        type: selectedType,
        intensity: selectedIntensity,
        duration: selectedDuration,
      },
    })
    window.dispatchEvent(event)
  }, [selectedType, selectedIntensity, selectedDuration])

  const handleReset = () => {
    setSelectedType('all')
    setSelectedIntensity('all')
    setSelectedDuration('all')
  }

  const hasActiveFilters = selectedType !== 'all' || selectedIntensity !== 'all' || selectedDuration !== 'all'

  return (
    <div className="space-y-6 sticky top-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Reset
          </Button>
        )}
      </div>

      {/* Program Type Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Program Type</h4>
        <div className="space-y-2">
          {programTypes.map((type) => (
            <label
              key={type.value}
              className="flex items-center cursor-pointer group"
            >
              <input
                type="radio"
                name="type"
                value={type.value}
                checked={selectedType === type.value}
                onChange={(e) => setSelectedType(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                {type.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Intensity Level Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Intensity Level</h4>
        <div className="space-y-2">
          {intensityLevels.map((level) => (
            <label
              key={level.value}
              className="flex items-center cursor-pointer group"
            >
              <input
                type="radio"
                name="intensity"
                value={level.value}
                checked={selectedIntensity === level.value}
                onChange={(e) => setSelectedIntensity(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                {level.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Duration Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Duration</h4>
        <div className="space-y-2">
          {durations.map((duration) => (
            <label
              key={duration.value}
              className="flex items-center cursor-pointer group"
            >
              <input
                type="radio"
                name="duration"
                value={duration.value}
                checked={selectedDuration === duration.value}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                {duration.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
