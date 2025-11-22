import * as React from 'react'

export const ValuesSection: React.FC = () => {
  const values = [
    {
      name: 'Community',
      description: 'We believe in the power of collective growth and support. Every member of AFYA is part of a larger movement toward better health.',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      name: 'Discipline',
      description: 'Sustainable wellness requires consistent effort and dedication. We provide the structure and guidance to help you build lasting habits.',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: 'Joy',
      description: 'Wellness should be enjoyable, not a burden. We create programs that celebrate progress and make health a source of happiness.',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Core Values
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Three principles guide everything we do at AFYA
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.name}
              className="rounded-lg bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-600 text-white">
                {value.icon}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">{value.name}</h3>
              <p className="mt-4 text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Our Approach */}
        <div className="mt-16 rounded-lg bg-blue-600 p-8 text-white sm:p-12">
          <h3 className="text-2xl font-bold">Our Approach</h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div>
              <div className="text-3xl font-bold text-blue-200">Science-Backed</div>
              <p className="mt-2 text-blue-100">
                Every program is rooted in evidence-based research and proven methodologies
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-200">Equity-Focused</div>
              <p className="mt-2 text-blue-100">
                Free access to underserved communities ensures wellness is a right, not a privilege
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-200">Automation-Powered</div>
              <p className="mt-2 text-blue-100">
                Fully automated onboarding and delivery systems make scaling possible
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
