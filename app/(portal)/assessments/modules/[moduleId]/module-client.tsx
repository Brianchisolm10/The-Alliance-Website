'use client'

import * as React from 'react'
import { ModularAssessment } from '@/components/assessments/modular-assessment'
import { BaseAssessmentModule } from '@/lib/assessments/modules/base'
import { saveModuleData } from '@/app/actions/modular-assessments'

interface ModuleAssessmentClientProps {
  module: BaseAssessmentModule
  initialData?: Record<string, any>
}

export const ModuleAssessmentClient: React.FC<ModuleAssessmentClientProps> = ({
  module,
  initialData,
}) => {
  const handleSave = async (moduleId: string, data: Record<string, any>, completed: boolean) => {
    await saveModuleData(moduleId, data, completed)
  }

  const handleComplete = async (moduleId: string, data: Record<string, any>) => {
    await saveModuleData(moduleId, data, true)
  }

  return (
    <ModularAssessment
      module={module}
      initialData={initialData}
      onSave={handleSave}
      onComplete={handleComplete}
    />
  )
}
