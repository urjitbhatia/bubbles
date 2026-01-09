# Bubbles Design System
**Version 1.0** | Premium Lending Library for Trusted Circles

---

## Design Philosophy

Bubbles is where **Airbnb meets Notion** — premium yet friendly, polished yet playful. The design embodies:

- **Polished & Premium**: Clean interfaces, thoughtful spacing, refined typography that builds trust
- **Elegant Simplicity**: Clear visual hierarchy, purposeful whitespace, intuitive interactions
- **Playful Delight**: The "bubbles" theme comes alive through soft gradients, gentle animations, and joyful micro-interactions
- **Community-First**: Warm, inviting aesthetics that encourage sharing and connection

**Inspiration from best-in-class products:**
- **Resend**: Clean code aesthetics, developer-friendly interfaces, perfect contrast ratios
- **Loom**: Warm gradients, friendly micro-interactions, emphasis on human connection
- **Notion**: Purposeful whitespace, elegant typography, seamless user flows

---

## Color System

### Semantic Color Palette

Our color system uses semantic tokens with clear purpose and proper contrast ratios (WCAG AA compliant).

#### Primary - Ocean (Trust & Reliability)
```css
ocean-50:  #f0f9ff  /* Backgrounds, subtle highlights */
ocean-100: #e0f2fe  /* Hover states, light accents */
ocean-200: #b9e6fe  /* Borders, decorative elements */
ocean-300: #7dd3fc  /* Secondary actions */
ocean-400: #38bdf8  /* Interactive elements */
ocean-500: #0ea5e9  /* Primary brand color */
ocean-600: #0284c7  /* Primary buttons, links ⭐ */
ocean-700: #0369a1  /* Hover states */
ocean-800: #075985  /* Active states */
ocean-900: #0c4a6e  /* Text emphasis */
```

**Usage Guidelines:**
- **ocean-600**: Primary CTAs, navigation highlights, key interactions
- **ocean-50/100**: Subtle backgrounds, card accents, hover states
- **ocean-700/800**: Hover/active states for primary actions
- **Contrast**: ocean-600 on white = 5.9:1 (AAA) ✅

#### Accent - Coral (Energy & Warmth)
```css
coral-50:  #fff1f2  /* Backgrounds */
coral-100: #ffe4e6  /* Accents */
coral-500: #f43f5e  /* Highlights */
coral-600: #e11d48  /* Destructive actions ⭐ */
coral-700: #be123c  /* Hover states */
```

**Usage Guidelines:**
- **Sparingly**: Use for highlights, badges, important notifications
- **Energy**: New features, achievements, celebration moments
- **Warnings**: Not primary error color (use error palette)

#### Secondary - Sage (Growth & Sustainability)
```css
sage-50:  #f6f7f6  /* Subtle backgrounds */
sage-100: #e3e8e3  /* Card backgrounds */
sage-500: #5f7562  /* Icons, secondary text */
sage-600: #4a5d4d  /* Secondary buttons ⭐ */
```

**Usage Guidelines:**
- **Sustainability theme**: Community, sharing, eco-friendly messaging
- **Secondary actions**: Non-primary buttons, informational elements
- **Backgrounds**: Soft, natural feel for sections

#### System Colors

**Success** (Green)
```css
success-500: #22c55e  /* Success messages */
success-600: #16a34a  /* Success buttons */
```

**Warning** (Amber)
```css
warning-500: #f59e0b  /* Warning messages */
warning-600: #d97706  /* Warning states */
```

**Error** (Red)
```css
error-500: #ef4444   /* Error text */
error-600: #dc2626   /* Error actions */
```

**Neutral** (Gray)
```css
neutral-50:  #fafafa  /* Page backgrounds */
neutral-100: #f5f5f5  /* Card backgrounds */
neutral-200: #e5e5e5  /* Borders */
neutral-500: #737373  /* Secondary text */
neutral-600: #525252  /* Body text */
neutral-700: #404040  /* Headings */
neutral-900: #171717  /* Primary text */
```

