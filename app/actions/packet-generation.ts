/**
 * Server actions for packet generation
 */

'use server';

import { revalidatePath } from 'next/cache';
import { PacketType } from '@prisma/client';
import {
  generatePacketContent,
  createDraftPacket,
  getPacketTypeForPopulation,
} from '@/lib/pdf/packet-generator';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

/**
 * Generate a draft packet for a user
 */
export async function generatePacket(
  userId: string,
  packetType: PacketType
): Promise<{ success: boolean; packetId?: string; error?: string }> {
  try {
    const session = await auth();

    // Check authorization
    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Admins can generate for any user, users can only generate for themselves
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      if (session.user.id !== userId) {
        return { success: false, error: 'Unauthorized' };
      }
    }

    // Generate draft packet
    const packetId = await createDraftPacket(userId, packetType);

    // Revalidate relevant paths
    revalidatePath('/dashboard');
    revalidatePath('/packets');
    revalidatePath(`/admin/users/${userId}`);

    return { success: true, packetId };
  } catch (error) {
    console.error('Error generating packet:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate packet',
    };
  }
}

/**
 * Generate packet based on user's population
 */
export async function generatePacketForPopulation(
  userId: string
): Promise<{ success: boolean; packetId?: string; error?: string }> {
  try {
    const session = await auth();

    // Check authorization
    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get user's population
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { population: true },
    });

    if (!user?.population) {
      return { success: false, error: 'User population not set' };
    }

    // Determine packet type from population
    const packetType = getPacketTypeForPopulation(user.population);

    // Generate packet
    return await generatePacket(userId, packetType);
  } catch (error) {
    console.error('Error generating packet for population:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate packet',
    };
  }
}

/**
 * Regenerate packet content (creates new version)
 */
export async function regeneratePacket(
  packetId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();

    // Check authorization
    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get existing packet
    const existingPacket = await prisma.packet.findUnique({
      where: { id: packetId },
      select: {
        userId: true,
        type: true,
        version: true,
      },
    });

    if (!existingPacket) {
      return { success: false, error: 'Packet not found' };
    }

    // Check authorization
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      if (session.user.id !== existingPacket.userId) {
        return { success: false, error: 'Unauthorized' };
      }
    }

    // Generate new content
    const newContent = await generatePacketContent(
      existingPacket.userId,
      existingPacket.type
    );

    // Update packet with new content and increment version
    await prisma.packet.update({
      where: { id: packetId },
      data: {
        data: newContent as any,
        version: existingPacket.version + 1,
        lastModifiedBy: session.user.id,
        updatedAt: new Date(),
      },
    });

    // Revalidate relevant paths
    revalidatePath('/dashboard');
    revalidatePath('/packets');
    revalidatePath(`/admin/users/${existingPacket.userId}`);

    return { success: true };
  } catch (error) {
    console.error('Error regenerating packet:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to regenerate packet',
    };
  }
}

/**
 * Get available packet types for a user based on their population
 */
export async function getAvailablePacketTypes(
  userId: string
): Promise<{ success: boolean; packetTypes?: PacketType[]; error?: string }> {
  try {
    const session = await auth();

    // Check authorization
    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get user's population
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { population: true },
    });

    if (!user?.population) {
      return { success: false, error: 'User population not set' };
    }

    // Determine available packet types based on population
    const primaryType = getPacketTypeForPopulation(user.population);
    const availableTypes: PacketType[] = [primaryType];

    // All populations can also get general, nutrition, and training packets
    if (primaryType !== PacketType.GENERAL) {
      availableTypes.push(PacketType.GENERAL);
    }
    if (primaryType !== PacketType.NUTRITION) {
      availableTypes.push(PacketType.NUTRITION);
    }
    if (primaryType !== PacketType.TRAINING) {
      availableTypes.push(PacketType.TRAINING);
    }

    return { success: true, packetTypes: availableTypes };
  } catch (error) {
    console.error('Error getting available packet types:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get packet types',
    };
  }
}

/**
 * Check if user has completed required assessments for packet generation
 */
export async function canGeneratePacket(
  userId: string
): Promise<{ success: boolean; canGenerate?: boolean; missingModules?: string[]; error?: string }> {
  try {
    const session = await auth();

    // Check authorization
    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get user's population
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { population: true },
    });

    if (!user?.population) {
      return { success: false, error: 'User population not set' };
    }

    // Check if user has completed unified profile
    const profile = await prisma.assessment.findFirst({
      where: {
        userId,
        type: 'GENERAL',
      },
      select: {
        data: true,
        completed: true,
      },
    });

    // For now, we can generate packets even with minimal data
    // In production, you might want to check for specific required fields
    const canGenerate = profile !== null;
    const missingModules: string[] = [];

    if (!profile) {
      missingModules.push('Complete at least one assessment module');
    }

    return {
      success: true,
      canGenerate,
      missingModules: missingModules.length > 0 ? missingModules : undefined,
    };
  } catch (error) {
    console.error('Error checking packet generation eligibility:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check eligibility',
    };
  }
}
