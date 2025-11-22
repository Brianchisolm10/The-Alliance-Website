import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { SetupAccountForm } from '@/components/forms/setup-account-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Account Setup | AFYA Wellness',
  description: 'Complete your AFYA account setup',
}

interface SetupPageProps {
  params: {
    token: string
  }
}

export default async function SetupPage({ params }: SetupPageProps) {
  // Validate token and get user
  const user = await prisma.user.findFirst({
    where: {
      setupToken: params.token,
      setupTokenExpiry: {
        gt: new Date(),
      },
      status: 'PENDING',
    },
  })

  // If token is invalid or expired, redirect to login
  if (!user) {
    redirect('/login?error=invalid_token')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">AFYA</h1>
          <p className="mt-2 text-sm text-gray-600">A Happier, Healthier You. Your Way</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to AFYA</CardTitle>
            <CardDescription>Complete your account setup to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <SetupAccountForm token={params.token} email={user.email} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
