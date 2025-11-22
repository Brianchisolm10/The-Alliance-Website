'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import {
  getTeamMembers,
  assignClientToTeamMember,
  unassignClientFromTeamMember,
} from '@/app/actions/client-communication'

interface TeamMember {
  id: string
  name: string | null
  email: string
  role: string
}

interface Assignment {
  id: string
  assignedTo: {
    id: string
    name: string | null
    email: string
  }
}

interface ClientAssignmentSectionProps {
  clientId: string
  assignments: Assignment[]
  onUpdate: () => void
}

export function ClientAssignmentSection({
  clientId,
  assignments,
  onUpdate,
}: ClientAssignmentSectionProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [selectedTeamMember, setSelectedTeamMember] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadTeamMembers()
  }, [])

  const loadTeamMembers = async () => {
    const result = await getTeamMembers()
    if (result.success && result.data) {
      setTeamMembers(result.data)
    }
  }

  const handleAssign = async () => {
    if (!selectedTeamMember) return

    setLoading(true)
    const result = await assignClientToTeamMember(clientId, selectedTeamMember)

    if (result.success) {
      setSelectedTeamMember('')
      onUpdate()
    } else {
      alert(result.error || 'Failed to assign client')
    }

    setLoading(false)
  }

  const handleUnassign = async (teamMemberId: string) => {
    if (!confirm('Are you sure you want to remove this assignment?')) return

    setLoading(true)
    const result = await unassignClientFromTeamMember(clientId, teamMemberId)

    if (result.success) {
      onUpdate()
    } else {
      alert(result.error || 'Failed to unassign client')
    }

    setLoading(false)
  }

  // Filter out already assigned team members
  const availableTeamMembers = teamMembers.filter(
    (member) => !assignments.some((a) => a.assignedTo.id === member.id)
  )

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Team Assignment
      </h3>

      {/* Current Assignments */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Assigned To:
        </p>
        {assignments.length === 0 ? (
          <p className="text-sm text-gray-500">Not assigned to any team member</p>
        ) : (
          <div className="space-y-2">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {assignment.assignedTo.name || assignment.assignedTo.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {assignment.assignedTo.email}
                  </p>
                </div>
                <button
                  onClick={() => handleUnassign(assignment.assignedTo.id)}
                  disabled={loading}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Assignment */}
      {availableTeamMembers.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">
            Add Assignment:
          </p>
          <div className="flex gap-2">
            <Select
              value={selectedTeamMember}
              onChange={(e) => setSelectedTeamMember(e.target.value)}
              disabled={loading}
              className="flex-1"
            >
              <option value="">Select team member...</option>
              {availableTeamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name || member.email} ({member.role})
                </option>
              ))}
            </Select>
            <Button
              onClick={handleAssign}
              disabled={loading || !selectedTeamMember}
              size="sm"
            >
              {loading ? 'Assigning...' : 'Assign'}
            </Button>
          </div>
        </div>
      )}

      {availableTeamMembers.length === 0 && assignments.length > 0 && (
        <p className="text-sm text-gray-500 mt-4">
          All team members are already assigned
        </p>
      )}
    </Card>
  )
}
