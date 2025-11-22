import { AdminLayout } from '@/components/layouts/admin-layout'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Check if user is authenticated
  if (!session?.user) {
    redirect('/login')
  }

  // Check if user has admin role
  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
    redirect('/dashboard')
  }

  return <AdminLayout userName={session.user.name || undefined}>{children}</AdminLayout>
}
