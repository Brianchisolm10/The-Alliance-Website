/**
 * Mobile Utility Functions
 * Helpers for mobile-specific functionality and responsive behavior
 */

/**
 * Detect if the user is on a mobile device
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/**
 * Detect if the user is on a touch device
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - msMaxTouchPoints is IE-specific
    navigator.msMaxTouchPoints > 0
  )
}

/**
 * Get the current viewport width
 */
export function getViewportWidth(): number {
  if (typeof window === 'undefined') return 0
  return window.innerWidth || document.documentElement.clientWidth
}

/**
 * Get the current viewport height
 */
export function getViewportHeight(): number {
  if (typeof window === 'undefined') return 0
  return window.innerHeight || document.documentElement.clientHeight
}

/**
 * Check if viewport is mobile size (< 768px)
 */
export function isMobileViewport(): boolean {
  return getViewportWidth() < 768
}

/**
 * Check if viewport is tablet size (768px - 1024px)
 */
export function isTabletViewport(): boolean {
  const width = getViewportWidth()
  return width >= 768 && width < 1024
}

/**
 * Check if viewport is desktop size (>= 1024px)
 */
export function isDesktopViewport(): boolean {
  return getViewportWidth() >= 1024
}

/**
 * Prevent body scroll (useful for mobile modals)
 */
export function preventBodyScroll(): void {
  if (typeof document === 'undefined') return
  document.body.style.overflow = 'hidden'
  document.body.style.position = 'fixed'
  document.body.style.width = '100%'
}

/**
 * Allow body scroll
 */
export function allowBodyScroll(): void {
  if (typeof document === 'undefined') return
  document.body.style.overflow = ''
  document.body.style.position = ''
  document.body.style.width = ''
}

/**
 * Debounce function for resize events
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Get optimal image size based on viewport
 */
export function getOptimalImageSize(): 'small' | 'medium' | 'large' {
  const width = getViewportWidth()
  
  if (width < 640) return 'small'
  if (width < 1024) return 'medium'
  return 'large'
}

/**
 * Format bytes to human readable size
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Check if connection is slow (3G or slower)
 */
export function isSlowConnection(): boolean {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return false
  }
  
  // @ts-expect-error - connection API is experimental
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  
  if (!connection) return false
  
  const slowTypes = ['slow-2g', '2g', '3g']
  return slowTypes.includes(connection.effectiveType)
}

/**
 * Preload critical images
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

/**
 * Get safe area insets for notched devices
 */
export function getSafeAreaInsets() {
  if (typeof window === 'undefined') return { top: 0, right: 0, bottom: 0, left: 0 }
  
  const style = getComputedStyle(document.documentElement)
  
  return {
    top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0'),
    right: parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0'),
    bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
    left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0'),
  }
}