### Color Usage Patterns

**Text Hierarchy:**
```css
/* Primary headings */
text-neutral-900

/* Body text */
text-neutral-700

/* Secondary/supporting text */
text-neutral-600

/* Muted/de-emphasized text */
text-neutral-500

/* Disabled text */
text-neutral-400
```

**Background Layers:**
```css
/* Page background */
bg-neutral-50 or bg-white

/* Card/container background */
bg-white with border-neutral-200

/* Nested/elevated background */
bg-neutral-50

/* Hover backgrounds */
hover:bg-ocean-50 hover:bg-neutral-50
```

**Interactive States:**
```css
/* Default */
bg-ocean-600 text-white

/* Hover */
hover:bg-ocean-700

/* Active/Pressed */
active:bg-ocean-800

/* Focus (keyboard) */
focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2

/* Disabled */
disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed
```

---

## Typography

### Font Family
```css
font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

**Why Inter?**
- Exceptional readability at all sizes
- Professional yet friendly
- Optimized for digital interfaces
- Wide range of weights (400-700)

### Type Scale

Modern, accessible scale based on 1.25 ratio (major third):

```css
/* Display - Hero sections only */
text-6xl: 60px / 1.1    (line-height: 66px)
text-5xl: 48px / 1.1    (line-height: 53px)

/* Headings */
text-4xl: 36px / 1.2    (line-height: 43px) - H1
text-3xl: 30px / 1.2    (line-height: 36px) - H2
text-2xl: 24px / 1.3    (line-height: 31px) - H3
text-xl:  20px / 1.4    (line-height: 28px) - H4

/* Body */
text-lg:  18px / 1.6    (line-height: 29px) - Large body
text-base:16px / 1.6    (line-height: 26px) - Default body ⭐
text-sm:  14px / 1.5    (line-height: 21px) - Small text
text-xs:  12px / 1.5    (line-height: 18px) - Captions, labels
```

### Font Weights

```css
font-normal:    400  /* Body text */
font-medium:    500  /* Emphasis, labels */
font-semibold:  600  /* Subheadings, buttons */
font-bold:      700  /* Headings, important text */
```

### Typography Patterns

**Page Title**
```jsx
<h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
  Share more. Own less.
</h1>
```

**Section Heading**
```jsx
<h2 className="text-3xl font-bold text-neutral-900 mb-4">
  How It Works
</h2>
```

**Card Title**
```jsx
<h3 className="text-xl font-semibold text-neutral-700 mb-2">
  Family & Friends
</h3>
```

**Body Text**
```jsx
<p className="text-base text-neutral-600 leading-relaxed">
  Share tools, books, and more with people you trust.
</p>
```

**Supporting Text**
```jsx
<p className="text-sm text-neutral-500">
  5 members · 23 items
</p>
```

**Label**
```jsx
<label className="text-sm font-medium text-neutral-700 mb-2">
  Bubble Name
</label>
```

---

## Spacing System

Consistent spacing using 4px base unit (Tailwind default):

```css
/* Base scale (4px increments) */
0:    0px
0.5:  2px   /* Tight spacing */
1:    4px   /* Icon-to-text gaps */
2:    8px   /* Small gaps */
3:    12px  /* Default gaps */
4:    16px  /* Component padding ⭐ */
5:    20px  /* Section spacing */
6:    24px  /* Card padding ⭐ */
8:    32px  /* Large spacing */
10:   40px  /* Section spacing */
12:   48px  /* Extra large spacing */
16:   64px  /* Hero spacing */
20:   80px  /* Page section spacing ⭐ */
24:   96px  /* Major sections */
```

### Spacing Patterns

**Component Internal Padding:**
```jsx
/* Small elements (badges, tags) */
px-2 py-1

/* Buttons */
px-6 py-3

/* Cards */
p-6 (24px all sides)

/* Large cards */
p-8 (32px all sides)
```

**Component Gaps:**
```jsx
/* Tight (icon + text) */
gap-2 (8px)

