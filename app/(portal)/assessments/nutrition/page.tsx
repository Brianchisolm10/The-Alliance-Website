import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { NutritionAssessmentClient } from './nutrition-client'
import { getAssessment } from '@/app/actions/assessments'

export default async function NutritionAssessmentPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const existingAssessment = await getAssessment('NUTRITION')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Nutrition Assessment</h1>
        <p className="mt-2 text-gray-600">
          Help us understand your dietary habits, preferences, and nutritional needs
        </p>
      </div>

      <NutritionAssessmentClient initialData={existingAssessment?.data as Record<string, any>} />
    </div>
  )
}
