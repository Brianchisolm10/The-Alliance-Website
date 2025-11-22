/**
 * Server actions for packet storage and retrieval
 */

'use server';

import { revalidatePath } from 'next/cache';
import { PacketStatus } from '@prisma/client';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import {
  generateAndUploadPacketPDF,
  regeneratePacketPDF,
  deletePacketPDF,
  getPacketDownloadUrl,
} from '@/lib/pdf/storage';

/**
 * Generate PDF for a packet and upload to storage
 */
export async function generatePacketPDF(
  packetId: string
): Promise<{ success: boolean; fileUrl?: string; error?: string }> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get packet to check ownership/permissions
    const packet = await prisma.packet.findUnique({
      where: { id: packetId },
      select: { userId: true },
    });

    if (!packet) {
      return { success: false, error: 'Packet not found' };
    }

    // Check authorization
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN';
    const isOwner = packet.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return { success: false, error: 'Unauthorized' };
    }

    // Generate and upload PDF
    const result = await generateAndUploadPacketPDF(packetId);

    if (result.success) {
      revalidatePath('/packets');
      revalidatePath('/dashboard');
      revalidatePath(`/admin/packets/${packetId}`);
    }

    return result;
  } catch (error) {
    console.error('Error in generatePacketPDF action:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate PDF',
    };
  }
}

/**
 * Regenerate PDF for a packet (after edits)
 */
export async function regeneratePDF(
  packetId: string
): Promise<{ success: boolean; fileUrl?: string; error?: string }> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Only admins can regenerate PDFs
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    const result = await regeneratePacketPDF(packetId);

    if (result.success) {
      revalidatePath('/packets');
      revalidatePath('/dashboard');
      revalidatePath(`/admin/packets/${packetId}`);
    }

    return result;
  } catch (error) {
    console.error('Error in regeneratePDF action:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to regenerate PDF',
    };
  }
}

/**
 * Delete packet PDF from storage
 */
export async function deletePDF(
  packetId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Only admins can delete PDFs
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    const result = await deletePacketPDF(packetId);

    if (result.success) {
      revalidatePath('/packets');
      revalidatePath('/dashboard');
      revalidatePath(`/admin/packets/${packetId}`);
    }

    return result;
  } catch (error) {
    console.error('Error in deletePDF action:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete PDF',
    };
  }
}

/**
 * Get user's published packets (client-side filtering)
 */
export async function getUserPublishedPackets(): Promise<{
  success: boolean;
  packets?: Array<{
    id: string;
    type: string;
    fileUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date | null;
  }>;
  error?: string;
}> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get only PUBLISHED packets for the user
    const packets = await prisma.packet.findMany({
      where: {
        userId: session.user.id,
        status: PacketStatus.PUBLISHED,
      },
      select: {
        id: true,
        type: true,
        fileUrl: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });

    return { success: true, packets };
  } catch (error) {
    console.error('Error getting user published packets:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get packets',
    };
  }
}

/**
 * Get all packets for admin view (all statuses)
 */
export async function getAllPacketsForAdmin(filters?: {
  status?: PacketStatus[];
  userId?: string;
}): Promise<{
  success: boolean;
  packets?: Array<{
    id: string;
    type: string;
    status: PacketStatus;
    fileUrl: string | null;
    version: number;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date | null;
    user: {
      id: string;
      name: string | null;
      email: string;
    };
  }>;
  error?: string;
}> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Only admins can view all packets
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    const where: any = {};

    if (filters?.status && filters.status.length > 0) {
      where.status = { in: filters.status };
    }

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    const packets = await prisma.packet.findMany({
      where,
      select: {
        id: true,
        type: true,
        status: true,
        fileUrl: true,
        version: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return { success: true, packets };
  } catch (error) {
    console.error('Error getting all packets for admin:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get packets',
    };
  }
}

/**
 * Download packet (only published packets)
 */
export async function downloadPacket(
  packetId: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    const result = await getPacketDownloadUrl(packetId, session.user.id);

    return result;
  } catch (error) {
    console.error('Error in downloadPacket action:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to download packet',
    };
  }
}

/**
 * Check if packet has PDF generated
 */
export async function checkPacketPDF(
  packetId: string
): Promise<{ success: boolean; hasPDF?: boolean; fileUrl?: string; error?: string }> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    const packet = await prisma.packet.findUnique({
      where: { id: packetId },
      select: {
        userId: true,
        fileUrl: true,
      },
    });

    if (!packet) {
      return { success: false, error: 'Packet not found' };
    }

    // Check authorization
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN';
    const isOwner = packet.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return { success: false, error: 'Unauthorized' };
    }

    return {
      success: true,
      hasPDF: !!packet.fileUrl,
      fileUrl: packet.fileUrl || undefined,
    };
  } catch (error) {
    console.error('Error checking packet PDF:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check PDF',
    };
  }
}
