import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { RecoveryAssessmentClient } from './recovery-client'
import { getAssessment } from '@/app/actions/assessments'

export default async function RecoveryAssessmentPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const existingAssessment = await getAssessment('RECOVERY')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Recovery Assessment</h1>
        <p className="mt-2 text-gray-600">
          Evaluate your injury history, recovery status, and rehabilitation needs
        </p>
      </div>

      <RecoveryAssessmentClient initialData={existingAssessment?.data as Record<string, any>} />
    </div>
  )
}
