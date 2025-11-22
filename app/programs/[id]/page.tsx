import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { PublicLayout } from '@/components/layouts/public-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { programQueries } from '@/lib/db/queries'

export const dynamic = 'force-dynamic'

interface ProgramDetailPageProps {
  params: {
    id: string
  }
}

const intensityColors = {
  BEGINNER: 'bg-green-100 text-green-800 border-green-200',
  INTERMEDIATE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  ADVANCED: 'bg-orange-100 text-orange-800 border-orange-200',
  ELITE: 'bg-red-100 text-red-800 border-red-200',
}

const typeLabels: Record<string, string> = {
  FITNESS: 'Fitness',
  NUTRITION: 'Nutrition',
  WELLNESS: 'Wellness',
  YOUTH: 'Youth',
  RECOVERY: 'Recovery',
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  let program
  
  try {
    program = await programQueries.findById(params.id)
  } catch (error) {
    console.error('Error fetching program:', error)
    notFound()
  }

  if (!program || !program.published) {
    notFound()
  }

  const intensityColor = intensityColors[program.intensity as keyof typeof intensityColors] || 'bg-gray-100 text-gray-800 border-gray-200'
  const typeLabel = typeLabels[program.type] || program.type

  return (
    <PublicLayout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link href="/" className="text-gray-500 hover:text-gray-700">
                    Home
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li>
                  <Link href="/programs" className="text-gray-500 hover:text-gray-700">
                    Programs
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li className="text-gray-900 font-medium">{program.name}</li>
              </ol>
            </nav>

            <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-start">
              {/* Image */}
              <div className="mb-8 lg:mb-0">
                {program.imageUrl ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-200 shadow-lg">
                    <Image
                      src={program.imageUrl}
                      alt={program.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg flex items-center justify-center">
                    <svg className="h-24 w-24 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium border ${intensityColor}`}>
                    {program.intensity.charAt(0) + program.intensity.slice(1).toLowerCase()}
                  </span>
                  <span className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    {typeLabel}
                  </span>
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
                  {program.name}
                </h1>

                <div className="flex items-center gap-6 mb-8 text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-lg">{program.duration}</span>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none mb-8">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {program.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/start" className="flex-1">
                    <Button size="lg" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/programs" className="flex-1">
                    <Button size="lg" variant="outline" className="w-full">
                      Browse Programs
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Science-Backed</h3>
                  </div>
                  <p className="text-gray-600">
                    All our programs are based on evidence-based research and proven methodologies
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Personalized</h3>
                  </div>
                  <p className="text-gray-600">
                    Tailored to your unique goals, fitness level, and lifestyle preferences
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Expert Support</h3>
                  </div>
                  <p className="text-gray-600">
                    Guided by certified professionals with advanced degrees in exercise science
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Take the first step towards a happier, healthier you. Schedule your discovery call today.
            </p>
            <Link href="/start">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
