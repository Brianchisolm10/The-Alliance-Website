/**
 * Server actions for packet editing and review
 */

'use server';

import { revalidatePath } from 'next/cache';
import { PacketStatus } from '@prisma/client';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { AnyPacketContent, ExerciseData, NutritionData } from '@/lib/pdf/types';
import { logAdminAction, LogResource } from '@/lib/logging';

/**
 * Get packets for admin review (DRAFT and UNPUBLISHED)
 */
export async function getPacketsForReview(filters?: {
  status?: PacketStatus[];
  userId?: string;
  type?: string;
}) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return { success: false, error: 'Unauthorized' };
    }

    const where: any = {
      status: {
        in: filters?.status || [PacketStatus.DRAFT, PacketStatus.UNPUBLISHED],
      },
    };

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    const packets = await prisma.packet.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            population: true,
          },
        },
        modifier: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return { success: true, data: packets };
  } catch (error) {
    console.error('Error fetching packets for review:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch packets',
    };
  }
}

/**
 * Get single packet with full details for editing
 */
export async function getPacketForEditing(packetId: string) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return { success: false, error: 'Unauthorized' };
    }

    const packet = await prisma.packet.findUnique({
      where: { id: packetId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            population: true,
          },
        },
        assessment: true,
        modifier: {
          select: {
            id: true,
            name: true,
          },
        },
        publisher: {
          select: {
            id: true,
            name: true,
          },
        },
        versions: {
          orderBy: {
            version: 'desc',
          },
          take: 5,
        },
      },
    });

    if (!packet) {
      return { success: false, error: 'Packet not found' };
    }

    return { success: true, data: packet };
  } catch (error) {
    console.error('Error fetching packet for editing:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch packet',
    };
  }
}

/**
 * Update packet content (exercises, nutrition, notes, etc.)
 */
export async function updatePacketContent(
  packetId: string,
  updates: Partial<AnyPacketContent>
) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get current packet
    const currentPacket = await prisma.packet.findUnique({
      where: { id: packetId },
    });

    if (!currentPacket) {
      return { success: false, error: 'Packet not found' };
    }

    // Merge updates with current data
    const currentData = currentPacket.data as unknown as AnyPacketContent;
    const updatedData = {
      ...currentData,
      ...updates,
    };

    // Save current version to history before updating
    await prisma.packetVersion.create({
      data: {
        packetId,
        version: currentPacket.version,
        data: currentData as any,
        fileUrl: currentPacket.fileUrl,
        modifiedBy: session.user.id,
      },
    });

    // Update packet with new content
    const updatedPacket = await prisma.packet.update({
      where: { id: packetId },
      data: {
        data: updatedData as any,
        version: currentPacket.version + 1,
        lastModifiedBy: session.user.id,
        status: PacketStatus.UNPUBLISHED, // Mark as unpublished after edits
        updatedAt: new Date(),
      },
    });

    revalidatePath('/admin/packets');
    revalidatePath(`/admin/packets/${packetId}`);

    return { success: true, data: updatedPacket };
  } catch (error) {
    console.error('Error updating packet content:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update packet',
    };
  }
}

/**
 * Swap exercise in packet
 */
export async function swapExercise(
  packetId: string,
  exerciseIndex: number,
  newExerciseId: string
) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get packet
    const packet = await prisma.packet.findUnique({
      where: { id: packetId },
    });

    if (!packet) {
      return { success: false, error: 'Packet not found' };
    }

    // Get new exercise from library
    const newExercise = await prisma.exerciseLibrary.findUnique({
      where: { id: newExerciseId },
    });

    if (!newExercise) {
      return { success: false, error: 'Exercise not found' };
    }

    // Update packet data
    const packetData = packet.data as unknown as AnyPacketContent;
    
    // Find exercises array in packet data
    let exercises: ExerciseData[] = [];
    if ('exercises' in packetData && Array.isArray(packetData.exercises)) {
      exercises = packetData.exercises;
    } else if ('strengthProgram' in packetData && Array.isArray(packetData.strengthProgram)) {
      exercises = packetData.strengthProgram;
    } else if ('program' in packetData && Array.isArray(packetData.program)) {
      // For training packets with phases
      const phase = packetData.program[0];
      if (phase && Array.isArray(phase.exercises)) {
        exercises = phase.exercises;
      }
    }

    if (exerciseIndex < 0 || exerciseIndex >= exercises.length) {
      return { success: false, error: 'Invalid exercise index' };
    }

    // Create new exercise data
    const oldExercise = exercises[exerciseIndex];
    const newExerciseData: ExerciseData = {
      id: newExercise.id,
      name: newExercise.name,
      description: newExercise.description,
      sets: oldExercise.sets,
      reps: oldExercise.reps,
      intensity: newExercise.difficulty,
      notes: newExercise.instructions,
      videoUrl: newExercise.videoUrl || undefined,
      imageUrl: newExercise.imageUrl || undefined,
      modifications: [],
      contraindications: [],
    };

    // Replace exercise
    exercises[exerciseIndex] = newExerciseData;

    // Update packet
    return await updatePacketContent(packetId, packetData);
  } catch (error) {
    console.error('Error swapping exercise:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to swap exercise',
    };
  }
}

