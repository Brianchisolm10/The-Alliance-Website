import * as React from 'react'

export const FounderSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Meet Our Founder
          </h2>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Founder Image Placeholder */}
          <div className="flex items-center justify-center">
            <div className="relative h-96 w-full overflow-hidden rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-blue-600 text-white">
                    <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">Founder Photo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Founder Bio */}
          <div className="flex flex-col justify-center">
            <h3 className="text-3xl font-bold text-gray-900">Brian L Chisolm II</h3>
            <p className="mt-2 text-xl text-blue-600">Founder & CEO</p>
            
            <div className="mt-6 space-y-4 text-lg text-gray-600">
              <p>
                Brian L Chisolm II is a passionate advocate for health equity and accessible 
                wellness education. With a Master&apos;s degree in Exercise Science, Brian combines 
                academic rigor with real-world experience to create programs that truly make 
                a difference.
              </p>
              <p>
                His vision for AFYA was born from witnessing the stark disparities in access 
                to quality fitness and nutrition resources. Brian recognized that elite-level 
                wellness education shouldn&apos;t be a luxury—it should be a right accessible to 
                everyone, regardless of their background or circumstances.
              </p>
              <p>
                Through AFYA, Brian is building a platform that leverages automation and 
                technology to scale personalized wellness programs while maintaining the 
                human touch that makes transformation possible. His commitment to 
                evidence-based practices, combined with a deep understanding of community 
                needs, drives AFYA&apos;s mission forward.
              </p>
            </div>

            {/* Credentials */}
            <div className="mt-8 rounded-lg bg-blue-50 p-6">
              <h4 className="text-lg font-semibold text-gray-900">Credentials & Expertise</h4>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="ml-3 text-gray-700">Master&apos;s Degree in Exercise Science</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="ml-3 text-gray-700">Evidence-Based Program Development</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="ml-3 text-gray-700">Community Health & Wellness Advocacy</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="ml-3 text-gray-700">Technology-Driven Wellness Solutions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
