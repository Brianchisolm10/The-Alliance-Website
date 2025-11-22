import * as React from 'react'

export const TractionSection: React.FC = () => {
  const metrics = [
    {
      value: '24+',
      label: 'Clients Served',
      description: 'Active community members across multiple states',
    },
    {
      value: '5+',
      label: 'U.S. States',
      description: 'Growing presence across the nation',
    },
    {
      value: '100',
      label: 'Q3 2025 Goal',
      description: 'Ambitious growth target for community expansion',
    },
    {
      value: '100%',
      label: 'Automated',
      description: 'Fully automated onboarding and program delivery',
    },
  ]

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Traction & Growth
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Building momentum toward a healthier future
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm"
            >
              <div className="text-4xl font-bold text-blue-600">{metric.value}</div>
              <div className="mt-2 text-lg font-semibold text-gray-900">{metric.label}</div>
              <p className="mt-2 text-sm text-gray-600">{metric.description}</p>
            </div>
          ))}
        </div>

        {/* Growth Vision */}
        <div className="mt-16 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-8 sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="text-2xl font-bold text-gray-900">Our Vision for Growth</h3>
            <p className="mt-4 text-lg text-gray-700">
              We&apos;re on a mission to reach 100 clients by Q3 2025, expanding our impact across 
              communities nationwide. Through our fully automated systems, we can scale efficiently 
              while maintaining the personalized, high-quality experience every member deserves.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">Scalable Technology</div>
                <p className="mt-2 text-gray-600">
                  Automated onboarding and program delivery enable us to serve more people 
                  without compromising quality
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">Community-First</div>
                <p className="mt-2 text-gray-600">
                  Every new member strengthens our community and helps us reach more people 
                  who need accessible wellness resources
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
