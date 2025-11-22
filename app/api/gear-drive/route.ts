import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const gearItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  category: z.string().min(1, 'Category is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  description: z.string().optional(),
});

const gearDriveSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  items: z.array(gearItemSchema).min(1, 'At least one item is required'),
  condition: z.string().min(1, 'Condition is required'),
  preference: z.string().min(1, 'Preference is required'),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = gearDriveSchema.safeParse(body);
    
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const { name, email, items, condition, preference, notes } = validationResult.data;

    // Create gear drive submission
    const gearDrive = await prisma.gearDrive.create({
      data: {
        name,
        email,
        items,
        condition,
        preference,
        notes: notes || null,
        status: 'SUBMITTED',
      },
    });

    // TODO: Send confirmation email
    // This would be implemented in the email system (task 21)

    return NextResponse.json({
      id: gearDrive.id,
      message: 'Gear drive donation submitted successfully',
    });
  } catch (error) {
    console.error('Gear drive submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit gear drive donation' },
      { status: 500 }
    );
  }
}

// GET endpoint for admin to retrieve gear drive submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status ? { status: status as any } : {};

    const gearDrives = await prisma.gearDrive.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(gearDrives);
  } catch (error) {
    console.error('Error fetching gear drives:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gear drive submissions' },
      { status: 500 }
    );
  }
}