/**
 * Update exercise sets/reps
 */
export async function updateExerciseParameters(
  packetId: string,
  exerciseIndex: number,
  updates: { sets?: number; reps?: string; duration?: string; intensity?: string; notes?: string }
) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get packet
    const packet = await prisma.packet.findUnique({
      where: { id: packetId },
    });

    if (!packet) {
      return { success: false, error: 'Packet not found' };
    }

    // Update packet data
    const packetData = packet.data as unknown as AnyPacketContent;
    
    // Find and update exercise
    let exercises: ExerciseData[] = [];
    if ('exercises' in packetData && Array.isArray(packetData.exercises)) {
      exercises = packetData.exercises;
    } else if ('strengthProgram' in packetData && Array.isArray(packetData.strengthProgram)) {
      exercises = packetData.strengthProgram;
    }

    if (exerciseIndex < 0 || exerciseIndex >= exercises.length) {
      return { success: false, error: 'Invalid exercise index' };
    }

    exercises[exerciseIndex] = {
      ...exercises[exerciseIndex],
      ...updates,
    };

    // Update packet
    return await updatePacketContent(packetId, packetData);
  } catch (error) {
    console.error('Error updating exercise parameters:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update exercise',
    };
  }
}

/**
 * Update nutrition item in packet
 */
export async function updateNutritionItem(
  packetId: string,
  itemIndex: number,
  updates: Partial<NutritionData>
) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get packet
    const packet = await prisma.packet.findUnique({
      where: { id: packetId },
    });

    if (!packet) {
      return { success: false, error: 'Packet not found' };
    }

    // Update packet data
    const packetData = packet.data as unknown as AnyPacketContent;
    
    // Find and update nutrition
    let nutrition: NutritionData[] = [];
    if ('nutrition' in packetData && Array.isArray(packetData.nutrition)) {
      nutrition = packetData.nutrition;
    } else if ('mealPlan' in packetData && Array.isArray(packetData.mealPlan)) {
      nutrition = packetData.mealPlan;
    } else if ('nutritionStrategy' in packetData && Array.isArray(packetData.nutritionStrategy)) {
      nutrition = packetData.nutritionStrategy;
    }

    if (itemIndex < 0 || itemIndex >= nutrition.length) {
      return { success: false, error: 'Invalid nutrition item index' };
    }

    nutrition[itemIndex] = {
      ...nutrition[itemIndex],
      ...updates,
    };

    // Update packet
    return await updatePacketContent(packetId, packetData);
  } catch (error) {
    console.error('Error updating nutrition item:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update nutrition',
    };
  }
}

/**
 * Add coach notes to packet
 */
export async function addCoachNotes(packetId: string, notes: string) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return { success: false, error: 'Unauthorized' };
    }

    const packet = await prisma.packet.findUnique({
      where: { id: packetId },
    });

    if (!packet) {
      return { success: false, error: 'Packet not found' };
    }

    const packetData = packet.data as any;
    packetData.coachNotes = notes;

    return await updatePacketContent(packetId, packetData);
  } catch (error) {
    console.error('Error adding coach notes:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add notes',
    };
  }
}

/**
 * Publish packet (change status to PUBLISHED)
 */
