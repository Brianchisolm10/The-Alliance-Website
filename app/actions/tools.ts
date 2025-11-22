'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function saveToolResult(toolName: string, data: any) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'You must be logged in to save results' }
    }

    await prisma.savedToolResult.create({
      data: {
        userId: session.user.id,
        toolName,
        data,
      },
    })

    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Error saving tool result:', error)
    return { success: false, error: 'Failed to save result' }
  }
}

export async function getSavedToolResults(userId: string) {
  try {
    const results = await prisma.savedToolResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return results
  } catch (error) {
    console.error('Error fetching saved tool results:', error)
    return []
  }
}
