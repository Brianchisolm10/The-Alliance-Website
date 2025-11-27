'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface CsrfContextType {
  token: string | null
  refreshToken: () => Promise<void>
}

const CsrfContext = createContext<CsrfContextType>({
  token: null,
  refreshToken: async () => {},
})

export function useCsrf() {
  return useContext(CsrfContext)
}

export function CsrfProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)

  const refreshToken = async () => {
    try {
      const response = await fetch('/api/csrf')
      if (response.ok) {
        const data = await response.json()
        setToken(data.token)
      }
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error)
    }
  }

  useEffect(() => {
    refreshToken()
  }, [])

  return (
    <CsrfContext.Provider value={{ token, refreshToken }}>
      {children}
    </CsrfContext.Provider>
  )
}