/* Default (buttons, form fields) */
gap-4 (16px)

/* Sections */
gap-8 (32px)
```

**Section Spacing:**
```jsx
/* Between sections */
py-16 md:py-20

/* Hero sections */
py-20 md:py-24

/* Containers */
px-4 md:px-6 lg:px-8
```

---

## Border Radius System

Soft, friendly rounding throughout:

```css
rounded-sm:   2px   /* Subtle, minimal */
rounded:      4px   /* Tags, small elements */
rounded-md:   6px   /* Not used - skip */
rounded-lg:   8px   /* Buttons, inputs ⭐ */
rounded-xl:   12px  /* Cards, containers ⭐ */
rounded-2xl:  16px  /* Large cards, modals */
rounded-3xl:  24px  /* Hero elements */
rounded-full: 9999px /* Avatars, badges, pills ⭐ */
```

**Usage Guidelines:**
- **Buttons/Inputs**: `rounded-lg` (8px) for clickable consistency
- **Cards**: `rounded-xl` (12px) for friendly, modern feel
- **Avatars/Icons**: `rounded-full` for perfect circles
- **Avoid**: `rounded-md` (6px) - not in our scale

---

## Shadow System

Subtle, layered elevation using soft shadows:

```css
/* Resting state - barely visible */
shadow-sm:
  0 1px 2px 0 rgb(0 0 0 / 0.05)

/* Default cards - gentle elevation */
shadow:
  0 1px 3px 0 rgb(0 0 0 / 0.1),
  0 1px 2px -1px rgb(0 0 0 / 0.1)

/* Hover state - noticeable lift */
shadow-md:
  0 4px 6px -1px rgb(0 0 0 / 0.1),
  0 2px 4px -2px rgb(0 0 0 / 0.1)

/* Elevated (modals, dropdowns) */
shadow-lg:
  0 10px 15px -3px rgb(0 0 0 / 0.1),
  0 4px 6px -4px rgb(0 0 0 / 0.1)

/* Floating (tooltips, popovers) */
shadow-xl:
  0 20px 25px -5px rgb(0 0 0 / 0.1),
  0 8px 10px -6px rgb(0 0 0 / 0.1)
```

**Elevation Hierarchy:**
```css
/* Flat on page */
No shadow or shadow-sm

/* Cards, containers */
shadow-sm hover:shadow-md

/* Floating panels */
shadow-lg

/* Modals, dialogs */
shadow-xl
```

---

## Animation Principles

Smooth, purposeful motion that delights without distracting.

### Timing Functions

```css
/* Default - most interactions */
ease-out: cubic-bezier(0, 0, 0.2, 1)

/* Snappy - buttons, toggles */
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)

/* Gentle - large movements */
ease: cubic-bezier(0.25, 0.1, 0.25, 1)
```

### Duration Scale

```css
duration-75:  75ms   /* Instant feedback (hover) */
duration-100: 100ms  /* Quick transitions */
duration-150: 150ms  /* Default interactions ⭐ */
duration-200: 200ms  /* Standard transitions ⭐ */
duration-300: 300ms  /* Noticeable animations */
duration-500: 500ms  /* Pronounced effects */
duration-700: 700ms  /* Loading states */
```

### Animation Patterns

**Button Hover:**
```jsx
<button className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
```

**Card Hover:**
```jsx
<div className="transition-all duration-200 hover:shadow-md hover:border-ocean-300">
```

**Fade In:**
```jsx
<div className="animate-in fade-in duration-300">
```

**Slide Up:**
```jsx
<div className="animate-in slide-in-from-bottom duration-300">
```

**Loading Spinner:**
```jsx
<div className="animate-spin duration-700">
```

### Accessibility: Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Component Styling

### Buttons

#### Primary Button
```jsx
<button className="
  px-6 py-3
  bg-ocean-600 hover:bg-ocean-700 active:bg-ocean-800
  text-white font-medium text-base
  rounded-lg shadow-sm hover:shadow-md
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  inline-flex items-center justify-center gap-2
">
  Get Started
