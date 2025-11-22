'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { DiscoveryStatus } from '@prisma/client'

export async function getClients(params?: {
  search?: string
  status?: string
  assignedTo?: string
  page?: number
  limit?: number
}) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    const page = params?.page || 1
    const limit = params?.limit || 20
    const skip = (page - 1) * limit

    // Build where clause for USER role only
    const where: any = {
      role: 'USER',
    }

    if (params?.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        { name: { contains: params.search, mode: 'insensitive' } },
      ]
    }

    if (params?.status) {
      where.status = params.status
    }

    // Filter by assigned team member
    if (params?.assignedTo) {
      where.clientAssignments = {
        some: {
          assignedToId: params.assignedTo,
        },
      }
    }

    // Fetch clients with pagination
    const [clients, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          status: true,
          population: true,
          createdAt: true,
          lastLoginAt: true,
          _count: {
            select: {
              assessments: true,
              packets: true,
              orders: true,
              clientNotes: true,
            },
          },
          clientAssignments: {
            include: {
              assignedTo: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ])

    // Get discovery submissions for each client
    const clientsWithDiscovery = await Promise.all(
      clients.map(async (client) => {
        const discovery = await prisma.discoverySubmission.findFirst({
          where: { email: client.email },
          orderBy: { createdAt: 'desc' },
        })

        return {
          ...client,
          discovery,
        }
      })
    )

    return {
      success: true,
      data: {
        clients: clientsWithDiscovery,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    }
  } catch (error) {
    console.error('Error fetching clients:', error)
    return { success: false, error: 'Failed to fetch clients' }
  }
}

export async function getClientById(clientId: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    const client = await prisma.user.findUnique({
      where: { id: clientId },
      include: {
        assessments: {
          orderBy: { createdAt: 'desc' },
        },
        packets: {
          orderBy: { createdAt: 'desc' },
          where: {
            status: {
              in: ['PUBLISHED', 'UNPUBLISHED', 'DRAFT'],
            },
          },
        },
        orders: {
          orderBy: { createdAt: 'desc' },
        },
        clientNotes: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        clientAssignments: {
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        activityLogs: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    })

    if (!client) {
      return { success: false, error: 'Client not found' }
    }

    // Get discovery submission
    const discovery = await prisma.discoverySubmission.findFirst({
      where: { email: client.email },
      orderBy: { createdAt: 'desc' },
    })

    return {
      success: true,
      data: {
        ...client,
        discovery,
      },
    }
  } catch (error) {
    console.error('Error fetching client:', error)
    return { success: false, error: 'Failed to fetch client' }
  }
}

export async function getTeamMembers() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    const teamMembers = await prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'SUPER_ADMIN'],
        },
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { name: 'asc' },
    })

    return {
      success: true,
      data: teamMembers,
    }
  } catch (error) {
    console.error('Error fetching team members:', error)
    return { success: false, error: 'Failed to fetch team members' }
  }
}

export async function createClientNote(clientId: string, content: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    if (!content || content.trim().length === 0) {
      return { success: false, error: 'Note content is required' }
    }

    // Verify client exists
    const client = await prisma.user.findUnique({
      where: { id: clientId },
    })

    if (!client) {
      return { success: false, error: 'Client not found' }
    }

    // Create note
    const note = await prisma.clientNote.create({
      data: {
        clientId,
        authorId: session.user.id,
        content: content.trim(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE_CLIENT_NOTE',
        resource: 'CLIENT_NOTE',
        details: {
          clientId,
          noteId: note.id,
        },
      },
    })

    return {
      success: true,
      data: note,
    }
  } catch (error) {
    console.error('Error creating client note:', error)
    return { success: false, error: 'Failed to create note' }
  }
}

export async function updateClientNote(noteId: string, content: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    if (!content || content.trim().length === 0) {
      return { success: false, error: 'Note content is required' }
    }

    // Get existing note
    const existingNote = await prisma.clientNote.findUnique({
      where: { id: noteId },
    })

    if (!existingNote) {
      return { success: false, error: 'Note not found' }
    }

    // Only author can edit their own notes
    if (existingNote.authorId !== session.user.id && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'You can only edit your own notes' }
    }

    // Update note
    const note = await prisma.clientNote.update({
      where: { id: noteId },
      data: {
        content: content.trim(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE_CLIENT_NOTE',
        resource: 'CLIENT_NOTE',
        details: {
          noteId,
          clientId: note.clientId,
        },
      },
    })

    return {
      success: true,
      data: note,
    }
  } catch (error) {
    console.error('Error updating client note:', error)
    return { success: false, error: 'Failed to update note' }
  }
}

