# Mobile Testing Checklist

## Device Testing Matrix

### Smartphones
- [ ] iPhone SE (375px width) - iOS Safari
- [ ] iPhone 12/13/14 (390px width) - iOS Safari
- [ ] iPhone 14 Pro Max (430px width) - iOS Safari
- [ ] Samsung Galaxy S21 (360px width) - Chrome Mobile
- [ ] Google Pixel 6 (412px width) - Chrome Mobile
- [ ] OnePlus 9 (412px width) - Chrome Mobile

### Tablets
- [ ] iPad Mini (768px width) - iOS Safari
- [ ] iPad Air (820px width) - iOS Safari
- [ ] iPad Pro 11" (834px width) - iOS Safari
- [ ] iPad Pro 12.9" (1024px width) - iOS Safari
- [ ] Samsung Galaxy Tab (800px width) - Chrome Mobile

### Browsers
- [ ] iOS Safari (latest)
- [ ] iOS Safari (previous version)
- [ ] Chrome Mobile (Android)
- [ ] Firefox Mobile
- [ ] Samsung Internet
- [ ] Edge Mobile

## Functional Testing

### Navigation
- [ ] Mobile menu opens and closes smoothly
- [ ] All navigation links are accessible
- [ ] Back button works correctly
- [ ] Deep links work properly
- [ ] Breadcrumbs display correctly on mobile

### Forms
- [ ] All input fields are easily tappable (44x44px minimum)
- [ ] Keyboard appears with correct input type
- [ ] Form validation messages are visible
- [ ] Error messages don't overlap with inputs
- [ ] Submit buttons are accessible
- [ ] Auto-fill works correctly
- [ ] Date pickers work on mobile
- [ ] Select dropdowns are usable

### Touch Interactions
- [ ] Buttons have adequate spacing (8px minimum)
- [ ] Swipe gestures work where implemented
- [ ] Pull-to-refresh doesn't interfere with scrolling
- [ ] Pinch-to-zoom works on images
- [ ] Long-press actions work correctly
- [ ] Double-tap doesn't cause unwanted zoom

### Content Display
- [ ] Text is readable without zooming (16px minimum)
- [ ] Images scale properly
- [ ] Tables are scrollable horizontally
- [ ] Cards stack vertically on mobile
- [ ] Modals fit within viewport
- [ ] No horizontal scrolling on any page

### Performance
- [ ] Pages load in < 3 seconds on 3G
- [ ] Images lazy load properly
- [ ] Animations are smooth (60fps)
- [ ] No layout shifts during load
- [ ] Scroll performance is smooth
- [ ] Touch response is immediate (< 100ms)

## Visual Testing

### Layout
- [ ] No content cutoff at any breakpoint
- [ ] Proper spacing on all screen sizes
- [ ] Images don't overflow containers
- [ ] Text doesn't overlap
- [ ] Footer stays at bottom
- [ ] Headers are sticky where intended

### Typography
- [ ] Font sizes are appropriate for mobile
- [ ] Line heights provide good readability
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] No text truncation issues
- [ ] Headings maintain hierarchy

### Components
- [ ] Buttons are touch-friendly
- [ ] Cards display correctly
- [ ] Modals/dialogs fit screen
- [ ] Tooltips work on touch
- [ ] Dropdowns are accessible
- [ ] Carousels are swipeable

## Accessibility Testing

### Screen Readers
- [ ] VoiceOver (iOS) reads content correctly
- [ ] TalkBack (Android) reads content correctly
- [ ] All images have alt text
- [ ] Form labels are associated correctly
- [ ] Error messages are announced
- [ ] Dynamic content updates are announced

### Keyboard Navigation
- [ ] All interactive elements are focusable
- [ ] Focus order is logical
- [ ] Focus indicators are visible
- [ ] No keyboard traps
- [ ] Skip links work

### Touch Accessibility
- [ ] Touch targets are 44x44px minimum
- [ ] Adequate spacing between targets
- [ ] No hover-only interactions
- [ ] Touch feedback is immediate
- [ ] Gestures have alternatives

## Network Testing

### 3G Connection
- [ ] Pages load within acceptable time
- [ ] Images load progressively
- [ ] Critical content loads first
- [ ] Loading states are shown
- [ ] Offline fallbacks work

### Slow Connection
- [ ] App remains usable
- [ ] Timeouts are handled gracefully
- [ ] Retry mechanisms work
- [ ] Error messages are helpful

### Offline
- [ ] Offline page displays
- [ ] Cached content is accessible
- [ ] Service worker functions correctly
- [ ] Sync works when back online

## Orientation Testing

### Portrait Mode
- [ ] All pages display correctly
- [ ] Navigation is accessible
- [ ] Forms are usable
- [ ] Content is readable

### Landscape Mode
- [ ] Layout adapts appropriately
- [ ] No content is hidden
- [ ] Navigation remains accessible
- [ ] Forms remain usable

## Edge Cases

### Small Screens (< 375px)
- [ ] Content is still accessible
- [ ] No horizontal scroll
- [ ] Text remains readable
- [ ] Buttons are still tappable

### Large Screens (> 430px)
- [ ] Content scales appropriately
- [ ] No excessive white space
- [ ] Layout remains balanced

### Notched Devices
- [ ] Content respects safe areas
- [ ] No content behind notch
- [ ] Status bar area is handled

### Foldable Devices
- [ ] Layout adapts to fold
- [ ] Content reflows correctly
- [ ] No content loss on fold

## Performance Metrics

### Core Web Vitals
- [ ] LCP < 2.5s (mobile)
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] FCP < 1.8s
- [ ] TTI < 3.8s

### Bundle Size
- [ ] Initial JS < 200KB (gzipped)
- [ ] CSS < 50KB (gzipped)
- [ ] Total page < 1MB

### Lighthouse Scores
- [ ] Performance > 90
- [ ] Accessibility > 95
- [ ] Best Practices > 95
- [ ] SEO > 95

## User Experience

### First Visit
- [ ] Fast initial load
- [ ] Clear value proposition
- [ ] Easy navigation
- [ ] Obvious CTAs

### Return Visit
- [ ] Cached content loads quickly
- [ ] User state is preserved
- [ ] Smooth experience

### Task Completion
- [ ] Discovery form is easy to complete
- [ ] Assessment flows work smoothly
- [ ] Checkout process is simple
- [ ] Admin tasks are efficient

## Testing Tools

### Manual Testing
- Real devices (preferred)
- BrowserStack / Sauce Labs
- Chrome DevTools Device Mode
- Firefox Responsive Design Mode

### Automated Testing
```bash
# Lighthouse
npx lighthouse https://your-site.com --view

# Mobile-friendly test
npx lighthouse https://your-site.com --preset=mobile

# Performance budget
npx lighthouse https://your-site.com --budget-path=budget.json
```

### Performance Testing
```bash
# WebPageTest
# Use webpagetest.org with Mobile 3G profile

# Chrome DevTools
# Network tab > Throttling > Slow 3G
```

## Sign-off

### Development Team
- [ ] All critical paths tested
- [ ] No blocking issues
- [ ] Performance targets met
- [ ] Accessibility verified

### QA Team
- [ ] Test plan executed
- [ ] Issues documented
- [ ] Regression testing complete
- [ ] Sign-off provided

### Product Team
- [ ] User flows validated
- [ ] Design approved
- [ ] Content reviewed
- [ ] Launch approved

## Notes

### Known Issues
- Document any known issues
- Include workarounds
- Note planned fixes

### Future Improvements
- List potential enhancements
- Note performance opportunities
- Document user feedback
