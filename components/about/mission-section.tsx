import * as React from 'react'

export const MissionSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Mission
          </h2>
          <div className="mt-8 space-y-6 text-lg text-gray-600">
            <p className="text-2xl font-semibold text-blue-600">
              &ldquo;A Happier, Healthier You. Your Way.&rdquo;
            </p>
            <p>
              AFYA is on a mission to make elite-level fitness, nutrition, and health education 
              universally accessible. We believe that everyone deserves access to quality wellness 
              resources, regardless of their background or circumstances.
            </p>
            <p>
              Built with the ethos of community, discipline, and joy, AFYA delivers automated, 
              science-backed programs to youth, adults, and educators—rooted in equity, powered 
              by automation, and guided by empathy.
            </p>
          </div>
        </div>

        {/* The Problem We Address */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-red-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-600 text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Health Inequities</h3>
            <p className="mt-2 text-gray-600">
              Rising global health disparities leave underserved communities without access to 
              quality fitness and nutrition resources.
            </p>
          </div>

          <div className="rounded-lg bg-orange-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-600 text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Misinformation</h3>
            <p className="mt-2 text-gray-600">
              Online spaces are dominated by unverified health advice, making it difficult to 
              find evidence-based guidance.
            </p>
          </div>

          <div className="rounded-lg bg-yellow-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-600 text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Limited Access</h3>
            <p className="mt-2 text-gray-600">
              Quality fitness education is often expensive and inaccessible, creating barriers 
              for those who need it most.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
