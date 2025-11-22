'use server'

import { prisma } from '@/lib/db'
import {
  discoveryFormSchema,
  type DiscoveryFormData,
  updateSchedulingSchema,
  type UpdateSchedulingData,
  updateDiscoveryStatusSchema,
  type UpdateDiscoveryStatusData,
} from '@/lib/validations/discovery'

export async function submitDiscoveryForm(data: DiscoveryFormData) {
  try {
    const validatedFields = discoveryFormSchema.safeParse(data)

    if (!validatedFields.success) {
      return {
        error: 'Invalid fields',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { name, email, goal, notes } = validatedFields.data

    // Create discovery submission
    const submission = await prisma.discoverySubmission.create({
      data: {
        name,
        email: email.toLowerCase(),
        goal,
        notes: notes || null,
        status: 'SUBMITTED',
        callScheduled: false,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'DISCOVERY_FORM_SUBMIT',
        resource: 'DISCOVERY',
        details: { 
          submissionId: submission.id,
          email: email.toLowerCase(),
          name,
        },
      },
    })

    return { 
      success: true,
      submissionId: submission.id,
    }
  } catch (error) {
    console.error('Discovery form submission error:', error)
    return { error: 'Something went wrong. Please try again.' }
  }
}

export async function updateSchedulingStatus(data: UpdateSchedulingData) {
  try {
    const validatedFields = updateSchedulingSchema.safeParse(data)

    if (!validatedFields.success) {
      return {
        error: 'Invalid fields',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { submissionId, callScheduled, callDate } = validatedFields.data

    // Update submission
    const submission = await prisma.discoverySubmission.update({
      where: { id: submissionId },
      data: {
        callScheduled,
        callDate,
        status: callScheduled ? 'CALL_SCHEDULED' : 'SUBMITTED',
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'DISCOVERY_CALL_SCHEDULED',
        resource: 'DISCOVERY',
        details: { 
          submissionId: submission.id,
          email: submission.email,
          callDate: callDate?.toISOString(),
        },
      },
    })

    // TODO: Send confirmation email
    console.log(`Discovery call scheduled for ${submission.email} on ${callDate?.toISOString()}`)

    return { success: true }
  } catch (error) {
    console.error('Update scheduling status error:', error)
    return { error: 'Something went wrong. Please try again.' }
  }
}

export async function updateDiscoveryStatus(data: UpdateDiscoveryStatusData) {
  try {
    const validatedFields = updateDiscoveryStatusSchema.safeParse(data)

    if (!validatedFields.success) {
      return {
        error: 'Invalid fields',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { submissionId, status } = validatedFields.data

    // Update submission status
    const submission = await prisma.discoverySubmission.update({
      where: { id: submissionId },
      data: { status },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'DISCOVERY_STATUS_UPDATE',
        resource: 'DISCOVERY',
        details: { 
          submissionId: submission.id,
          email: submission.email,
          newStatus: status,
        },
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Update discovery status error:', error)
    return { error: 'Something went wrong. Please try again.' }
  }
}
