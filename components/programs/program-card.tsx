'use client'

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

interface ProgramCardProps {
  program: Program
}

const intensityColors = {
  BEGINNER: 'bg-green-100 text-green-800',
  INTERMEDIATE: 'bg-yellow-100 text-yellow-800',
  ADVANCED: 'bg-orange-100 text-orange-800',
  ELITE: 'bg-red-100 text-red-800',
}

const typeLabels: Record<string, string> = {
  FITNESS: 'Fitness',
  NUTRITION: 'Nutrition',
  WELLNESS: 'Wellness',
  YOUTH: 'Youth',
  RECOVERY: 'Recovery',
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  const intensityColor = intensityColors[program.intensity as keyof typeof intensityColors] || 'bg-gray-100 text-gray-800'
  const typeLabel = typeLabels[program.type] || program.type

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      {program.imageUrl ? (
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-gray-200">
          <Image
            src={program.imageUrl}
            alt={program.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <svg className="h-16 w-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl line-clamp-1">{program.name}</CardTitle>
          <span className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${intensityColor}`}>
            {program.intensity.charAt(0) + program.intensity.slice(1).toLowerCase()}
          </span>
        </div>
        <CardDescription className="line-clamp-3">{program.description}</CardDescription>
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
            <span>{typeLabel}</span>
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
