'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'
import { AssessmentType } from '@prisma/client'
import { logFormSubmission } from '@/lib/logging'

export async function saveAssessment(
  type: AssessmentType,
  data: Record<string, any>,
  completed: boolean
) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  try {
    // Find existing assessment or create new one
    const existingAssessment = await prisma.assessment.findFirst({
      where: {
        userId: session.user.id,
        type,
      },
    })

    if (existingAssessment) {
      // Update existing assessment
      await prisma.assessment.update({
        where: { id: existingAssessment.id },
        data: {
          data,
          completed,
          updatedAt: new Date(),
        },
      })
    } else {
      // Create new assessment
      await prisma.assessment.create({
        data: {
          userId: session.user.id,
          type,
          data,
          completed,
        },
      })
    }

    // Log activity
    if (completed) {
      await logFormSubmission('ASSESSMENT_SUBMIT', session.user.id, { type })
    }

    revalidatePath('/assessments')
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Error saving assessment:', error)
    throw new Error('Failed to save assessment')
  }
}

export async function getAssessment(type: AssessmentType) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  try {
    const assessment = await prisma.assessment.findFirst({
      where: {
        userId: session.user.id,
        type,
      },
    })

    return assessment
  } catch (error) {
    console.error('Error fetching assessment:', error)
    throw new Error('Failed to fetch assessment')
  }
}
