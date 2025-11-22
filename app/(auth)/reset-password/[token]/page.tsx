import { Metadata } from 'next'
import { ResetPasswordForm } from '@/components/forms/reset-password-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Reset Password | AFYA Wellness',
  description: 'Set your new password',
}

interface ResetPasswordTokenPageProps {
  params: {
    token: string
  }
}

export default function ResetPasswordTokenPage({ params }: ResetPasswordTokenPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">AFYA</h1>
          <p className="mt-2 text-sm text-gray-600">A Happier, Healthier You. Your Way</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Set new password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <ResetPasswordForm token={params.token} />
            <div className="mt-6 text-center text-sm text-gray-600">
              <Link href="/login" className="text-blue-600 hover:text-blue-700 hover:underline">
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
