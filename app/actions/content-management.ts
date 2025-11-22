'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { ProgramType, IntensityLevel } from '@prisma/client';

// Type definitions
interface ProgramFormData {
  name: string;
  description: string;
  type: ProgramType;
  intensity: IntensityLevel;
  duration: string;
  imageUrl?: string;
  published?: boolean;
  featured?: boolean;
}

interface TestimonialFormData {
  name: string;
  content: string;
  imageUrl?: string;
  published?: boolean;
  featured?: boolean;
}

interface ImpactAreaFormData {
  name: string;
  description: string;
  metrics?: Record<string, any>;
}

// Helper function to check admin access
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    throw new Error('Unauthorized');
  }
  return session.user;
}

// ============================================================================
// PROGRAM MANAGEMENT
// ============================================================================

export async function getPrograms(filters?: {
  type?: ProgramType;
  published?: boolean;
}) {
  try {
    const where: any = {};
    
    if (filters?.type) {
      where.type = filters.type;
    }
    
    if (filters?.published !== undefined) {
      where.published = filters.published;
    }

    const programs = await prisma.program.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, programs };
  } catch (error) {
    console.error('Error fetching programs:', error);
    return { success: false, error: 'Failed to fetch programs' };
  }
}

export async function getProgram(id: string) {
  try {
    const program = await prisma.program.findUnique({
      where: { id },
    });

    if (!program) {
      return { success: false, error: 'Program not found' };
    }

    return { success: true, program };
  } catch (error) {
    console.error('Error fetching program:', error);
    return { success: false, error: 'Failed to fetch program' };
  }
}

export async function createProgram(data: ProgramFormData) {
  try {
    await requireAdmin();

    const program = await prisma.program.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        intensity: data.intensity,
        duration: data.duration,
        imageUrl: data.imageUrl,
        published: data.published ?? false,
        featured: data.featured ?? false,
      },
    });

    revalidatePath('/admin/content/programs');
    revalidatePath('/programs');

    return { success: true, program };
  } catch (error) {
    console.error('Error creating program:', error);
    return { success: false, error: 'Failed to create program' };
  }
}

export async function updateProgram(id: string, data: Partial<ProgramFormData>) {
  try {
    await requireAdmin();

    const program = await prisma.program.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.type && { type: data.type }),
        ...(data.intensity && { intensity: data.intensity }),
        ...(data.duration && { duration: data.duration }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.published !== undefined && { published: data.published }),
        ...(data.featured !== undefined && { featured: data.featured }),
      },
    });

    revalidatePath('/admin/content/programs');
    revalidatePath('/programs');
    revalidatePath(`/programs/${id}`);

    return { success: true, program };
  } catch (error) {
    console.error('Error updating program:', error);
    return { success: false, error: 'Failed to update program' };
  }
}

export async function deleteProgram(id: string) {
  try {
    await requireAdmin();

    await prisma.program.delete({
      where: { id },
    });

    revalidatePath('/admin/content/programs');
    revalidatePath('/programs');

    return { success: true };
  } catch (error) {
    console.error('Error deleting program:', error);
    return { success: false, error: 'Failed to delete program' };
  }
}

export async function toggleProgramPublished(id: string) {
  try {
    await requireAdmin();

    const program = await prisma.program.findUnique({
      where: { id },
      select: { published: true },
    });

    if (!program) {
      return { success: false, error: 'Program not found' };
    }

    const updated = await prisma.program.update({
      where: { id },
      data: { published: !program.published },
    });

    revalidatePath('/admin/content/programs');
    revalidatePath('/programs');

    return { success: true, program: updated };
  } catch (error) {
    console.error('Error toggling program published status:', error);
    return { success: false, error: 'Failed to toggle published status' };
  }
}

// ============================================================================
// TESTIMONIAL MANAGEMENT
// ============================================================================

export async function getTestimonials(filters?: {
  published?: boolean;
}) {
  try {
    const where: any = {};
    
    if (filters?.published !== undefined) {
      where.published = filters.published;
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, testimonials };
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return { success: false, error: 'Failed to fetch testimonials' };
  }
}

