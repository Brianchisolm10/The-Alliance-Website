'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { PacketStatus, UserStatus, OrderStatus } from '@prisma/client'

export interface AnalyticsData {
  kpis: {
    totalUsers: number
    activeUsers: number
    totalPackets: number
    publishedPackets: number
    totalOrders: number
    totalRevenue: number
    totalDonations: number
  }
  userEngagement: {
    newUsers: number
    activeUsers: number
    assessmentsCompleted: number
    packetsGenerated: number
    toolsUsed: number
  }
  programEnrollment: {
    totalPrograms: number
    publishedPrograms: number
    featuredPrograms: number
  }
  donations: {
    totalAmount: number
    totalCount: number
    gearDriveSubmissions: number
  }
  orders: {
    totalOrders: number
    totalRevenue: number
    averageOrderValue: number
    pendingOrders: number
  }
}

export async function getAnalyticsData(startDate?: Date, endDate?: Date) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    // Set default date range if not provided (last 30 days)
    const end = endDate || new Date()
    const start = startDate || new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Fetch KPIs
    const [
      totalUsers,
      activeUsers,
      totalPackets,
      publishedPackets,
      totalOrders,
      ordersRevenue,
      totalDonations,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
      prisma.packet.count(),
      prisma.packet.count({ where: { status: PacketStatus.PUBLISHED } }),
      prisma.order.count(),
      prisma.order.aggregate({
        where: { status: { in: ['DELIVERED', 'PROCESSING', 'SHIPPED'] } },
        _sum: { total: true },
      }),
      prisma.donation.count(),
    ])

    // Fetch user engagement metrics for date range
    const [
      newUsers,
      activeUsersInRange,
      assessmentsCompleted,
      packetsGenerated,
      toolsUsed,
    ] = await Promise.all([
      prisma.user.count({
        where: {
          createdAt: { gte: start, lte: end },
        },
      }),
      prisma.user.count({
        where: {
          lastLoginAt: { gte: start, lte: end },
        },
      }),
      prisma.assessment.count({
        where: {
          completed: true,
          updatedAt: { gte: start, lte: end },
        },
      }),
      prisma.packet.count({
        where: {
          createdAt: { gte: start, lte: end },
        },
      }),
      prisma.savedToolResult.count({
        where: {
          createdAt: { gte: start, lte: end },
        },
      }),
    ])

    // Fetch program enrollment data
    const [totalPrograms, publishedPrograms, featuredPrograms] = await Promise.all([
      prisma.program.count(),
      prisma.program.count({ where: { published: true } }),
      prisma.program.count({ where: { featured: true } }),
    ])

    // Fetch donation metrics for date range
    const [donationsInRange, donationsAmountInRange, gearDriveSubmissions] =
      await Promise.all([
        prisma.donation.count({
          where: {
            createdAt: { gte: start, lte: end },
          },
        }),
        prisma.donation.aggregate({
          where: {
            createdAt: { gte: start, lte: end },
          },
          _sum: { amount: true },
        }),
        prisma.gearDrive.count({
          where: {
            createdAt: { gte: start, lte: end },
          },
        }),
      ])

    // Fetch order metrics for date range
    const [ordersInRange, ordersRevenueInRange] = await Promise.all([
      prisma.order.count({
        where: {
          createdAt: { gte: start, lte: end },
        },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: start, lte: end },
          status: { in: ['DELIVERED', 'PROCESSING', 'SHIPPED'] },
        },
        _sum: { total: true },
      }),
    ])

    const pendingOrders = await prisma.order.count({
      where: { status: OrderStatus.PENDING },
    })

    const averageOrderValue =
      ordersInRange > 0
        ? (ordersRevenueInRange._sum?.total || 0) / ordersInRange
        : 0

    const data: AnalyticsData = {
      kpis: {
        totalUsers,
        activeUsers,
        totalPackets,
        publishedPackets,
        totalOrders,
        totalRevenue: ordersRevenue._sum?.total || 0,
        totalDonations,
      },
      userEngagement: {
        newUsers,
        activeUsers: activeUsersInRange,
        assessmentsCompleted,
        packetsGenerated,
        toolsUsed,
      },
      programEnrollment: {
        totalPrograms,
        publishedPrograms,
        featuredPrograms,
      },
      donations: {
        totalAmount: donationsAmountInRange._sum?.amount || 0,
        totalCount: donationsInRange,
        gearDriveSubmissions,
      },
      orders: {
        totalOrders: ordersInRange,
        totalRevenue: ordersRevenueInRange._sum?.total || 0,
        averageOrderValue,
        pendingOrders,
      },
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return { success: false, error: 'Failed to fetch analytics data' }
  }
}

