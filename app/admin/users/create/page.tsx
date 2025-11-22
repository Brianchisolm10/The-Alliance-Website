'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { createUser } from '@/app/actions/user-management'
import { UserRole, Population } from '@prisma/client'

export default function CreateUserPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'USER' as UserRole,
    population: '' as string,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    // Validate name
    if (!formData.name.trim()) {
      setError('Please enter a name')
      setLoading(false)
      return
    }

    const result = await createUser({
      email: formData.email,
      name: formData.name,
      role: formData.role,
      population: formData.population || undefined,
    })

    if (result.success) {
      router.push('/admin/users')
    } else {
      setError(result.error || 'Failed to create user')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
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
          <h1 className="text-3xl font-bold text-gray-900">Create User</h1>
          <p className="text-gray-600 mt-1">
            Create a new user account and send setup email
          </p>
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
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="user@example.com"
              required
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-1">
              A setup email will be sent to this address
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
              disabled={loading}
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
              disabled={loading}
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
            <Label htmlFor="population">Population (Optional)</Label>
            <Select
              id="population"
              value={formData.population}
              onChange={(e) =>
                setFormData({ ...formData, population: e.target.value })
              }
              disabled={loading}
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
              Population can be assigned later based on discovery call
            </p>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-2">What happens next?</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>User account will be created with PENDING status</li>
              <li>Setup email will be sent with a secure link</li>
              <li>User has 7 days to complete account setup</li>
              <li>User will set their password and activate account</li>
            </ol>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating User...
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create User & Send Email
                </>
              )}
            </Button>
            <Link href="/admin/users">
              <Button type="button" variant="outline" disabled={loading}>
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}
