/**
 * Custom React Hook for Mobile Detection and Responsive Behavior
 */

'use client'

import { useState, useEffect } from 'react'
import { debounce, isMobileViewport, isTabletViewport, isDesktopViewport, isTouchDevice } from '@/lib/utils/mobile'

interface UseMobileReturn {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isTouch: boolean
  width: number
  height: number
}

/**
 * Hook to detect mobile viewport and device characteristics
 */
export function useMobile(): UseMobileReturn {
  const [state, setState] = useState<UseMobileReturn>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouch: false,
    width: 1024,
    height: 768,
  })

  useEffect(() => {
    // Initial check
    const updateState = () => {
      setState({
        isMobile: isMobileViewport(),
        isTablet: isTabletViewport(),
        isDesktop: isDesktopViewport(),
        isTouch: isTouchDevice(),
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateState()

    // Listen for resize events
    const debouncedUpdate = debounce(updateState, 150)
    window.addEventListener('resize', debouncedUpdate)

    return () => {
      window.removeEventListener('resize', debouncedUpdate)
    }
  }, [])

  return state
}

/**
 * Hook to detect if viewport matches a specific breakpoint
 */
export function useBreakpoint(breakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl'): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const breakpoints = {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    }

    const query = window.matchMedia(`(min-width: ${breakpoints[breakpoint]}px)`)
    
    const updateMatch = () => setMatches(query.matches)
    updateMatch()

    // Modern browsers
    if (query.addEventListener) {
      query.addEventListener('change', updateMatch)
      return () => query.removeEventListener('change', updateMatch)
    } else {
      // Fallback for older browsers
      query.addListener(updateMatch)
      return () => query.removeListener(updateMatch)
    }
  }, [breakpoint])

  return matches
}

/**
 * Hook to detect orientation
 */
export function useOrientation(): 'portrait' | 'landscape' {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }

    updateOrientation()

    const debouncedUpdate = debounce(updateOrientation, 150)
    window.addEventListener('resize', debouncedUpdate)

    return () => {
      window.removeEventListener('resize', debouncedUpdate)
    }
  }, [])

  return orientation
}

/**
 * Hook to detect if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    const updatePreference = () => setPrefersReducedMotion(query.matches)
    updatePreference()

    if (query.addEventListener) {
      query.addEventListener('change', updatePreference)
      return () => query.removeEventListener('change', updatePreference)
    } else {
      query.addListener(updatePreference)
      return () => query.removeListener(updatePreference)
    }
  }, [])

  return prefersReducedMotion
}
