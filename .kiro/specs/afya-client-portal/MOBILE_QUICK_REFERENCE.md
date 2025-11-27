# Mobile Responsiveness Quick Reference

## Quick Start

### Using Mobile Utilities

```typescript
import { useMobile } from '@/lib/hooks/use-mobile'

function MyComponent() {
  const { isMobile, isTablet, isDesktop, isTouch } = useMobile()
  
  return (
    <div>
      {isMobile && <MobileView />}
      {isDesktop && <DesktopView />}
    </div>
  )
}
```

### Responsive Tailwind Classes

```tsx
// Mobile-first approach (default is mobile, then scale up)
<div className="
  px-4 sm:px-6 lg:px-8          // Padding
  text-base sm:text-sm          // Font size
  h-11 sm:h-10                  // Height
  grid-cols-1 md:grid-cols-2    // Grid columns
">
```

### Touch-Friendly Components

```tsx
// All UI components are already optimized
import { Button, Input, Select, Textarea } from '@/components/ui'

// Buttons automatically have 44px height on mobile
<Button>Touch-friendly button</Button>

// Inputs have larger touch targets on mobile
<Input placeholder="Mobile-optimized input" />
```

## Common Patterns

### Responsive Layout

```tsx
<div className="
  container-mobile              // Mobile-optimized container
  py-8 sm:py-12 lg:py-16       // Responsive padding
">
  <div className="
    grid 
    grid-cols-1                 // 1 column on mobile
    md:grid-cols-2              // 2 columns on tablet
    lg:grid-cols-3              // 3 columns on desktop
    gap-4 sm:gap-6              // Responsive gap
  ">
    {/* Content */}
  </div>
</div>
```

### Responsive Typography

```tsx
<h1 className="
  text-2xl sm:text-3xl lg:text-4xl    // Responsive heading
  font-bold
  leading-tight
">
  Responsive Heading
</h1>

<p className="
  text-base sm:text-sm                // Larger on mobile (prevents zoom)
  leading-relaxed
">
  Body text
</p>
```

### Mobile Navigation

```tsx
// Already implemented in layouts
// Portal: components/layouts/portal-layout.tsx
// Admin: components/layouts/admin-layout.tsx
// Public: components/layouts/public-header.tsx
```

### Responsive Images

```tsx
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  className="
    w-full                      // Full width
    h-auto                      // Maintain aspect ratio
    rounded-lg
  "
  sizes="
    (max-width: 640px) 100vw,   // Full width on mobile
    (max-width: 1024px) 50vw,   // Half width on tablet
    33vw                        // Third width on desktop
  "
  priority={false}              // Lazy load by default
  loading="lazy"
/>
```

### Conditional Rendering

```tsx
import { useMobile } from '@/lib/hooks/use-mobile'

function ResponsiveComponent() {
  const { isMobile } = useMobile()
  
  return (
    <>
      {/* Show on mobile only */}
      {isMobile && <MobileMenu />}
      
      {/* Hide on mobile */}
      {!isMobile && <DesktopSidebar />}
      
      {/* Or use CSS classes */}
      <div className="hidden md:block">Desktop only</div>
      <div className="block md:hidden">Mobile only</div>
    </>
  )
}
```

### Touch Events

```tsx
'use client'

function TouchComponent() {
  const handleTouch = (e: React.TouchEvent) => {
    // Handle touch
  }
  
  return (
    <div
      onTouchStart={handleTouch}
      onTouchMove={handleTouch}
      onTouchEnd={handleTouch}
      className="touch-manipulation"  // Better touch response
    >
      Touch me
    </div>
  )
}
```

## Breakpoints

```typescript
// Tailwind breakpoints
sm: 640px   // Small devices (landscape phones)
md: 768px   // Medium devices (tablets)
lg: 1024px  // Large devices (desktops)
xl: 1280px  // Extra large devices
2xl: 1536px // 2X Extra large devices
```

## Touch Target Sizes

```css
/* Minimum touch target: 44x44px */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Minimum spacing between targets: 8px */
.touch-spacing {
  gap: 8px;
}
```

## Performance Tips

### 1. Dynamic Imports

```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false  // Client-side only if needed
})
```

### 2. Image Optimization

```tsx
// Use next/image for all images
import Image from 'next/image'

// Specify dimensions to prevent layout shift
<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Description"
/>
```

### 3. Code Splitting

```tsx
// Split by route automatically with App Router
// app/
//   page.tsx          -> Separate bundle
//   about/page.tsx    -> Separate bundle
//   shop/page.tsx     -> Separate bundle
```

### 4. Lazy Loading

```tsx
// Components below the fold
const BelowFold = dynamic(() => import('./BelowFold'))

// Images
<Image loading="lazy" ... />

// Use Suspense for data fetching
<Suspense fallback={<Loading />}>
  <DataComponent />
</Suspense>
```

## Testing

### Chrome DevTools

```bash
# Open DevTools (F12)
# Network tab > Throttling > Slow 3G
# Device toolbar (Cmd+Shift+M)
```

### Lighthouse

```bash
# Run mobile audit
npx lighthouse https://localhost:3000 --preset=mobile --view

# With 3G throttling
npx lighthouse https://localhost:3000 \
  --throttling.rttMs=150 \
  --throttling.throughputKbps=1638.4 \
  --view
```

### Bundle Analysis

```bash
# Analyze bundle size
./scripts/analyze-bundle.sh

# Or with Next.js analyzer
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

## Common Issues

### Issue: Text too small on mobile
```tsx
// ❌ Bad
<p className="text-xs">Small text</p>

// ✅ Good
<p className="text-base sm:text-sm">Readable text</p>
```

### Issue: Buttons too small to tap
```tsx
// ❌ Bad
<button className="h-8 px-2">Small button</button>

// ✅ Good
<Button>Touch-friendly button</Button>
// or
<button className="h-11 sm:h-10 px-4">Custom button</button>
```

### Issue: Horizontal scroll on mobile
```tsx
// ❌ Bad
<div className="w-[1200px]">Fixed width</div>

// ✅ Good
<div className="w-full max-w-7xl mx-auto px-4">Responsive width</div>
```

### Issue: Images not optimized
```tsx
// ❌ Bad
<img src="/large-image.jpg" />

// ✅ Good
<Image
  src="/large-image.jpg"
  width={800}
  height={600}
  alt="Description"
  loading="lazy"
/>
```

## Utility Functions

```typescript
import {
  isMobileDevice,
  isTouchDevice,
  isMobileViewport,
  isSlowConnection,
  preventBodyScroll,
  allowBodyScroll,
} from '@/lib/utils/mobile'

// Check if mobile device
if (isMobileDevice()) {
  // Mobile-specific code
}

// Check if slow connection
if (isSlowConnection()) {
  // Load lighter version
}

// Prevent scroll (for modals)
preventBodyScroll()
// Later...
allowBodyScroll()
```

## Resources

- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Web Vitals](https://web.dev/vitals/)
- [Mobile Performance](https://web.dev/mobile/)
- [Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

## Need Help?

- Check `.kiro/specs/afya-client-portal/MOBILE_RESPONSIVENESS_AUDIT.md`
- Review `.kiro/specs/afya-client-portal/MOBILE_PERFORMANCE_GUIDE.md`
- See `.kiro/specs/afya-client-portal/MOBILE_TESTING_CHECKLIST.md`
- Run `./scripts/analyze-bundle.sh` for bundle analysis
