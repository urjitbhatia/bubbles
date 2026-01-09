# Design System Implementation Guide
**Step-by-step setup for the Bubbles design system**

---

## Step 1: Import Custom Animations

Add the custom animations to your global CSS:

### Option A: Import in index.css (Recommended)

Update `/web/src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import 'tailwindcss';
@import './animations.css';  /* Add this line */

@theme {
  /* Your existing color palette */
  /* ... */
}

/* Rest of your existing CSS */
```

### Option B: Import in App Component

If you prefer component-level import:

```tsx
// In your App.tsx or main component
import './animations.css'
```

---

## Step 2: Update Tailwind Config (Optional Enhancements)

If you want to add custom utilities to your Tailwind config:

```js
// tailwind.config.js (if you have one)
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
```

---

## Step 3: Using the Design System in Components

### Example 1: Enhanced Button

```tsx
// /web/src/components/ui/Button.tsx

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { Spinner } from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 inline-flex items-center justify-center gap-2 relative'

  const variantClasses = {
    primary: 'px-6 py-3 bg-ocean-600 hover:bg-ocean-700 active:bg-ocean-800 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5',
    secondary: 'px-6 py-3 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-ocean-700 border-2 border-ocean-600 hover:border-ocean-700 hover:shadow-sm',
    ghost: 'px-4 py-2 bg-transparent hover:bg-ocean-50 active:bg-ocean-100 text-ocean-700',
    destructive: 'px-6 py-3 bg-error-600 hover:bg-error-700 active:bg-error-800 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5'
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[52px]'
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${size !== 'md' ? sizeClasses[size] : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-lg">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
    </button>
  )
}
```

### Example 2: Enhanced BubbleCard

```tsx
// /web/src/components/bubbles/BubbleCard.tsx

import { Link } from '@tanstack/react-router'

interface BubbleCardProps {
  id: string
  name: string
  description?: string
  memberCount: number
  itemCount: number
  members?: Array<{ id: string; name: string; avatar?: string }>
}

export default function BubbleCard({
  id,
  name,
  description,
  memberCount,
  itemCount,
  members = [],
}: BubbleCardProps) {
  const displayMembers = members.slice(0, 3)
  const extraCount = Math.max(0, memberCount - 3)

  return (
    <Link to="/bubbles/$id" params={{ id }}>
      <div className="group relative overflow-hidden bg-gradient-to-br from-ocean-50 via-white to-sage-50 rounded-xl p-6 shadow-sm hover:shadow-lg border-2 border-ocean-200 hover:border-ocean-400 transition-all duration-300 cursor-pointer hover:scale-[1.02]">
        {/* Decorative bubbles with hover animation */}
        <div className="bubble-decoration-md -top-8 -right-8 bg-ocean-100 group-hover:opacity-30 transition-opacity duration-500" />
        <div className="bubble-decoration-sm -bottom-4 -left-4 bg-sage-100 group-hover:opacity-30 transition-opacity duration-500" />
        <div className="bubble-decoration-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-coral-50" />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-neutral-900 mb-1 group-hover:text-ocean-700 transition-colors duration-200">
                {name}
              </h3>
              <p className="text-sm text-neutral-500">
                {memberCount} {memberCount === 1 ? 'member' : 'members'} · {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </p>
            </div>

            {/* Animated icon */}
            <div className="w-12 h-12 bg-ocean-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-ocean-200 group-hover:scale-110 transition-all duration-300">
              <svg className="w-6 h-6 text-ocean-600 group-hover:text-ocean-700" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="10" r="6" stroke="currentColor" strokeWidth="2"/>
                <circle cx="15" cy="10" r="6" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                <circle cx="12" cy="15" r="6" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
              </svg>
            </div>
          </div>

          {description && (
            <p className="text-sm text-neutral-600 mb-4 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Member avatars with stagger */}
          {displayMembers.length > 0 && (
            <div className="flex -space-x-2">
              {displayMembers.map((member, index) => (
                <div
                  key={member.id}
                  className="w-8 h-8 rounded-full border-2 border-white bg-ocean-100 flex items-center justify-center text-xs font-medium text-ocean-700 shadow-sm group-hover:shadow-md transition-all duration-200"
                  style={{ transitionDelay: `${index * 50}ms` }}
                  title={member.name}
                >
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    member.name.charAt(0).toUpperCase()
                  )}
                </div>
              ))}
              {extraCount > 0 && (
                <div className="w-8 h-8 rounded-full border-2 border-white bg-neutral-200 flex items-center justify-center text-xs font-medium text-neutral-600 shadow-sm">
                  +{extraCount}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
```

---

## Step 4: Using Custom Animations

### Floating Hero Icon

```tsx
<div className="mb-8 inline-block animate-float">
  <span className="text-7xl md:text-8xl drop-shadow-lg">🫧</span>
</div>
```

### Background Bubbles with Pulse

