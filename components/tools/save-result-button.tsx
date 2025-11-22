'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { saveToolResult } from '@/app/actions/tools'
import { Save, Check } from 'lucide-react'
import Link from 'next/link'

interface SaveResultButtonProps {
  toolName: string
  data: any
  disabled?: boolean
}

export function SaveResultButton({ toolName, data, disabled }: SaveResultButtonProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user is authenticated by trying to save (the server action will check)
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(session => {
        setIsAuthenticated(!!session?.user)
      })
      .catch(() => {
        setIsAuthenticated(false)
      })
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await saveToolResult(toolName, data)
      if (result.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        alert(result.error || 'Failed to save result')
      }
    } catch {
      alert('Failed to save result')
    } finally {
      setIsSaving(false)
    }
  }

  if (isAuthenticated === null) {
    return null
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>Want to save your results?</span>
        <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Log in
        </Link>
      </div>
    )
  }

  return (
    <Button
      onClick={handleSave}
      disabled={disabled || isSaving || saved}
      variant={saved ? 'default' : 'outline'}
      size="sm"
      className="min-w-[120px]"
    >
      {saved ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Saved!
        </>
      ) : (
        <>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Result'}
        </>
      )}
    </Button>
  )
}
