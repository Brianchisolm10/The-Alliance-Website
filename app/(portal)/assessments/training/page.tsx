import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { TrainingAssessmentClient } from './training-client'
import { getAssessment } from '@/app/actions/assessments'

export default async function TrainingAssessmentPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const existingAssessment = await getAssessment('TRAINING')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Training Assessment</h1>
        <p className="mt-2 text-gray-600">
          Tell us about your training experience, goals, and current fitness level
        </p>
      </div>

      <TrainingAssessmentClient initialData={existingAssessment?.data as Record<string, any>} />
    </div>
  )
}
