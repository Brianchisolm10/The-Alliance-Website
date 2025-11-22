import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { YouthAssessmentClient } from './youth-client'
import { getAssessment } from '@/app/actions/assessments'

export default async function YouthAssessmentPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const existingAssessment = await getAssessment('YOUTH')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Youth Assessment</h1>
        <p className="mt-2 text-gray-600">
          Age-appropriate wellness evaluation for young athletes
        </p>
      </div>

      <YouthAssessmentClient initialData={existingAssessment?.data as Record<string, any>} />
    </div>
  )
}
