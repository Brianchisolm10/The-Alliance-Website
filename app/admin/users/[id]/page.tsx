'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getUserById } from '@/app/actions/user-management'
import { UserRole, UserStatus, Population, AssessmentType, PacketType, PacketStatus } from '@prisma/client'

interface User {
  id: string
  email: string
  name: string | null
  role: UserRole
  status: UserStatus
  population: Population | null
  createdAt: Date
  lastLoginAt: Date | null
  assessments: Array<{
    id: string
    type: AssessmentType
    completed: boolean
    createdAt: Date
  }>
  packets: Array<{
    id: string
    type: PacketType
    status: PacketStatus
    createdAt: Date
  }>
  orders: Array<{
    id: string
    total: number
    status: string
    createdAt: Date
  }>
  clientNotes: Array<{
    id: string
    content: string
    createdAt: Date
    author: {
      id: string
      name: string | null
      email: string
    }
  }>
  activityLogs: Array<{
    id: string
    action: string
    resource: string
    details: any
    createdAt: Date
  }>
  _count: {
    assessments: number
    packets: number
    orders: number
    clientNotes: number
    activityLogs: number
  }
}

export default function UserDetailPage() {
  const params = useParams()
  const userId = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'assessments' | 'packets' | 'orders' | 'notes' | 'activity'>('overview')

  useEffect(() => {
    loadUser()
  }, [userId])

  const loadUser = async () => {
    setLoading(true)
    const result = await getUserById(userId)

    if (result.success && result.data) {
      setUser(result.data as any)
    } else {
      setError(result.error || 'Failed to load user')
    }

    setLoading(false)
  }

  const getStatusBadgeColor = (status: UserStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800'
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800'
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800'
      case 'USER':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'User not found'}</p>
          <Link href="/admin/users">
            <Button>Back to Users</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/users">
            <Button variant="outline" size="sm">
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.name || 'No name'}
            </h1>
            <p className="text-gray-600 mt-1">{user.email}</p>
          </div>
        </div>
        <Link href={`/admin/users/${userId}/edit`}>
          <Button>
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit User
          </Button>
        </Link>
      </div>

      {/* User Info Card */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Role</p>
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${getRoleBadgeColor(
                user.role
              )}`}
            >
              {user.role.replace('_', ' ')}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadgeColor(
                user.status
              )}`}
            >
              {user.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Population</p>
            <p className="text-sm font-medium text-gray-900">
              {user.population || 'Not assigned'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Member Since</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        {user.lastLoginAt && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Last login: {new Date(user.lastLoginAt).toLocaleString()}
            </p>
          </div>
        )}
      </Card>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Assessments</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {user._count.assessments}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {user.assessments.filter((a) => a.completed).length} completed
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Packets</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {user._count.packets}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {user.packets.filter((p) => p.status === 'PUBLISHED').length} published
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Orders</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {user._count.orders}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            ${(user.orders.reduce((sum, o) => sum + o.total, 0) / 100).toFixed(2)} total
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Activity Logs</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {user._count.activityLogs}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total actions</p>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'assessments', label: 'Assessments' },
              { id: 'packets', label: 'Packets' },
              { id: 'orders', label: 'Orders' },
              { id: 'notes', label: 'Notes' },
              { id: 'activity', label: 'Activity' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
                {user.activityLogs.length === 0 ? (
                  <p className="text-gray-500 text-sm">No activity yet</p>
                ) : (
                  <div className="space-y-2">
                    {user.activityLogs.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {log.action.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {log.resource} • {new Date(log.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Assessments Tab */}
          {activeTab === 'assessments' && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Assessments</h3>
              {user.assessments.length === 0 ? (
                <p className="text-gray-500 text-sm">No assessments yet</p>
              ) : (
                <div className="space-y-2">
                  {user.assessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      className="flex items-center justify-between p-4 border rounded"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {assessment.type.replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(assessment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          assessment.completed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {assessment.completed ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Packets Tab */}
          {activeTab === 'packets' && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Packets</h3>
              {user.packets.length === 0 ? (
                <p className="text-gray-500 text-sm">No packets yet</p>
              ) : (
                <div className="space-y-2">
                  {user.packets.map((packet) => (
                    <div
                      key={packet.id}
                      className="flex items-center justify-between p-4 border rounded"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {packet.type.replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(packet.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            packet.status === 'PUBLISHED'
                              ? 'bg-green-100 text-green-800'
                              : packet.status === 'UNPUBLISHED'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {packet.status}
                        </span>
                        <Link href={`/admin/packets/${packet.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Orders</h3>
              {user.orders.length === 0 ? (
                <p className="text-gray-500 text-sm">No orders yet</p>
              ) : (
                <div className="space-y-2">
                  {user.orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          ${(order.total / 100).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          order.status === 'DELIVERED'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Client Notes</h3>
              {user.clientNotes.length === 0 ? (
                <p className="text-gray-500 text-sm">No notes yet</p>
              ) : (
                <div className="space-y-3">
                  {user.clientNotes.map((note) => (
                    <div key={note.id} className="p-4 border rounded">
                      <p className="text-sm text-gray-900 mb-2">{note.content}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          By {note.author.name || note.author.email}
                        </span>
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Activity Log</h3>
              {user.activityLogs.length === 0 ? (
                <p className="text-gray-500 text-sm">No activity yet</p>
              ) : (
                <div className="space-y-2">
                  {user.activityLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {log.action.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Resource: {log.resource}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
