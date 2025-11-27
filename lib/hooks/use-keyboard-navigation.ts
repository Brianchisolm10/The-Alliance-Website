'use client'

import { useEffect, useCallback, RefObject } from 'react'

interface UseKeyboardNavigationOptions {
  onEscape?: () => void
  onEnter?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onHome?: () => void
  onEnd?: () => void
  onTab?: (shiftKey: boolean) => void
  enabled?: boolean
}

/**
 * Hook for handling keyboard navigation
 */
export function useKeyboardNavigation(
  ref: RefObject<HTMLElement>,
  options: UseKeyboardNavigationOptions = {}
) {
  const {
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onHome,
    onEnd,
    onTab,
    enabled = true,
  } = options

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      switch (event.key) {
        case 'Escape':
          if (onEscape) {
            event.preventDefault()
            onEscape()
          }
          break
        case 'Enter':
          if (onEnter) {
            event.preventDefault()
            onEnter()
          }
          break
        case 'ArrowUp':
          if (onArrowUp) {
            event.preventDefault()
            onArrowUp()
          }
          break
        case 'ArrowDown':
          if (onArrowDown) {
            event.preventDefault()
            onArrowDown()
          }
          break
        case 'ArrowLeft':
          if (onArrowLeft) {
            event.preventDefault()
            onArrowLeft()
          }
          break
        case 'ArrowRight':
          if (onArrowRight) {
            event.preventDefault()
            onArrowRight()
          }
          break
        case 'Home':
          if (onHome) {
            event.preventDefault()
            onHome()
          }
          break
        case 'End':
          if (onEnd) {
            event.preventDefault()
            onEnd()
          }
          break
        case 'Tab':
          if (onTab) {
            event.preventDefault()
            onTab(event.shiftKey)
          }
          break
      }
    },
    [enabled, onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onHome, onEnd, onTab]
  )

  useEffect(() => {
    const element = ref.current
    if (!element || !enabled) return

    element.addEventListener('keydown', handleKeyDown)
    return () => {
      element.removeEventListener('keydown', handleKeyDown)
    }
  }, [ref, handleKeyDown, enabled])
}

/**
 * Hook for managing focus trap in modals/dialogs
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement>,
  isActive: boolean = true
) {
  useEffect(() => {
    if (!isActive) return

    const element = ref.current
    if (!element) return

    const focusableElements = element.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Store previously focused element
    const previouslyFocused = document.activeElement as HTMLElement

    // Focus first element
    firstElement?.focus()

    const handleTab = (e: KeyboardEvent) => {
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

    element.addEventListener('keydown', handleTab)

    return () => {
      element.removeEventListener('keydown', handleTab)
      // Restore focus to previously focused element
      previouslyFocused?.focus()
    }
  }, [ref, isActive])
}

/**
 * Hook for roving tabindex pattern (for lists, menus, etc.)
 */
export function useRovingTabIndex(
  containerRef: RefObject<HTMLElement>,
  itemSelector: string = '[role="menuitem"], [role="option"], [role="tab"]',
  orientation: 'horizontal' | 'vertical' = 'vertical'
) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let currentIndex = 0
    const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector))

    if (items.length === 0) return

    // Set initial tabindex
    items.forEach((item, index) => {
      item.setAttribute('tabindex', index === 0 ? '0' : '-1')
    })

    const handleKeyDown = (e: KeyboardEvent) => {
      const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'
      const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'

      let newIndex = currentIndex

      switch (e.key) {
        case nextKey:
          e.preventDefault()
          newIndex = Math.min(currentIndex + 1, items.length - 1)
          break
        case prevKey:
          e.preventDefault()
          newIndex = Math.max(currentIndex - 1, 0)
          break
        case 'Home':
          e.preventDefault()
          newIndex = 0
          break
        case 'End':
          e.preventDefault()
          newIndex = items.length - 1
          break
        default:
          return
      }

      if (newIndex !== currentIndex) {
        items[currentIndex]?.setAttribute('tabindex', '-1')
        items[newIndex]?.setAttribute('tabindex', '0')
        items[newIndex]?.focus()
        currentIndex = newIndex
      }
    }

    container.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [containerRef, itemSelector, orientation])
}
