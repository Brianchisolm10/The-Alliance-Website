import { PublicLayout } from '@/components/layouts/public-layout'
import { ProgramsGrid } from '@/components/programs/programs-grid'
import { ProgramFilters } from '@/components/programs/program-filters'
import { MobileFilters } from '@/components/programs/mobile-filters'
import { cachedProgramQueries } from '@/lib/db/cached-queries'

// Revalidate this page every 10 minutes
export const revalidate = 600

export default async function ProgramsPage() {
  let programs: any[] = []
  
  try {
    programs = await cachedProgramQueries.findPublished()
  } catch (error) {
    console.error('Error fetching programs:', error)
  }

  return (
    <PublicLayout>
      <div className="bg-white">
        {/* Header Section */}
        <div className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Wellness Programs
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our science-backed programs designed to help you achieve your health and fitness goals
              </p>
            </div>
          </div>
        </div>

        {/* Programs Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Mobile Filters */}
          <div className="lg:hidden mb-6">
            <MobileFilters />
          </div>

          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Filters Sidebar */}
            <aside className="hidden lg:block">
              <ProgramFilters />
            </aside>

            {/* Programs Grid */}
            <div className="lg:col-span-3">
              <ProgramsGrid programs={programs} />
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
