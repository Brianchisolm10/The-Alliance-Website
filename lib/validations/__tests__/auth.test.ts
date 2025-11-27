import { describe, it, expect } from 'vitest'
import {
  loginSchema,
  resetRequestSchema,
  resetPasswordSchema,
  setupAccountSchema,
} from '../auth'

describe('Auth Validations', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const data = {
        email: 'test@example.com',
        password: 'password123',
      }
      const result = loginSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const data = {
        email: 'invalid-email',
        password: 'password123',
      }
      const result = loginSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject missing password', () => {
      const data = {
        email: 'test@example.com',
        password: '',
      }
      const result = loginSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('resetRequestSchema', () => {
    it('should validate correct email', () => {
      const data = { email: 'test@example.com' }
      const result = resetRequestSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const data = { email: 'not-an-email' }
      const result = resetRequestSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('resetPasswordSchema', () => {
    it('should validate correct reset data', () => {
      const data = {
        token: 'valid-token-123',
        password: 'newpassword123',
        confirmPassword: 'newpassword123',
      }
      const result = resetPasswordSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject short password', () => {
      const data = {
        token: 'valid-token-123',
        password: 'short',
        confirmPassword: 'short',
      }
      const result = resetPasswordSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject mismatched passwords', () => {
      const data = {
        token: 'valid-token-123',
        password: 'password123',
        confirmPassword: 'different123',
      }
      const result = resetPasswordSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('confirmPassword')
      }
    })

    it('should reject missing token', () => {
      const data = {
        token: '',
        password: 'password123',
        confirmPassword: 'password123',
      }
      const result = resetPasswordSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('setupAccountSchema', () => {
    it('should validate correct setup data', () => {
      const data = {
        token: 'setup-token-123',
        password: 'password123',
        confirmPassword: 'password123',
        name: 'John Doe',
      }
      const result = setupAccountSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject missing name', () => {
      const data = {
        token: 'setup-token-123',
        password: 'password123',
        confirmPassword: 'password123',
        name: '',
      }
      const result = setupAccountSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject short password', () => {
      const data = {
        token: 'setup-token-123',
        password: 'short',
        confirmPassword: 'short',
        name: 'John Doe',
      }
      const result = setupAccountSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject mismatched passwords', () => {
      const data = {
        token: 'setup-token-123',
        password: 'password123',
        confirmPassword: 'different123',
        name: 'John Doe',
      }
      const result = setupAccountSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })
})
