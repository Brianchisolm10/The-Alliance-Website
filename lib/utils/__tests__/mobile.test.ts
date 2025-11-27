import { describe, it, expect } from 'vitest'
import {
  isMobileDevice,
  getViewportWidth,
  getViewportHeight,
  isMobileViewport,
  isTabletViewport,
  isDesktopViewport,
  debounce,
  getOptimalImageSize,
  formatBytes,
} from '../mobile'

describe('Mobile Utils', () => {
  describe('isMobileDevice', () => {
    it('should detect mobile user agent', () => {
      const originalUserAgent = navigator.userAgent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      })
      expect(isMobileDevice()).toBe(true)
      Object.defineProperty(navigator, 'userAgent', {
        value: originalUserAgent,
        configurable: true,
      })
    })
  })

  describe('getViewportWidth', () => {
    it('should return viewport width', () => {
      const width = getViewportWidth()
      expect(width).toBeGreaterThan(0)
      expect(typeof width).toBe('number')
    })
  })

  describe('getViewportHeight', () => {
    it('should return viewport height', () => {
      const height = getViewportHeight()
      expect(height).toBeGreaterThan(0)
      expect(typeof height).toBe('number')
    })
  })

  describe('isMobileViewport', () => {
    it('should detect mobile viewport', () => {
      const result = isMobileViewport()
      expect(typeof result).toBe('boolean')
    })
  })

  describe('isTabletViewport', () => {
    it('should detect tablet viewport', () => {
      const result = isTabletViewport()
      expect(typeof result).toBe('boolean')
    })
  })

  describe('isDesktopViewport', () => {
    it('should detect desktop viewport', () => {
      const result = isDesktopViewport()
      expect(typeof result).toBe('boolean')
    })
  })

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      let callCount = 0
      const fn = () => callCount++
      const debounced = debounce(fn, 100)

      debounced()
      debounced()
      debounced()

      expect(callCount).toBe(0)

      await new Promise((resolve) => setTimeout(resolve, 150))
      expect(callCount).toBe(1)
    })

    it('should pass arguments to debounced function', async () => {
      let result = 0
      const fn = (a: number, b: number) => {
        result = a + b
      }
      const debounced = debounce(fn, 50)

      debounced(5, 10)

      await new Promise((resolve) => setTimeout(resolve, 100))
      expect(result).toBe(15)
    })
  })

  describe('getOptimalImageSize', () => {
    it('should return small for narrow viewports', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      })
      expect(getOptimalImageSize()).toBe('small')
    })

    it('should return medium for tablet viewports', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      })
      expect(getOptimalImageSize()).toBe('medium')
    })

    it('should return large for desktop viewports', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      })
      expect(getOptimalImageSize()).toBe('large')
    })
  })

  describe('formatBytes', () => {
    it('should format 0 bytes', () => {
      expect(formatBytes(0)).toBe('0 Bytes')
    })

    it('should format bytes', () => {
      expect(formatBytes(500)).toBe('500 Bytes')
    })

    it('should format kilobytes', () => {
      expect(formatBytes(1024)).toBe('1 KB')
    })

    it('should format megabytes', () => {
      expect(formatBytes(1048576)).toBe('1 MB')
    })

    it('should format gigabytes', () => {
      expect(formatBytes(1073741824)).toBe('1 GB')
    })

    it('should respect decimal places', () => {
      expect(formatBytes(1536, 1)).toBe('1.5 KB')
      expect(formatBytes(1536, 0)).toBe('2 KB')
    })
  })
})
