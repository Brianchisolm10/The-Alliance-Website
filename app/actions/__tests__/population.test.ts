import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getUserPopulation } from '../population'

// Mock dependencies
vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    activityLog: {
      create: vi.fn(),
    },
    clientNote: {
      create: vi.fn(),
    },
    discoverySubmission: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}))

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Population Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getUserPopulation', () => {
    it('should return user population when authenticated', async () => {
      const { auth } = await import('@/lib/auth')
      const { prisma } = await import('@/lib/db')

      vi.mocked(auth).mockResolvedValue({
        user: { id: 'user-123', email: 'test@example.com', role: 'USER' },
      } as any)

      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'user-123',
        population: 'ATHLETE',
      } as any)

      const result = await getUserPopulation()

      expect(result.success).toBe(true)
      expect(result.population).toBe('ATHLETE')
    })

    it('should return error when not authenticated', async () => {
      const { auth } = await import('@/lib/auth')

      vi.mocked(auth).mockResolvedValue(null as any)

      const result = await getUserPopulation()

      expect(result.error).toBe('Not authenticated')
    })

    it('should return error when user not found', async () => {
      const { auth } = await import('@/lib/auth')
      const { prisma } = await import('@/lib/db')

      vi.mocked(auth).mockResolvedValue({
        user: { id: 'user-123', email: 'test@example.com', role: 'USER' },
      } as any)

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

      const result = await getUserPopulation()

      expect(result.error).toBe('User not found')
    })
  })
})
