import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  generateId,
  shouldAnnounce,
  createFieldLabel,
  getLiveRegionPoliteness,
  formatErrorMessage,
  meetsContrastRequirement,
  announceToScreenReader,
  createListNavigationHandler,
} from '../accessibility'

describe('Accessibility Utils', () => {
  describe('generateId', () => {
    it('should generate unique IDs with default prefix', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).toMatch(/^field-/)
      expect(id2).toMatch(/^field-/)
      expect(id1).not.toBe(id2)
    })

    it('should generate IDs with custom prefix', () => {
      const id = generateId('custom')
      expect(id).toMatch(/^custom-/)
    })
  })

  describe('shouldAnnounce', () => {
    let element: HTMLElement

    beforeEach(() => {
      element = document.createElement('div')
    })

    it('should return false for null element', () => {
      expect(shouldAnnounce(null)).toBe(false)
    })

    it('should return true for element without aria-hidden', () => {
      expect(shouldAnnounce(element)).toBe(true)
    })

    it('should return false for element with aria-hidden="true"', () => {
      element.setAttribute('aria-hidden', 'true')
      expect(shouldAnnounce(element)).toBe(false)
    })
  })

  describe('createFieldLabel', () => {
    it('should create label without required indicator', () => {
      expect(createFieldLabel('Email')).toBe('Email')
    })

    it('should create label with required indicator', () => {
      expect(createFieldLabel('Email', true)).toBe('Email (required)')
    })
  })

  describe('getLiveRegionPoliteness', () => {
    it('should return polite by default', () => {
      expect(getLiveRegionPoliteness()).toBe('polite')
    })

    it('should return polite when not urgent', () => {
      expect(getLiveRegionPoliteness(false)).toBe('polite')
    })

    it('should return assertive when urgent', () => {
      expect(getLiveRegionPoliteness(true)).toBe('assertive')
    })
  })

  describe('formatErrorMessage', () => {
    it('should format error message correctly', () => {
      expect(formatErrorMessage('Email', 'Invalid email')).toBe('Email: Invalid email')
    })
  })

  describe('meetsContrastRequirement', () => {
    it('should pass for high contrast (black on white)', () => {
      expect(meetsContrastRequirement('#000000', '#ffffff')).toBe(true)
    })

    it('should pass for sufficient contrast', () => {
      expect(meetsContrastRequirement('#2563eb', '#ffffff')).toBe(true)
    })

    it('should fail for low contrast', () => {
      expect(meetsContrastRequirement('#cccccc', '#ffffff')).toBe(false)
    })
  })

  describe('announceToScreenReader', () => {
    afterEach(() => {
      // Clean up any announcement elements
      document.querySelectorAll('[role="status"]').forEach((el) => el.remove())
    })

    it('should create announcement element with correct attributes', () => {
      announceToScreenReader('Test message')
      const announcement = document.querySelector('[role="status"]')
      expect(announcement).toBeTruthy()
      expect(announcement?.getAttribute('aria-live')).toBe('polite')
      expect(announcement?.textContent).toBe('Test message')
    })

    it('should create assertive announcement when priority is assertive', () => {
      announceToScreenReader('Urgent message', 'assertive')
      const announcement = document.querySelector('[role="status"]')
      expect(announcement?.getAttribute('aria-live')).toBe('assertive')
    })
  })

  describe('createListNavigationHandler', () => {
    let items: HTMLElement[]
    let selectedIndex: number | undefined

    beforeEach(() => {
      items = [
        document.createElement('button'),
        document.createElement('button'),
        document.createElement('button'),
      ]
      items.forEach((item) => document.body.appendChild(item))
      selectedIndex = undefined
    })

    afterEach(() => {
      items.forEach((item) => item.remove())
    })

    it('should handle ArrowDown key', () => {
      const handler = createListNavigationHandler(items)
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      handler(event)
      expect(document.activeElement).toBe(items[1])
    })

    it('should handle ArrowUp key', () => {
      items[1].focus()
      const handler = createListNavigationHandler(items)
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })
      handler(event)
      expect(document.activeElement).toBe(items[0])
    })

    it('should handle Home key', () => {
      items[2].focus()
      const handler = createListNavigationHandler(items)
      const event = new KeyboardEvent('keydown', { key: 'Home' })
      handler(event)
      expect(document.activeElement).toBe(items[0])
    })

    it('should handle End key', () => {
      const handler = createListNavigationHandler(items)
      const event = new KeyboardEvent('keydown', { key: 'End' })
      handler(event)
      expect(document.activeElement).toBe(items[2])
    })

    it('should call onSelect when Enter is pressed', () => {
      const handler = createListNavigationHandler(items, (index) => {
        selectedIndex = index
      })
      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      handler(event)
      expect(selectedIndex).toBe(0)
    })
  })
})
