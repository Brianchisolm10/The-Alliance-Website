import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LifestyleAssessmentClient } from './lifestyle-client'
import { getAssessment } from '@/app/actions/assessments'

export default async function LifestyleAssessmentPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const existingAssessment = await getAssessment('LIFESTYLE')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Lifestyle Assessment</h1>
        <p className="mt-2 text-gray-600">
          Assess your sleep, hydration, stress, and daily habits
        </p>
      </div>

      <LifestyleAssessmentClient initialData={existingAssessment?.data as Record<string, any>} />
    </div>
  )
}
