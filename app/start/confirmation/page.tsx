import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'

export const metadata = {
  title: 'Confirmation | AFYA',
  description: 'Your discovery call has been scheduled.',
}

interface ConfirmationPageProps {
  searchParams: { id?: string; manual?: string }
}

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const submissionId = searchParams.id
  const isManual = searchParams.manual === 'true'

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-2xl font-bold text-blue-600">AFYA</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Success Icon */}
          <div className="text-center mb-6">
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
              {isManual ? 'Request Received!' : 'Call Scheduled!'}
            </h1>
            <p className="text-gray-600">
              {isManual
                ? "We&apos;ve received your request. Our team will contact you shortly to schedule your discovery call."
                : "Your discovery call has been scheduled successfully."}
            </p>
          </div>

          {/* Details */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              What&apos;s Next?
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  Check your email at <strong>{submission.email}</strong> for confirmation details
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  {isManual
                    ? 'Our team will reach out within 24 hours to schedule your call'
                    : 'Add the event to your calendar (check your email for the calendar invite)'}
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>
                  Prepare any questions about your wellness goals for the call
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>
                  During the call, we'll discuss your goals and create a personalized wellness plan
                </span>
              </li>
            </ul>
          </div>

          {/* Your Goal */}
          {submission.goal && (
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Your Goal:
              </h3>
              <p className="text-gray-600 text-sm">{submission.goal}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 px-6 py-3 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </Link>
            <Link
              href="/programs"
              className="flex-1 px-6 py-3 bg-white text-blue-600 text-center rounded-md border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Explore Programs
            </Link>
          </div>
        </div>

        {/* Support */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <Link href="/contact" className="text-blue-600 hover:text-blue-700 hover:underline">
              Contact us
            </Link>
            {' '}or email{' '}
            <a
              href="mailto:afya@theafya.org"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              afya@theafya.org
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