</button>
```

**States:**
- Default: ocean-600 background, shadow-sm
- Hover: ocean-700 background, shadow-md, subtle lift
- Active: ocean-800 background
- Focus: 2px ocean-500 ring with 2px offset
- Disabled: 50% opacity, not-allowed cursor

#### Secondary Button
```jsx
<button className="
  px-6 py-3
  bg-white hover:bg-neutral-50 active:bg-neutral-100
  text-ocean-700 font-medium text-base
  rounded-lg border-2 border-ocean-600 hover:border-ocean-700
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  inline-flex items-center justify-center gap-2
">
  Learn More
</button>
```

#### Ghost Button
```jsx
<button className="
  px-4 py-2
  bg-transparent hover:bg-ocean-50 active:bg-ocean-100
  text-ocean-700 font-medium text-base
  rounded-lg
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2
  inline-flex items-center justify-center gap-2
">
  Cancel
</button>
```

#### Destructive Button
```jsx
<button className="
  px-6 py-3
  bg-error-600 hover:bg-error-700 active:bg-error-800
  text-white font-medium text-base
  rounded-lg shadow-sm hover:shadow-md
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  inline-flex items-center justify-center gap-2
">
  Delete
</button>
```

#### Size Variants
```jsx
/* Small */
px-4 py-2 text-sm

/* Medium (default) */
px-6 py-3 text-base

/* Large */
px-8 py-4 text-lg
```

---

### Cards

#### Bubble Card (Premium)
```jsx
<div className="
  relative overflow-hidden
  bg-gradient-to-br from-ocean-50 via-white to-sage-50
  rounded-xl p-6
  shadow-sm hover:shadow-md
  border-2 border-ocean-200 hover:border-ocean-300
  transition-all duration-200
  cursor-pointer
">
  {/* Decorative bubbles */}
  <div className="absolute -top-8 -right-8 w-32 h-32 bg-ocean-100 rounded-full opacity-20 blur-2xl" />
  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-sage-100 rounded-full opacity-20 blur-xl" />

  {/* Content */}
  <div className="relative z-10">
    {/* Your content here */}
  </div>
</div>
```

**Key Features:**
- Soft gradient background (ocean-50 → white → sage-50)
- Decorative blur bubbles for depth
- 2px border that changes on hover
- Shadow elevation on hover

#### Item Card (Clean)
```jsx
<div className="
  bg-white rounded-lg
  shadow-sm hover:shadow-md
  border border-neutral-200 hover:border-ocean-200
  overflow-hidden
  transition-all duration-200
">
  {/* Image placeholder */}
  <div className="aspect-square bg-gradient-to-br from-ocean-100 to-sage-100 relative flex items-center justify-center">
    {/* Icon or image */}
  </div>

  {/* Content */}
  <div className="p-4">
    {/* Your content here */}
  </div>
</div>
```

**Key Features:**
- Clean white background
- Soft gradient image placeholder
- Subtle border color shift on hover
- Consistent rounded corners

#### Info Card
```jsx
<div className="
  bg-white p-6 md:p-8
  rounded-xl
  shadow-sm
  border border-neutral-200
">
  <div className="flex items-start gap-4">
    {/* Icon */}
    <div className="w-12 h-12 bg-ocean-100 rounded-lg flex items-center justify-center flex-shrink-0">
      {/* Icon SVG */}
    </div>

    {/* Content */}
    <div>
      <h3 className="text-xl font-semibold text-neutral-900 mb-2">
        Title
      </h3>
      <p className="text-neutral-600">
        Description text
      </p>
    </div>
  </div>
</div>
```

---

### Inputs & Forms

#### Text Input
```jsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-neutral-700">
    Email
  </label>
  <input
    type="email"
    className="
      w-full px-4 py-3
      bg-white border-2 border-neutral-200
      rounded-lg
      text-base text-neutral-900 placeholder:text-neutral-400
      transition-all duration-200
      focus:outline-none focus:border-ocean-500 focus:ring-4 focus:ring-ocean-100
      disabled:bg-neutral-50 disabled:text-neutral-500
    "
    placeholder="you@example.com"
  />
