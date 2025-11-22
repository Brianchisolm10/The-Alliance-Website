import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PortalLayout as PortalLayoutComponent } from '@/components/layouts/portal-layout'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return <PortalLayoutComponent userName={session.user.name || session.user.email}>{children}</PortalLayoutComponent>
}
