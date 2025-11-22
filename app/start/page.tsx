import { DiscoveryForm } from '@/components/forms/discovery-form'
import Link from 'next/link'

export const metadata = {
  title: 'Start Your Journey | AFYA',
  description: 'Begin your wellness journey with AFYA. Complete our discovery form to schedule your personalized consultation.',
}

export default function StartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-2xl font-bold text-blue-600">AFYA</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Start Your Wellness Journey
          </h1>
          <p className="text-lg text-gray-600">
            Tell us about yourself and your goals. We&apos;ll schedule a discovery call to create your personalized wellness plan.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Discovery Form
            </h2>
            <p className="text-sm text-gray-600">
              This should only take a few minutes. After submitting, you&apos;ll be able to schedule your discovery call.
            </p>
          </div>

          <DiscoveryForm />
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Have questions?{' '}
            <Link href="/contact" className="text-blue-600 hover:text-blue-700 hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