export async function publishPacket(packetId: string) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get packet with user info for email notification
    const existingPacket = await prisma.packet.findUnique({
      where: { id: packetId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!existingPacket) {
      return { success: false, error: 'Packet not found' };
    }

    // Update packet status
    const packet = await prisma.packet.update({
      where: { id: packetId },
      data: {
        status: PacketStatus.PUBLISHED,
        publishedAt: new Date(),
        publishedBy: session.user.id,
      },
    });

    // Generate PDF if not already generated
    if (!existingPacket.fileUrl) {
      try {
        const { generateAndUploadPacketPDF } = await import('@/lib/pdf/storage');
        await generateAndUploadPacketPDF(packetId);
      } catch (pdfError) {
        console.error('Error generating PDF on publish:', pdfError);
        // Don't fail the publish operation if PDF generation fails
        // PDF can be generated later
      }
    }

    // Send email notification to client
    try {
      const { sendPacketPublishedEmail } = await import('@/lib/email');
      await sendPacketPublishedEmail(
        existingPacket.user.email,
        existingPacket.user.name || 'Client',
        packet.type
      );
    } catch (emailError) {
      console.error('Error sending packet published email:', emailError);
      // Don't fail the publish operation if email fails
    }

    // Log activity
    await logAdminAction('PACKET_PUBLISHED', session.user.id, LogResource.PACKET, {
      packetId,
      userId: existingPacket.user.id,
      type: packet.type,
    });

    revalidatePath('/admin/packets');
    revalidatePath(`/admin/packets/${packetId}`);
    revalidatePath('/dashboard');
    revalidatePath('/packets');

    return { success: true, data: packet };
  } catch (error) {
    console.error('Error publishing packet:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to publish packet',
    };
  }
}

/**
 * Unpublish packet (change status to UNPUBLISHED)
 */
export async function unpublishPacket(packetId: string) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return { success: false, error: 'Unauthorized' };
    }

    const packet = await prisma.packet.update({
      where: { id: packetId },
      data: {
        status: PacketStatus.UNPUBLISHED,
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    // Log activity
    await logAdminAction('PACKET_UNPUBLISHED', session.user.id, LogResource.PACKET, {
      packetId,
      userId: packet.user.id,
      type: packet.type,
    });

    revalidatePath('/admin/packets');
    revalidatePath(`/admin/packets/${packetId}`);
    revalidatePath('/dashboard');
    revalidatePath('/packets');

    return { success: true, data: packet };
  } catch (error) {
    console.error('Error unpublishing packet:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to unpublish packet',
    };
  }
}

/**
 * Get packet version history with user details
 */
export async function getPacketVersionHistory(packetId: string) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return { success: false, error: 'Unauthorized' };
    }

    const versions = await prisma.packetVersion.findMany({
      where: { packetId },
      orderBy: { version: 'desc' },
    });

    // Fetch user details for each version
    const userIds = [...new Set(versions.map(v => v.modifiedBy))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });

    const userMap = new Map(users.map(u => [u.id, u]));

    // Enrich versions with user details
    const enrichedVersions = versions.map(version => ({
      ...version,
      modifiedByUser: userMap.get(version.modifiedBy) || null,
    }));

    return { success: true, data: enrichedVersions };
  } catch (error) {
    console.error('Error fetching version history:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch version history',
    };
  }
}

/**
 * Restore packet to previous version
 */
export async function restorePacketVersion(packetId: string, versionNumber: number) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get version to restore
    const version = await prisma.packetVersion.findUnique({
      where: {
        packetId_version: {
          packetId,
          version: versionNumber,
        },
      },
    });

    if (!version) {
      return { success: false, error: 'Version not found' };
    }

    // Get current packet
    const currentPacket = await prisma.packet.findUnique({
      where: { id: packetId },
    });

    if (!currentPacket) {
      return { success: false, error: 'Packet not found' };
    }

    // Save current state to history
    await prisma.packetVersion.create({
      data: {
        packetId,
        version: currentPacket.version,
        data: currentPacket.data as any,
        fileUrl: currentPacket.fileUrl,
        modifiedBy: session.user.id,
      },
    });

    // Restore version
    const updatedPacket = await prisma.packet.update({
      where: { id: packetId },
      data: {
        data: version.data as any,
        fileUrl: version.fileUrl,
        version: currentPacket.version + 1,
        lastModifiedBy: session.user.id,
        status: PacketStatus.UNPUBLISHED,
        updatedAt: new Date(),
      },
    });

    revalidatePath('/admin/packets');
    revalidatePath(`/admin/packets/${packetId}`);

    return { success: true, data: updatedPacket };
  } catch (error) {
    console.error('Error restoring packet version:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to restore version',
    };
  }
}
