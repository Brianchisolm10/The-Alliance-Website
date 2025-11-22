import { prisma } from './prisma'

/**
 * User Queries
 */
export const userQueries = {
  findByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    })
  },

  findById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
    })
  },

  findBySetupToken: async (token: string) => {
    return prisma.user.findUnique({
      where: { setupToken: token },
    })
  },

  findByResetToken: async (token: string) => {
    return prisma.user.findUnique({
      where: { resetToken: token },
    })
  },

  create: async (data: {
    email: string
    name?: string
    role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
    setupToken?: string
    setupTokenExpiry?: Date
  }) => {
    return prisma.user.create({
      data,
    })
  },

  updatePassword: async (id: string, password: string) => {
    return prisma.user.update({
      where: { id },
      data: { password, status: 'ACTIVE' },
    })
  },

  updateStatus: async (id: string, status: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => {
    return prisma.user.update({
      where: { id },
      data: { status },
    })
  },

  updateLastLogin: async (id: string) => {
    return prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    })
  },
}

/**
 * Assessment Queries
 */
export const assessmentQueries = {
  findByUserId: async (userId: string) => {
    return prisma.assessment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  },

  findByUserIdAndType: async (userId: string, type: 'GENERAL' | 'NUTRITION' | 'TRAINING' | 'PERFORMANCE' | 'YOUTH' | 'RECOVERY' | 'LIFESTYLE') => {
    return prisma.assessment.findFirst({
      where: { userId, type },
      orderBy: { createdAt: 'desc' },
    })
  },

  create: async (data: {
    userId: string
    type: 'GENERAL' | 'NUTRITION' | 'TRAINING' | 'PERFORMANCE' | 'YOUTH' | 'RECOVERY' | 'LIFESTYLE'
    data: any
    completed?: boolean
  }) => {
    return prisma.assessment.create({
      data,
    })
  },

  update: async (id: string, data: any, completed?: boolean) => {
    return prisma.assessment.update({
      where: { id },
      data: {
        data,
        completed: completed ?? undefined,
        updatedAt: new Date(),
      },
    })
  },
}

/**
 * Packet Queries
 */
export const packetQueries = {
  findByUserId: async (userId: string) => {
    return prisma.packet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        assessment: true,
      },
    })
  },

  create: async (data: {
    userId: string
    assessmentId?: string
    type: 'GENERAL' | 'NUTRITION' | 'TRAINING' | 'ATHLETE_PERFORMANCE' | 'YOUTH' | 'RECOVERY'
    fileUrl: string
    data?: any
  }) => {
    return prisma.packet.create({
      data,
    })
  },
}

/**
 * Discovery Submission Queries
 */
export const discoveryQueries = {
  create: async (data: {
    name: string
    email: string
    goal: string
    notes?: string
  }) => {
    return prisma.discoverySubmission.create({
      data,
    })
  },

  findAll: async (limit?: number) => {
    return prisma.discoverySubmission.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  },

  updateStatus: async (id: string, status: any, callDate?: Date) => {
    return prisma.discoverySubmission.update({
      where: { id },
      data: {
        status,
        callScheduled: callDate ? true : undefined,
        callDate,
      },
    })
  },
}

/**
 * Program Queries
 */
export const programQueries = {
  findPublished: async () => {
    return prisma.program.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })
  },

  findFeatured: async () => {
    return prisma.program.findMany({
      where: { published: true, featured: true },
      orderBy: { createdAt: 'desc' },
    })
  },

  findById: async (id: string) => {
    return prisma.program.findUnique({
      where: { id },
    })
  },
}

/**
 * Product Queries
 */
export const productQueries = {
  findPublished: async () => {
    return prisma.product.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })
  },

  findById: async (id: string) => {
    return prisma.product.findUnique({
      where: { id },
    })
  },
}

/**
 * Order Queries
 */
export const orderQueries = {
  create: async (data: {
    userId?: string
    email: string
    total: number
    stripePaymentId?: string
    donationAmount?: number
    donationArea?: string
    shippingAddress?: any
  }) => {
    return prisma.order.create({
      data,
    })
  },

  findByUserId: async (userId: string) => {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })
  },

  updateStatus: async (id: string, status: any) => {
    return prisma.order.update({
      where: { id },
      data: { status },
    })
  },
}

/**
 * Activity Log Queries
 */
export const activityLogQueries = {
  create: async (data: {
    userId?: string
    action: string
    resource: string
    details?: any
    ipAddress?: string
  }) => {
    return prisma.activityLog.create({
      data,
    })
  },

  findByUserId: async (userId: string, limit?: number) => {
    return prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  },

  findRecent: async (limit: number = 50) => {
    return prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })
  },
}

/**
 * Testimonial Queries
 */
export const testimonialQueries = {
  findPublished: async () => {
    return prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })
  },

  findFeatured: async () => {
    return prisma.testimonial.findMany({
      where: { published: true, featured: true },
      orderBy: { createdAt: 'desc' },
    })
  },
}

/**
 * Stats Queries
 */
export const statsQueries = {
  getCommunityStats: async () => {
    const [activeUsers, publishedPrograms] = await Promise.all([
      prisma.user.count({
        where: { status: 'ACTIVE', role: 'USER' },
      }),
      prisma.program.count({
        where: { published: true },
      }),
    ])

    return {
      membersServed: activeUsers,
      programsOffered: publishedPrograms,
    }
  },
}

/**
 * Population Queries
 */
export const populationQueries = {
  getUserWithPopulation: async (userId: string) => {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        population: true,
        status: true,
        role: true,
      },
    })
  },

  updateUserPopulation: async (userId: string, population: 'GENERAL' | 'ATHLETE' | 'YOUTH' | 'RECOVERY' | 'PREGNANCY' | 'POSTPARTUM' | 'OLDER_ADULT' | 'CHRONIC_CONDITION') => {
    return prisma.user.update({
      where: { id: userId },
      data: { population },
    })
  },

  getUsersByPopulation: async (population: 'GENERAL' | 'ATHLETE' | 'YOUTH' | 'RECOVERY' | 'PREGNANCY' | 'POSTPARTUM' | 'OLDER_ADULT' | 'CHRONIC_CONDITION') => {
    return prisma.user.findMany({
      where: { population },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },
}

/**
 * Helper exports for backward compatibility
 */
export const getAssessmentsByUserId = assessmentQueries.findByUserId
export const getPacketsByUserId = packetQueries.findByUserId
