import { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Validation schema for credentials
const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// Simple in-memory rate limiter for auth attempts
const authAttempts = new Map<string, { count: number; resetTime: number }>()

function checkAuthRateLimit(email: string): boolean {
  const now = Date.now()
  const record = authAttempts.get(email)
  
  if (!record || record.resetTime < now) {
    authAttempts.set(email, { count: 1, resetTime: now + 15 * 60 * 1000 })
    return true
  }
  
  if (record.count >= 5) {
    return false
  }
  
  record.count++
  authAttempts.set(email, record)
  return true
}

// Clean up expired entries
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of authAttempts.entries()) {
    if (value.resetTime < now) {
      authAttempts.delete(key)
    }
  }
}, 60000)

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validate credentials
        const validatedFields = credentialsSchema.safeParse(credentials)

        if (!validatedFields.success) {
          return null
        }

        const { email, password } = validatedFields.data

        // Check rate limit
        if (!checkAuthRateLimit(email.toLowerCase())) {
          throw new Error('Too many login attempts. Please try again later.')
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        })

        // Check if user exists and has a password
        if (!user || !user.password) {
          return null
        }

        // Check if user is active
        if (user.status !== 'ACTIVE') {
          return null
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
          return null
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        // Return user object
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as any
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60, // 30 minutes
    updateAge: 5 * 60, // Update session every 5 minutes
  },
  jwt: {
    maxAge: 30 * 60, // 30 minutes
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
