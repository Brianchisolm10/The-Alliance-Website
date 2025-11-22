import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PerformanceAssessmentClient } from './performance-client'
import { getAssessment } from '@/app/actions/assessments'

export default async function PerformanceAssessmentPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const existingAssessment = await getAssessment('PERFORMANCE')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Performance Assessment</h1>
        <p className="mt-2 text-gray-600">
          Track your athletic performance metrics and benchmarks
        </p>
      </div>

      <PerformanceAssessmentClient initialData={existingAssessment?.data as Record<string, any>} />
    </div>
  )
}
