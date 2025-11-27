import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Program {
  id: string
  name: string
  description: string
  type: string
  intensity: string
  duration: string
  imageUrl: string | null
}

interface FeaturedProgramsProps {
  programs: Program[]
}

const ProgramCard: React.FC<{ program: Program }> = ({ program }) => {
  const intensityColors = {
    BEGINNER: 'bg-green-100 text-green-800',
    INTERMEDIATE: 'bg-yellow-100 text-yellow-800',
    ADVANCED: 'bg-orange-100 text-orange-800',
    ELITE: 'bg-red-100 text-red-800',
  }

  const intensityColor = intensityColors[program.intensity as keyof typeof intensityColors] || 'bg-gray-100 text-gray-800'

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      {program.imageUrl && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-gray-200">
          <Image
            src={program.imageUrl}
            alt={program.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            quality={85}
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{program.name}</CardTitle>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${intensityColor}`}>
            {program.intensity}
          </span>
        </div>
        <CardDescription className="line-clamp-2">{program.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{program.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="capitalize">{program.type.toLowerCase()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link href={`/programs/${program.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            Learn More
          </Button>
        </Link>
        <Link href="/start" className="flex-1">
          <Button className="w-full">
            Get Started
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export const FeaturedPrograms: React.FC<FeaturedProgramsProps> = ({ programs }) => {
  if (programs.length === 0) {
    return null
  }

  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Featured Programs
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Discover our most popular science-backed wellness programs
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/programs">
            <Button size="lg" variant="outline">
              View All Programs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
