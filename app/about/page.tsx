import * as React from 'react'
import { PublicLayout } from '@/components/layouts/public-layout'
import { MissionSection } from '@/components/about/mission-section'
import { ValuesSection } from '@/components/about/values-section'
import { TractionSection } from '@/components/about/traction-section'
import { SDGSection } from '@/components/about/sdg-section'
import { FounderSection } from '@/components/about/founder-section'
import { PartnershipsSection } from '@/components/about/partnerships-section'

export const metadata = {
  title: 'About AFYA | Making Wellness Accessible',
  description: 'Learn about AFYA\'s mission to make elite-level fitness, nutrition, and health education universally accessible through science-backed programs rooted in equity.',
}

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                About AFYA
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-blue-100">
                Building a healthier, happier world through accessible wellness education
              </p>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <MissionSection />
        <ValuesSection />
        <TractionSection />
        <SDGSection />
        <FounderSection />
        <PartnershipsSection />
      </div>
    </PublicLayout>
  )
}