export async function deleteClientNote(noteId: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    // Get existing note
    const existingNote = await prisma.clientNote.findUnique({
      where: { id: noteId },
    })

    if (!existingNote) {
      return { success: false, error: 'Note not found' }
    }

    // Only author can delete their own notes
    if (existingNote.authorId !== session.user.id && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'You can only delete your own notes' }
    }

    // Delete note
    await prisma.clientNote.delete({
      where: { id: noteId },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE_CLIENT_NOTE',
        resource: 'CLIENT_NOTE',
        details: {
          noteId,
          clientId: existingNote.clientId,
        },
      },
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting client note:', error)
    return { success: false, error: 'Failed to delete note' }
  }
}

export async function sendClientEmail(
  clientId: string,
  subject: string,
  message: string,
  templateId?: string
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    if (!subject || !message) {
      return { success: false, error: 'Subject and message are required' }
    }

    // Get client
    const client = await prisma.user.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    if (!client) {
      return { success: false, error: 'Client not found' }
    }

    // Send email
    const { sendEmail } = await import('@/lib/email')
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h1 style="color: #2563eb; margin-bottom: 20px;">${subject}</h1>
            
            <p>Hi ${client.name || 'there'},</p>
            
            <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 25px 0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            
            <p style="margin-top: 30px;">Best regards,<br>
            <strong>The AFYA Team</strong></p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #6b7280; text-align: center;">
              This email was sent by AFYA Wellness<br>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="color: #2563eb;">theafya.org</a>
            </p>
          </div>
        </body>
      </html>
    `

    const text = `
Hi ${client.name || 'there'},

${message}

Best regards,
The AFYA Team

---
This email was sent by AFYA Wellness
${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}
    `.trim()

    const emailResult = await sendEmail({
      to: client.email,
      subject,
      html,
      text,
    })

    if (!emailResult.success) {
      return { success: false, error: emailResult.error || 'Failed to send email' }
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'SEND_CLIENT_EMAIL',
        resource: 'EMAIL',
        details: {
          clientId,
          subject,
          templateId,
        },
      },
    })

    return {
      success: true,
      message: 'Email sent successfully',
    }
  } catch (error) {
    console.error('Error sending client email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

export async function getEmailTemplates() {
  // Return predefined email templates
  return {
    success: true,
    data: [
      {
        id: 'welcome',
        name: 'Welcome Message',
        subject: 'Welcome to AFYA!',
        message: `We're excited to have you join the AFYA community!

Your wellness journey starts here. We've created a personalized experience just for you, and we're here to support you every step of the way.

If you have any questions or need assistance, please don't hesitate to reach out.`,
      },
      {
        id: 'check-in',
        name: 'Progress Check-in',
        subject: 'How are you doing?',
        message: `We wanted to check in and see how you're progressing with your wellness journey.

Have you had a chance to review your personalized packet? Are there any questions or concerns we can help address?

We're here to support you and want to make sure you're getting the most out of your AFYA experience.`,
      },
      {
        id: 'assessment-reminder',
        name: 'Assessment Reminder',
        subject: 'Complete Your Assessment',
        message: `We noticed you haven't completed your assessment yet.

Your assessment is an important step in creating your personalized wellness plan. It only takes a few minutes and will help us tailor recommendations specifically for you.

Log in to your portal to get started!`,
      },
      {
        id: 'packet-ready',
        name: 'Packet Ready Notification',
        subject: 'Your Wellness Packet is Ready',
        message: `Great news! Your personalized wellness packet has been prepared and is now available in your portal.

This packet contains customized recommendations based on your assessment responses and goals.

Log in to download and review your packet, and let us know if you have any questions!`,
      },
      {
        id: 'follow-up',
        name: 'General Follow-up',
        subject: 'Following Up',
        message: `I wanted to follow up with you regarding your wellness journey.

Please let me know if there's anything I can help you with or if you have any questions about your program.

Looking forward to hearing from you!`,
      },
    ],
  }
}

