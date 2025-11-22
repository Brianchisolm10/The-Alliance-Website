'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { PacketStatus, UserStatus } from '@prisma/client'

export async function getAdminDashboardData() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    // Fetch KPIs
    const [
      totalUsers,
      activeUsers,
      pendingUsers,
      totalPackets,
      draftPackets,
      unpublishedPackets,
      publishedPackets,
      totalDiscoveryForms,
      pendingDiscoveryForms,
      totalOrders,
      pendingOrders,
      totalRevenue,
    ] = await Promise.all([
      // User metrics
      prisma.user.count(),
      prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
      prisma.user.count({ where: { status: UserStatus.PENDING } }),
      
      // Packet metrics
      prisma.packet.count(),
      prisma.packet.count({ where: { status: PacketStatus.DRAFT } }),
      prisma.packet.count({ where: { status: PacketStatus.UNPUBLISHED } }),
      prisma.packet.count({ where: { status: PacketStatus.PUBLISHED } }),
      
      // Discovery form metrics
      prisma.discoverySubmission.count(),
      prisma.discoverySubmission.count({ where: { status: 'SUBMITTED' } }),
      
      // Order metrics
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      
      // Revenue calculation
      prisma.order.aggregate({
        where: { status: { in: ['DELIVERED', 'PROCESSING', 'SHIPPED'] } },
        _sum: { total: true },
      }),
    ])

    // Fetch recent activity
    const recentActivity = await getRecentActivity()

    // Calculate engagement metrics
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [recentLogins, recentAssessments, recentOrders] = await Promise.all([
      prisma.user.count({
        where: {
          lastLoginAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.assessment.count({
        where: {
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
    ])

    return {
      success: true,
      data: {
        kpis: {
          users: {
            total: totalUsers,
            active: activeUsers,
            pending: pendingUsers,
          },
          packets: {
            total: totalPackets,
            draft: draftPackets,
            unpublished: unpublishedPackets,
            published: publishedPackets,
            needsReview: draftPackets + unpublishedPackets,
          },
          discovery: {
            total: totalDiscoveryForms,
            pending: pendingDiscoveryForms,
          },
          orders: {
            total: totalOrders,
            pending: pendingOrders,
          },
          revenue: {
            total: totalRevenue._sum?.total || 0,
          },
        },
        engagement: {
          recentLogins,
          recentAssessments,
          recentOrders,
        },
        recentActivity,
      },
    }
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error)
    return { success: false, error: 'Failed to fetch dashboard data' }
  }
}

async function getRecentActivity() {
  try {
    // Fetch recent users
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        status: true,
      },
    })

    // Fetch recent discovery submissions
    const recentDiscovery = await prisma.discoverySubmission.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        goal: true,
        createdAt: true,
        status: true,
      },
    })

    // Fetch recent orders
    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        email: true,
        total: true,
        status: true,
        createdAt: true,
      },
    })

    // Fetch recent packets
    const recentPackets = await prisma.packet.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        type: true,
        status: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Combine and sort all activities
    const activities: Array<{
      id: string
      type: 'user' | 'discovery' | 'order' | 'packet'
      description: string
      timestamp: Date
      status?: string
    }> = []

    recentUsers.forEach((user) => {
      activities.push({
        id: user.id,
        type: 'user',
        description: `New user registered: ${user.name || user.email}`,
        timestamp: user.createdAt,
        status: user.status,
      })
    })

    recentDiscovery.forEach((submission) => {
      activities.push({
        id: submission.id,
        type: 'discovery',
        description: `New discovery form: ${submission.name} - ${submission.goal}`,
        timestamp: submission.createdAt,
        status: submission.status,
      })
    })

    recentOrders.forEach((order) => {
      activities.push({
        id: order.id,
        type: 'order',
        description: `New order: ${order.email} - $${(order.total / 100).toFixed(2)}`,
        timestamp: order.createdAt,
        status: order.status,
      })
    })

    recentPackets.forEach((packet) => {
      activities.push({
        id: packet.id,
        type: 'packet',
        description: `Packet updated: ${packet.type} for ${packet.user.name || packet.user.email}`,
        timestamp: packet.updatedAt,
        status: packet.status,
      })
    })

    // Sort by timestamp descending and take top 10
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    return activities.slice(0, 10)
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return []
  }
}

export async function getSystemHealth() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    // Check database connection
    const dbHealthy = await prisma.$queryRaw`SELECT 1`

    // Get database stats
    const [userCount, packetCount, orderCount] = await Promise.all([
      prisma.user.count(),
      prisma.packet.count(),
      prisma.order.count(),
    ])

    return {
      success: true,
      data: {
        database: {
          status: dbHealthy ? 'healthy' : 'unhealthy',
          users: userCount,
          packets: packetCount,
          orders: orderCount,
        },
        timestamp: new Date(),
      },
    }
  } catch (error) {
    console.error('Error checking system health:', error)
    return {
      success: false,
      error: 'Failed to check system health',
    }
  }
}

export async function getNotifications() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    const notifications: Array<{
      id: string
      type: 'discovery' | 'order' | 'packet' | 'user'
      title: string
      description: string
      link: string
      timestamp: Date
      priority: 'high' | 'medium' | 'low'
    }> = []

    // Fetch pending discovery forms
    const pendingDiscovery = await prisma.discoverySubmission.findMany({
      where: { status: 'SUBMITTED' },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    pendingDiscovery.forEach((submission) => {
      notifications.push({
        id: `discovery-${submission.id}`,
        type: 'discovery',
        title: 'New Discovery Form',
        description: `${submission.name} submitted a discovery form: ${submission.goal}`,
        link: '/admin/discovery',
        timestamp: submission.createdAt,
        priority: 'high',
      })
    })

    // Fetch pending orders
    const pendingOrders = await prisma.order.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    pendingOrders.forEach((order) => {
      notifications.push({
        id: `order-${order.id}`,
        type: 'order',
        title: 'Pending Order',
        description: `Order from ${order.email} - $${(order.total / 100).toFixed(2)}`,
        link: '/admin/orders',
        timestamp: order.createdAt,
        priority: 'high',
      })
    })

    // Fetch packets needing review (draft or unpublished)
    const packetsNeedingReview = await prisma.packet.findMany({
      where: {
        status: { in: [PacketStatus.DRAFT, PacketStatus.UNPUBLISHED] },
      },
      orderBy: { updatedAt: 'desc' },
      take: 10,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    packetsNeedingReview.forEach((packet) => {
      notifications.push({
        id: `packet-${packet.id}`,
        type: 'packet',
        title: `Packet Needs Review`,
        description: `${packet.type} packet for ${packet.user.name || packet.user.email} (${packet.status})`,
        link: `/admin/packets/${packet.id}`,
        timestamp: packet.updatedAt,
        priority: packet.status === PacketStatus.DRAFT ? 'medium' : 'high',
      })
    })

    // Fetch pending users
    const pendingUsers = await prisma.user.findMany({
      where: { status: UserStatus.PENDING },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    pendingUsers.forEach((user) => {
      notifications.push({
        id: `user-${user.id}`,
        type: 'user',
        title: 'Pending User Setup',
        description: `${user.name || user.email} has not completed account setup`,
        link: '/admin/users',
        timestamp: user.createdAt,
        priority: 'low',
      })
    })

    // Sort by priority and timestamp
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    notifications.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      return b.timestamp.getTime() - a.timestamp.getTime()
    })

    return {
      success: true,
      data: notifications.slice(0, 20), // Return top 20 notifications
    }
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return { success: false, error: 'Failed to fetch notifications' }
  }
}
