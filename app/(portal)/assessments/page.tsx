import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getAssessmentsByUserId, populationQueries } from '@/lib/db/queries'
import { getPopulationAssessments, formatPopulationName } from '@/lib/population/routing'
import { AssessmentType } from '@prisma/client'
import Link from 'next/link'

const assessmentModuleInfo: Record<AssessmentType, {
  name: string
  description: string
  icon: string
  color: string
}> = {
  GENERAL: {
    name: 'General Assessment',
    description: 'Overall wellness and health evaluation',
    icon: '📋',
    color: 'bg-gray-50 border-gray-200 hover:bg-gray-100',
  },
  NUTRITION: {
    name: 'Nutrition Assessment',
    description: 'Evaluate your dietary habits, preferences, and nutritional needs',
    icon: '🥗',
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
  },
  TRAINING: {
    name: 'Training Assessment',
    description: 'Assess your training experience, goals, and current fitness level',
    icon: '💪',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
  },
  PERFORMANCE: {
    name: 'Performance Assessment',
    description: 'Track athletic performance metrics and benchmarks',
    icon: '🏃',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
  },
  YOUTH: {
    name: 'Youth Assessment',
    description: 'Age-appropriate wellness evaluation for young athletes',
    icon: '👦',
    color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
  },
  RECOVERY: {
    name: 'Recovery Assessment',
    description: 'Evaluate injury history, recovery status, and rehabilitation needs',
    icon: '🩹',
    color: 'bg-red-50 border-red-200 hover:bg-red-100',
  },
  LIFESTYLE: {
    name: 'Lifestyle Assessment',
    description: 'Assess sleep, hydration, stress, and daily habits',
    icon: '🧘',
    color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
  },
}

export default async function AssessmentsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Get user with population
  const user = await populationQueries.getUserWithPopulation(session.user.id)
  
  if (!user) {
    redirect('/login')
  }

  // If user doesn&apos;t have a population assigned, show message
  if (!user.population) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Assessments</h1>
        </div>
        <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-8 text-center">
          <div className="text-5xl mb-4">⏳</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Assessment Setup Pending
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Your personalized assessment pathway is being configured based on your discovery call. 
            You&apos;ll receive an email notification once your assessments are ready.
          </p>
        </div>
      </div>
    )
  }

  // Get population-specific assessments
  const populationConfig = getPopulationAssessments(user.population)
  const assessments = await getAssessmentsByUserId(session.user.id)

  const getAssessmentStatus = (type: AssessmentType) => {
    const assessment = assessments.find((a) => a.type === type)
    if (!assessment) return { status: 'not_started', progress: 0 }
    if (assessment.completed) return { status: 'completed', progress: 100 }
    return { status: 'in_progress', progress: 50 } // Simplified progress calculation
  }

  // Build assessment modules based on population
  const requiredModules = populationConfig.required.map(type => ({
    type,
    ...assessmentModuleInfo[type],
    required: true,
  }))

  const optionalModules = populationConfig.optional.map(type => ({
    type,
    ...assessmentModuleInfo[type],
    required: false,
  }))

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Assessments</h1>
        <p className="mt-2 text-gray-600">
          Complete assessments to receive personalized wellness packets tailored to your needs
        </p>
        <div className="mt-4 flex items-center gap-4">
          <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800">
            <span className="mr-2">📊</span>
            Your pathway: {formatPopulationName(user.population)}
          </div>
          <Link
            href="/assessments/modules"
            className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 hover:bg-purple-200 transition-colors"
          >
            <span className="mr-2">🧩</span>
            Modular Assessments
          </Link>
        </div>
      </div>

      {/* Required Assessments */}
      {requiredModules.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Assessments</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {requiredModules.map((module) => {
              const { status, progress } = getAssessmentStatus(module.type)

              return (
                <Link
                  key={module.type}
                  href={`/assessments/${module.type.toLowerCase()}`}
                  className={`block rounded-lg border-2 p-6 transition-all ${module.color}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="text-4xl">{module.icon}</div>
                    <div className="flex flex-col items-end gap-1">
                      {status === 'completed' && (
                        <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white">
                          Completed
                        </span>
                      )}
                      {status === 'in_progress' && (
                        <span className="rounded-full bg-blue-500 px-2 py-1 text-xs font-semibold text-white">
                          In Progress
                        </span>
                      )}
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
                        Required
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{module.name}</h3>
                  <p className="mt-2 text-sm text-gray-600">{module.description}</p>

                  {status !== 'not_started' && (
                    <div className="mt-4">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full bg-blue-600 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{progress}% complete</p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center text-sm font-medium text-blue-600">
                    {status === 'not_started' && 'Start Assessment'}
                    {status === 'in_progress' && 'Continue Assessment'}
                    {status === 'completed' && 'View Results'}
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Optional Assessments */}
      {optionalModules.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Optional Assessments</h2>
          <p className="text-sm text-gray-600 mb-4">
            These assessments can provide additional insights but are not required for your program.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {optionalModules.map((module) => {
              const { status, progress } = getAssessmentStatus(module.type)

              return (
                <Link
                  key={module.type}
                  href={`/assessments/${module.type.toLowerCase()}`}
                  className={`block rounded-lg border-2 p-6 transition-all ${module.color}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="text-4xl">{module.icon}</div>
                    <div className="flex flex-col items-end gap-1">
                      {status === 'completed' && (
                        <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white">
                          Completed
                        </span>
                      )}
                      {status === 'in_progress' && (
                        <span className="rounded-full bg-blue-500 px-2 py-1 text-xs font-semibold text-white">
                          In Progress
                        </span>
                      )}
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
                        Optional
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{module.name}</h3>
                  <p className="mt-2 text-sm text-gray-600">{module.description}</p>

                  {status !== 'not_started' && (
                    <div className="mt-4">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full bg-blue-600 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{progress}% complete</p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center text-sm font-medium text-blue-600">
                    {status === 'not_started' && 'Start Assessment'}
                    {status === 'in_progress' && 'Continue Assessment'}
                    {status === 'completed' && 'View Results'}
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
