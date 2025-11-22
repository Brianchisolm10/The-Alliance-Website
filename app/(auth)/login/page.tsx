import { Metadata } from 'next'
import { LoginForm } from '@/components/forms/login-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PublicHeader } from '@/components/layouts/public-header'
import { Footer } from '@/components/layouts/footer'
import { HealthFactsSidebar } from '@/components/auth/health-facts-sidebar'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Login | AFYA Wellness',
  description: 'Sign in to your AFYA account',
}

interface LoginPageProps {
  searchParams: {
    reset?: string
    setup?: string
    error?: string
  }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const showResetSuccess = searchParams.reset === 'success'
  const showSetupSuccess = searchParams.setup === 'success'
  const showInvalidToken = searchParams.error === 'invalid_token'

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      
      <main className="flex-grow bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            {/* Login Card */}
            <div className="w-full max-w-md">
              <Card className="shadow-xl">
                <CardHeader className="space-y-1 pb-6">
                  <CardTitle className="text-2xl">Welcome back</CardTitle>
                  <CardDescription>Sign in to your account to continue</CardDescription>
                </CardHeader>
                <CardContent>
                  {showResetSuccess && (
                    <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
                      Your password has been reset successfully. You can now sign in with your new password.
                    </div>
                  )}
                  {showSetupSuccess && (
                    <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
                      Your account has been set up successfully. You can now sign in.
                    </div>
                  )}
                  {showInvalidToken && (
                    <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
                      The setup link is invalid or has expired. Please contact support for assistance.
                    </div>
                  )}
                  <LoginForm />
                  <div className="mt-6 text-center text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/start" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
                      Start your journey
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Health Facts Sidebar */}
            <HealthFactsSidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
