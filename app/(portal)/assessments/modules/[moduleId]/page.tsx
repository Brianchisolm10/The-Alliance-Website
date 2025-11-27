import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ModuleAssessmentClient } from './module-client'
import { getModuleData } from '@/app/actions/modular-assessments'
import { assessmentRegistry } from '@/lib/assessments'

interface ModulePageProps {
  params: {
    moduleId: string
  }
}

export default async function ModulePage({ params }: ModulePageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  try {
    // Get existing data
    const existingData = await getModuleData(params.moduleId)

    // Get the actual module instance for rendering
    const assessmentModule = assessmentRegistry.getModule(params.moduleId)

    if (!assessmentModule) {
      redirect('/assessments/modules')
    }

    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <ModuleAssessmentClient
          module={assessmentModule}
          initialData={existingData}
        />
      </div>
    )
  } catch (error) {
    console.error('Error loading module:', error)
    redirect('/assessments/modules')
  }
}