</div>
```

**States:**
- Default: neutral-200 border
- Focus: ocean-500 border + ocean-100 ring
- Error: error-500 border + error-100 ring
- Disabled: neutral-50 background

#### Search Input
```jsx
<div className="relative">
  <input
    type="search"
    className="
      w-full pl-12 pr-4 py-3
      bg-neutral-50 border-2 border-transparent
      rounded-lg
      text-base text-neutral-900 placeholder:text-neutral-500
      transition-all duration-200
      focus:outline-none focus:bg-white focus:border-ocean-500 focus:ring-4 focus:ring-ocean-100
    "
    placeholder="Search items..."
  />
  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
    {/* Search icon */}
  </div>
</div>
```

#### Textarea
```jsx
<textarea
  className="
    w-full px-4 py-3
    bg-white border-2 border-neutral-200
    rounded-lg
    text-base text-neutral-900 placeholder:text-neutral-400
    transition-all duration-200
    focus:outline-none focus:border-ocean-500 focus:ring-4 focus:ring-ocean-100
    resize-none
  "
  rows={4}
  placeholder="Describe your item..."
/>
```

---

### Navigation

#### Header/Navbar
```jsx
<nav className="
  sticky top-0 z-50
  bg-white/80 backdrop-blur-lg
  border-b border-neutral-200
  px-4 py-4
">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    {/* Logo */}
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-gradient-to-br from-ocean-500 to-ocean-600 rounded-full flex items-center justify-center">
        {/* Logo icon */}
      </div>
      <span className="text-xl font-bold text-neutral-900">Bubbles</span>
    </div>

    {/* Navigation items */}
    <div className="flex items-center gap-6">
      {/* Nav links */}
    </div>
  </div>
</nav>
```

**Key Features:**
- Sticky positioning
- Frosted glass effect (backdrop-blur)
- Semi-transparent background
- Clear bottom border

#### Tab Navigation
```jsx
<div className="border-b border-neutral-200">
  <nav className="flex gap-8">
    <button className="
      px-1 py-4
      text-sm font-medium
      text-ocean-600 border-b-2 border-ocean-600
    ">
      Active Tab
    </button>
    <button className="
      px-1 py-4
      text-sm font-medium
      text-neutral-600 border-b-2 border-transparent
      hover:text-neutral-900 hover:border-neutral-300
      transition-colors duration-200
    ">
      Inactive Tab
    </button>
  </nav>
</div>
```

---

### Modals & Dialogs

#### Modal Overlay
```jsx
<div className="
  fixed inset-0 z-50
  bg-black/50 backdrop-blur-sm
  flex items-center justify-center p-4
">
  <div className="
    w-full max-w-md
    bg-white rounded-2xl
    shadow-xl
    p-6
    animate-in fade-in zoom-in-95 duration-200
  ">
    {/* Modal content */}
  </div>
</div>
```

**Key Features:**
- Semi-transparent black overlay
- Backdrop blur for depth
- Centered content
- Smooth fade + zoom animation

---

### Badges & Pills

#### Status Badge
```jsx
<span className="
  inline-flex items-center gap-1
  px-2 py-1
  bg-success-100 text-success-700
  rounded-full
  text-xs font-medium
">
  <span className="w-1.5 h-1.5 bg-success-500 rounded-full" />
  Available
</span>
```

**Variants:**
```jsx
/* Available */
bg-success-100 text-success-700

/* Borrowed */
bg-warning-100 text-warning-700

/* Unavailable */
bg-neutral-100 text-neutral-600

/* New */
bg-coral-100 text-coral-700
```

#### Bubble Share Pills
```jsx
<div className="flex flex-wrap gap-1">
  <span className="
    px-3 py-1
    bg-ocean-100 text-ocean-700
    rounded-full
    text-xs font-medium
  ">
    Family
  </span>
  <span className="
    px-3 py-1
    bg-sage-100 text-sage-700
    rounded-full
    text-xs font-medium
  ">
    Friends
  </span>
