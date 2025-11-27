'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useRef } from 'react'

interface SessionRefreshProps {
  /**
   * Interval in milliseconds to check and refresh session
   * Default: 5 minutes (300000ms)
   */
  interval?: number
}

/**
 * Component that automatically refreshes the session before it expires
 * Should be included in the root layout for authenticated pages
 */
export function SessionRefresh({ interval = 5 * 60 * 1000 }: SessionRefreshProps) {
  const { data: session, update } = useSession()
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Only set up refresh if user is logged in
    if (!session?.user) {
      return
    }

    // Function to refresh session
    const refreshSession = async () => {
      try {
        // Trigger session update
        await update()
      } catch (error) {
        console.error('Failed to refresh session:', error)
      }
    }

    // Set up interval to refresh session
    intervalRef.current = setInterval(refreshSession, interval)

    // Clean up on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [session, update, interval])

  // This component doesn't render anything
  return null
}
