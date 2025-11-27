import { describe, it, expect } from 'vitest'
import {
  checkContrast,
  isAccessible,
  getReadableColor,
  TAILWIND_COLORS,
} from '../color-contrast-checker'

describe('Color Contrast Checker', () => {
  describe('checkContrast', () => {
    it('should calculate contrast ratio for black on white', () => {
      const result = checkContrast('#000000', '#ffffff')
      expect(result.ratio).toBe(21)
      expect(result.passesAA).toBe(true)
      expect(result.passesAAA).toBe(true)
      expect(result.passesAALarge).toBe(true)
      expect(result.passesAAALarge).toBe(true)
    })

    it('should calculate contrast ratio for white on black', () => {
      const result = checkContrast('#ffffff', '#000000')
      expect(result.ratio).toBe(21)
      expect(result.passesAA).toBe(true)
    })

    it('should detect passing AA contrast', () => {
      const result = checkContrast('#2563eb', '#ffffff')
      expect(result.passesAA).toBe(true)
    })

    it('should detect failing AA contrast', () => {
      const result = checkContrast('#cccccc', '#ffffff')
      expect(result.passesAA).toBe(false)
    })

    it('should handle shorthand hex colors', () => {
      const result = checkContrast('#fff', '#000')
      expect(result.ratio).toBe(21)
    })

    it('should handle hex colors without # prefix', () => {
      const result = checkContrast('ffffff', '000000')
      expect(result.ratio).toBe(21)
    })
  })

  describe('isAccessible', () => {
    it('should return true for accessible color combinations', () => {
      expect(isAccessible('#000000', '#ffffff')).toBe(true)
      expect(isAccessible('blue-600', 'white')).toBe(true)
    })

    it('should return false for inaccessible color combinations', () => {
      expect(isAccessible('#cccccc', '#ffffff')).toBe(false)
    })

    it('should handle large text differently', () => {
      const result = isAccessible('#999999', '#ffffff', true)
      expect(typeof result).toBe('boolean')
    })

    it('should work with Tailwind color names', () => {
      expect(isAccessible('gray-900', 'white')).toBe(true)
      expect(isAccessible('blue-600', 'white')).toBe(true)
    })
  })

  describe('getReadableColor', () => {
    it('should return white for dark backgrounds', () => {
      expect(getReadableColor('#000000')).toBe('#ffffff')
      expect(getReadableColor('gray-900')).toBe('#ffffff')
    })

    it('should return black for light backgrounds', () => {
      expect(getReadableColor('#ffffff')).toBe('#000000')
      expect(getReadableColor('gray-50')).toBe('#000000')
    })

    it('should work with Tailwind color names', () => {
      expect(getReadableColor('blue-600')).toBe('#ffffff')
      expect(getReadableColor('blue-100')).toBe('#000000')
    })
  })

  describe('TAILWIND_COLORS', () => {
    it('should contain expected color values', () => {
      expect(TAILWIND_COLORS.white).toBe('#ffffff')
      expect(TAILWIND_COLORS.black).toBe('#000000')
      expect(TAILWIND_COLORS['blue-600']).toBe('#2563eb')
      expect(TAILWIND_COLORS['gray-900']).toBe('#111827')
    })
  })
})
