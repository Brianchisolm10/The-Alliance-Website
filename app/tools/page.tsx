'use client'

import { PublicLayout } from '@/components/layouts/public-layout'
import Link from 'next/link'
import { useState } from 'react'
import { 
  Calculator, 
  UtensilsCrossed, 
  Heart, 
  Droplets, 
  Baby, 
  Activity,
  Users,
  Dumbbell,
  Brain,
  Stethoscope,
  ExternalLink,
  BookOpen,
  Filter
} from 'lucide-react'

type Category = 'all' | 'nutrition' | 'training' | 'recovery' | 'youth' | 'pregnancy' | 'older-adults' | 'chronic' | 'mental'

interface Tool {
  id: string
  name: string
  description: string
  icon: any
  href: string
  categories: Category[]
  type: 'interactive' | 'external' | 'educational'
  externalUrl?: string
}

const categories = [
  { id: 'all' as Category, name: 'All Tools', icon: Filter },
  { id: 'nutrition' as Category, name: 'Nutrition', icon: UtensilsCrossed },
  { id: 'training' as Category, name: 'Training & Performance', icon: Dumbbell },
  { id: 'recovery' as Category, name: 'Recovery & Injury', icon: Heart },
  { id: 'youth' as Category, name: 'Youth & Teens', icon: Baby },
  { id: 'pregnancy' as Category, name: 'Pregnancy & Postpartum', icon: Users },
  { id: 'older-adults' as Category, name: 'Older Adults', icon: Activity },
  { id: 'chronic' as Category, name: 'Chronic Conditions', icon: Stethoscope },
  { id: 'mental' as Category, name: 'Mental Health', icon: Brain },
]

const tools: Tool[] = [
  // Core AFYA Interactive Tools
  {
    id: 'bmr-tdee',
    name: 'Energy & Protein Needs Calculator',
    description: 'Calculate your BMR, TDEE, and daily protein requirements based on your goals',
    icon: Calculator,
    href: '/tools/bmr-tdee',
    categories: ['nutrition', 'training'],
    type: 'interactive',
  },
  {
    id: 'plate-builder',
    name: 'Plate Builder',
    description: 'Build balanced meals with visual portion guidance for optimal nutrition',
    icon: UtensilsCrossed,
    href: '/tools/plate-builder',
    categories: ['nutrition'],
    type: 'interactive',
  },
  {
    id: 'heart-rate-zones',
    name: 'Heart Rate Zone Calculator',
    description: 'Calculate your personalized heart rate training zones',
    icon: Heart,
    href: '/tools/heart-rate-zones',
    categories: ['training', 'recovery'],
    type: 'interactive',
  },
  {
    id: 'hydration-sleep',
    name: 'Hydration & Sleep Snapshot',
    description: 'Track your daily hydration and sleep patterns for better recovery',
    icon: Droplets,
    href: '/tools/hydration-sleep',
    categories: ['recovery', 'training'],
    type: 'interactive',
  },
  {
    id: 'recovery-checkin',
    name: 'Stress & Recovery Classifier',
    description: 'Assess your recovery status and readiness for training',
    icon: Activity,
    href: '/tools/recovery-checkin',
    categories: ['recovery', 'training', 'mental'],
    type: 'interactive',
  },
  {
    id: 'youth-corner',
    name: 'Youth Activity Guidelines',
    description: 'Age-appropriate health and fitness guidance for young athletes',
    icon: Baby,
    href: '/tools/youth-corner',
    categories: ['youth'],
    type: 'interactive',
  },
  
  // External Resources
  {
    id: 'myplate',
    name: 'USDA MyPlate',
    description: 'Official USDA nutrition guidance and meal planning resources',
    icon: UtensilsCrossed,
    href: '/tools/external',
    externalUrl: 'https://www.myplate.gov',
    categories: ['nutrition'],
    type: 'external',
  },
  {
    id: 'cdc-nutrition',
    name: 'CDC Nutrition Guidelines',
    description: 'Evidence-based nutrition information from the CDC',
    icon: BookOpen,
    href: '/tools/external',
    externalUrl: 'https://www.cdc.gov/nutrition',
    categories: ['nutrition', 'chronic'],
    type: 'external',
  },
  {
    id: 'nih-exercise',
    name: 'NIH Exercise & Fitness',
    description: 'Research-backed exercise guidelines and resources',
    icon: Dumbbell,
    href: '/tools/external',
    externalUrl: 'https://www.nih.gov/health-information/exercise-fitness',
    categories: ['training', 'older-adults'],
    type: 'external',
  },
  {
    id: 'acog-pregnancy',
    name: 'ACOG Pregnancy Exercise',
    description: 'Official guidelines for exercise during pregnancy',
    icon: Users,
    href: '/tools/external',
    externalUrl: 'https://www.acog.org/womens-health/faqs/exercise-during-pregnancy',
    categories: ['pregnancy', 'training'],
    type: 'external',
  },
  {
    id: 'samhsa-mental',
    name: 'SAMHSA Mental Health',
    description: 'Mental health resources and support hotlines',
    icon: Brain,
    href: '/tools/external',
    externalUrl: 'https://www.samhsa.gov/find-help/national-helpline',
    categories: ['mental'],
    type: 'external',
  },
  {
    id: 'ada-diabetes',
    name: 'ADA Diabetes Resources',
    description: 'Comprehensive diabetes management and education',
    icon: Stethoscope,
    href: '/tools/external',
    externalUrl: 'https://diabetes.org',
    categories: ['chronic', 'nutrition'],
    type: 'external',
  },
]

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')

  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.categories.includes(selectedCategory))

  const interactiveTools = filteredTools.filter(t => t.type === 'interactive')
  const externalResources = filteredTools.filter(t => t.type === 'external')

  return (
    <PublicLayout>
      <div className="bg-white min-h-screen">
        {/* Header Section */}
        <div className="bg-gradient-to-b from-blue-50 to-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                AFYA Health Tools & Resources
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                A continuously expanding resource hub with interactive calculators, curated external resources, 
                and educational content for all populations
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto py-4 space-x-2 scrollbar-hide">
              {categories.map((category) => {
                const Icon = category.icon
                const isActive = selectedCategory === category.id
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{category.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 pb-24">
          {/* Interactive Tools Section */}
          {interactiveTools.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center space-x-3 mb-6">
                <Calculator className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Interactive AFYA Tools</h2>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {interactiveTools.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:border-blue-300"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Icon className="h-6 w-6" aria-hidden="true" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {tool.name}
                          </h3>
                          <p className="mt-2 text-sm text-gray-600">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                        Use tool
                        <svg
                          className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {/* External Resources Section */}
          {externalResources.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center space-x-3 mb-6">
                <ExternalLink className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Trusted External Resources</h2>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {externalResources.map((resource) => {
                  const Icon = resource.icon
                  return (
                    <a
                      key={resource.id}
                      href={resource.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:border-green-300"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <Icon className="h-6 w-6" aria-hidden="true" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                            {resource.name}
                          </h3>
                          <p className="mt-2 text-sm text-gray-600">
                            {resource.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-sm font-medium text-green-600 group-hover:text-green-700">
                        Visit resource
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </div>
                    </a>
                  )
                })}
              </div>
            </section>
          )}

          {/* Coming Soon Section */}
          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
            <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">More Tools Coming Soon</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We&apos;re continuously expanding our resource hub with new calculators, assessments, 
              educational content, and curated resources. Check back regularly for updates!
            </p>
          </section>
        </div>
      </div>
    </PublicLayout>
  )
}