export async function getTestimonial(id: string) {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return { success: false, error: 'Testimonial not found' };
    }

    return { success: true, testimonial };
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return { success: false, error: 'Failed to fetch testimonial' };
  }
}

export async function createTestimonial(data: TestimonialFormData) {
  try {
    await requireAdmin();

    const testimonial = await prisma.testimonial.create({
      data: {
        name: data.name,
        content: data.content,
        imageUrl: data.imageUrl,
        published: data.published ?? false,
        featured: data.featured ?? false,
      },
    });

    revalidatePath('/admin/content/testimonials');
    revalidatePath('/');

    return { success: true, testimonial };
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return { success: false, error: 'Failed to create testimonial' };
  }
}

export async function updateTestimonial(id: string, data: Partial<TestimonialFormData>) {
  try {
    await requireAdmin();

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.content && { content: data.content }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.published !== undefined && { published: data.published }),
        ...(data.featured !== undefined && { featured: data.featured }),
      },
    });

    revalidatePath('/admin/content/testimonials');
    revalidatePath('/');

    return { success: true, testimonial };
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return { success: false, error: 'Failed to update testimonial' };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await requireAdmin();

    await prisma.testimonial.delete({
      where: { id },
    });

    revalidatePath('/admin/content/testimonials');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return { success: false, error: 'Failed to delete testimonial' };
  }
}

export async function toggleTestimonialPublished(id: string) {
  try {
    await requireAdmin();

    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
      select: { published: true },
    });

    if (!testimonial) {
      return { success: false, error: 'Testimonial not found' };
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data: { published: !testimonial.published },
    });

    revalidatePath('/admin/content/testimonials');
    revalidatePath('/');

    return { success: true, testimonial: updated };
  } catch (error) {
    console.error('Error toggling testimonial published status:', error);
    return { success: false, error: 'Failed to toggle published status' };
  }
}

// ============================================================================
// IMPACT AREA MANAGEMENT
// ============================================================================

export async function getImpactAreas() {
  try {
    const impactAreas = await prisma.impactArea.findMany({
      orderBy: { name: 'asc' },
    });

    return { success: true, impactAreas };
  } catch (error) {
    console.error('Error fetching impact areas:', error);
    return { success: false, error: 'Failed to fetch impact areas' };
  }
}

export async function getImpactArea(id: string) {
  try {
    const impactArea = await prisma.impactArea.findUnique({
      where: { id },
    });

    if (!impactArea) {
      return { success: false, error: 'Impact area not found' };
    }

    return { success: true, impactArea };
  } catch (error) {
    console.error('Error fetching impact area:', error);
    return { success: false, error: 'Failed to fetch impact area' };
  }
}

export async function createImpactArea(data: ImpactAreaFormData) {
  try {
    await requireAdmin();

    const impactArea = await prisma.impactArea.create({
      data: {
        name: data.name,
        description: data.description,
        metrics: data.metrics || {},
      },
    });

    revalidatePath('/admin/content/impact-areas');
    revalidatePath('/impact');

    return { success: true, impactArea };
  } catch (error) {
    console.error('Error creating impact area:', error);
    return { success: false, error: 'Failed to create impact area' };
  }
}

export async function updateImpactArea(id: string, data: Partial<ImpactAreaFormData>) {
  try {
    await requireAdmin();

    const impactArea = await prisma.impactArea.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.metrics !== undefined && { metrics: data.metrics }),
      },
    });

    revalidatePath('/admin/content/impact-areas');
    revalidatePath('/impact');

    return { success: true, impactArea };
  } catch (error) {
    console.error('Error updating impact area:', error);
    return { success: false, error: 'Failed to update impact area' };
  }
}

export async function deleteImpactArea(id: string) {
  try {
    await requireAdmin();

    await prisma.impactArea.delete({
      where: { id },
    });

    revalidatePath('/admin/content/impact-areas');
    revalidatePath('/impact');

    return { success: true };
  } catch (error) {
    console.error('Error deleting impact area:', error);
    return { success: false, error: 'Failed to delete impact area' };
  }
}
