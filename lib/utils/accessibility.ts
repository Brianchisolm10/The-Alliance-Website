/**
 * Accessibility utility functions for WCAG 2.1 AA compliance
 */

/**
 * Generate a unique ID for form field associations
 */
export function generateId(prefix: string = 'field'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Check if an element should be announced to screen readers
 */
export function shouldAnnounce(element: HTMLElement | null): boolean {
  if (!element) return false
  return !element.hasAttribute('aria-hidden') && element.getAttribute('aria-hidden') !== 'true'
}

/**
 * Create accessible label for form fields
 */
export function createFieldLabel(label: string, required: boolean = false): string {
  return required ? `${label} (required)` : label
}

/**
 * Get ARIA live region politeness level based on urgency
 */
export function getLiveRegionPoliteness(urgent: boolean = false): 'polite' | 'assertive' {
  return urgent ? 'assertive' : 'polite'
}

/**
 * Format error message for screen readers
 */
export function formatErrorMessage(fieldName: string, error: string): string {
  return `${fieldName}: ${error}`
}

/**
 * Check if color contrast meets WCAG AA standards
 * @param foreground - Foreground color in hex format
 * @param background - Background color in hex format
 * @returns true if contrast ratio is >= 4.5:1 for normal text
 */
export function meetsContrastRequirement(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background)
  return ratio >= 4.5
}

/**
 * Calculate contrast ratio between two colors
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
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : null
}

/**
 * Trap focus within a modal or dialog
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement?.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement?.focus()
        e.preventDefault()
      }
    }
  }

  element.addEventListener('keydown', handleTabKey)

  // Focus first element
  firstElement?.focus()

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey)
  }
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  if (typeof document === 'undefined') return

  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Get keyboard navigation handler for lists
 */
export function createListNavigationHandler(
  items: HTMLElement[],
  onSelect?: (index: number) => void
): (e: KeyboardEvent) => void {
  let currentIndex = 0

  return (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        currentIndex = Math.min(currentIndex + 1, items.length - 1)
        items[currentIndex]?.focus()
        break
      case 'ArrowUp':
        e.preventDefault()
        currentIndex = Math.max(currentIndex - 1, 0)
        items[currentIndex]?.focus()
        break
      case 'Home':
        e.preventDefault()
        currentIndex = 0
        items[currentIndex]?.focus()
        break
      case 'End':
        e.preventDefault()
        currentIndex = items.length - 1
        items[currentIndex]?.focus()
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        onSelect?.(currentIndex)
        break
    }
  }
}
