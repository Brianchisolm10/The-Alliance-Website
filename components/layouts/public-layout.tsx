import * as React from 'react'
import { PublicHeader } from './public-header'
import { Footer } from './footer'

interface PublicLayoutProps {
  children: React.ReactNode
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
