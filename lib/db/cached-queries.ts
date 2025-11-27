/**
 * Cached query wrappers for frequently accessed data
 * Uses in-memory caching to reduce database load
 */

import { withCache, CacheTTL, invalidateCache } from '@/lib/cache'
import { programQueries, productQueries, testimonialQueries, statsQueries } from './queries'

/**
 * Cached Program Queries
 */
export const cachedProgramQueries = {
  /**
   * Get all published programs (cached for 10 minutes)
   */
  findPublished: async () => {
    return withCache(
      'programs:published',
      () => programQueries.findPublished(),
      CacheTTL.TEN_MINUTES
    )
  },

  /**
   * Get featured programs (cached for 10 minutes)
   */
  findFeatured: async () => {
    return withCache(
      'programs:featured',
      () => programQueries.findFeatured(),
      CacheTTL.TEN_MINUTES
    )
  },

  /**
   * Get program by ID (cached for 5 minutes)
   */
  findById: async (id: string) => {
    return withCache(
      `program:${id}`,
      () => programQueries.findById(id),
      CacheTTL.FIVE_MINUTES
    )
  },

  /**
   * Invalidate all program caches
   */
  invalidate: () => {
    invalidateCache('programs:')
    invalidateCache('program:')
  },
}

/**
 * Cached Product Queries
 */
export const cachedProductQueries = {
  /**
   * Get all published products (cached for 5 minutes)
   */
  findPublished: async () => {
    return withCache(
      'products:published',
      () => productQueries.findPublished(),
      CacheTTL.FIVE_MINUTES
    )
  },

  /**
   * Get product by ID (cached for 5 minutes)
   */
  findById: async (id: string) => {
    return withCache(
      `product:${id}`,
      () => productQueries.findById(id),
      CacheTTL.FIVE_MINUTES
    )
  },

  /**
   * Invalidate all product caches
   */
  invalidate: () => {
    invalidateCache('products:')
    invalidateCache('product:')
  },
}

/**
 * Cached Testimonial Queries
 */
export const cachedTestimonialQueries = {
  /**
   * Get all published testimonials (cached for 10 minutes)
   */
  findPublished: async () => {
    return withCache(
      'testimonials:published',
      () => testimonialQueries.findPublished(),
      CacheTTL.TEN_MINUTES
    )
  },

  /**
   * Get featured testimonials (cached for 10 minutes)
   */
  findFeatured: async () => {
    return withCache(
      'testimonials:featured',
      () => testimonialQueries.findFeatured(),
      CacheTTL.TEN_MINUTES
    )
  },

  /**
   * Invalidate all testimonial caches
   */
  invalidate: () => {
    invalidateCache('testimonials:')
  },
}

/**
 * Cached Stats Queries
 */
export const cachedStatsQueries = {
  /**
   * Get community stats (cached for 30 minutes)
   */
  getCommunityStats: async () => {
    return withCache(
      'stats:community',
      () => statsQueries.getCommunityStats(),
      CacheTTL.THIRTY_MINUTES
    )
  },

  /**
   * Invalidate stats cache
   */
  invalidate: () => {
    invalidateCache('stats:')
  },
}

/**
 * Invalidate all caches
 * Use this when making bulk changes or during deployments
 */
export function invalidateAllCaches() {
  cachedProgramQueries.invalidate()
  cachedProductQueries.invalidate()
  cachedTestimonialQueries.invalidate()
  cachedStatsQueries.invalidate()
}