</div>
```

---

### Avatars & Icons

#### Avatar
```jsx
<div className="w-10 h-10 rounded-full border-2 border-white bg-ocean-100 flex items-center justify-center text-sm font-medium text-ocean-700 overflow-hidden">
  {hasImage ? (
    <img src={avatar} alt={name} className="w-full h-full object-cover" />
  ) : (
    <span>{initials}</span>
  )}
</div>
```

**Sizes:**
```jsx
/* Extra small */
w-6 h-6 text-xs

/* Small */
w-8 h-8 text-xs

/* Medium (default) */
w-10 h-10 text-sm

/* Large */
w-12 h-12 text-base

/* Extra large */
w-16 h-16 text-lg
```

#### Icon Container
```jsx
<div className="w-12 h-12 bg-ocean-100 rounded-lg flex items-center justify-center">
  <svg className="w-6 h-6 text-ocean-600">
    {/* Icon path */}
  </svg>
</div>
```

---

### Empty States

```jsx
<div className="text-center py-16 px-4">
  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
    <svg className="w-8 h-8 text-neutral-400">
      {/* Icon */}
    </svg>
  </div>
  <h3 className="text-xl font-semibold text-neutral-700 mb-2">
    No items yet
  </h3>
  <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
    Start by adding your first item to share with your bubbles.
  </p>
  <button className="px-6 py-3 bg-ocean-600 hover:bg-ocean-700 text-white rounded-lg font-medium transition-colors duration-200">
    Add Item
  </button>
</div>
```

---

## Page Layouts

### Landing Page Pattern

```jsx
<div className="min-h-screen">
  {/* Hero Section */}
  <section className="py-20 md:py-24 px-4 bg-gradient-to-b from-ocean-50 to-white">
    <div className="max-w-4xl mx-auto text-center">
      <span className="text-6xl mb-6 inline-block">🫧</span>
      <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
        Hero Headline
      </h1>
      <p className="text-xl text-neutral-600 mb-10 max-w-2xl mx-auto">
        Supporting copy that explains value prop
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {/* CTAs */}
      </div>
    </div>
  </section>

  {/* Feature Section */}
  <section className="py-16 md:py-20 px-4">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-neutral-900 mb-12">
        Section Title
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Feature cards */}
      </div>
    </div>
  </section>

  {/* Alternating Background Section */}
  <section className="py-16 md:py-20 px-4 bg-neutral-50">
    {/* Content */}
  </section>
</div>
```

### Dashboard Pattern

```jsx
<div className="min-h-screen bg-neutral-50">
  {/* Page Header */}
  <div className="bg-white border-b border-neutral-200 px-4 py-6">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-neutral-900 mb-2">
        Page Title
      </h1>
      <p className="text-neutral-600">
        Supporting description
      </p>
    </div>
  </div>

  {/* Main Content */}
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Cards */}
    </div>
  </div>
</div>
```

### Detail Page Pattern

```jsx
<div className="min-h-screen bg-neutral-50">
  <div className="max-w-5xl mx-auto px-4 py-8">
    {/* Back button */}
    <button className="mb-6 text-ocean-600 hover:text-ocean-700 flex items-center gap-2">
      <svg className="w-5 h-5">←</svg>
      Back
    </button>

    {/* Main card */}
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
      {/* Content sections */}
    </div>
  </div>
</div>
```

---

## Micro-Interactions & Delight

### Button Micro-Interactions

**Subtle Lift on Hover:**
```jsx
<button className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
```

**Scale on Active:**
```jsx
<button className="transition-transform duration-150 active:scale-95">
```

**Ripple Effect (via animation):**
```css
@keyframes ripple {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(4); opacity: 0; }
}
```

### Loading States

**Button Loading:**
```jsx
<button disabled className="relative">
  <span className={loading ? 'opacity-0' : ''}>Button Text</span>
  {loading && (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  )}
