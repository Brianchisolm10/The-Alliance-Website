/**
 * Packet Storage Service
 * 
 * Handles generating PDFs and uploading them to storage
 */

import { prisma } from '@/lib/db/prisma';
import { PacketStatus } from '@prisma/client';
import { generatePDFBuffer, generatePDFFilename } from './generator';
import { uploadFile, deleteFile, isStorageConfigured } from '@/lib/storage';
import { AnyPacketContent } from './types';

/**
 * Generate PDF and upload to storage
 */
export async function generateAndUploadPacketPDF(
  packetId: string
): Promise<{ success: boolean; fileUrl?: string; error?: string }> {
  try {
    // Check if storage is configured
    if (!isStorageConfigured()) {
      return {
        success: false,
        error: 'File storage is not configured. Please set up Vercel Blob or AWS S3.',
      };
    }

    // Get packet data
    const packet = await prisma.packet.findUnique({
      where: { id: packetId },
      select: {
        id: true,
        data: true,
        fileUrl: true,
      },
    });

    if (!packet) {
      return { success: false, error: 'Packet not found' };
    }

    if (!packet.data) {
      return { success: false, error: 'Packet has no content data' };
    }

    // Generate PDF buffer
    const content = packet.data as AnyPacketContent;
    const pdfBuffer = await generatePDFBuffer(content);

    // Generate filename
    const filename = generatePDFFilename(content);

    // Upload to storage
    const fileUrl = await uploadFile(pdfBuffer, filename, 'application/pdf');

    // Delete old file if it exists
    if (packet.fileUrl) {
      try {
        await deleteFile(packet.fileUrl);
      } catch (error) {
        console.error('Error deleting old file:', error);
        // Continue even if deletion fails
      }
    }

    // Update packet with file URL
    await prisma.packet.update({
      where: { id: packetId },
      data: { fileUrl },
    });

    return { success: true, fileUrl };
  } catch (error) {
    console.error('Error generating and uploading packet PDF:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate PDF',
    };
  }
}

/**
 * Regenerate PDF for a packet (useful after edits)
 */
export async function regeneratePacketPDF(
  packetId: string
): Promise<{ success: boolean; fileUrl?: string; error?: string }> {
  return await generateAndUploadPacketPDF(packetId);
}

/**
 * Delete packet PDF from storage
 */
export async function deletePacketPDF(
  packetId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get packet
    const packet = await prisma.packet.findUnique({
      where: { id: packetId },
      select: { fileUrl: true },
    });

    if (!packet?.fileUrl) {
      return { success: true }; // Nothing to delete
    }

    // Delete from storage
    await deleteFile(packet.fileUrl);

    // Update packet to remove file URL
    await prisma.packet.update({
      where: { id: packetId },
      data: { fileUrl: null },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting packet PDF:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete PDF',
    };
  }
}

/**
 * Batch generate PDFs for multiple packets
 */
export async function batchGeneratePacketPDFs(
  packetIds: string[]
): Promise<{
  success: boolean;
  results: Array<{ packetId: string; success: boolean; fileUrl?: string; error?: string }>;
}> {
  const results = await Promise.all(
    packetIds.map(async (packetId) => {
      const result = await generateAndUploadPacketPDF(packetId);
      return {
        packetId,
        ...result,
      };
    })
  );

  const allSuccessful = results.every((r) => r.success);

  return {
    success: allSuccessful,
    results,
  };
}

/**
 * Get packet download URL (only for published packets)
 */
export async function getPacketDownloadUrl(
  packetId: string,
  userId: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Get packet
    const packet = await prisma.packet.findUnique({
      where: { id: packetId },
      select: {
        userId: true,
        status: true,
        fileUrl: true,
      },
    });

    if (!packet) {
      return { success: false, error: 'Packet not found' };
    }

    // Check ownership
    if (packet.userId !== userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Check if published
    if (packet.status !== PacketStatus.PUBLISHED) {
      return { success: false, error: 'Packet is not published yet' };
    }

    // Check if file exists
    if (!packet.fileUrl) {
      return { success: false, error: 'Packet PDF has not been generated' };
    }

    return { success: true, url: packet.fileUrl };
  } catch (error) {
    console.error('Error getting packet download URL:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get download URL',
    };
  }
}
