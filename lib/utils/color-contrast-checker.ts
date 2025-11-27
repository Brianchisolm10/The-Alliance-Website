/**
 * Color Contrast Checker for WCAG 2.1 AA Compliance
 * Use this utility during development to verify color combinations
 */

export interface ContrastResult {
  ratio: number
  passesAA: boolean
  passesAAA: boolean
  passesAALarge: boolean
  passesAAALarge: boolean
}

/**
 * Calculate contrast ratio between two colors
 * @param foreground - Foreground color in hex format (e.g., '#2563eb')
 * @param background - Background color in hex format (e.g., '#ffffff')
 * @returns Contrast ratio and WCAG compliance results
 */
export function checkContrast(foreground: string, background: string): ContrastResult {
  const ratio = getContrastRatio(foreground, background)

  return {
    ratio: Math.round(ratio * 100) / 100,
    passesAA: ratio >= 4.5, // Normal text
    passesAAA: ratio >= 7,
    passesAALarge: ratio >= 3, // Large text (18pt+ or 14pt+ bold)
    passesAAALarge: ratio >= 4.5,
  }
}

/**
 * Get contrast ratio between two colors
 */
function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}

/**
 * Calculate relative luminance of a color
 */
function getLuminance(hexColor: string): number {
  const rgb = hexToRgb(hexColor)
  if (!rgb) return 0

  const [r, g, b] = rgb.map((val) => {
    const normalized = val / 255
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): [number, number, number] | null {
  // Remove # if present
  hex = hex.replace(/^#/, '')

  // Handle shorthand hex (e.g., #fff)
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('')
  }

  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : null
}

/**
 * Tailwind color palette with hex values for quick reference
 */
export const TAILWIND_COLORS = {
  // Blues (Primary)
  'blue-50': '#eff6ff',
  'blue-100': '#dbeafe',
  'blue-200': '#bfdbfe',
  'blue-300': '#93c5fd',
  'blue-400': '#60a5fa',
  'blue-500': '#3b82f6',
  'blue-600': '#2563eb',
  'blue-700': '#1d4ed8',
  'blue-800': '#1e40af',
  'blue-900': '#1e3a8a',

  // Grays
  'gray-50': '#f9fafb',
  'gray-100': '#f3f4f6',
  'gray-200': '#e5e7eb',
  'gray-300': '#d1d5db',
  'gray-400': '#9ca3af',
  'gray-500': '#6b7280',
  'gray-600': '#4b5563',
  'gray-700': '#374151',
  'gray-800': '#1f2937',
  'gray-900': '#111827',

  // Status colors
  'green-600': '#16a34a',
  'red-600': '#dc2626',
  'yellow-600': '#ca8a04',
  'orange-600': '#ea580c',

  // Base colors
  white: '#ffffff',
  black: '#000000',
} as const

/**
 * Check if a color combination is WCAG AA compliant
 * @param foreground - Foreground color name or hex
 * @param background - Background color name or hex
 * @param isLargeText - Whether the text is large (18pt+ or 14pt+ bold)
 */
export function isAccessible(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  // Convert color names to hex if needed
  const fgHex = TAILWIND_COLORS[foreground as keyof typeof TAILWIND_COLORS] || foreground
  const bgHex = TAILWIND_COLORS[background as keyof typeof TAILWIND_COLORS] || background

  const result = checkContrast(fgHex, bgHex)
  return isLargeText ? result.passesAALarge : result.passesAA
}

/**
 * Get a readable color (black or white) for a given background
 */
export function getReadableColor(backgroundColor: string): '#000000' | '#ffffff' {
  const bgHex =
    TAILWIND_COLORS[backgroundColor as keyof typeof TAILWIND_COLORS] || backgroundColor

  const whiteContrast = checkContrast('#ffffff', bgHex)
  const blackContrast = checkContrast('#000000', bgHex)

  return whiteContrast.ratio > blackContrast.ratio ? '#ffffff' : '#000000'
}

/**
 * Development helper: Log contrast check results
 */
export function logContrastCheck(
  foreground: string,
  background: string,
  label?: string
): void {
  if (process.env.NODE_ENV !== 'development') return

  const fgHex = TAILWIND_COLORS[foreground as keyof typeof TAILWIND_COLORS] || foreground
  const bgHex = TAILWIND_COLORS[background as keyof typeof TAILWIND_COLORS] || background

  const result = checkContrast(fgHex, bgHex)

  console.group(label || `Contrast Check: ${foreground} on ${background}`)
  console.log(`Ratio: ${result.ratio}:1`)
  console.log(`WCAG AA (normal): ${result.passesAA ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`WCAG AA (large): ${result.passesAALarge ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`WCAG AAA (normal): ${result.passesAAA ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`WCAG AAA (large): ${result.passesAAALarge ? '✅ PASS' : '❌ FAIL'}`)
  console.groupEnd()
}

// Example usage in development:
// import { logContrastCheck } from '@/lib/utils/color-contrast-checker'
// logContrastCheck('blue-600', 'white', 'Primary Button')
