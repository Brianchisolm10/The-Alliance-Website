'use client'

import { useState } from 'react'
import { updateDiscoveryStatus } from '@/app/actions/discovery'
import { useRouter } from 'next/navigation'
import { PopulationAssignment } from './population-assignment'
import { Dialog } from '@/components/ui/dialog'

interface DiscoverySubmission {
  id: string
  name: string
  email: string
  goal: string
  notes: string | null
  status: string
  callScheduled: boolean
  callDate: Date | null
  createdAt: Date
  updatedAt: Date
}

interface DiscoverySubmissionsListProps {
  submissions: DiscoverySubmission[]
}

const statusColors = {
  SUBMITTED: 'bg-blue-100 text-blue-800',
  CALL_SCHEDULED: 'bg-yellow-100 text-yellow-800',
  CALL_COMPLETED: 'bg-green-100 text-green-800',
  CONVERTED: 'bg-purple-100 text-purple-800',
  CLOSED: 'bg-gray-100 text-gray-800',
}

const statusLabels = {
  SUBMITTED: 'Submitted',
  CALL_SCHEDULED: 'Call Scheduled',
  CALL_COMPLETED: 'Call Completed',
  CONVERTED: 'Converted',
  CLOSED: 'Closed',
}

export function DiscoverySubmissionsList({ submissions }: DiscoverySubmissionsListProps) {
  const router = useRouter()
  const [filter, setFilter] = useState<string>('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [convertingId, setConvertingId] = useState<string | null>(null)
  const [showConvertDialog, setShowConvertDialog] = useState(false)

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesFilter = filter === 'ALL' || submission.status === filter
    const matchesSearch =
      searchTerm === '' ||
      submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleStatusUpdate = async (
    submissionId: string,
    newStatus: 'SUBMITTED' | 'CALL_SCHEDULED' | 'CALL_COMPLETED' | 'CONVERTED' | 'CLOSED'
  ) => {
    // If converting, show population assignment dialog
    if (newStatus === 'CONVERTED') {
      setConvertingId(submissionId)
      setShowConvertDialog(true)
      return
    }

    setUpdatingId(submissionId)
    try {
      const result = await updateDiscoveryStatus({ submissionId, status: newStatus })
      if (result.success) {
        router.refresh()
      } else {
        alert(result.error || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleConversionSuccess = () => {
    setShowConvertDialog(false)
    setConvertingId(null)
    router.refresh()
  }

  return (
    <>
      {/* Population Assignment Dialog */}
      {showConvertDialog && convertingId && (
        <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Convert to User Account
                </h2>
                <p className="text-gray-600 mb-6">
                  Assign a population to create a user account from this discovery submission.
                  The user will receive a setup email to complete their registration.
                </p>
                <PopulationAssignment
                  discoverySubmissionId={convertingId}
                  mode="convert"
                  onSuccess={handleConversionSuccess}
                />
                <button
                  onClick={() => {
                    setShowConvertDialog(false)
                    setConvertingId(null)
                  }}
                  className="mt-4 text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}

      <div className="p-6">
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">All Status</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="CALL_SCHEDULED">Call Scheduled</option>
            <option value="CALL_COMPLETED">Call Completed</option>
            <option value="CONVERTED">Converted</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      {filteredSubmissions.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filter !== 'ALL'
              ? 'Try adjusting your filters'
              : 'Discovery submissions will appear here'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Call Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubmissions.map((submission) => (
                <>
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{submission.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{submission.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          statusColors[submission.status as keyof typeof statusColors]
                        }`}
                      >
                        {statusLabels[submission.status as keyof typeof statusLabels]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {submission.callDate
                        ? new Date(submission.callDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(submission.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() =>
                          setExpandedId(expandedId === submission.id ? null : submission.id)
                        }
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        {expandedId === submission.id ? 'Hide' : 'View'}
                      </button>
                      <select
                        value={submission.status}
                        onChange={(e) =>
                          handleStatusUpdate(
                            submission.id,
                            e.target.value as
                              | 'SUBMITTED'
                              | 'CALL_SCHEDULED'
                              | 'CALL_COMPLETED'
                              | 'CONVERTED'
                              | 'CLOSED'
                          )
                        }
                        disabled={updatingId === submission.id}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="SUBMITTED">Submitted</option>
                        <option value="CALL_SCHEDULED">Call Scheduled</option>
                        <option value="CALL_COMPLETED">Call Completed</option>
                        <option value="CONVERTED">Converted</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </td>
                  </tr>
                  {expandedId === submission.id && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">
                              Primary Goal:
                            </h4>
                            <p className="text-sm text-gray-600">{submission.goal}</p>
                          </div>
                          {submission.notes && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                Additional Notes:
                              </h4>
                              <p className="text-sm text-gray-600">{submission.notes}</p>
                            </div>
                          )}
                          <div className="flex gap-4 text-xs text-gray-500">
                            <div>
                              <span className="font-medium">Submission ID:</span> {submission.id}
                            </div>
                            <div>
                              <span className="font-medium">Last Updated:</span>{' '}
                              {new Date(submission.updatedAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  )
}
