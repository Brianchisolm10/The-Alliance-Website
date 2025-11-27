# Accessibility Quick Reference Card

## Quick Checklist for New Components

### ✅ Semantic HTML
```tsx
// ✅ Good
<nav aria-label="Main navigation">
  <button type="button">Click me</button>
</nav>

// ❌ Bad
<div onClick={handleClick}>Click me</div>
```

### ✅ ARIA Labels
```tsx
// ✅ Good - Functional icon
<button aria-label="Close dialog">
  <svg aria-hidden="true">...</svg>
</button>

// ✅ Good - Decorative icon with text
<button>
  <svg aria-hidden="true">...</svg>
  Close
</button>

// ❌ Bad - No label
<button>
  <svg>...</svg>
</button>
```

### ✅ Form Fields
```tsx
// ✅ Good
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && <p id="email-error" role="alert">Invalid email</p>}

// ❌ Bad - No label association
<label>Email</label>
<input type="email" />
```

### ✅ Keyboard Navigation
```tsx
// ✅ Good - Keyboard accessible
<button onClick={handleClick}>Action</button>

// ❌ Bad - Not keyboard accessible
<div onClick={handleClick}>Action</div>
```

### ✅ Focus Indicators
```css
/* ✅ Good - Custom focus visible */
*:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* ❌ Bad - Removing focus outline */
*:focus {
  outline: none;
}
```

### ✅ Color Contrast
```tsx
// ✅ Good - High contrast (8.59:1)
<button className="bg-blue-600 text-white">Click</button>

// ⚠️ Warning - Low contrast (check with tool)
<button className="bg-gray-300 text-gray-400">Click</button>
```

### ✅ Alternative Text
```tsx
// ✅ Good - Informative image
<Image src="/program.jpg" alt="Beginner strength training program" />

// ✅ Good - Decorative image
<div aria-hidden="true">
  <Image src="/decoration.jpg" alt="" />
</div>

// ❌ Bad - Missing alt
<Image src="/program.jpg" />
```

## Common Patterns

### Skip Link
```tsx
<a href="#main-content" className="skip-to-main">
  Skip to main content
</a>
```

### Modal Dialog
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Title</h2>
  <p id="dialog-description">Description</p>
</div>
```

### Loading Button
```tsx
<button
  disabled={isLoading}
  aria-busy={isLoading}
  aria-disabled={isLoading}
>
  {isLoading ? 'Loading...' : 'Submit'}
</button>
```

### Navigation
```tsx
<nav aria-label="Main navigation">
  <Link href="/home" aria-current="page">Home</Link>
  <Link href="/about">About</Link>
</nav>
```

### Live Region
```tsx
<div role="status" aria-live="polite" aria-atomic="true">
  {message}
</div>
```

## Utilities

### Screen Reader Only
```tsx
<span className="sr-only">Additional context for screen readers</span>
```

### Accessible Icon
```tsx
import { AccessibleIcon } from '@/components/ui/accessible-image'

<AccessibleIcon label="Delete" decorative={false}>
  <path d="..." />
</AccessibleIcon>
```

### Keyboard Navigation Hook
```tsx
import { useKeyboardNavigation } from '@/lib/hooks/use-keyboard-navigation'

useKeyboardNavigation(ref, {
  onEscape: () => close(),
  onEnter: () => submit(),
})
```

### Color Contrast Check
```tsx
import { checkContrast } from '@/lib/utils/color-contrast-checker'

const result = checkContrast('#2563eb', '#ffffff')
console.log(result.passesAA) // true
```

## Testing Commands

```bash
# Run Lighthouse audit
npm run lighthouse

# Check with axe DevTools (browser extension)
# Install: https://www.deque.com/axe/devtools/

# Test with screen reader
# Windows: NVDA (free)
# Mac: VoiceOver (Cmd+F5)
```

## Resources

- [WCAG Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

## Remember

1. **Keyboard First**: If you can't use it with keyboard, it's not accessible
2. **Test with Screen Reader**: Actually test with NVDA or VoiceOver
3. **Check Contrast**: Use tools to verify color combinations
4. **Semantic HTML**: Use the right element for the job
5. **ARIA is Enhancement**: Use semantic HTML first, ARIA second

---

**Need Help?** Check the full guide: `.kiro/specs/afya-client-portal/ACCESSIBILITY_IMPLEMENTATION_GUIDE.md`
