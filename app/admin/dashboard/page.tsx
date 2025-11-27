'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getAdminDashboardData, getSystemHealth, getNotifications } from '@/app/actions/admin-dashboard'

// Lazy load NotificationsCenter as it&apos;s below the fold
const NotificationsCenter = dynamic(() => import('@/components/admin/notifications-center').then(mod => ({ default: mod.NotificationsCenter })), {
  loading: () => <Card className="p-6 min-h-[200px] animate-pulse bg-gray-100" />,
})

interface DashboardData {
  kpis: {
    users: {
      total: number
      active: number
      pending: number
    }
    packets: {
      total: number
      draft: number
      unpublished: number
      published: number
      needsReview: number
    }
    discovery: {
      total: number
      pending: number
    }
    orders: {
      total: number
      pending: number
    }
    revenue: {
      total: number
    }
  }
  engagement: {
    recentLogins: number
    recentAssessments: number
    recentOrders: number
  }
  recentActivity: Array<{
    id: string
    type: 'user' | 'discovery' | 'order' | 'packet'
    description: string
    timestamp: Date
    status?: string
  }>
}

interface SystemHealth {
  database: {
    status: string
    users: number
    packets: number
    orders: number
  }
  timestamp: Date
}

interface Notification {
  id: string
  type: 'discovery' | 'order' | 'packet' | 'user'
  title: string
  description: string
  link: string
  timestamp: Date
  priority: 'high' | 'medium' | 'low'
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    const [dashboardResult, healthResult, notificationsResult] = await Promise.all([
      getAdminDashboardData(),
      getSystemHealth(),
      getNotifications(),
    ])

    if (dashboardResult.success && dashboardResult.data) {
      setData(dashboardResult.data)
    }

    if (healthResult.success && healthResult.data) {
      setHealth(healthResult.data)
    }

    if (notificationsResult.success && notificationsResult.data) {
      setNotifications(notificationsResult.data)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600">Failed to load dashboard data</p>
          <Button onClick={loadDashboardData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your platform.
        </p>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/admin/users">
            <Button variant="outline" className="w-full">
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Create User
            </Button>
          </Link>
          <Link href="/admin/discovery">
            <Button variant="outline" className="w-full">
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              View Submissions
            </Button>
          </Link>
          <Link href="/admin/packets">
            <Button variant="outline" className="w-full">
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Review Packets
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="outline" className="w-full">
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Process Orders
            </Button>
          </Link>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Users KPI */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {data.kpis.users.total}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {data.kpis.users.active} active, {data.kpis.users.pending} pending
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
        </Card>

        {/* Packets KPI */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Packets</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {data.kpis.packets.total}
              </p>
              <p className="text-sm text-orange-600 mt-1">
                {data.kpis.packets.needsReview} need review
              </p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg
                className="h-6 w-6 text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </Card>

        {/* Revenue KPI */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${(data.kpis.revenue.total / 100).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {data.kpis.orders.total} orders
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </Card>

        {/* Discovery Forms KPI */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Discovery Forms</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {data.kpis.discovery.total}
              </p>
              <p className="text-sm text-purple-600 mt-1">
                {data.kpis.discovery.pending} pending
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">30-Day Engagement</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Recent Logins</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {data.engagement.recentLogins}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Assessments Completed</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {data.engagement.recentAssessments}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Orders Placed</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {data.engagement.recentOrders}
            </p>
          </div>
        </div>
      </Card>

      {/* Notifications Center */}
      <NotificationsCenter notifications={notifications} onRefresh={loadDashboardData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {data.recentActivity.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent activity</p>
            ) : (
              data.recentActivity.map((activity) => (
                <div
                  key={`${activity.type}-${activity.id}`}
                  className="flex items-start gap-3 pb-4 border-b last:border-b-0"
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'user'
                        ? 'bg-blue-100'
                        : activity.type === 'discovery'
                        ? 'bg-purple-100'
                        : activity.type === 'order'
                        ? 'bg-green-100'
                        : 'bg-orange-100'
                    }`}
                  >
                    {activity.type === 'user' && (
                      <svg
                        className="h-4 w-4 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    )}
                    {activity.type === 'discovery' && (
                      <svg
                        className="h-4 w-4 text-purple-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    )}
                    {activity.type === 'order' && (
                      <svg
                        className="h-4 w-4 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    )}
                    {activity.type === 'packet' && (
                      <svg
                        className="h-4 w-4 text-orange-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {activity.status && (
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        activity.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : activity.status === 'ACTIVE' || activity.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {activity.status}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>

        {/* System Health */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">System Health</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full ${
                    health?.database.status === 'healthy'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                ></div>
                <span className="font-medium">Database</span>
              </div>
              <span className="text-sm text-gray-600">
                {health?.database.status || 'Unknown'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {health?.database.users || 0}
                </p>
                <p className="text-xs text-gray-600 mt-1">Users</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {health?.database.packets || 0}
                </p>
                <p className="text-xs text-gray-600 mt-1">Packets</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {health?.database.orders || 0}
                </p>
                <p className="text-xs text-gray-600 mt-1">Orders</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500">
                Last checked: {health?.timestamp ? new Date(health.timestamp).toLocaleString() : 'Never'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
