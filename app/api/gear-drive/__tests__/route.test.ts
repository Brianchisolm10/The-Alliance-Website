import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST, GET } from '../route'
import { NextRequest } from 'next/server'

// Mock dependencies
vi.mock('@/lib/db', () => ({
  prisma: {
    gearDrive: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}))

vi.mock('@/lib/email', () => ({
  sendGearDriveConfirmationEmail: vi.fn().mockResolvedValue({ success: true }),
}))

describe('Gear Drive API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/gear-drive', () => {
    it('should create gear drive submission with valid data', async () => {
      const { prisma } = await import('@/lib/db')

      vi.mocked(prisma.gearDrive.create).mockResolvedValue({
        id: 'gear-123',
        name: 'John Doe',
        email: 'john@example.com',
        items: [{ name: 'Soccer Ball', category: 'Equipment', quantity: 2 }],
        condition: 'Good',
        preference: 'Drop-off',
        notes: null,
        status: 'SUBMITTED',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const request = new NextRequest('http://localhost:3000/api/gear-drive', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          items: [
            {
              name: 'Soccer Ball',
              category: 'Equipment',
              quantity: 2,
            },
          ],
          condition: 'Good',
          preference: 'Drop-off',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.id).toBe('gear-123')
      expect(prisma.gearDrive.create).toHaveBeenCalled()
    })

    it('should reject invalid email', async () => {
      const request = new NextRequest('http://localhost:3000/api/gear-drive', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'invalid-email',
          items: [{ name: 'Ball', category: 'Equipment', quantity: 1 }],
          condition: 'Good',
          preference: 'Drop-off',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('email')
    })

    it('should reject empty items array', async () => {
      const request = new NextRequest('http://localhost:3000/api/gear-drive', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          items: [],
          condition: 'Good',
          preference: 'Drop-off',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('item')
    })
  })

  describe('GET /api/gear-drive', () => {
    it('should return all gear drive submissions', async () => {
      const { prisma } = await import('@/lib/db')

      const mockGearDrives = [
        {
          id: 'gear-1',
          name: 'John Doe',
          email: 'john@example.com',
          items: [],
          condition: 'Good',
          preference: 'Drop-off',
          notes: null,
          status: 'SUBMITTED',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      vi.mocked(prisma.gearDrive.findMany).mockResolvedValue(mockGearDrives as any)

      const request = new NextRequest('http://localhost:3000/api/gear-drive')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveLength(1)
      expect(data[0].id).toBe('gear-1')
    })

    it('should filter by status', async () => {
      const { prisma } = await import('@/lib/db')

      vi.mocked(prisma.gearDrive.findMany).mockResolvedValue([])

      const request = new NextRequest(
        'http://localhost:3000/api/gear-drive?status=SUBMITTED'
      )
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(prisma.gearDrive.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'SUBMITTED' },
        })
      )
    })
  })
})
