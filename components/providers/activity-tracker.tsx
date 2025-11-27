'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useRef, useCallback } from 'react'

interface ActivityTrackerProps {
  /**
   * Timeout in milliseconds before considering user inactive
   * Default: 25 minutes (1500000ms) - 5 minutes before session expires
   */
  timeout?: number
  /**
   * Callback when user becomes inactive
   */
  onInactive?: () => void
}

/**
 * Component that tracks user activity and can trigger actions on inactivity
 * Useful for warning users before session expires
 */
export function ActivityTracker({ 
  timeout = 25 * 60 * 1000,
  onInactive 
}: ActivityTrackerProps) {
  const { data: session, update } = useSession()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const lastActivityRef = useRef<number>(Date.now())

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now()
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      if (onInactive) {
        onInactive()
      }
    }, timeout)
  }, [timeout, onInactive])

  const handleActivity = useCallback(() => {
    // Only track activity if user is logged in
    if (!session?.user) {
      return
    }

    const now = Date.now()
    const timeSinceLastActivity = now - lastActivityRef.current

    // If more than 1 minute since last activity, refresh session
    if (timeSinceLastActivity > 60 * 1000) {
      update().catch(console.error)
    }

    resetTimer()
  }, [session, update, resetTimer])

  useEffect(() => {
    // Only set up tracking if user is logged in
    if (!session?.user) {
      return
    }

    // Events to track
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true })
    })

    // Initialize timer
    resetTimer()

    // Clean up
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [session, handleActivity, resetTimer])

  return null
}
