'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface SessionTimeoutWarningProps {
  /**
   * Warning time in milliseconds before session expires
   * Default: 5 minutes (300000ms)
   */
  warningTime?: number
}

/**
 * Component that warns users before their session expires
 * and allows them to extend their session
 */
export function SessionTimeoutWarning({ 
  warningTime = 5 * 60 * 1000 
}: SessionTimeoutWarningProps) {
  const { data: session, update } = useSession()
  const [showWarning, setShowWarning] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const handleExtendSession = async () => {
    try {
      await update()
      setShowWarning(false)
    } catch (error) {
      console.error('Failed to extend session:', error)
    }
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  useEffect(() => {
    if (!session?.user) {
      return
    }

    // Calculate when to show warning
    // Session expires after 30 minutes, show warning 5 minutes before
    const sessionDuration = 30 * 60 * 1000 // 30 minutes
    const warningDelay = sessionDuration - warningTime

    const warningTimer = setTimeout(() => {
      setShowWarning(true)
      setCountdown(Math.floor(warningTime / 1000))
    }, warningDelay)

    return () => {
      clearTimeout(warningTimer)
    }
  }, [session, warningTime])

  useEffect(() => {
    if (!showWarning || countdown <= 0) {
      return
    }

    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Session expired, log out
          handleLogout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(countdownTimer)
    }
  }, [showWarning, countdown])

  if (!showWarning) {
    return null
  }

  const minutes = Math.floor(countdown / 60)
  const seconds = countdown % 60

  return (
    <Dialog open={showWarning} onOpenChange={setShowWarning}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
          <h2 className="text-xl font-semibold mb-4">Session Expiring Soon</h2>
          <p className="text-gray-600 mb-4">
            Your session will expire in{' '}
            <span className="font-semibold text-gray-900">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
            . Would you like to continue your session?
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleLogout}
            >
              Log Out
            </Button>
            <Button
              onClick={handleExtendSession}
            >
              Continue Session
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
