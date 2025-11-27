'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { fetchActivityLogs } from '@/app/actions/activity-logs'
import { LogAction, LogResource } from '@/lib/logging/types'
import { formatDistanceToNow } from 'date-fns'

type ActivityLog = {
  id: string
  userId: string | null
  action: string
  resource: string
  details: any
  ipAddress: string | null
  createdAt: Date
  user: {
    id: string
    name: string | null
    email: string
    role: string
  } | null
}

export function ActivityLogsClient() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  
  // Filters
  const [searchUserId, setSearchUserId] = useState('')
  const [selectedAction, setSelectedAction] = useState<string>('')
  const [selectedResource, setSelectedResource] = useState<string>('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [expandedLog, setExpandedLog] = useState<string | null>(null)

  const loadLogs = async () => {
    setLoading(true)
    try {
      const result = await fetchActivityLogs({
        userId: searchUserId || undefined,
        action: selectedAction as any,
        resource: selectedResource as any,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page,
        limit: 50,
      })

      if (result.success && result.logs) {
        setLogs(result.logs as ActivityLog[])
        setTotalPages(result.totalPages || 1)
        setTotal(result.total || 0)
      }
    } catch (error) {
      console.error('Failed to load activity logs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [page])

  const handleSearch = () => {
    setPage(1)
    loadLogs()
  }

  const handleReset = () => {
    setSearchUserId('')
    setSelectedAction('')
    setSelectedResource('')
    setStartDate('')
    setEndDate('')
    setPage(1)
    setTimeout(loadLogs, 0)
  }

  const getActionColor = (action: string) => {
    if (action.includes('LOGIN') || action.includes('CREATED')) {
      return 'text-green-600 bg-green-50'
    }
    if (action.includes('DELETE') || action.includes('FAILED')) {
      return 'text-red-600 bg-red-50'
    }
    if (action.includes('UPDATE') || action.includes('PUBLISHED')) {
      return 'text-blue-600 bg-blue-50'
    }
    return 'text-gray-600 bg-gray-50'
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User ID
            </label>
            <Input
              type="text"
              placeholder="Search by user ID"
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action
            </label>
            <Select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
            >
              <option value="">All Actions</option>
              <optgroup label="Authentication">
                <option value={LogAction.LOGIN}>Login</option>
                <option value={LogAction.LOGOUT}>Logout</option>
                <option value={LogAction.PASSWORD_RESET_REQUEST}>Password Reset Request</option>
                <option value={LogAction.PASSWORD_RESET_COMPLETE}>Password Reset Complete</option>
                <option value={LogAction.ACCOUNT_SETUP_COMPLETE}>Account Setup Complete</option>
              </optgroup>
              <optgroup label="Forms">
                <option value={LogAction.DISCOVERY_FORM_SUBMIT}>Discovery Form</option>
                <option value={LogAction.CONTACT_FORM_SUBMIT}>Contact Form</option>
                <option value={LogAction.ASSESSMENT_SUBMIT}>Assessment</option>
                <option value={LogAction.GEAR_DRIVE_SUBMIT}>Gear Drive</option>
              </optgroup>
              <optgroup label="Transactions">
                <option value={LogAction.ORDER_CREATED}>Order Created</option>
                <option value={LogAction.ORDER_UPDATED}>Order Updated</option>
                <option value={LogAction.PAYMENT_COMPLETED}>Payment Completed</option>
                <option value={LogAction.DONATION_COMPLETED}>Donation Completed</option>
              </optgroup>
              <optgroup label="Admin Actions">
                <option value={LogAction.USER_CREATED}>User Created</option>
                <option value={LogAction.USER_UPDATED}>User Updated</option>
                <option value={LogAction.PACKET_PUBLISHED}>Packet Published</option>
                <option value={LogAction.PACKET_UNPUBLISHED}>Packet Unpublished</option>
              </optgroup>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resource
            </label>
            <Select
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
            >
              <option value="">All Resources</option>
              <option value={LogResource.AUTH}>Authentication</option>
              <option value={LogResource.USER}>User</option>
              <option value={LogResource.DISCOVERY}>Discovery</option>
              <option value={LogResource.CONTACT}>Contact</option>
              <option value={LogResource.ASSESSMENT}>Assessment</option>
              <option value={LogResource.PACKET}>Packet</option>
              <option value={LogResource.ORDER}>Order</option>
              <option value={LogResource.PAYMENT}>Payment</option>
              <option value={LogResource.DONATION}>Donation</option>
              <option value={LogResource.GEAR_DRIVE}>Gear Drive</option>
              <option value={LogResource.PRODUCT}>Product</option>
              <option value={LogResource.PROGRAM}>Program</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex items-end gap-2">
            <Button onClick={handleSearch} className="flex-1">
              Search
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Activity Logs ({total} total)
          </h2>
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No activity logs found
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                      <span className="text-sm text-gray-600">
                        {log.resource}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(log.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    <div className="text-sm text-gray-700 mb-2">
                      {log.user ? (
                        <span>
                          <span className="font-medium">{log.user.name || log.user.email}</span>
                          <span className="text-gray-500"> ({log.user.role})</span>
                        </span>
                      ) : (
                        <span className="text-gray-500">Anonymous</span>
                      )}
                      {log.ipAddress && (
                        <span className="text-gray-500 ml-2">
                          from {log.ipAddress}
                        </span>
                      )}
                    </div>

                    {log.details && (
                      <button
                        onClick={() =>
                          setExpandedLog(expandedLog === log.id ? null : log.id)
                        }
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        {expandedLog === log.id ? 'Hide' : 'Show'} details
                      </button>
                    )}

                    {expandedLog === log.id && log.details && (
                      <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    )}
                  </div>

                  <div className="text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
