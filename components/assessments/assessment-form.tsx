'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export interface AssessmentQuestion {
  id: string
  question: string
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number'
  options?: string[]
  required?: boolean
  placeholder?: string
  condition?: (data: Record<string, any>) => boolean
}

export interface AssessmentSection {
  id: string
  title: string
  description?: string
  questions: AssessmentQuestion[]
}

interface AssessmentFormProps {
  sections: AssessmentSection[]
  initialData?: Record<string, any>
  onSave: (data: Record<string, any>, completed: boolean) => Promise<void>
  onComplete: (data: Record<string, any>) => Promise<void>
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({
  sections,
  initialData = {},
  onSave,
  onComplete,
}) => {
  const [currentSection, setCurrentSection] = React.useState(0)
  const [formData, setFormData] = React.useState<Record<string, any>>(initialData)
  const [saving, setSaving] = React.useState(false)
  const [completing, setCompleting] = React.useState(false)

  const currentSectionData = sections[currentSection]
  const isLastSection = currentSection === sections.length - 1
  const progress = ((currentSection + 1) / sections.length) * 100

  const handleInputChange = (questionId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleSaveProgress = async () => {
    setSaving(true)
    try {
      await onSave(formData, false)
    } finally {
      setSaving(false)
    }
  }

  const handleNext = async () => {
    await handleSaveProgress()
    if (currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1)
    }
  }

  const handleComplete = async () => {
    setCompleting(true)
    try {
      await onComplete(formData)
    } finally {
      setCompleting(false)
    }
  }

  const renderQuestion = (question: AssessmentQuestion) => {
    // Check condition if exists
    if (question.condition && !question.condition(formData)) {
      return null
    }

    const value = formData[question.id] || ''

    return (
      <div key={question.id} className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {question.question}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {question.type === 'text' && (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required={question.required}
          />
        )}

        {question.type === 'number' && (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required={question.required}
          />
        )}

        {question.type === 'textarea' && (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required={question.required}
          />
        )}

        {question.type === 'select' && (
          <select
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required={question.required}
          >
            <option value="">Select an option</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}

        {question.type === 'radio' && (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  required={question.required}
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'checkbox' && (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={(value as string[])?.includes(option) || false}
                  onChange={(e) => {
                    const currentValues = (value as string[]) || []
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((v) => v !== option)
                    handleInputChange(question.id, newValues)
                  }}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">
            Section {currentSection + 1} of {sections.length}
          </span>
          <span className="text-gray-500">{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current section */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{currentSectionData.title}</h2>
          {currentSectionData.description && (
            <p className="mt-2 text-gray-600">{currentSectionData.description}</p>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (isLastSection) {
              handleComplete()
            } else {
              handleNext()
            }
          }}
          className="space-y-6"
        >
          {currentSectionData.questions.map(renderQuestion)}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between border-t pt-6">
            <div className="flex gap-2">
              {currentSection > 0 && (
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveProgress}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Progress'}
              </Button>

              {isLastSection ? (
                <Button type="submit" disabled={completing}>
                  {completing ? 'Completing...' : 'Complete Assessment'}
                </Button>
              ) : (
                <Button type="submit">Next</Button>
              )}
            </div>
          </div>
        </form>
      </Card>
    </div>
  )
}