export async function assignClientToTeamMember(
  clientId: string,
  teamMemberId: string
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    // Verify client exists
    const client = await prisma.user.findUnique({
      where: { id: clientId },
    })

    if (!client) {
      return { success: false, error: 'Client not found' }
    }

    // Verify team member exists and is admin
    const teamMember = await prisma.user.findUnique({
      where: { id: teamMemberId },
    })

    if (!teamMember) {
      return { success: false, error: 'Team member not found' }
    }

    if (teamMember.role !== 'ADMIN' && teamMember.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Can only assign to admin users' }
    }

    // Check if assignment already exists
    const existingAssignment = await prisma.clientAssignment.findUnique({
      where: {
        clientId_assignedToId: {
          clientId,
          assignedToId: teamMemberId,
        },
      },
    })

    if (existingAssignment) {
      return { success: false, error: 'Client is already assigned to this team member' }
    }

    // Create assignment
    const assignment = await prisma.clientAssignment.create({
      data: {
        clientId,
        assignedToId: teamMemberId,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'ASSIGN_CLIENT',
        resource: 'CLIENT_ASSIGNMENT',
        details: {
          clientId,
          assignedToId: teamMemberId,
          assignmentId: assignment.id,
        },
      },
    })

    return {
      success: true,
      data: assignment,
    }
  } catch (error) {
    console.error('Error assigning client:', error)
    return { success: false, error: 'Failed to assign client' }
  }
}

export async function unassignClientFromTeamMember(
  clientId: string,
  teamMemberId: string
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    // Find and delete assignment
    const assignment = await prisma.clientAssignment.findUnique({
      where: {
        clientId_assignedToId: {
          clientId,
          assignedToId: teamMemberId,
        },
      },
    })

    if (!assignment) {
      return { success: false, error: 'Assignment not found' }
    }

    await prisma.clientAssignment.delete({
      where: {
        id: assignment.id,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'UNASSIGN_CLIENT',
        resource: 'CLIENT_ASSIGNMENT',
        details: {
          clientId,
          assignedToId: teamMemberId,
        },
      },
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error unassigning client:', error)
    return { success: false, error: 'Failed to unassign client' }
  }
}

export async function getClientAssignments(clientId: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    const assignments = await prisma.clientAssignment.findMany({
      where: { clientId },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return {
      success: true,
      data: assignments,
    }
  } catch (error) {
    console.error('Error fetching client assignments:', error)
    return { success: false, error: 'Failed to fetch assignments' }
  }
}

export async function updateDiscoveryCallStatus(
  discoveryId: string,
  data: {
    status?: DiscoveryStatus
    callScheduled?: boolean
    callDate?: Date | null
  }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    // Get existing discovery submission
    const existingDiscovery = await prisma.discoverySubmission.findUnique({
      where: { id: discoveryId },
    })

    if (!existingDiscovery) {
      return { success: false, error: 'Discovery submission not found' }
    }

    // Update discovery submission
    const updateData: any = {}
    if (data.status !== undefined) updateData.status = data.status
    if (data.callScheduled !== undefined) updateData.callScheduled = data.callScheduled
    if (data.callDate !== undefined) updateData.callDate = data.callDate

    const discovery = await prisma.discoverySubmission.update({
      where: { id: discoveryId },
      data: updateData,
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE_DISCOVERY_CALL',
        resource: 'DISCOVERY_SUBMISSION',
        details: {
          discoveryId,
          updates: updateData,
        },
      },
    })

    return {
      success: true,
      data: discovery,
    }
  } catch (error) {
    console.error('Error updating discovery call status:', error)
    return { success: false, error: 'Failed to update discovery call status' }
  }
}

export async function getDiscoverySubmissionByEmail(email: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    const discovery = await prisma.discoverySubmission.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
    })

    return {
      success: true,
      data: discovery,
    }
  } catch (error) {
    console.error('Error fetching discovery submission:', error)
    return { success: false, error: 'Failed to fetch discovery submission' }
  }
}
