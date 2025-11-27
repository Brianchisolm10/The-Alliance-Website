# Mobile Performance Optimization Guide

## Overview
This guide documents the mobile performance optimizations implemented for the AFYA platform, focusing on reducing bundle size, optimizing images, and improving load times on 3G connections.

## Bundle Size Optimizations

### 1. Code Splitting
- **Dynamic Imports**: Non-critical components are lazy-loaded
- **Route-based Splitting**: Each page loads only required code
- **Component-level Splitting**: Heavy components load on demand

### 2. Tree Shaking
- **ES Modules**: All imports use ES6 module syntax
- **Named Imports**: Import only what's needed from libraries
- **Dead Code Elimination**: Unused code removed during build

### 3. Package Optimization
```javascript
// Before (imports entire library)
import _ from 'lodash'

// After (imports only needed function)
import debounce from 'lodash/debounce'
```

## Image Optimization

### 1. Next.js Image Component
- **Automatic Optimization**: Images optimized at build time
- **Responsive Images**: Multiple sizes generated automatically
- **Modern Formats**: WebP and AVIF support
- **Lazy Loading**: Images load as they enter viewport

### 2. Image Configuration
```javascript
// next.config.js
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

### 3. Best Practices
- Use `next/image` for all images
- Specify width and height to prevent layout shift
- Use `priority` for above-the-fold images
- Use `loading="lazy"` for below-the-fold images
- Optimize source images before upload (< 500KB)

## Network Optimization

### 1. Resource Hints
```html
<!-- DNS Prefetch -->
<link rel="dns-prefetch" href="https://api.stripe.com" />

<!-- Preconnect -->
<link rel="preconnect" href="https://fonts.googleapis.com" />

<!-- Prefetch -->
<link rel="prefetch" href="/critical-page" />
```

### 2. Caching Strategy
- **Static Assets**: 1 year cache (immutable)
- **API Responses**: Revalidate every 10 minutes
- **Pages**: ISR with 10-minute revalidation
- **Images**: CDN caching with long TTL

### 3. Compression
- **Gzip**: Enabled for all text assets
- **Brotli**: Preferred when supported
- **Minification**: CSS and JS minified in production

## 3G Network Optimization

### 1. Critical CSS
- Inline critical CSS in `<head>`
- Defer non-critical CSS
- Remove unused CSS with PurgeCSS

### 2. JavaScript Loading
```javascript
// Defer non-critical scripts
<script src="analytics.js" defer />

// Async for independent scripts
<script src="chat-widget.js" async />
```

### 3. Progressive Enhancement
- Core functionality works without JavaScript
- Enhanced features load progressively
- Graceful degradation for slow connections

## Performance Metrics

### Target Metrics (3G)
| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint (FCP) | < 2.5s | TBD |
| Largest Contentful Paint (LCP) | < 3.5s | TBD |
| Time to Interactive (TTI) | < 5s | TBD |
| Total Blocking Time (TBT) | < 300ms | TBD |
| Cumulative Layout Shift (CLS) | < 0.1 | TBD |

### Bundle Size Targets
| Asset | Target | Current |
|-------|--------|---------|
| Initial JS | < 200KB (gzipped) | TBD |
| CSS | < 50KB (gzipped) | TBD |
| Total Page Weight | < 1MB | TBD |

## Testing on 3G

### Chrome DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Select "Slow 3G" from throttling dropdown
4. Reload page and measure metrics

### Lighthouse
```bash
# Run Lighthouse with 3G throttling
npx lighthouse https://your-site.com \
  --throttling.rttMs=150 \
  --throttling.throughputKbps=1638.4 \
  --throttling.cpuSlowdownMultiplier=4
```

### WebPageTest
- Use WebPageTest.org
- Select "Mobile 3G - Slow" connection
- Test from multiple locations
- Analyze waterfall and filmstrip

## Mobile-Specific Optimizations

### 1. Touch Optimization
- Minimum 44x44px touch targets
- Prevent accidental taps with spacing
- Use `touch-action` CSS property
- Disable hover effects on touch devices

### 2. Viewport Configuration
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
```

### 3. Font Loading
```css
/* Use system fonts for instant rendering */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Or optimize web fonts */
@font-face {
  font-family: 'Custom';
  font-display: swap; /* Show fallback immediately */
  src: url('/fonts/custom.woff2') format('woff2');
}
```

### 4. Reduce JavaScript
- Remove unused dependencies
- Use native browser APIs when possible
- Defer third-party scripts
- Code split by route and component

## Monitoring

### Real User Monitoring (RUM)
- Vercel Analytics for Web Vitals
- Track performance by device type
- Monitor slow connections
- Alert on regressions

### Synthetic Monitoring
- Lighthouse CI in GitHub Actions
- Daily performance audits
- Budget alerts for bundle size
- Regression detection

## Continuous Optimization

### 1. Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer
```

### 2. Performance Budget
```javascript
// next.config.js
experimental: {
  performanceBudget: {
    maxInitialLoadSize: 200 * 1024, // 200KB
    maxPageLoadSize: 500 * 1024, // 500KB
  }
}
```

### 3. Regular Audits
- Weekly Lighthouse audits
- Monthly bundle size review
- Quarterly dependency updates
- Annual architecture review

## Resources

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

### Documentation
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web Vitals](https://web.dev/vitals/)
- [Mobile Performance](https://web.dev/mobile/)
- [Image Optimization](https://web.dev/fast/#optimize-your-images)
