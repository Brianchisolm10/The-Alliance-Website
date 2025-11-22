'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { getClients, getTeamMembers } from '@/app/actions/client-communication'
import { UserStatus, Population, DiscoveryStatus } from '@prisma/client'

interface Client {
  id: string
  email: string
  name: string | null
  status: UserStatus
  population: Population | null
  createdAt: Date
  lastLoginAt: Date | null
  _count: {
    assessments: number
    packets: number
    orders: number
    clientNotes: number
  }
  clientAssignments: Array<{
    assignedTo: {
      id: string
      name: string | null
      email: string
    }
  }>
  discovery?: {
    id: string
    status: DiscoveryStatus
    callScheduled: boolean
    callDate: Date | null
    createdAt: Date
  } | null
}

interface TeamMember {
  id: string
  name: string | null
  email: string
  role: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<UserStatus | ''>('')
  const [assignedToFilter, setAssignedToFilter] = useState('')

  useEffect(() => {
    loadTeamMembers()
  }, [])

  useEffect(() => {
    loadClients()
  }, [pagination.page, statusFilter, assignedToFilter])

  const loadTeamMembers = async () => {
    const result = await getTeamMembers()
    if (result.success && result.data) {
      setTeamMembers(result.data)
    }
  }

  const loadClients = async () => {
    setLoading(true)
    const result = await getClients({
      search: search || undefined,
      status: statusFilter || undefined,
      assignedTo: assignedToFilter || undefined,
      page: pagination.page,
      limit: pagination.limit,
    })

    if (result.success && result.data) {
      setClients(result.data.clients)
      setPagination(result.data.pagination)
    }

    setLoading(false)
  }

  const handleSearch = () => {
    setPagination({ ...pagination, page: 1 })
    loadClients()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
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

  const getDiscoveryStatusBadge = (discovery?: Client['discovery']) => {
    if (!discovery) {
      return <span className="text-xs text-gray-500">No discovery</span>
    }

    let color = 'bg-gray-100 text-gray-800'
    let text = discovery.status

    switch (discovery.status) {
      case 'SUBMITTED':
        color = 'bg-blue-100 text-blue-800'
        break
      case 'CALL_SCHEDULED':
        color = 'bg-yellow-100 text-yellow-800'
        text = 'Call Scheduled'
        break
      case 'CALL_COMPLETED':
        color = 'bg-green-100 text-green-800'
        text = 'Call Completed'
        break
      case 'CONVERTED':
        color = 'bg-purple-100 text-purple-800'
        break
      case 'CLOSED':
        color = 'bg-gray-100 text-gray-800'
        break
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${color}`}>
        {text}
      </span>
    )
  }

  const getClientJourneyStatus = (client: Client) => {
    const hasDiscovery = !!client.discovery
    const hasAssessments = client._count.assessments > 0
    const hasPackets = client._count.packets > 0
    const hasOrders = client._count.orders > 0

    if (hasPackets && hasOrders) return 'Engaged'
    if (hasPackets) return 'Active'
    if (hasAssessments) return 'In Progress'
    if (hasDiscovery) return 'New Lead'
    return 'Inactive'
  }

  const getJourneyStatusColor = (status: string) => {
    switch (status) {
      case 'Engaged':
        return 'bg-purple-100 text-purple-800'
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800'
      case 'New Lead':
        return 'bg-yellow-100 text-yellow-800'
      case 'Inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading && clients.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading clients...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600 mt-1">
            Manage client relationships, communications, and journey tracking
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSearch} variant="outline">
                Search
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as UserStatus | '')}
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned To
            </label>
            <Select
              value={assignedToFilter}
              onChange={(e) => setAssignedToFilter(e.target.value)}
            >
              <option value="">All Team Members</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name || member.email}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Clients</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {pagination.total}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {clients.filter((c) => c.status === 'ACTIVE').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">New Leads</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {clients.filter((c) => getClientJourneyStatus(c) === 'New Lead').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">In Progress</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {clients.filter((c) => getClientJourneyStatus(c) === 'In Progress').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Engaged</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {clients.filter((c) => getClientJourneyStatus(c) === 'Engaged').length}
          </p>
        </Card>
      </div>

      {/* Clients Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Journey
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discovery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No clients found
                  </td>
                </tr>
              ) : (
                clients.map((client) => {
                  const journeyStatus = getClientJourneyStatus(client)
                  return (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {client.name || 'No name'}
                          </div>
                          <div className="text-sm text-gray-500">{client.email}</div>
                          {client.population && (
                            <div className="text-xs text-gray-400 mt-1">
                              {client.population}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadgeColor(
                            client.status
                          )}`}
                        >
                          {client.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${getJourneyStatusColor(
                            journeyStatus
                          )}`}
                        >
                          {journeyStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getDiscoveryStatusBadge(client.discovery)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {client._count.assessments} assessments
                        </div>
                        <div className="text-sm text-gray-500">
                          {client._count.packets} packets, {client._count.orders} orders
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {client._count.clientNotes} notes
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {client.clientAssignments.length > 0 ? (
                          <div className="text-sm">
                            {client.clientAssignments.map((assignment) => (
                              <div key={assignment.assignedTo.id} className="text-gray-900">
                                {assignment.assignedTo.name || assignment.assignedTo.email}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link href={`/admin/clients/${client.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} clients
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page - 1 })
                }
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === pagination.totalPages ||
                      Math.abs(page - pagination.page) <= 1
                  )
                  .map((page, index, array) => (
                    <div key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      <Button
                        variant={page === pagination.page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPagination({ ...pagination, page })}
                      >
                        {page}
                      </Button>
                    </div>
                  ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page + 1 })
                }
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
