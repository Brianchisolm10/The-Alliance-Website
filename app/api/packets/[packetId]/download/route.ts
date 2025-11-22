/**
 * API route for downloading packet PDFs
 * Only allows downloading PUBLISHED packets
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { PacketStatus } from '@prisma/client';

export async function GET(
  _request: NextRequest,
  { params }: { params: { packetId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { packetId } = params;

    // Get packet
    const packet = await prisma.packet.findUnique({
      where: { id: packetId },
      select: {
        userId: true,
        status: true,
        fileUrl: true,
        type: true,
      },
    });

    if (!packet) {
      return NextResponse.json({ error: 'Packet not found' }, { status: 404 });
    }

    // Check ownership
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN';
    const isOwner = packet.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // For non-admin users, only allow downloading PUBLISHED packets
    if (!isAdmin && packet.status !== PacketStatus.PUBLISHED) {
      return NextResponse.json(
        { error: 'Packet is not published yet' },
        { status: 403 }
      );
    }

    // Check if file exists
    if (!packet.fileUrl) {
      return NextResponse.json(
        { error: 'Packet PDF has not been generated' },
        { status: 404 }
      );
    }

    // Redirect to the file URL
    return NextResponse.redirect(packet.fileUrl);
  } catch (error) {
    console.error('Error downloading packet:', error);
    return NextResponse.json(
      { error: 'Failed to download packet' },
      { status: 500 }
    );
  }
}