```tsx
<div className="absolute top-20 left-10 w-72 h-72 bg-ocean-200 rounded-full opacity-20 blur-3xl animate-pulse-soft" />
```

### Gradient Text

```tsx
<h1 className="text-5xl font-bold">
  Share more.{' '}
  <span className="text-gradient-ocean">Own less.</span>
</h1>
```

### Glass Morphism Card

```tsx
<div className="glass rounded-2xl p-6">
  {/* Content */}
</div>
```

### Loading Skeleton

```tsx
<div className="space-y-2">
  <div className="skeleton-title" />
  <div className="skeleton-text" />
  <div className="skeleton-text" />
</div>
```

---

## Step 5: Common Page Layouts

### Landing Page Pattern

```tsx
export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 md:py-24 px-4 bg-gradient-to-b from-ocean-50 via-white to-neutral-50 overflow-hidden">
        {/* Background decorations */}
        <div className="bubble-decoration-lg top-20 left-10 bg-ocean-200 animate-pulse-soft" />
        <div className="bubble-decoration-lg bottom-20 right-10 bg-sage-200 animate-pulse-soft" style={{ animationDelay: '1s' }} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-8 inline-block animate-float">
            <span className="text-7xl md:text-8xl">🫧</span>
          </div>

          <h1 className="text-responsive-hero font-bold text-neutral-900 mb-6 leading-tight">
            Share more. <span className="text-gradient-ocean">Own less.</span>
          </h1>

          {/* CTA buttons */}
        </div>
      </section>

      {/* Feature section */}
      <section className="section-spacing container-padding">
        <div className="max-w-6xl mx-auto">
          {/* Features */}
        </div>
      </section>
    </div>
  )
}
```

### Dashboard Pattern

```tsx
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            My Bubbles
          </h1>
          <p className="text-neutral-600">
            Manage your trusted circles
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cards */}
        </div>
      </div>
    </div>
  )
}
```

---

## Step 6: Testing Your Implementation

### Visual Test Checklist

```tsx
// Create a test page to verify all components
export default function DesignSystemTest() {
  return (
    <div className="p-8 space-y-12 bg-neutral-50 min-h-screen">
      {/* Colors */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Colors</h2>
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-ocean-600 rounded-lg" />
          <div className="w-20 h-20 bg-sage-600 rounded-lg" />
          <div className="w-20 h-20 bg-coral-600 rounded-lg" />
        </div>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Buttons</h2>
        <div className="flex gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Typography</h2>
        <h1 className="text-4xl font-bold mb-2">Heading 1</h1>
        <h2 className="text-3xl font-bold mb-2">Heading 2</h2>
        <h3 className="text-2xl font-semibold mb-2">Heading 3</h3>
        <p className="text-base text-neutral-600">Body text paragraph</p>
      </section>

      {/* Animations */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Animations</h2>
        <div className="flex gap-8">
          <div className="animate-float">Float</div>
          <div className="animate-pulse-soft">Pulse</div>
          <div className="spinner" />
        </div>
      </section>
    </div>
  )
}
```

---

## Step 7: Accessibility Quick Checks

### Run These Tests

1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Verify focus rings are visible
   - Check tab order is logical

2. **Color Contrast**
   - Use browser DevTools or WebAIM checker
   - Verify all text meets WCAG AA (4.5:1)
   - Check UI components meet 3:1

3. **Screen Reader**
   - Use VoiceOver (Mac) or NVDA (Windows)
   - Verify all content is announced
   - Check ARIA labels are present

4. **Responsive**
   - Test at 320px, 768px, 1024px, 1920px
   - Verify touch targets are 44×44px minimum
   - Check text scales appropriately

---

## Step 8: Performance Optimization

### Animation Performance

```tsx
// Use will-change for animated elements
<div className="animate-float will-change-transform">

// Prefer transform over position changes
// Good: transform: translateY()
// Bad: top: 20px
```

### Reduce Motion

```css
/* Already included in animations.css */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Troubleshooting

### Issue: Animations not working
**Solution**: Make sure you imported `animations.css` in your `index.css` or main component

### Issue: Colors not showing
**Solution**: Verify your `@theme` block in `index.css` has all color tokens defined

### Issue: Focus rings not visible
**Solution**: Never use `outline-none` without adding `focus:ring-*`

### Issue: Hover effects jerky
**Solution**: Add `transition-all duration-200` to the element

### Issue: Text too small on mobile
**Solution**: Use responsive text utilities like `text-responsive-base`

---

## Next Steps

1. Start with small components (Button, Input)
2. Test thoroughly before moving to complex components
3. Build a component library page for reference
4. Document any custom patterns you create
5. Share the design system with your team

---

**You're ready to build beautiful Bubbles interfaces!** 🫧

For questions or clarifications, refer to:
- Full design system: `/BUBBLES_DESIGN_SYSTEM.md`
- Component examples: `/BUBBLES_COMPONENT_UPGRADES.md`
- Quick reference: `/DESIGN_QUICK_REFERENCE.md`
