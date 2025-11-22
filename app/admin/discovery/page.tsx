import { prisma } from '@/lib/db'
import { AdminLayout } from '@/components/layouts/admin-layout'
import { DiscoverySubmissionsList } from '@/components/admin/discovery-submissions-list'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Discovery Submissions | Admin | AFYA',
  description: 'Manage discovery form submissions and schedule calls.',
}

export default async function AdminDiscoveryPage() {
  const session = await auth()

  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    redirect('/login')
  }

  // Fetch all discovery submissions
  const submissions = await prisma.discoverySubmission.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Get stats
  const stats = {
    total: submissions.length,
    submitted: submissions.filter((s) => s.status === 'SUBMITTED').length,
    scheduled: submissions.filter((s) => s.status === 'CALL_SCHEDULED').length,
    completed: submissions.filter((s) => s.status === 'CALL_COMPLETED').length,
    converted: submissions.filter((s) => s.status === 'CONVERTED').length,
  }

  return (
    <AdminLayout userName={session.user.name || session.user.email}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discovery Submissions</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage discovery form submissions and track call scheduling.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="bg-white rounded-lg shadow p-5">
            <div className="text-sm font-medium text-gray-600">Total</div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <div className="text-sm font-medium text-gray-600">Submitted</div>
            <div className="mt-1 text-3xl font-semibold text-blue-600">{stats.submitted}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <div className="text-sm font-medium text-gray-600">Scheduled</div>
            <div className="mt-1 text-3xl font-semibold text-yellow-600">{stats.scheduled}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <div className="text-sm font-medium text-gray-600">Completed</div>
            <div className="mt-1 text-3xl font-semibold text-green-600">{stats.completed}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <div className="text-sm font-medium text-gray-600">Converted</div>
            <div className="mt-1 text-3xl font-semibold text-purple-600">{stats.converted}</div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white rounded-lg shadow">
          <DiscoverySubmissionsList submissions={submissions} />
        </div>
      </div>
    </AdminLayout>
  )
}
