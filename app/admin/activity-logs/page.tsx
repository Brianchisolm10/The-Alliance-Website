import { Suspense } from 'react'
import { ActivityLogsClient } from './activity-logs-client'
import { Card } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export const metadata = {
  title: 'Activity Logs | Admin',
  description: 'View system activity logs and audit trail',
}

export default function ActivityLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Activity Logs</h1>
        <p className="text-gray-600 mt-2">
          View and search system activity logs for auditing and monitoring
        </p>
      </div>

      <Suspense
        fallback={
          <Card className="p-8">
            <div className="flex items-center justify-center">
              <LoadingSpinner />
            </div>
          </Card>
        }
      >
        <ActivityLogsClient />
      </Suspense>
    </div>
  )
}
