import * as React from 'react'

export const SDGSection: React.FC = () => {
  const sdgs = [
    {
      number: 3,
      name: 'Good Health and Well-Being',
      description: 'Ensuring healthy lives and promoting well-being for all at all ages',
      color: 'bg-green-600',
    },
    {
      number: 4,
      name: 'Quality Education',
      description: 'Ensuring inclusive and equitable quality education and promoting lifelong learning',
      color: 'bg-red-600',
    },
    {
      number: 10,
      name: 'Reduced Inequalities',
      description: 'Reducing inequality within and among countries',
      color: 'bg-pink-600',
    },
  ]

  const esgCommitments = [
    {
      category: 'Environmental',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      commitments: [
        'Digital-first approach reduces paper waste',
        'Promoting active transportation and outdoor activities',
      ],
    },
    {
      category: 'Social',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      commitments: [
        'Free access to underserved communities',
        'Inclusive design for all abilities and backgrounds',
        'Multilingual adaptability for diverse populations',
      ],
    },
    {
      category: 'Governance',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      commitments: [
        'Transparent operations and impact reporting',
        'Evidence-based program development',
        'Ethical data handling and privacy protection',
      ],
    },
  ]

  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* UN SDG Alignment */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            UN Sustainable Development Goals
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            AFYA aligns with the United Nations&apos; global framework for a better future
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {sdgs.map((sdg) => (
            <div
              key={sdg.number}
              className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
            >
              <div className={`${sdg.color} px-6 py-4 text-white`}>
                <div className="text-3xl font-bold">SDG {sdg.number}</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{sdg.name}</h3>
                <p className="mt-3 text-gray-600">{sdg.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ESG Commitments */}
        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              ESG Commitments
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Our commitment to Environmental, Social, and Governance excellence
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {esgCommitments.map((item) => (
              <div
                key={item.category}
                className="rounded-lg bg-white p-8 shadow-sm"
              >
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                    {item.icon}
                  </div>
                  <h3 className="ml-4 text-xl font-semibold text-gray-900">{item.category}</h3>
                </div>
                <ul className="mt-6 space-y-3">
                  {item.commitments.map((commitment, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="mt-1 h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="ml-3 text-gray-600">{commitment}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
