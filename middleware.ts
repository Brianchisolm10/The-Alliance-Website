import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Get the session token
  const token = await getToken({ 
    req, 
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET 
  })
  const isLoggedIn = !!token

  // Public routes that don't require authentication
  const isPublicRoute =
    pathname === '/' ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/programs') ||
    pathname.startsWith('/tools') ||
    pathname.startsWith('/shop') ||
    pathname.startsWith('/impact') ||
    pathname.startsWith('/start') ||
    pathname.startsWith('/contact') ||
    pathname === '/login' ||
    pathname.startsWith('/setup') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/csrf')

  // Protected admin routes
  const isAdminRoute = pathname.startsWith('/admin')

  // Redirect to login if accessing protected route while not logged in
  if (!isPublicRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if accessing login while logged in
  if (pathname === '/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Check admin access
  if (isAdminRoute && isLoggedIn) {
    const userRole = token?.role
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // Create response
  const response = NextResponse.next()

  // Add security headers to response
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
