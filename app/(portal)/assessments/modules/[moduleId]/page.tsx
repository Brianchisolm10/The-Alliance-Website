import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ModuleAssessmentClient } from './module-client'
import { getModuleById, getModuleData } from '@/app/actions/modular-assessments'
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
    // Get module info
    const moduleInfo = await getModuleById(params.moduleId)
    
    // Get existing data
    const existingData = await getModuleData(params.moduleId)

    // Get the actual module instance for rendering
    const module = assessmentRegistry.getModule(params.moduleId)

    if (!module) {
      redirect('/assessments/modules')
    }

    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <ModuleAssessmentClient
          module={module}
          initialData={existingData}
        />
      </div>
    )
  } catch (error) {
    console.error('Error loading module:', error)
    redirect('/assessments/modules')
  }
}
