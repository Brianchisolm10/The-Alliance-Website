'use server'

import { signIn, signOut } from '@/lib/auth'
import { AuthError } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/db'

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export async function login(data: LoginFormData) {
  try {
    const validatedFields = loginSchema.safeParse(data)

    if (!validatedFields.success) {
      return {
        error: 'Invalid fields',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { email, password } = validatedFields.data

    await signIn('credentials', {
      email: email.toLowerCase(),
      password,
      redirect: false,
    })

    // Log activity
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (user) {
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          action: 'LOGIN',
          resource: 'AUTH',
          details: { email },
        },
      })
    }

    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid email or password' }
        default:
          return { error: 'Something went wrong' }
      }
    }
    throw error
  }
}

export async function logout() {
  await signOut({ redirect: false })
}

// Password reset request schema
export const resetRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export type ResetRequestFormData = z.infer<typeof resetRequestSchema>

// Password reset schema
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export async function requestPasswordReset(data: ResetRequestFormData) {
  try {
    const validatedFields = resetRequestSchema.safeParse(data)

    if (!validatedFields.success) {
      return {
        error: 'Invalid email address',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { email } = validatedFields.data

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return { success: true }
    }

    // Generate reset token
    const crypto = await import('crypto')
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // TODO: Send password reset email
    // For now, we'll just log the token (in production, send via email service)
    console.log(`Password reset token for ${email}: ${resetToken}`)
    console.log(`Reset URL: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`)

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'PASSWORD_RESET_REQUEST',
        resource: 'AUTH',
        details: { email },
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Password reset request error:', error)
    return { error: 'Something went wrong' }
  }
}

export async function resetPassword(data: ResetPasswordFormData) {
  try {
    const validatedFields = resetPasswordSchema.safeParse(data)

    if (!validatedFields.success) {
      return {
        error: 'Invalid fields',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { token, password } = validatedFields.data

    // Find user with valid token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return { error: 'Invalid or expired reset token' }
    }

    // Hash new password
    const bcrypt = await import('bcryptjs')
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'PASSWORD_RESET_COMPLETE',
        resource: 'AUTH',
        details: { email: user.email },
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Password reset error:', error)
    return { error: 'Something went wrong' }
  }
}

// Account setup schema
export const setupAccountSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  name: z.string().min(1, 'Name is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export type SetupAccountFormData = z.infer<typeof setupAccountSchema>

export async function setupAccount(data: SetupAccountFormData) {
  try {
    const validatedFields = setupAccountSchema.safeParse(data)

    if (!validatedFields.success) {
      return {
        error: 'Invalid fields',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { token, password, name } = validatedFields.data

    // Find user with valid setup token
    const user = await prisma.user.findFirst({
      where: {
        setupToken: token,
        setupTokenExpiry: {
          gt: new Date(),
        },
        status: 'PENDING',
      },
    })

    if (!user) {
      return { error: 'Invalid or expired setup token' }
    }

    // Hash password
    const bcrypt = await import('bcryptjs')
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user account
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        password: hashedPassword,
        status: 'ACTIVE',
        setupToken: null,
        setupTokenExpiry: null,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'ACCOUNT_SETUP_COMPLETE',
        resource: 'AUTH',
        details: { email: user.email },
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Account setup error:', error)
    return { error: 'Something went wrong' }
  }
}
