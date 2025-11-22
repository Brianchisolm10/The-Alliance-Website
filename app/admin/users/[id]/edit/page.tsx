'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { getUserById, updateUser } from '@/app/actions/user-management'
import { UserRole, UserStatus, Population } from '@prisma/client'

interface User {
  id: string
  email: string
  name: string | null
  role: UserRole
  status: UserStatus
  population: Population | null
}

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    role: 'USER' as UserRole,
    status: 'ACTIVE' as UserStatus,
    population: '' as string,
  })

  useEffect(() => {
    loadUser()
  }, [userId])

  const loadUser = async () => {
    setLoading(true)
    const result = await getUserById(userId)

    if (result.success && result.data) {
      const userData = result.data as any
      setUser(userData)
      setFormData({
        name: userData.name || '',
        role: userData.role,
        status: userData.status,
        population: userData.population || '',
      })
    } else {
      setError(result.error || 'Failed to load user')
    }

    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    // Validate name
    if (!formData.name.trim()) {
      setError('Please enter a name')
      setSaving(false)
      return
    }

    const result = await updateUser(userId, {
      name: formData.name,
      role: formData.role,
      status: formData.status,
      population: formData.population || null,
    })

    if (result.success) {
      router.push(`/admin/users/${userId}`)
    } else {
      setError(result.error || 'Failed to update user')
      setSaving(false)
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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/admin/users/${userId}`}>
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
          <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
          <p className="text-gray-600 mt-1">{user.email}</p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-sm text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="John Doe"
              required
              disabled={saving}
            />
          </div>

          <div>
            <Label htmlFor="role">Role *</Label>
            <Select
              id="role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as UserRole })
              }
              disabled={saving}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </Select>
            <p className="text-sm text-gray-500 mt-1">
              {formData.role === 'USER' &&
                'Standard user with access to portal features'}
              {formData.role === 'ADMIN' &&
                'Admin with access to management features'}
              {formData.role === 'SUPER_ADMIN' &&
                'Super admin with full system access'}
            </p>
          </div>

          <div>
            <Label htmlFor="status">Status *</Label>
            <Select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as UserStatus })
              }
              disabled={saving}
            >
              <option value="PENDING">Pending</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </Select>
            <p className="text-sm text-gray-500 mt-1">
              {formData.status === 'PENDING' &&
                'User has not completed account setup'}
              {formData.status === 'ACTIVE' &&
                'User can access the platform'}
              {formData.status === 'INACTIVE' &&
                'User account is temporarily disabled'}
              {formData.status === 'SUSPENDED' &&
                'User account is suspended'}
            </p>
          </div>

          <div>
            <Label htmlFor="population">Population</Label>
            <Select
              id="population"
              value={formData.population}
              onChange={(e) =>
                setFormData({ ...formData, population: e.target.value })
              }
              disabled={saving}
            >
              <option value="">Not Assigned</option>
              <option value="GENERAL">General</option>
              <option value="ATHLETE">Athlete</option>
              <option value="YOUTH">Youth</option>
              <option value="RECOVERY">Recovery</option>
              <option value="PREGNANCY">Pregnancy</option>
              <option value="POSTPARTUM">Postpartum</option>
              <option value="OLDER_ADULT">Older Adult</option>
              <option value="CHRONIC_CONDITION">Chronic Condition</option>
            </Select>
            <p className="text-sm text-gray-500 mt-1">
              Population determines available assessment modules
            </p>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-2 text-yellow-700">
              ⚠️ Important Notes
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>You cannot change your own role or status</li>
              <li>Only super admins can modify other admin accounts</li>
              <li>Changing status to SUSPENDED will immediately block access</li>
              <li>All changes are logged for audit purposes</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving Changes...
                </>
              ) : (
                <>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Changes
                </>
              )}
            </Button>
            <Link href={`/admin/users/${userId}`}>
              <Button type="button" variant="outline" disabled={saving}>
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}
