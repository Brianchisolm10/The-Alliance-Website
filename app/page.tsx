import { PublicLayout } from '@/components/layouts/public-layout'
import { HeroSection } from '@/components/home/hero-section'
import { CommunityStats } from '@/components/home/community-stats'
import { FeaturedPrograms } from '@/components/home/featured-programs'
import { ImpactShowcase } from '@/components/home/impact-showcase'
import { TestimonialsCarousel } from '@/components/home/testimonials-carousel'
import { statsQueries, programQueries, testimonialQueries } from '@/lib/db/queries'

export default async function HomePage() {
  // Fetch data for the home page with error handling
  let stats = { membersServed: 0, programsOffered: 0 }
  let featuredPrograms: any[] = []
  let testimonials: any[] = []

  try {
    const results = await Promise.all([
      statsQueries.getCommunityStats().catch(() => ({ membersServed: 0, programsOffered: 0 })),
      programQueries.findFeatured().catch(() => []),
      testimonialQueries.findFeatured().catch(() => []),
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
