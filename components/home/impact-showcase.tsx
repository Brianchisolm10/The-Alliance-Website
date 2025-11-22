import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const impactMetrics = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    label: 'Communities Served',
    value: '5+',
    description: 'States across the U.S.',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Success Rate',
    value: '95%',
    description: 'Client satisfaction',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    label: 'Free Access',
    value: '100%',
    description: 'For underserved communities',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    label: 'Evidence-Based',
    value: '100%',
    description: 'Science-backed programs',
  },
]

export const ImpactShowcase: React.FC = () => {
  return (
    <section className="bg-blue-900 py-16 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Making an Impact
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Committed to health equity and accessible wellness for all
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {impactMetrics.map((metric, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-800 text-blue-200">
                {metric.icon}
              </div>
              <div className="mt-4 text-4xl font-bold">{metric.value}</div>
              <div className="mt-2 text-lg font-medium">{metric.label}</div>
              <div className="mt-1 text-sm text-blue-200">{metric.description}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-blue-800 p-8 text-center sm:p-12">
          <h3 className="text-2xl font-bold sm:text-3xl">
            Aligned with UN Sustainable Development Goals
          </h3>
          <p className="mt-4 text-lg text-blue-100">
            Supporting SDG 3 (Good Health), SDG 4 (Quality Education), and SDG 10 (Reduced Inequalities)
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/impact">
              <Button size="lg" className="!bg-white !text-blue-900 hover:!bg-blue-50 font-semibold">
                Learn About Our Impact
              </Button>
            </Link>
            <Link href="/impact/donate">
              <Button size="lg" className="!bg-transparent !border-2 !border-white !text-white hover:!bg-white hover:!text-blue-900 font-semibold transition-colors">
                Support Our Mission
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
