import { NextResponse } from 'next/server'
import { setCsrfToken } from '@/lib/security/csrf'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const token = await setCsrfToken()
    
    return NextResponse.json({ token })
  } catch (error) {
    console.error('CSRF token generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
}
