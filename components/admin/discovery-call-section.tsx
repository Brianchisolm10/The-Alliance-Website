'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { updateDiscoveryCallStatus } from '@/app/actions/client-communication'
import { DiscoveryStatus } from '@prisma/client'

interface Discovery {
  id: string
  name: string
  email: string
  goal: string
  notes: string | null
  status: DiscoveryStatus
  callScheduled: boolean
  callDate: Date | null
  createdAt: Date
}

interface DiscoveryCallSectionProps {
  clientEmail: string
  discovery?: Discovery | null
  onUpdate: () => void
}

export function DiscoveryCallSection({
  clientEmail,
  discovery,
  onUpdate,
}: DiscoveryCallSectionProps) {
  const [status, setStatus] = useState(discovery?.status || 'SUBMITTED')
  const [callScheduled, setCallScheduled] = useState(discovery?.callScheduled || false)
  const [callDate, setCallDate] = useState(
    discovery?.callDate ? new Date(discovery.callDate).toISOString().split('T')[0] : ''
  )
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    if (!discovery) return

    setLoading(true)

    const result = await updateDiscoveryCallStatus(discovery.id, {
      status: status as DiscoveryStatus,
      callScheduled,
      callDate: callDate ? new Date(callDate) : null,
    })

    if (result.success) {
      onUpdate()
    } else {
      alert(result.error || 'Failed to update discovery call status')
    }

    setLoading(false)
  }

  const getStatusBadgeColor = (status: DiscoveryStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800'
      case 'CALL_SCHEDULED':
        return 'bg-yellow-100 text-yellow-800'
      case 'CALL_COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CONVERTED':
        return 'bg-purple-100 text-purple-800'
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!discovery) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Discovery Call
        </h3>
        <p className="text-sm text-gray-500">
          No discovery submission found for {clientEmail}
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Discovery Call Tracking
      </h3>

      {/* Discovery Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200">
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-500">Submitted</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(discovery.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Primary Goal</p>
            <p className="text-sm text-gray-900">{discovery.goal}</p>
          </div>
          {discovery.notes && (
            <div>
              <p className="text-xs text-gray-500">Notes</p>
              <p className="text-sm text-gray-900">{discovery.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Call Status Management */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as DiscoveryStatus)}
            disabled={loading}
          >
            <option value="SUBMITTED">Submitted</option>
            <option value="CALL_SCHEDULED">Call Scheduled</option>
            <option value="CALL_COMPLETED">Call Completed</option>
            <option value="CONVERTED">Converted</option>
            <option value="CLOSED">Closed</option>
          </Select>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={callScheduled}
              onChange={(e) => setCallScheduled(e.target.checked)}
              disabled={loading}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">
              Call Scheduled
            </span>
          </label>
        </div>

        {callScheduled && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Call Date
            </label>
            <Input
              type="date"
              value={callDate}
              onChange={(e) => setCallDate(e.target.value)}
              disabled={loading}
            />
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? 'Updating...' : 'Update Status'}
          </Button>
        </div>
      </div>

      {/* Current Status Badge */}
      <div className="mt-6 pt-6 border-t">
        <p className="text-sm text-gray-600 mb-2">Current Status:</p>
        <span
          className={`inline-block px-3 py-1 text-sm font-medium rounded ${getStatusBadgeColor(
            discovery.status
          )}`}
        >
          {discovery.status.replace('_', ' ')}
        </span>
        {discovery.callDate && (
          <p className="text-sm text-gray-600 mt-2">
            Call Date: {new Date(discovery.callDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </Card>
  )
}
