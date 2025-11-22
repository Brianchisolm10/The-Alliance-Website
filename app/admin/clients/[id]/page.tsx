'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getClientById } from '@/app/actions/client-communication'
import { ClientNotesSection } from '@/components/admin/client-notes-section'
import { ClientAssignmentSection } from '@/components/admin/client-assignment-section'
import { DiscoveryCallSection } from '@/components/admin/discovery-call-section'
import { EmailClientSection } from '@/components/admin/email-client-section'
import { UserStatus, Population, DiscoveryStatus, AssessmentType, PacketType, PacketStatus } from '@prisma/client'

interface ClientData {
  id: string
  email: string
  name: string | null
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
  clientAssignments: Array<{
    id: string
    assignedTo: {
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
  discovery?: {
    id: string
    name: string
    email: string
    goal: string
    notes: string | null
    status: DiscoveryStatus
    callScheduled: boolean
    callDate: Date | null
    createdAt: Date
  } | null
}

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const clientId = params.id as string

  const [client, setClient] = useState<ClientData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'activity' | 'communication'>('overview')

  useEffect(() => {
    loadClient()
  }, [clientId])

  const loadClient = async () => {
    setLoading(true)
    const result = await getClientById(clientId)

    if (result.success && result.data) {
      setClient(result.data as ClientData)
    } else {
      // Handle error - client not found
      router.push('/admin/clients')
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

  if (loading || !client) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading client...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/clients">
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
              Back to Clients
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {client.name || 'Unnamed Client'}
            </h1>
            <p className="text-gray-600 mt-1">{client.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/users/${client.id}/edit`}>
            <Button variant="outline">Edit Profile</Button>
          </Link>
        </div>
      </div>

      {/* Client Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Status</p>
          <span
            className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${getStatusBadgeColor(
              client.status
            )}`}
          >
            {client.status}
          </span>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Population</p>
          <p className="text-lg font-semibold text-gray-900 mt-2">
            {client.population || 'Not Set'}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Member Since</p>
          <p className="text-lg font-semibold text-gray-900 mt-2">
            {new Date(client.createdAt).toLocaleDateString()}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Last Login</p>
          <p className="text-lg font-semibold text-gray-900 mt-2">
            {client.lastLoginAt
              ? new Date(client.lastLoginAt).toLocaleDateString()
              : 'Never'}
          </p>
        </Card>
      </div>

      {/* Assignment and Discovery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ClientAssignmentSection
          clientId={client.id}
          assignments={client.clientAssignments}
          onUpdate={loadClient}
        />
        <DiscoveryCallSection
          clientEmail={client.email}
          discovery={client.discovery}
          onUpdate={loadClient}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`${
              activeTab === 'notes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Notes ({client.clientNotes.length})
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`${
              activeTab === 'activity'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Activity
          </button>
          <button
            onClick={() => setActiveTab('communication')}
            className={`${
              activeTab === 'communication'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Communication
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assessments */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Assessments ({client.assessments.length})
            </h3>
            {client.assessments.length === 0 ? (
              <p className="text-gray-500 text-sm">No assessments completed</p>
            ) : (
              <div className="space-y-3">
                {client.assessments.slice(0, 5).map((assessment) => (
                  <div
                    key={assessment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {assessment.type.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-gray-500">
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
          </Card>

          {/* Packets */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Packets ({client.packets.length})
            </h3>
            {client.packets.length === 0 ? (
              <p className="text-gray-500 text-sm">No packets generated</p>
            ) : (
              <div className="space-y-3">
                {client.packets.slice(0, 5).map((packet) => (
                  <div
                    key={packet.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {packet.type.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(packet.createdAt).toLocaleDateString()}
                      </p>
                    </div>
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
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Orders */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Orders ({client.orders.length})
            </h3>
            {client.orders.length === 0 ? (
              <p className="text-gray-500 text-sm">No orders placed</p>
            ) : (
              <div className="space-y-3">
                {client.orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        ${(order.total / 100).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'notes' && (
        <ClientNotesSection
          clientId={client.id}
          notes={client.clientNotes}
          onUpdate={loadClient}
        />
      )}

      {activeTab === 'activity' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Activity Log
          </h3>
          {client.activityLogs.length === 0 ? (
            <p className="text-gray-500 text-sm">No activity recorded</p>
          ) : (
            <div className="space-y-3">
              {client.activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {log.action.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {log.resource} • {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'communication' && (
        <EmailClientSection
          clientId={client.id}
          clientEmail={client.email}
          clientName={client.name || 'Client'}
        />
      )}
    </div>
  )
}
