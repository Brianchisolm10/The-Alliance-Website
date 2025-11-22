'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function getDashboardData() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return null
    }

    const userId = session.user.id

    // Fetch user packets
    const packets = await prisma.packet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        assessment: {
          select: {
            type: true,
            completed: true,
          },
        },
      },
    })

    // Fetch saved tool results
    const savedToolResults = await prisma.savedToolResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 4,
    })

    // Fetch assessments count
    const assessmentsCount = await prisma.assessment.count({
      where: { userId },
    })

    const completedAssessmentsCount = await prisma.assessment.count({
      where: { userId, completed: true },
    })

    // Fetch packets count
    const packetsCount = await prisma.packet.count({
      where: { userId },
    })

    return {
      packets,
      savedToolResults,
      stats: {
        assessments: assessmentsCount,
        completedAssessments: completedAssessmentsCount,
        packets: packetsCount,
        savedTools: savedToolResults.length,
      },
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return null
  }
}
