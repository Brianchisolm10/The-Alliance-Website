'use client'

import { Population } from '@prisma/client'
import { getPopulationInfo } from '@/lib/population/routing'

interface PopulationInfoProps {
  population: Population
  showDetails?: boolean
}

export function PopulationInfo({ population, showDetails = false }: PopulationInfoProps) {
  const info = getPopulationInfo(population)

  return (
    <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📊</span>
            <h3 className="text-lg font-semibold text-gray-900">
              Your Wellness Pathway
            </h3>
          </div>
          <p className="text-blue-900 font-medium mb-1">{info.name}</p>
          <p className="text-sm text-gray-700">{info.description}</p>
          
          {showDetails && (
            <div className="mt-3 flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="font-medium text-gray-900">
                  {info.requiredAssessments}
                </span>
                <span className="text-gray-600">required</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-gray-900">
                  {info.optionalAssessments}
                </span>
                <span className="text-gray-600">optional</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-blue-200">
        <p className="text-xs text-gray-600">
          Your pathway is customized based on your discovery call. If you feel this doesn&apos;t match 
          your needs, please contact your wellness coach.
        </p>
      </div>
    </div>
  )
}
