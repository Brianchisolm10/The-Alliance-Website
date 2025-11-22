'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export const MobileFilters: React.FC = () => {
  const [open, setOpen] = React.useState(false)
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

  const applyFilters = () => {
    const event = new CustomEvent('filterChange', {
      detail: {
        type: selectedType,
        intensity: selectedIntensity,
        duration: selectedDuration,
      },
    })
    window.dispatchEvent(event)
    setOpen(false)
  }

  const handleReset = () => {
    setSelectedType('all')
    setSelectedIntensity('all')
    setSelectedDuration('all')
  }

  const hasActiveFilters = selectedType !== 'all' || selectedIntensity !== 'all' || selectedDuration !== 'all'

  return (
    <>
      <Button variant="outline" className="w-full" onClick={() => setOpen(true)}>
        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
        {hasActiveFilters && (
          <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
            {[selectedType !== 'all', selectedIntensity !== 'all', selectedDuration !== 'all'].filter(Boolean).length}
          </span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filter Programs</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
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

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1"
              disabled={!hasActiveFilters}
            >
              Reset
            </Button>
            <Button onClick={applyFilters} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