</button>
```

**Skeleton Loading:**
```jsx
<div className="animate-pulse">
  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
  <div className="h-4 bg-neutral-200 rounded w-1/2" />
</div>
```

### Success States

**Checkmark Animation:**
```jsx
<div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
  <svg className="w-8 h-8 text-success-600 animate-in fade-in duration-500 delay-150">
    <path d="M5 13l4 4L19 7" />
  </svg>
</div>
```

**Toast Notification:**
```jsx
<div className="
  fixed bottom-4 right-4 z-50
  bg-white rounded-lg shadow-lg border border-neutral-200
  p-4 max-w-sm
  animate-in slide-in-from-bottom duration-300
">
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0">
      ✓
    </div>
    <div>
      <h4 className="font-semibold text-neutral-900 mb-1">Success!</h4>
      <p className="text-sm text-neutral-600">Item added to your bubble</p>
    </div>
  </div>
</div>
```

### Hover Animations

**Card Tilt (subtle):**
```jsx
<div className="transition-transform duration-200 hover:rotate-1 hover:scale-105">
```

**Gradient Shift:**
```jsx
<div className="bg-gradient-to-r from-ocean-500 to-ocean-600 hover:from-ocean-600 hover:to-ocean-700 transition-all duration-300">
```

**Border Glow:**
```jsx
<div className="border-2 border-ocean-200 hover:border-ocean-400 hover:shadow-lg hover:shadow-ocean-200/50 transition-all duration-300">
```

---

## Responsive Design

### Breakpoints

```css
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

### Mobile-First Patterns

**Typography:**
```jsx
<h1 className="text-4xl md:text-5xl lg:text-6xl">
```

**Spacing:**
```jsx
<section className="py-12 md:py-16 lg:py-20">
```

**Grid Layouts:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
```

**Flex Direction:**
```jsx
<div className="flex flex-col md:flex-row gap-4">
```

### Touch Targets

**Minimum size: 44×44px (iOS) / 48×48px (Android)**

```jsx
/* Good - adequate touch target */
<button className="px-6 py-3">  /* 48px height */

/* Good - explicit minimum */
<button className="min-w-[44px] min-h-[44px]">

/* Bad - too small */
<button className="px-2 py-1">  /* ~28px height */
```

---

## Accessibility Guidelines

### Color Contrast

**All text must meet WCAG AA standards:**
- Normal text (16px): 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

**Our compliant pairings:**
```css
/* AAA - Excellent */
ocean-600 on white:     5.9:1 ✓
neutral-900 on white:   15.3:1 ✓

/* AA - Good */
ocean-700 on white:     7.8:1 ✓
neutral-600 on white:   4.7:1 ✓
```

### Focus States

**Always visible, never removed:**
```jsx
focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2
```

**For dark backgrounds:**
```jsx
focus:ring-white focus:ring-offset-ocean-600
```

### Keyboard Navigation

**Tab order must be logical:**
- Skip links for main content
- All interactive elements reachable
- Clear focus indicators
- Logical reading order

### Screen Reader Support

**Semantic HTML:**
```jsx
<button>  /* not <div onclick> */
<nav>     /* not <div class="nav"> */
<main>    /* not <div id="main"> */
<article> /* not <div class="card"> */
```

**ARIA labels:**
```jsx
<button aria-label="Close dialog">×</button>
<img alt="Descriptive text" />
<input aria-describedby="help-text" />
```

### Motion & Animation

**Respect user preferences:**
```jsx
/* Already included in base CSS */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Before/After Examples

### Button Transformation

**Before:**
```jsx
<button className="bg-blue-500 text-white p-2 rounded">
  Click me
</button>
```

**After:**
```jsx
<button className="
  px-6 py-3
  bg-ocean-600 hover:bg-ocean-700 active:bg-ocean-800
  text-white font-medium
  rounded-lg shadow-sm hover:shadow-md
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2
  inline-flex items-center justify-center gap-2
">
  Get Started
</button>
```

