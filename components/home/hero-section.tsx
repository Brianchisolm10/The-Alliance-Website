import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white" aria-label="Hero section">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            A Happier, Healthier You.
            <span className="block text-blue-200">Your Way.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-blue-100">
            Making elite-level fitness, nutrition, and health education universally accessible.
            Science-backed programs rooted in equity, powered by automation, and guided by empathy.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/start">
              <Button size="lg" className="!bg-white !text-blue-700 hover:!bg-blue-50 focus-visible:ring-white text-lg px-8 py-6 h-auto font-semibold">
                Start Your Journey
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" className="!bg-transparent !border-2 !border-white !text-white hover:!bg-white hover:!text-blue-700 focus-visible:ring-white text-lg px-8 py-6 h-auto font-semibold transition-colors">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-400 opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-300 opacity-20 blur-3xl" />
      </div>
    </section>
  )
}