export async function getPerformanceMetrics() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    // In a real implementation, these would come from monitoring services
    // For now, we'll return placeholder data
    const data = {
      pageLoadTimes: {
        average: 1.2, // seconds
        p50: 0.9,
        p95: 2.1,
        p99: 3.5,
      },
      errorRates: {
        total: 12,
        rate: 0.02, // 2%
        last24h: 3,
      },
      apiResponseTimes: {
        average: 250, // milliseconds
        p50: 180,
        p95: 450,
        p99: 800,
      },
      uptime: {
        percentage: 99.9,
        lastIncident: null,
      },
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error('Error fetching performance metrics:', error)
    return { success: false, error: 'Failed to fetch performance metrics' }
  }
}

export async function getTrendData(metric: string, days: number = 30) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000)

    // Generate daily data points
    const dataPoints: Array<{ date: string; value: number }> = []

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
      const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000)

      let value = 0

      switch (metric) {
        case 'users':
          value = await prisma.user.count({
            where: {
              createdAt: { gte: date, lt: nextDate },
            },
          })
          break
        case 'orders':
          value = await prisma.order.count({
            where: {
              createdAt: { gte: date, lt: nextDate },
            },
          })
          break
        case 'revenue':
          const revenue = await prisma.order.aggregate({
            where: {
              createdAt: { gte: date, lt: nextDate },
              status: { in: ['DELIVERED', 'PROCESSING', 'SHIPPED'] },
            },
            _sum: { total: true },
          })
          value = revenue._sum?.total || 0
          break
        case 'donations':
          const donations = await prisma.donation.aggregate({
            where: {
              createdAt: { gte: date, lt: nextDate },
            },
            _sum: { amount: true },
          })
          value = donations._sum?.amount || 0
          break
        case 'assessments':
          value = await prisma.assessment.count({
            where: {
              completed: true,
              updatedAt: { gte: date, lt: nextDate },
            },
          })
          break
        case 'packets':
          value = await prisma.packet.count({
            where: {
              createdAt: { gte: date, lt: nextDate },
            },
          })
          break
        default:
          break
      }

      dataPoints.push({
        date: date.toISOString().split('T')[0],
        value,
      })
    }

    return {
      success: true,
      data: dataPoints,
    }
  } catch (error) {
    console.error('Error fetching trend data:', error)
    return { success: false, error: 'Failed to fetch trend data' }
  }
}

export async function exportAnalyticsData(
  startDate: Date,
  endDate: Date,
  format: 'csv' | 'json' = 'csv'
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    // Fetch comprehensive data for export
    const analyticsResult = await getAnalyticsData(startDate, endDate)

    if (!analyticsResult.success || !analyticsResult.data) {
      return { success: false, error: 'Failed to fetch analytics data' }
    }

    const data = analyticsResult.data

    if (format === 'json') {
      return {
        success: true,
        data: JSON.stringify(data, null, 2),
        filename: `analytics-${startDate.toISOString().split('T')[0]}-to-${
          endDate.toISOString().split('T')[0]
        }.json`,
      }
    }

    // Generate CSV
    const csv = [
      'Metric,Value',
      `Total Users,${data.kpis.totalUsers}`,
      `Active Users,${data.kpis.activeUsers}`,
      `Total Packets,${data.kpis.totalPackets}`,
      `Published Packets,${data.kpis.publishedPackets}`,
      `Total Orders,${data.kpis.totalOrders}`,
      `Total Revenue,$${(data.kpis.totalRevenue / 100).toFixed(2)}`,
      `Total Donations,$${(data.kpis.totalDonations / 100).toFixed(2)}`,
      '',
      'User Engagement',
      `New Users,${data.userEngagement.newUsers}`,
      `Active Users,${data.userEngagement.activeUsers}`,
      `Assessments Completed,${data.userEngagement.assessmentsCompleted}`,
      `Packets Generated,${data.userEngagement.packetsGenerated}`,
      `Tools Used,${data.userEngagement.toolsUsed}`,
      '',
      'Program Enrollment',
      `Total Programs,${data.programEnrollment.totalPrograms}`,
      `Published Programs,${data.programEnrollment.publishedPrograms}`,
      `Featured Programs,${data.programEnrollment.featuredPrograms}`,
      '',
      'Donations',
      `Total Amount,$${(data.donations.totalAmount / 100).toFixed(2)}`,
      `Total Count,${data.donations.totalCount}`,
      `Gear Drive Submissions,${data.donations.gearDriveSubmissions}`,
      '',
      'Orders',
      `Total Orders,${data.orders.totalOrders}`,
      `Total Revenue,$${(data.orders.totalRevenue / 100).toFixed(2)}`,
      `Average Order Value,$${(data.orders.averageOrderValue / 100).toFixed(2)}`,
      `Pending Orders,${data.orders.pendingOrders}`,
    ].join('\n')

    return {
      success: true,
      data: csv,
      filename: `analytics-${startDate.toISOString().split('T')[0]}-to-${
        endDate.toISOString().split('T')[0]
      }.csv`,
    }
  } catch (error) {
    console.error('Error exporting analytics data:', error)
    return { success: false, error: 'Failed to export analytics data' }
  }
}
