import dynamic from 'next/dynamic'
import { PublicLayout } from '@/components/layouts/public-layout'
import { HeroSection } from '@/components/home/hero-section'
import { CommunityStats } from '@/components/home/community-stats'
import { cachedStatsQueries, cachedProgramQueries, cachedTestimonialQueries } from '@/lib/db/cached-queries'

// Lazy load non-critical below-the-fold components
const FeaturedPrograms = dynamic(() => import('@/components/home/featured-programs').then(mod => ({ default: mod.FeaturedPrograms })), {
  loading: () => <div className="bg-gray-50 py-16 sm:py-24 min-h-[400px]" />,
})

const ImpactShowcase = dynamic(() => import('@/components/home/impact-showcase').then(mod => ({ default: mod.ImpactShowcase })), {
  loading: () => <div className="bg-white py-16 sm:py-24 min-h-[400px]" />,
})

const TestimonialsCarousel = dynamic(() => import('@/components/home/testimonials-carousel').then(mod => ({ default: mod.TestimonialsCarousel })), {
  loading: () => <div className="bg-white py-16 sm:py-24 min-h-[400px]" />,
})

// Revalidate this page every 10 minutes
export const revalidate = 600

export default async function HomePage() {
  // Fetch data for the home page with error handling
  let stats = { membersServed: 0, programsOffered: 0 }
  let featuredPrograms: any[] = []
  let testimonials: any[] = []

  try {
    const results = await Promise.all([
      cachedStatsQueries.getCommunityStats().catch(() => ({ membersServed: 0, programsOffered: 0 })),
      cachedProgramQueries.findFeatured().catch(() => []),
      cachedTestimonialQueries.findFeatured().catch(() => []),
    ])
    stats = results[0]
    featuredPrograms = results[1]
    testimonials = results[2]
  } catch (error) {
    console.error('Error fetching home page data:', error)
  }

  return (
    <PublicLayout>
      <HeroSection />
      <CommunityStats 
        membersServed={stats.membersServed} 
        programsOffered={stats.programsOffered} 
      />
      <FeaturedPrograms programs={featuredPrograms} />
      <ImpactShowcase />
      <TestimonialsCarousel testimonials={testimonials} />
    </PublicLayout>
  )
}
