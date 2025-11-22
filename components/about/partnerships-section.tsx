import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const PartnershipsSection: React.FC = () => {
  const currentPartners = [
    {
      name: 'Nova University',
      type: 'University Outreach',
      description: 'Providing wellness programs and resources to students and faculty',
    },
    {
      name: 'Georgetown University',
      type: 'University Outreach',
      description: 'Collaborative wellness initiatives and educational programs',
    },
  ]

  const partnershipOpportunities = [
    {
      title: 'University Partnerships',
      description: 'Bring evidence-based wellness programs to your campus community',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: 'Corporate Wellness',
      description: 'Enhance employee health and productivity with customized programs',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: 'Community Organizations',
      description: 'Partner with us to bring wellness resources to underserved communities',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ]

  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Current Partnerships */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Partnerships
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Collaborating with leading institutions to expand our impact
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {currentPartners.map((partner) => (
            <div
              key={partner.name}
              className="rounded-lg bg-white p-8 shadow-sm"
            >
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">{partner.name}</h3>
                  <p className="text-sm text-blue-600">{partner.type}</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600">{partner.description}</p>
            </div>
          ))}
        </div>

        {/* Partnership Opportunities */}
        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Partnership Opportunities
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Join us in making wellness accessible to everyone
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {partnershipOpportunities.map((opportunity) => (
              <div
                key={opportunity.title}
                className="rounded-lg bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-600 text-white">
                  {opportunity.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">{opportunity.title}</h3>
                <p className="mt-4 text-gray-600">{opportunity.description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-lg bg-blue-600 p-8 text-center text-white sm:p-12">
            <h3 className="text-2xl font-bold">Interested in Partnering with AFYA?</h3>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              We&apos;re always looking for like-minded organizations to collaborate with. 
              Let&apos;s work together to make wellness accessible to more communities.
            </p>
            <div className="mt-8">
              <Link href="/contact">
                <Button size="lg" className="!bg-white !text-blue-700 hover:!bg-blue-50 font-semibold">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
