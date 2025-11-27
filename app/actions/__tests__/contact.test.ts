import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitContactForm } from '../contact'

// Mock dependencies
vi.mock('@/lib/db', () => ({
  prisma: {
    contactSubmission: {
      create: vi.fn(),
    },
  },
}))

vi.mock('@/lib/logging', () => ({
  logFormSubmission: vi.fn(),
}))

vi.mock('@/lib/email', () => ({
  sendContactFormNotification: vi.fn(),
  sendContactFormConfirmation: vi.fn(),
}))

describe('Contact Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('submitContactForm', () => {
    it('should validate and accept correct contact form data', async () => {
      const { prisma } = await import('@/lib/db')
      
      vi.mocked(prisma.contactSubmission.create).mockResolvedValue({
        id: 'test-id',
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message',
        createdAt: new Date(),
      })

      const result = await submitContactForm({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message',
      })

      expect(result.success).toBe(true)
      expect(prisma.contactSubmission.create).toHaveBeenCalled()
    })

    it('should reject invalid email', async () => {
      const result = await submitContactForm({
        name: 'John Doe',
        email: 'invalid-email',
        subject: 'Test',
        message: 'Test message',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('email')
    })

    it('should reject short message', async () => {
      const result = await submitContactForm({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Short',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('10 characters')
    })

    it('should reject missing required fields', async () => {
      const result = await submitContactForm({
        name: '',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Test message here',
      })

      expect(result.success).toBe(false)
      expect(result.error).toBeTruthy()
    })
  })
})
