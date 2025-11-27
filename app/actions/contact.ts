'use server'

import { prisma } from '@/lib/db'
import { z } from 'zod'
import { logFormSubmission } from '@/lib/logging'
import { sendContactFormNotification, sendContactFormConfirmation } from '@/lib/email'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function submitContactForm(data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    const validatedData = contactSchema.parse(data)

    // Save to database
    const submission = await prisma.contactSubmission.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
      },
    })

    // Log activity
    await logFormSubmission('CONTACT_FORM_SUBMIT', null, {
      submissionId: submission.id,
      email: validatedData.email,
      subject: validatedData.subject,
    })

    // Send notification email to admin (afya@theafya.org)
    await sendContactFormNotification(
      validatedData.name,
      validatedData.email,
      validatedData.subject,
      validatedData.message,
      submission.id
    )

    // Send confirmation email to submitter
    await sendContactFormConfirmation(
      validatedData.name,
      validatedData.email,
      validatedData.subject
    )

    return { success: true }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Failed to submit contact form' }
  }
}
