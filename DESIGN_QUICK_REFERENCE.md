# Bubbles Design System - Quick Reference Card
**Keep this handy while coding** 🫧

---

## Colors (Copy-Paste Ready)

### Primary Actions
```
bg-ocean-600 hover:bg-ocean-700 active:bg-ocean-800 text-white
```

### Secondary Actions
```
bg-white hover:bg-neutral-50 text-ocean-700 border-2 border-ocean-600
```

### Destructive Actions
```
bg-error-600 hover:bg-error-700 text-white
```

### Text Hierarchy
```
text-neutral-900  /* Headings */
text-neutral-700  /* Body text */
text-neutral-600  /* Supporting text */
text-neutral-500  /* Muted text */
```

---

## Typography Scale

```
text-6xl: Hero (60px)
text-5xl: Hero (48px)
text-4xl: H1 (36px)
text-3xl: H2 (30px)
text-2xl: H3 (24px)
text-xl:  H4 (20px)
text-lg:  Large body (18px)
text-base: Default body (16px) ⭐
text-sm:  Small text (14px)
text-xs:  Labels (12px)
```

**Font weights:**
```
font-normal:    400  (body)
font-medium:    500  (labels)
font-semibold:  600  (subheadings)
font-bold:      700  (headings)
```

---

## Spacing Shortcuts

### Component Padding
```
p-4   /* Small (16px) */
p-6   /* Cards (24px) ⭐ */
p-8   /* Large cards (32px) */
```

### Section Spacing
```
py-12 md:py-16    /* Default sections */
py-16 md:py-20    /* Large sections ⭐ */
py-20 md:py-24    /* Hero sections */
```

### Gaps
```
gap-2   /* Tight (8px) - icons */
gap-4   /* Default (16px) ⭐ */
gap-6   /* Cards (24px) */
gap-8   /* Sections (32px) */
```

---

## Border Radius

```
rounded-lg:   8px   /* Buttons, inputs ⭐ */
rounded-xl:   12px  /* Cards ⭐ */
rounded-2xl:  16px  /* Large cards, modals */
rounded-full: ∞     /* Avatars, badges ⭐ */
```

---

## Shadows

```
shadow-sm          /* Resting cards */
hover:shadow-md    /* Hover cards */
shadow-lg          /* Floating elements */
shadow-xl          /* Modals */
```

---

## Common Patterns (Ready to Use)

### Primary Button
```tsx
<button className="px-6 py-3 bg-ocean-600 hover:bg-ocean-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2">
  Button Text
</button>
```

### Card
```tsx
<div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md border border-neutral-200 hover:border-ocean-200 transition-all duration-200">
  {/* Content */}
</div>
```

### Input
```tsx
<input className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:outline-none focus:border-ocean-500 focus:ring-4 focus:ring-ocean-100 transition-all duration-200" />
```

### Badge
```tsx
<span className="inline-flex items-center gap-1 px-2 py-1 bg-success-100 text-success-700 rounded-full text-xs font-medium">
  Available
</span>
```

### Avatar
```tsx
<div className="w-10 h-10 rounded-full border-2 border-white bg-ocean-100 flex items-center justify-center text-sm font-medium text-ocean-700">
  JD
</div>
```

---

## Responsive Grid

```tsx
/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

---

## Hover Effects

### Lift
```
hover:-translate-y-1 transition-transform duration-200
```

### Scale
```
hover:scale-105 transition-transform duration-200
```

### Glow
```
hover:shadow-lg hover:shadow-ocean-200/50 transition-shadow duration-300
```

---

## Focus States (Accessibility)

### Default
```
focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2
```

### On Dark Backgrounds
```
focus:ring-white focus:ring-offset-ocean-600
```

---

## Loading States

### Spinner
```tsx
<div className="w-6 h-6 border-2 border-ocean-600 border-t-transparent rounded-full animate-spin" />
```

### Skeleton
```tsx
<div className="h-4 bg-neutral-200 rounded animate-pulse" />
```

---

## Color Contrast Quick Check

**Always Safe:**
- ocean-600 on white ✅ (5.9:1)
- neutral-900 on white ✅ (15.3:1)
- neutral-700 on white ✅ (7.8:1)
- white on ocean-600 ✅

**Borderline (use for large text only):**
- ocean-500 on white (4.3:1)
- neutral-600 on white (4.7:1)

---

## Accessibility Checklist

- [ ] Minimum 44×44px touch targets
- [ ] Focus rings on all interactive elements
- [ ] Color contrast ≥ 4.5:1 for text
- [ ] Semantic HTML (`<button>` not `<div onclick>`)
- [ ] Alt text on images
- [ ] ARIA labels where needed

---

## Animation Timing

```
duration-150: Instant feedback
duration-200: Default transitions ⭐
duration-300: Noticeable effects
duration-500: Pronounced animations
```

---

## Breakpoints

```
sm:  640px   (tablets)
md:  768px   (tablets) ⭐
lg:  1024px  (laptops)
xl:  1280px  (desktops)
```

**Mobile-first approach:**
```tsx
<div className="text-4xl md:text-5xl lg:text-6xl">
```

---

## Common Class Combinations

### Hero Section
```
py-20 md:py-24 px-4 bg-gradient-to-b from-ocean-50 to-white
```

### Content Section
```
py-16 md:py-20 px-4 max-w-6xl mx-auto
```

### Page Header
```
bg-white border-b border-neutral-200 px-4 py-6
```

### Sticky Nav
```
sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-neutral-200
```

---

## Tips for Consistency

1. **Always use semantic colors**: `ocean-600` not `blue-600`
2. **Stick to the scale**: Use defined spacing values (4, 6, 8, not 5, 7, 9)
3. **Consistent transitions**: `transition-all duration-200` for most interactions
4. **Focus rings everywhere**: Never `outline-none` without a ring
5. **Mobile-first**: Base classes for mobile, `md:` for desktop
6. **Rounded corners**: `rounded-lg` for interactive, `rounded-xl` for cards

---

## Before You Ship

- [ ] Test on mobile (320px minimum)
- [ ] Check all focus states
- [ ] Verify color contrast
- [ ] Test keyboard navigation
- [ ] Run Lighthouse audit
- [ ] Check with screen reader

---

**When in doubt, check the full design system: `/BUBBLES_DESIGN_SYSTEM.md`**
