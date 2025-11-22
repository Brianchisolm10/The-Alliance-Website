import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ModulesListClient } from './modules-client'
import { getAvailableModules, getAssessmentProgress } from '@/app/actions/modular-assessments'

export default async function ModulesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const modules = await getAvailableModules()
  const progress = await getAssessmentProgress()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Assessment Modules</h1>
        <p className="mt-2 text-gray-600">
          Complete these modules to build your personalized wellness profile
        </p>
      </div>

      <ModulesListClient
        requiredModules={modules.required}
        optionalModules={modules.optional}
        progress={progress}
      />
    </div>
  )
}
