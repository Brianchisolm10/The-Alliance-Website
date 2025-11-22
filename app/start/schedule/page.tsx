import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { SchedulingInterface } from '@/components/scheduling/scheduling-interface'

export const metadata = {
  title: 'Schedule Discovery Call | AFYA',
  description: 'Schedule your personalized discovery call with AFYA.',
}

interface SchedulePageProps {
  searchParams: { id?: string }
}

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const submissionId = searchParams.id

  if (!submissionId) {
    redirect('/start')
  }

  // Fetch the submission
  const submission = await prisma.discoverySubmission.findUnique({
    where: { id: submissionId },
  })

  if (!submission) {
    redirect('/start')
  }

  // If already scheduled, show confirmation
  if (submission.callScheduled) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-bold text-blue-600">AFYA</span>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Call Already Scheduled!
              </h1>
              <p className="text-gray-600 mb-6">
                You&apos;ve already scheduled your discovery call. Check your email for confirmation details.
              </p>
            </div>

            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-2xl font-bold text-blue-600">AFYA</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Schedule Your Discovery Call
          </h1>
          <p className="text-lg text-gray-600">
            Thanks, {submission.name}! Choose a time that works best for you.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <SchedulingInterface 
            submissionId={submission.id}
            name={submission.name}
            email={submission.email}
          />
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need to reschedule?{' '}
            <Link href="/contact" className="text-blue-600 hover:text-blue-700 hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