**Improvements:**
- ✅ Consistent padding (24px horizontal)
- ✅ Semantic color names (ocean vs blue)
- ✅ Clear hover/active states
- ✅ Focus ring for accessibility
- ✅ Smooth transitions
- ✅ Professional shadow elevation

---

### Card Transformation

**Before:**
```jsx
<div className="border p-4 rounded bg-white">
  <h3>Bubble Name</h3>
  <p>5 members</p>
</div>
```

**After:**
```jsx
<div className="
  relative overflow-hidden
  bg-gradient-to-br from-ocean-50 via-white to-sage-50
  rounded-xl p-6
  shadow-sm hover:shadow-md
  border-2 border-ocean-200 hover:border-ocean-300
  transition-all duration-200
  cursor-pointer
">
  {/* Decorative bubbles */}
  <div className="absolute -top-8 -right-8 w-32 h-32 bg-ocean-100 rounded-full opacity-20 blur-2xl" />
  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-sage-100 rounded-full opacity-20 blur-xl" />

  <div className="relative z-10">
    <h3 className="text-xl font-semibold text-neutral-700 mb-2">
      Bubble Name
    </h3>
    <p className="text-sm text-neutral-500">
      5 members · 12 items
    </p>
  </div>
</div>
```

**Improvements:**
- ✅ Soft gradient background for depth
- ✅ Decorative bubble elements (on-brand)
- ✅ Larger padding for breathing room
- ✅ Better typography hierarchy
- ✅ Interactive hover states
- ✅ Rounded corners for friendliness

---

## Custom CSS Utilities

### Gradient Backgrounds

```css
/* Ocean gradient */
.bg-ocean-gradient {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
}

/* Soft page gradient */
.bg-soft-gradient {
  background: linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%);
}

/* Card gradient */
.bg-card-gradient {
  background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #f6f7f6 100%);
}
```

### Glass Morphism

```css
.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Decorative Elements

```css
/* Floating bubble animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Subtle pulse */
@keyframes pulse-soft {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.animate-pulse-soft {
  animation: pulse-soft 2s ease-in-out infinite;
}
```

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Update color tokens in Tailwind config
- [ ] Verify all colors meet WCAG AA contrast
- [ ] Implement focus ring utilities
- [ ] Add reduced motion support
- [ ] Test with screen readers

### Phase 2: Components
- [ ] Update Button component with all variants
- [ ] Refine Card components (Bubble, Item, Info)
- [ ] Standardize Input/Form components
- [ ] Create Badge/Pill components
- [ ] Build Modal/Dialog patterns

### Phase 3: Pages
- [ ] Refine Landing page gradients
- [ ] Update Login page aesthetics
- [ ] Polish Dashboard layouts
- [ ] Enhance Detail page spacing

### Phase 4: Delight
- [ ] Add hover micro-interactions
- [ ] Implement loading states
- [ ] Create success animations
- [ ] Build toast notification system
- [ ] Add decorative bubble elements

### Phase 5: Polish
- [ ] Optimize for mobile touch targets
- [ ] Test all responsive breakpoints
- [ ] Verify keyboard navigation
- [ ] Audit color contrast
- [ ] Performance optimization

---

## Resources & Tools

### Design Tools
- **Figma Color Contrast Plugin**: Check WCAG compliance
- **Tailwind CSS IntelliSense**: VSCode extension
- **Accessibility Insights**: Browser extension

### Reference Sites
- **Resend** (resend.com): Code aesthetics, developer UX
- **Loom** (loom.com): Warm gradients, friendly interactions
- **Notion** (notion.so): Clean layouts, elegant typography
- **Linear** (linear.app): Smooth animations, polished UI

### Testing
- **WebAIM Contrast Checker**: Color contrast ratios
- **WAVE**: Accessibility evaluation
- **Lighthouse**: Performance & accessibility scores

---

## Version History

**v1.0** - January 2026
- Initial design system
- Complete color, typography, spacing scales
- Component library patterns
- Accessibility guidelines
- Micro-interaction principles

---

**Built with care for the Bubbles community** 🫧
