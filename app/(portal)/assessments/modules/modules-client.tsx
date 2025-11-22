'use client'

import * as React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle, Circle, Clock } from 'lucide-react'

interface ModuleInfo {
  id: string
  name: string
  description: string
  category: string
  priority: number
}

interface Progress {
  completedModules: string[]
  requiredModules: string[]
  allCompleted: boolean
  percentage: number
}

interface ModulesListClientProps {
  requiredModules: ModuleInfo[]
  optionalModules: ModuleInfo[]
  progress: Progress
}

export const ModulesListClient: React.FC<ModulesListClientProps> = ({
  requiredModules,
  optionalModules,
  progress,
}) => {
  const isModuleCompleted = (moduleId: string) => {
    return progress.completedModules.includes(moduleId)
  }

  const renderModuleCard = (module: ModuleInfo, required: boolean) => {
    const completed = isModuleCompleted(module.id)

    return (
      <Card key={module.id} className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {completed ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
              <h3 className="text-lg font-semibold text-gray-900">{module.name}</h3>
              {required && (
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                  Required
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-600">{module.description}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                {module.category}
              </span>
              {completed && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  Completed
                </span>
              )}
            </div>
          </div>
          <div className="ml-4">
            <Link href={`/assessments/modules/${module.id}`}>
              <Button variant={completed ? 'outline' : 'default'}>
                {completed ? 'Review' : 'Start'}
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Progress bar */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Overall Progress</h2>
            <p className="mt-1 text-sm text-gray-600">
              {progress.completedModules.length} of{' '}
              {requiredModules.length + optionalModules.length} modules completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{progress.percentage}%</div>
            {progress.allCompleted && (
              <p className="mt-1 text-sm text-green-600">All required modules complete!</p>
            )}
          </div>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </Card>

      {/* Required modules */}
      {requiredModules.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-900">Required Modules</h2>
          <div className="space-y-4">
            {requiredModules.map((module) => renderModuleCard(module, true))}
          </div>
        </div>
      )}

      {/* Optional modules */}
      {optionalModules.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-900">Optional Modules</h2>
          <p className="mb-4 text-sm text-gray-600">
            These modules help us create a more personalized program for you
          </p>
          <div className="space-y-4">
            {optionalModules.map((module) => renderModuleCard(module, false))}
          </div>
        </div>
      )}

      {requiredModules.length === 0 && optionalModules.length === 0 && (
        <Card className="p-12 text-center">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No Modules Available</h3>
          <p className="mt-2 text-sm text-gray-600">
            Please contact your coach to set up your assessment modules.
          </p>
        </Card>
      )}
    </div>
  )
}
