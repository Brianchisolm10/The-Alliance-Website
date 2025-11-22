'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateSchedulingStatus } from '@/app/actions/discovery'

interface SchedulingInterfaceProps {
  submissionId: string
  name: string
  email: string
}

export function SchedulingInterface({ submissionId, name, email }: SchedulingInterfaceProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      setIsLoading(false)
    }

    script.onerror = () => {
      setError('Failed to load scheduling widget. Please try again.')
      setIsLoading(false)
    }

    // Listen for Calendly events
    const handleCalendlyEvent = async (e: MessageEvent) => {
      if (e.data.event && e.data.event.indexOf('calendly') === 0) {
        if (e.data.event === 'calendly.event_scheduled') {
          // Update submission status
          try {
            const result = await updateSchedulingStatus({
              submissionId,
              callScheduled: true,
              callDate: new Date(e.data.payload.event.start_time),
            })

            if (result.success) {
              // Redirect to confirmation page
              router.push(`/start/confirmation?id=${submissionId}`)
            }
          } catch (error) {
            console.error('Failed to update scheduling status:', error)
          }
        }
      }
    }

    window.addEventListener('message', handleCalendlyEvent)

    return () => {
      document.body.removeChild(script)
      window.removeEventListener('message', handleCalendlyEvent)
    }
  }, [submissionId, router])

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mb-4 text-red-600">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading scheduling calendar...</p>
      </div>
    )
  }

  // Calendly URL - In production, replace with actual Calendly URL
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/afya-wellness/discovery-call'

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Choose Your Time
        </h2>
        <p className="text-sm text-gray-600">
          Select a convenient time for your 30-minute discovery call. We&apos;ll discuss your goals and create a personalized plan.
        </p>
      </div>

      {/* Calendly Inline Widget */}
      <div
        className="calendly-inline-widget"
        data-url={`${calendlyUrl}?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&hide_event_type_details=1&hide_gdpr_banner=1`}
        style={{ minWidth: '320px', height: '700px' }}
      />

      {/* Alternative: Manual Scheduling */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          Having trouble with the calendar?{' '}
          <button
            onClick={async () => {
              // Mark as manually scheduled
              const result = await updateSchedulingStatus({
                submissionId,
                callScheduled: false,
                callDate: null,
              })
              if (result.success) {
                router.push(`/start/confirmation?id=${submissionId}&manual=true`)
              }
            }}
            className="text-blue-600 hover:text-blue-700 hover:underline"
          >
            Contact us to schedule manually
          </button>
        </p>
      </div>
    </div>
  )
}
