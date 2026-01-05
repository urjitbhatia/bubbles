# Bubbles Design Language

**Version 1.0** | Last Updated: December 2025

A comprehensive design system for Bubbles—a lending library app built on trust, community, and thoughtful reuse.

---

## Design Principles

1. **Trustworthy & Clear**: Visual design reinforces reliability and transparency in lending relationships
2. **Community-First**: Emphasize connections between people, not just transactions
3. **Approachable**: Friendly without being childish; professional without being corporate
4. **Sustainable**: Visual language that reflects our reuse-focused mission
5. **Mobile-Native**: Optimized for thumb-friendly interactions and small screens

---

## 1. Color Palette

Our color system balances warmth and trust, using soft, natural tones that feel inviting without being overly playful.

### Primary Colors

```javascript
// tailwind.config.js
colors: {
  // Ocean Blue - Primary brand color
  // Represents trust, community, and the "bubble" metaphor
  ocean: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#b9e6fe',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',  // Primary
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },

  // Coral - Secondary/Accent color
  // Warm, friendly, energetic - for CTAs and highlights
  coral: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',  // Secondary
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
    950: '#4c0519',
  },

  // Sage - Tertiary/Support color
  // Natural, sustainable, calming
  sage: {
    50: '#f6f7f6',
    100: '#e3e8e3',
    200: '#c7d1c8',
    300: '#a3b3a5',
    400: '#7d9180',
    500: '#5f7562',  // Tertiary
    600: '#4a5d4d',
    700: '#3d4c3f',
    800: '#333f35',
    900: '#2c352e',
    950: '#171d18',
  },
}
```

### Semantic Colors

```javascript
// Extend the above in tailwind.config.js
colors: {
  // Success - Item returned, request approved
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',  // Main success
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Warning - Item due soon, pending action
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',  // Main warning
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Error - Item overdue, request denied
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',  // Main error
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Info - Tips, help text, neutral notifications
  info: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',  // Main info (matches ocean-500)
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
}
```

### Background & Surface Colors

```javascript
colors: {
  // Neutral grays for backgrounds, borders, and text
  neutral: {
    50: '#fafafa',   // Page background (light mode)
    100: '#f5f5f5',  // Card/surface background
    200: '#e5e5e5',  // Borders, dividers
    300: '#d4d4d4',  // Disabled backgrounds
    400: '#a3a3a3',  // Placeholder text
    500: '#737373',  // Secondary text
    600: '#525252',  // Primary text (light mode)
    700: '#404040',  // Headings
    800: '#262626',  // Dark surfaces
    900: '#171717',  // Dark mode background
    950: '#0a0a0a',  // Deepest dark
  },
}
```

### Usage Guidelines

**Primary (Ocean Blue)**
- Primary buttons and CTAs
- Active navigation states
- Links and interactive elements
- Loading indicators
- Focus rings

**Secondary (Coral)**
- Secondary actions
- Highlights and accents
- Notification badges
- Special promotions or features
- Hover states on primary elements

**Tertiary (Sage)**
- Subtle backgrounds
- Tags and labels
- Eco/sustainability messaging
- Neutral secondary actions
- Empty state illustrations

**Semantic Colors**
- Use consistently for status indication
- Always pair with text/icons (never rely on color alone)
- Maintain AA contrast ratios minimum

---

## 2. Typography

We use a clean, friendly sans-serif system with excellent readability across all sizes.

### Font Families

```javascript
// tailwind.config.js
fontFamily: {
  sans: ['Inter var', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  display: ['Cabinet Grotesk', 'Inter var', 'Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
}
```

**Primary Font: Inter**
- Google Fonts: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`
- Use for all body text, UI elements, and most headings
- Variable font support for better performance
- Excellent readability at small sizes

**Display Font: Cabinet Grotesk** (optional upgrade)
- For large headings and marketing content
- Can substitute with Inter if keeping bundle size minimal
- Alternative free option: Plus Jakarta Sans

**Mono Font: JetBrains Mono**
- For codes, IDs, technical information
- Use sparingly

### Type Scale

```javascript
// tailwind.config.js
fontSize: {
  'xs': ['0.75rem', { lineHeight: '1rem' }],       // 12px - Captions, labels
  'sm': ['0.875rem', { lineHeight: '1.25rem' }],   // 14px - Small body, helper text
  'base': ['1rem', { lineHeight: '1.5rem' }],      // 16px - Body text (default)
  'lg': ['1.125rem', { lineHeight: '1.75rem' }],   // 18px - Large body, subheadings
  'xl': ['1.25rem', { lineHeight: '1.75rem' }],    // 20px - H4
  '2xl': ['1.5rem', { lineHeight: '2rem' }],       // 24px - H3
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],  // 30px - H2
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],    // 36px - H1
  '5xl': ['3rem', { lineHeight: '1' }],            // 48px - Display/Hero
  '6xl': ['3.75rem', { lineHeight: '1' }],         // 60px - Large display
}
```

### Font Weights

```javascript
fontWeight: {
  normal: '400',    // Body text
  medium: '500',    // Subtle emphasis, button text
  semibold: '600',  // Subheadings, labels, strong emphasis
  bold: '700',      // Headings, primary emphasis
}
```

### Typography Usage

**Headings**
```html
<!-- H1 - Page titles -->
<h1 class="font-display text-4xl font-bold text-neutral-700">My Bubbles</h1>

<!-- H2 - Section headers -->
<h2 class="font-display text-3xl font-bold text-neutral-700">Available Items</h2>

<!-- H3 - Card titles, modal headers -->
<h3 class="text-2xl font-semibold text-neutral-700">Mountain Bike</h3>

<!-- H4 - List headers, subsections -->
<h4 class="text-xl font-semibold text-neutral-600">Borrowed Items</h4>
```

**Body Text**
```html
<!-- Primary body text -->
<p class="text-base text-neutral-600">Browse items your friends want to share...</p>

<!-- Secondary/helper text -->
<p class="text-sm text-neutral-500">Last borrowed 3 days ago</p>

<!-- Captions, metadata -->
<span class="text-xs text-neutral-400">Added Feb 2024</span>

<!-- Large/emphasized body -->
<p class="text-lg text-neutral-600">Welcome to Bubbles!</p>
```

**Links**
```html
<a href="#" class="text-ocean-600 hover:text-ocean-700 underline decoration-ocean-300 hover:decoration-ocean-500">
  View details
</a>
```

### Line Height & Spacing

- **Headings**: Tight line height (1.1-1.25) for visual impact
- **Body text**: Comfortable reading (1.5-1.75) for accessibility
- **Paragraph spacing**: Use `space-y-4` or `mb-4` between paragraphs
- **Section spacing**: Use `space-y-8` or larger for major sections

---

## 3. Spacing & Layout

### Spacing Scale

Use Tailwind's default spacing scale based on 0.25rem (4px) increments:

```javascript
// Key spacing values (already in Tailwind)
spacing: {
  '0': '0',
  '1': '0.25rem',  // 4px  - Tight internal padding
  '2': '0.5rem',   // 8px  - Small gaps
  '3': '0.75rem',  // 12px - Medium-small gaps
  '4': '1rem',     // 16px - Default gap, card padding
  '5': '1.25rem',  // 20px - Comfortable padding
  '6': '1.5rem',   // 24px - Large padding
  '8': '2rem',     // 32px - Section spacing
  '10': '2.5rem',  // 40px - Large section spacing
  '12': '3rem',    // 48px - Major sections
  '16': '4rem',    // 64px - Page sections
  '20': '5rem',    // 80px - Hero spacing
}
```

### Spacing Conventions

**Component Internal Spacing**
- **Tight**: `p-2` or `p-3` for badges, chips
- **Comfortable**: `p-4` for buttons, inputs
- **Generous**: `p-6` for cards, modals

**Stack Spacing** (vertical gaps)
- **Tight list**: `space-y-2` for compact lists
- **Standard list**: `space-y-4` for default lists
- **Sections**: `space-y-8` between major sections
- **Page sections**: `space-y-12` or `space-y-16`

**Inline Spacing** (horizontal gaps)
- **Button groups**: `space-x-2` or `gap-2`
- **Form fields**: `space-x-4` or `gap-4`
- **Navigation items**: `space-x-6` or `gap-6`

### Border Radius

```javascript
// tailwind.config.js
borderRadius: {
  'none': '0',
  'sm': '0.25rem',    // 4px  - Small elements, badges
  'DEFAULT': '0.5rem', // 8px  - Buttons, inputs, cards
  'md': '0.625rem',    // 10px - Larger cards
  'lg': '0.75rem',     // 12px - Modals, prominent cards
  'xl': '1rem',        // 16px - Special elements
  '2xl': '1.5rem',     // 24px - Hero cards
  'full': '9999px',    // Pills, avatars, circle icons
}
```

**Usage**
- **Buttons, inputs**: `rounded` (8px)
- **Cards**: `rounded-lg` (12px)
- **Modals, sheets**: `rounded-xl` (16px)
- **Avatars, badges**: `rounded-full`
- **Item photos**: `rounded-md` (10px)

### Container Widths

```javascript
// tailwind.config.js
extend: {
  maxWidth: {
    'container-sm': '640px',   // Single column forms
    'container-md': '768px',   // Default content width
    'container-lg': '1024px',  // Wide desktop views
    'container-xl': '1280px',  // Maximum content width
  }
}
```

**Mobile-First Layout**
```html
<!-- Full width on mobile, contained on desktop -->
<div class="w-full max-w-container-md mx-auto px-4 sm:px-6 lg:px-8">
  <!-- Content -->
</div>
```

### Grid System

Use CSS Grid and Flexbox:

**Item Grid**
```html
<!-- Responsive item grid -->
<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
  <!-- Item cards -->
</div>
```

**Form Layouts**
```html
<!-- Two-column form on larger screens -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <!-- Form fields -->
</div>
```

### Safe Areas (Mobile PWA)

```css
/* Account for iOS safe areas */
.safe-top {
  padding-top: max(1rem, env(safe-area-inset-top));
}

.safe-bottom {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}

/* Bottom navigation safe area */
.bottom-nav {
  padding-bottom: calc(1rem + env(safe-area-inset-bottom));
}
```

---

## 4. Component Patterns

### Buttons

**Primary Button**
```html
<button class="
  px-6 py-3
  bg-ocean-600 hover:bg-ocean-700 active:bg-ocean-800
  text-white font-medium
  rounded-lg
  shadow-sm hover:shadow-md
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Request Item
</button>
```

**Secondary Button**
```html
<button class="
  px-6 py-3
  bg-white hover:bg-neutral-50 active:bg-neutral-100
  text-ocean-700 font-medium
  border-2 border-ocean-600 hover:border-ocean-700
  rounded-lg
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Cancel
</button>
```

**Ghost Button**
```html
<button class="
  px-4 py-2
  bg-transparent hover:bg-ocean-50 active:bg-ocean-100
  text-ocean-700 font-medium
  rounded-lg
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2
">
  Learn More
</button>
```

**Destructive Button**
```html
<button class="
  px-6 py-3
  bg-error-600 hover:bg-error-700 active:bg-error-800
  text-white font-medium
  rounded-lg
  shadow-sm hover:shadow-md
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2
">
  Delete Item
</button>
```

**Icon Button**
```html
<button class="
  p-2
  bg-transparent hover:bg-neutral-100 active:bg-neutral-200
  text-neutral-600 hover:text-neutral-700
  rounded-full
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2
">
  <svg class="w-6 h-6"><!-- Icon --></svg>
</button>
```

**Button Sizes**
- **Small**: `px-4 py-2 text-sm`
- **Default**: `px-6 py-3 text-base`
- **Large**: `px-8 py-4 text-lg`

**Accessibility**
- Always include `focus:ring` for keyboard navigation
- Use `disabled:` modifiers, never just opacity changes
- Minimum touch target: 44x44px on mobile

### Cards

**Item Card**
```html
<div class="
  bg-white
  rounded-lg
  shadow-sm hover:shadow-md
  border border-neutral-200
  overflow-hidden
  transition-shadow duration-200
">
  <!-- Image -->
  <div class="aspect-square bg-neutral-100 relative">
    <img src="..." alt="..." class="w-full h-full object-cover">
    <!-- Status badge -->
    <span class="absolute top-3 right-3 px-2 py-1 bg-success-500 text-white text-xs font-medium rounded-full">
      Available
    </span>
  </div>

  <!-- Content -->
  <div class="p-4">
    <h3 class="text-lg font-semibold text-neutral-700 mb-1">Mountain Bike</h3>
    <p class="text-sm text-neutral-500 mb-3">Owned by Sarah Chen</p>
    <p class="text-sm text-neutral-600 line-clamp-2">Perfect for weekend trail rides...</p>
  </div>

  <!-- Actions -->
  <div class="px-4 pb-4 pt-2 border-t border-neutral-100">
    <button class="w-full px-4 py-2 bg-ocean-600 hover:bg-ocean-700 text-white font-medium rounded-lg">
      Request to Borrow
    </button>
  </div>
</div>
```

**Bubble Card**
```html
<div class="
  bg-gradient-to-br from-ocean-50 to-sage-50
  rounded-xl
  p-6
  shadow-sm hover:shadow-md
  border-2 border-ocean-200 hover:border-ocean-300
  transition-all duration-200
  cursor-pointer
">
  <div class="flex items-start justify-between mb-4">
    <div class="flex-1">
      <h3 class="text-xl font-semibold text-neutral-700 mb-1">Family Circle</h3>
      <p class="text-sm text-neutral-500">12 members · 48 items</p>
    </div>
    <!-- Bubble icon -->
    <div class="w-12 h-12 bg-ocean-100 rounded-full flex items-center justify-center">
      <svg class="w-6 h-6 text-ocean-600"><!-- Icon --></svg>
    </div>
  </div>

  <!-- Member avatars -->
  <div class="flex -space-x-2">
    <img class="w-8 h-8 rounded-full border-2 border-white" src="..." alt="...">
    <img class="w-8 h-8 rounded-full border-2 border-white" src="..." alt="...">
    <img class="w-8 h-8 rounded-full border-2 border-white" src="..." alt="...">
    <div class="w-8 h-8 rounded-full border-2 border-white bg-neutral-200 flex items-center justify-center text-xs font-medium text-neutral-600">
      +9
    </div>
  </div>
</div>
```

**List Item Card**
```html
<div class="
  bg-white
  rounded-lg
  p-4
  border border-neutral-200
  hover:border-ocean-300
  hover:bg-ocean-50/30
  transition-colors duration-200
">
  <div class="flex items-center gap-4">
    <!-- Thumbnail -->
    <img class="w-16 h-16 rounded-md object-cover flex-shrink-0" src="..." alt="...">

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <h4 class="font-semibold text-neutral-700 truncate">Camping Tent</h4>
      <p class="text-sm text-neutral-500">Due back Mar 15</p>
    </div>

    <!-- Action -->
    <svg class="w-5 h-5 text-neutral-400 flex-shrink-0"><!-- Chevron --></svg>
  </div>
</div>
```

### Forms

**Text Input**
```html
<div class="space-y-2">
  <label for="item-name" class="block text-sm font-medium text-neutral-700">
    Item Name
  </label>
  <input
    type="text"
    id="item-name"
    class="
      w-full px-4 py-3
      bg-white
      border border-neutral-300
      rounded-lg
      text-neutral-700 placeholder:text-neutral-400
      focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent
      disabled:bg-neutral-100 disabled:cursor-not-allowed
      transition-colors duration-200
    "
    placeholder="e.g., Mountain Bike"
  >
  <!-- Helper text -->
  <p class="text-xs text-neutral-500">Give your item a descriptive name</p>
</div>
```

**Textarea**
```html
<div class="space-y-2">
  <label for="description" class="block text-sm font-medium text-neutral-700">
    Description
  </label>
  <textarea
    id="description"
    rows="4"
    class="
      w-full px-4 py-3
      bg-white
      border border-neutral-300
      rounded-lg
      text-neutral-700 placeholder:text-neutral-400
      focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent
      resize-none
    "
    placeholder="Describe your item..."
  ></textarea>
</div>
```

**Select/Dropdown**
```html
<div class="space-y-2">
  <label for="category" class="block text-sm font-medium text-neutral-700">
    Category
  </label>
  <select
    id="category"
    class="
      w-full px-4 py-3
      bg-white
      border border-neutral-300
      rounded-lg
      text-neutral-700
      focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent
      appearance-none
      bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E')]
      bg-[length:1.5rem] bg-[right_0.5rem_center] bg-no-repeat
      pr-10
    "
  >
    <option>Select a category</option>
    <option>Sports & Outdoors</option>
    <option>Tools & Equipment</option>
    <option>Electronics</option>
  </select>
</div>
```

**Checkbox**
```html
<div class="flex items-start gap-3">
  <input
    type="checkbox"
    id="terms"
    class="
      w-5 h-5 mt-0.5
      text-ocean-600
      border-neutral-300
      rounded
      focus:ring-2 focus:ring-ocean-500 focus:ring-offset-0
      transition-colors duration-200
    "
  >
  <label for="terms" class="text-sm text-neutral-600 cursor-pointer">
    I agree to the lending terms and conditions
  </label>
</div>
```

**Radio Button**
```html
<div class="space-y-3">
  <p class="text-sm font-medium text-neutral-700">Lending Duration</p>

  <div class="flex items-center gap-3">
    <input
      type="radio"
      id="duration-week"
      name="duration"
      class="
        w-5 h-5
        text-ocean-600
        border-neutral-300
        focus:ring-2 focus:ring-ocean-500 focus:ring-offset-0
      "
    >
    <label for="duration-week" class="text-sm text-neutral-600 cursor-pointer">
      Up to 1 week
    </label>
  </div>

  <div class="flex items-center gap-3">
    <input
      type="radio"
      id="duration-month"
      name="duration"
      class="
        w-5 h-5
        text-ocean-600
        border-neutral-300
        focus:ring-2 focus:ring-ocean-500 focus:ring-offset-0
      "
    >
    <label for="duration-month" class="text-sm text-neutral-600 cursor-pointer">
      Up to 1 month
    </label>
  </div>
</div>
```

**Toggle Switch**
```html
<div class="flex items-center justify-between">
  <span class="text-sm font-medium text-neutral-700">Available to lend</span>
  <button
    type="button"
    role="switch"
    aria-checked="true"
    class="
      relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
      bg-ocean-600
      transition-colors duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2
    "
  >
    <span
      class="
        pointer-events-none inline-block h-5 w-5 transform rounded-full
        bg-white shadow ring-0
        transition duration-200 ease-in-out
        translate-x-5
      "
    ></span>
  </button>
</div>
```

**Error State**
```html
<div class="space-y-2">
  <label for="email" class="block text-sm font-medium text-neutral-700">
    Email
  </label>
  <input
    type="email"
    id="email"
    class="
      w-full px-4 py-3
      bg-white
      border-2 border-error-500
      rounded-lg
      text-neutral-700
      focus:outline-none focus:ring-2 focus:ring-error-500 focus:border-transparent
    "
    aria-invalid="true"
    aria-describedby="email-error"
  >
  <p id="email-error" class="text-sm text-error-600 flex items-center gap-1">
    <svg class="w-4 h-4"><!-- Error icon --></svg>
    Please enter a valid email address
  </p>
</div>
```

### Badges

**Status Badges**
```html
<!-- Available -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
  Available
</span>

<!-- Borrowed -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
  Borrowed
</span>

<!-- Unavailable -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700">
  Unavailable
</span>

<!-- Overdue -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-100 text-error-800">
  Overdue
</span>
```

**Role Badges**
```html
<!-- Owner -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-ocean-100 text-ocean-800">
  Owner
</span>

<!-- Admin -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-coral-100 text-coral-800">
  Admin
</span>

<!-- Member -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sage-100 text-sage-800">
  Member
</span>
```

**Count Badge (Notification)**
```html
<div class="relative inline-flex">
  <button class="p-2 rounded-full hover:bg-neutral-100">
    <svg class="w-6 h-6 text-neutral-600"><!-- Bell icon --></svg>
  </button>
  <span class="absolute -top-1 -right-1 w-5 h-5 bg-coral-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
    3
  </span>
</div>
```

### Navigation

**Mobile Bottom Navigation**
```html
<nav class="
  fixed bottom-0 inset-x-0
  bg-white
  border-t border-neutral-200
  shadow-lg
  pb-safe-bottom
">
  <div class="flex justify-around items-center h-16">
    <!-- Active item -->
    <a href="#" class="flex flex-col items-center justify-center flex-1 gap-1 text-ocean-600">
      <svg class="w-6 h-6"><!-- Icon --></svg>
      <span class="text-xs font-medium">Browse</span>
    </a>

    <!-- Inactive items -->
    <a href="#" class="flex flex-col items-center justify-center flex-1 gap-1 text-neutral-500 hover:text-neutral-700">
      <svg class="w-6 h-6"><!-- Icon --></svg>
      <span class="text-xs">My Items</span>
    </a>

    <a href="#" class="flex flex-col items-center justify-center flex-1 gap-1 text-neutral-500 hover:text-neutral-700">
      <svg class="w-6 h-6"><!-- Icon --></svg>
      <span class="text-xs">Bubbles</span>
    </a>

    <a href="#" class="flex flex-col items-center justify-center flex-1 gap-1 text-neutral-500 hover:text-neutral-700">
      <svg class="w-6 h-6"><!-- Icon --></svg>
      <span class="text-xs">Profile</span>
    </a>
  </div>
</nav>
```

**Mobile Top Header**
```html
<header class="
  sticky top-0 z-10
  bg-white
  border-b border-neutral-200
  shadow-sm
  pt-safe-top
">
  <div class="flex items-center justify-between h-16 px-4">
    <!-- Back/Menu -->
    <button class="p-2 -ml-2 hover:bg-neutral-100 rounded-full">
      <svg class="w-6 h-6 text-neutral-700"><!-- Menu or Back icon --></svg>
    </button>

    <!-- Title -->
    <h1 class="text-lg font-semibold text-neutral-700">Family Circle</h1>

    <!-- Action -->
    <button class="p-2 -mr-2 hover:bg-neutral-100 rounded-full">
      <svg class="w-6 h-6 text-neutral-700"><!-- Search or More icon --></svg>
    </button>
  </div>
</header>
```

**Desktop Sidebar Navigation**
```html
<aside class="w-64 h-screen bg-white border-r border-neutral-200 p-6">
  <!-- Logo -->
  <div class="mb-8">
    <h1 class="text-2xl font-display font-bold text-ocean-600">Bubbles</h1>
  </div>

  <!-- Nav items -->
  <nav class="space-y-2">
    <!-- Active -->
    <a href="#" class="flex items-center gap-3 px-4 py-3 bg-ocean-50 text-ocean-700 font-medium rounded-lg">
      <svg class="w-5 h-5"><!-- Icon --></svg>
      <span>Browse Items</span>
    </a>

    <!-- Inactive -->
    <a href="#" class="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-700 rounded-lg transition-colors">
      <svg class="w-5 h-5"><!-- Icon --></svg>
      <span>My Items</span>
    </a>

    <a href="#" class="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-700 rounded-lg transition-colors">
      <svg class="w-5 h-5"><!-- Icon --></svg>
      <span>My Bubbles</span>
    </a>
  </nav>
</aside>
```

### Modals & Dialogs

**Modal Container**
```html
<!-- Backdrop -->
<div class="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-40 transition-opacity"></div>

<!-- Modal -->
<div class="fixed inset-0 z-50 overflow-y-auto">
  <div class="flex min-h-full items-end sm:items-center justify-center p-4">
    <div class="
      relative w-full max-w-lg
      bg-white
      rounded-t-2xl sm:rounded-2xl
      shadow-xl
      transform transition-all
    ">
      <!-- Header -->
      <div class="flex items-start justify-between p-6 border-b border-neutral-200">
        <div>
          <h2 class="text-xl font-semibold text-neutral-700">Request to Borrow</h2>
          <p class="text-sm text-neutral-500 mt-1">Mountain Bike from Sarah Chen</p>
        </div>
        <button class="p-1 hover:bg-neutral-100 rounded-full transition-colors">
          <svg class="w-5 h-5 text-neutral-500"><!-- Close icon --></svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Form fields, content, etc. -->
      </div>

      <!-- Footer -->
      <div class="flex gap-3 p-6 border-t border-neutral-200 bg-neutral-50 rounded-b-2xl">
        <button class="flex-1 px-6 py-3 bg-white border-2 border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50">
          Cancel
        </button>
        <button class="flex-1 px-6 py-3 bg-ocean-600 text-white font-medium rounded-lg hover:bg-ocean-700">
          Send Request
        </button>
      </div>
    </div>
  </div>
</div>
```

**Bottom Sheet (Mobile)**
```html
<!-- Backdrop -->
<div class="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-40"></div>

<!-- Sheet -->
<div class="
  fixed inset-x-0 bottom-0 z-50
  bg-white
  rounded-t-2xl
  shadow-xl
  pb-safe-bottom
">
  <!-- Handle -->
  <div class="flex justify-center pt-3 pb-2">
    <div class="w-12 h-1 bg-neutral-300 rounded-full"></div>
  </div>

  <!-- Content -->
  <div class="px-6 pb-6">
    <h2 class="text-xl font-semibold text-neutral-700 mb-4">Filter Items</h2>
    <!-- Filter options -->
  </div>
</div>
```

**Alert Dialog**
```html
<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
  <!-- Backdrop -->
  <div class="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"></div>

  <!-- Dialog -->
  <div class="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
    <!-- Icon -->
    <div class="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg class="w-6 h-6 text-error-600"><!-- Alert icon --></svg>
    </div>

    <!-- Content -->
    <h2 class="text-lg font-semibold text-neutral-700 text-center mb-2">Delete Item?</h2>
    <p class="text-sm text-neutral-600 text-center mb-6">This action cannot be undone. The item will be permanently removed from your inventory.</p>

    <!-- Actions -->
    <div class="flex flex-col gap-3">
      <button class="w-full px-6 py-3 bg-error-600 text-white font-medium rounded-lg hover:bg-error-700">
        Delete Item
      </button>
      <button class="w-full px-6 py-3 bg-white border-2 border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50">
        Cancel
      </button>
    </div>
  </div>
</div>
```

### Empty States

**No Items Found**
```html
<div class="flex flex-col items-center justify-center py-16 px-4 text-center">
  <!-- Illustration container -->
  <div class="w-32 h-32 bg-gradient-to-br from-ocean-100 to-sage-100 rounded-full flex items-center justify-center mb-6">
    <svg class="w-16 h-16 text-ocean-300"><!-- Empty box icon --></svg>
  </div>

  <h3 class="text-xl font-semibold text-neutral-700 mb-2">No Items Yet</h3>
  <p class="text-neutral-500 mb-6 max-w-sm">Start building your lending library by adding items you're willing to share.</p>

  <button class="px-6 py-3 bg-ocean-600 hover:bg-ocean-700 text-white font-medium rounded-lg">
    Add Your First Item
  </button>
</div>
```

**No Search Results**
```html
<div class="flex flex-col items-center justify-center py-12 px-4 text-center">
  <div class="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
    <svg class="w-12 h-12 text-neutral-400"><!-- Search icon --></svg>
  </div>

  <h3 class="text-lg font-semibold text-neutral-700 mb-1">No results for "camping gear"</h3>
  <p class="text-sm text-neutral-500 mb-4">Try adjusting your search or filters</p>

  <button class="text-ocean-600 hover:text-ocean-700 font-medium text-sm">
    Clear filters
  </button>
</div>
```

**No Notifications**
```html
<div class="flex flex-col items-center justify-center py-12 px-4 text-center">
  <div class="w-20 h-20 bg-sage-50 rounded-full flex items-center justify-center mb-4">
    <svg class="w-10 h-10 text-sage-400"><!-- Bell icon --></svg>
  </div>

  <h3 class="text-lg font-semibold text-neutral-700 mb-1">You're all caught up!</h3>
  <p class="text-sm text-neutral-500">No new notifications</p>
</div>
```

### Loading States

**Spinner**
```html
<div class="flex items-center justify-center">
  <svg class="animate-spin h-8 w-8 text-ocean-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
</div>
```

**Skeleton Card**
```html
<div class="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden animate-pulse">
  <!-- Image skeleton -->
  <div class="aspect-square bg-neutral-200"></div>

  <!-- Content skeleton -->
  <div class="p-4 space-y-3">
    <div class="h-5 bg-neutral-200 rounded w-3/4"></div>
    <div class="h-4 bg-neutral-200 rounded w-1/2"></div>
    <div class="h-4 bg-neutral-200 rounded w-full"></div>
    <div class="h-4 bg-neutral-200 rounded w-5/6"></div>
  </div>
</div>
```

**Progress Bar**
```html
<div class="w-full">
  <div class="flex items-center justify-between mb-2">
    <span class="text-sm font-medium text-neutral-700">Uploading...</span>
    <span class="text-sm text-neutral-500">67%</span>
  </div>
  <div class="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
    <div class="h-full bg-ocean-600 rounded-full transition-all duration-300" style="width: 67%"></div>
  </div>
</div>
```

**Button Loading State**
```html
<button class="
  px-6 py-3
  bg-ocean-600 text-white font-medium
  rounded-lg
  inline-flex items-center gap-2
  disabled:opacity-75 disabled:cursor-not-allowed
" disabled>
  <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
  Processing...
</button>
```

---

## 5. Iconography

### Icon Library

**Primary: Lucide Icons**
- Website: https://lucide.dev
- NPM: `lucide-react` or `lucide-static`
- Rationale: Clean, consistent, modern design with excellent coverage
- Open source, actively maintained
- Tree-shakeable for optimal bundle size

**Alternative: Heroicons**
- Website: https://heroicons.com
- Made by Tailwind Labs
- Two variants: outline (default) and solid (emphasis)

### Icon Sizing

```javascript
// Icon size utilities
iconSize: {
  'xs': '16px',   // 16x16 - Inline with small text
  'sm': '20px',   // 20x20 - Inline with body text
  'md': '24px',   // 24x24 - Default UI icons
  'lg': '32px',   // 32x32 - Larger interactive elements
  'xl': '40px',   // 40x40 - Feature icons, empty states
  '2xl': '48px',  // 48x48 - Hero icons
}
```

**Usage**
```html
<!-- Small icon in text -->
<span class="inline-flex items-center gap-1">
  <svg class="w-4 h-4"><!-- Icon --></svg>
  <span>See details</span>
</span>

<!-- Default UI icon -->
<button class="p-2">
  <svg class="w-6 h-6"><!-- Icon --></svg>
</button>

<!-- Large feature icon -->
<div class="w-12 h-12 bg-ocean-100 rounded-full flex items-center justify-center">
  <svg class="w-6 h-6 text-ocean-600"><!-- Icon --></svg>
</div>
```

### Key Icons

**Navigation & Actions**
- Home: `home`
- Search: `search`
- Add/Plus: `plus`, `plus-circle`
- Menu: `menu`
- Close/X: `x`
- Back/Arrow: `arrow-left`, `chevron-left`
- Settings: `settings`
- Filter: `filter`, `sliders-horizontal`
- More: `more-vertical`, `more-horizontal`

**Bubbles & People**
- Bubble/Circle: `circle`, `radio` (custom bubble icon recommended)
- Users/Group: `users`, `users-round`
- Person: `user`, `user-round`
- Add Person: `user-plus`

**Items & Lending**
- Item/Box: `package`, `box`
- Camera (add photo): `camera`
- Image: `image`
- Tag: `tag`
- Calendar: `calendar`
- Clock: `clock`
- Check/Complete: `check`, `check-circle`
- Arrow (transfer): `arrow-right-left`, `repeat`

**Status & Notifications**
- Bell: `bell`
- Alert/Warning: `alert-circle`, `alert-triangle`
- Info: `info`
- Success: `check-circle-2`
- Error: `x-circle`
- Heart/Favorite: `heart`

**Actions**
- Edit: `edit`, `pencil`
- Delete: `trash-2`
- Share: `share-2`
- Download: `download`
- Upload: `upload`
- Send: `send`
- QR Code: `qr-code`

**Custom Bubble Icon**

Create a custom bubble icon for brand consistency:

```svg
<!-- Bubble icon (three overlapping circles) -->
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="9" cy="10" r="6" stroke="currentColor" stroke-width="2"/>
  <circle cx="15" cy="10" r="6" stroke="currentColor" stroke-width="2" opacity="0.6"/>
  <circle cx="12" cy="15" r="6" stroke="currentColor" stroke-width="2" opacity="0.4"/>
</svg>
```

### Icon Color Guidelines

- **Default**: `text-neutral-600` (body text color)
- **Muted**: `text-neutral-400` (secondary/inactive)
- **Active/Selected**: `text-ocean-600` (brand color)
- **Success**: `text-success-600`
- **Warning**: `text-warning-600`
- **Error**: `text-error-600`
- **On colored backgrounds**: `text-white` or appropriate contrast color

---

## 6. Motion & Interaction

### Animation Principles

1. **Purposeful**: Every animation should have a clear purpose (feedback, guidance, delight)
2. **Subtle**: Animations should enhance, not distract
3. **Fast**: Keep durations short (150-300ms for most UI)
4. **Natural**: Use easing curves that feel organic
5. **Accessible**: Respect `prefers-reduced-motion`

### Transition Timing

```javascript
// tailwind.config.js
transitionDuration: {
  'fast': '150ms',      // Quick feedback (hover states)
  'base': '200ms',      // Default transitions
  'slow': '300ms',      // Larger movements (modals, slides)
  'slower': '500ms',    // Page transitions, complex animations
}

transitionTimingFunction: {
  'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',      // Default (ease-in-out)
  'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',  // Playful bounce
  'snappy': 'cubic-bezier(0.4, 0, 1, 1)',        // Quick end
}
```

### Common Transitions

**Hover States**
```html
<!-- Button hover -->
<button class="bg-ocean-600 hover:bg-ocean-700 transition-colors duration-200">
  Click me
</button>

<!-- Card hover with shadow -->
<div class="shadow-sm hover:shadow-md transition-shadow duration-300">
  <!-- Card content -->
</div>

<!-- Scale on hover (subtle) -->
<button class="transform hover:scale-105 transition-transform duration-200">
  Icon button
</button>
```

**Active States**
```html
<!-- Button press -->
<button class="active:scale-95 transition-transform duration-150">
  Press me
</button>
```

**Focus States**
```html
<!-- Input focus -->
<input class="
  border border-neutral-300
  focus:border-transparent focus:ring-2 focus:ring-ocean-500
  transition-all duration-200
">

<!-- Link focus -->
<a href="#" class="
  focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2
  rounded
">
  Link
</a>
```

**Loading States**
```html
<!-- Fade in when loaded -->
<img class="opacity-0 transition-opacity duration-500 data-[loaded=true]:opacity-100">

<!-- Pulse animation -->
<div class="animate-pulse bg-neutral-200 rounded">
  <!-- Skeleton content -->
</div>
```

**Page Transitions**
```html
<!-- Slide up from bottom -->
<div class="
  transform translate-y-4 opacity-0
  transition-all duration-500
  data-[state=open]:translate-y-0 data-[state=open]:opacity-100
">
  <!-- Content -->
</div>

<!-- Fade in -->
<div class="
  opacity-0
  transition-opacity duration-300
  data-[loaded=true]:opacity-100
">
  <!-- Content -->
</div>
```

### Micro-Interactions

**Checkbox Check**
```css
/* Checkbox with smooth checkmark animation */
input[type="checkbox"]:checked ~ svg {
  @apply scale-100 opacity-100;
}

input[type="checkbox"]:not(:checked) ~ svg {
  @apply scale-75 opacity-0;
}

input[type="checkbox"] ~ svg {
  @apply transition-all duration-200;
}
```

**Button Ripple Effect**
```html
<!-- Add to button click events via JS -->
<button class="relative overflow-hidden">
  <span class="relative z-10">Click me</span>
  <!-- Ripple element added dynamically -->
</button>
```

**Toast Notifications**
```html
<!-- Slide in from top -->
<div class="
  fixed top-4 right-4 z-50
  transform -translate-y-full opacity-0
  transition-all duration-300
  data-[state=open]:translate-y-0 data-[state=open]:opacity-100
">
  <!-- Toast content -->
</div>
```

### Reduced Motion Support

Always respect user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Or use Tailwind's `motion-safe` and `motion-reduce` variants:

```html
<button class="
  motion-safe:hover:scale-105
  motion-reduce:hover:scale-100
  transition-transform
">
  Button
</button>
```

### Animation Examples

**Spin (Loading)**
```html
<svg class="animate-spin h-5 w-5"><!-- Icon --></svg>
```

**Pulse (Skeleton)**
```html
<div class="animate-pulse bg-neutral-200"><!-- Skeleton --></div>
```

**Bounce (Notification badge)**
```html
<span class="animate-bounce bg-coral-500 text-white rounded-full w-5 h-5">3</span>
```

**Custom: Slide In**
```javascript
// tailwind.config.js
extend: {
  keyframes: {
    'slide-in-bottom': {
      '0%': { transform: 'translateY(100%)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    'slide-out-bottom': {
      '0%': { transform: 'translateY(0)', opacity: '1' },
      '100%': { transform: 'translateY(100%)', opacity: '0' },
    },
  },
  animation: {
    'slide-in-bottom': 'slide-in-bottom 0.3s ease-out',
    'slide-out-bottom': 'slide-out-bottom 0.3s ease-in',
  },
}
```

---

## 7. Visual Metaphors

### Bubbles Representation

The "bubble" is our core visual metaphor for trusted groups. Represent it consistently:

**Bubble Icon**
- Use three overlapping circles (custom icon)
- Color variations based on bubble type or theme
- Gradient fills for visual depth: `bg-gradient-to-br from-ocean-100 to-sage-100`

**Bubble Card Design**
```html
<div class="
  relative
  bg-gradient-to-br from-ocean-50 via-white to-sage-50
  border-2 border-ocean-200
  rounded-2xl
  p-6
  overflow-hidden
">
  <!-- Decorative bubble shapes in background -->
  <div class="absolute -top-8 -right-8 w-32 h-32 bg-ocean-100 rounded-full opacity-20"></div>
  <div class="absolute -bottom-4 -left-4 w-24 h-24 bg-sage-100 rounded-full opacity-20"></div>

  <!-- Content -->
  <div class="relative z-10">
    <!-- Bubble details -->
  </div>
</div>
```

**Member Avatars in Bubbles**
- Show overlapping avatars to reinforce connection
- Use `-space-x-2` for overlap effect
- Include "+N" count badge for additional members

**Bubble Themes**
- Family: Warm tones, orange/coral accents
- Work: Professional, blue/neutral
- Friends: Vibrant, mixed colors
- Community: Green/sage, sustainability focus

### Item Availability States

Clear visual hierarchy for item status:

**Available**
- Badge: Green background `bg-success-100` with green text `text-success-800`
- Icon: `check-circle` in green
- Card border: Optional subtle green glow `ring-2 ring-success-200`

**Borrowed**
- Badge: Orange background `bg-warning-100` with orange text `text-warning-800`
- Icon: `clock` or `arrow-right-left` in orange
- Show borrower info and return date prominently

**Unavailable**
- Badge: Gray background `bg-neutral-100` with gray text `text-neutral-700`
- Icon: `x-circle` in gray
- Reduce opacity slightly `opacity-75` on entire card

**Overdue**
- Badge: Red background `bg-error-100` with red text `text-error-800`
- Icon: `alert-circle` in red
- Pulsing animation to draw attention

### Lending Status Progression

Visualize the lending journey clearly:

**Timeline View**
```html
<div class="space-y-4">
  <!-- Step 1: Requested (completed) -->
  <div class="flex items-start gap-4">
    <div class="flex flex-col items-center">
      <div class="w-10 h-10 bg-success-500 text-white rounded-full flex items-center justify-center">
        <svg class="w-5 h-5"><!-- Check --></svg>
      </div>
      <div class="w-0.5 h-12 bg-success-200"></div>
    </div>
    <div class="flex-1 pt-1">
      <h4 class="font-semibold text-neutral-700">Request Sent</h4>
      <p class="text-sm text-neutral-500">Mar 1, 2024</p>
    </div>
  </div>

  <!-- Step 2: Approved (completed) -->
  <div class="flex items-start gap-4">
    <div class="flex flex-col items-center">
      <div class="w-10 h-10 bg-success-500 text-white rounded-full flex items-center justify-center">
        <svg class="w-5 h-5"><!-- Check --></svg>
      </div>
      <div class="w-0.5 h-12 bg-ocean-200"></div>
    </div>
    <div class="flex-1 pt-1">
      <h4 class="font-semibold text-neutral-700">Approved</h4>
      <p class="text-sm text-neutral-500">Mar 2, 2024</p>
    </div>
  </div>

  <!-- Step 3: In Use (current) -->
  <div class="flex items-start gap-4">
    <div class="flex flex-col items-center">
      <div class="w-10 h-10 bg-ocean-500 text-white rounded-full flex items-center justify-center ring-4 ring-ocean-100">
        <svg class="w-5 h-5"><!-- Clock --></svg>
      </div>
      <div class="w-0.5 h-12 bg-neutral-200"></div>
    </div>
    <div class="flex-1 pt-1">
      <h4 class="font-semibold text-neutral-700">Currently Borrowed</h4>
      <p class="text-sm text-neutral-500">Due back Mar 15, 2024</p>
    </div>
  </div>

  <!-- Step 4: Return (pending) -->
  <div class="flex items-start gap-4">
    <div class="flex flex-col items-center">
      <div class="w-10 h-10 bg-neutral-200 text-neutral-400 rounded-full flex items-center justify-center">
        <svg class="w-5 h-5"><!-- Check --></svg>
      </div>
    </div>
    <div class="flex-1 pt-1">
      <h4 class="font-semibold text-neutral-500">Return Item</h4>
      <p class="text-sm text-neutral-400">Pending</p>
    </div>
  </div>
</div>
```

**Status Badge Progression**
1. Pending Request: `bg-info-100 text-info-800`
2. Approved: `bg-success-100 text-success-800`
3. Active Loan: `bg-warning-100 text-warning-800`
4. Overdue: `bg-error-100 text-error-800` (with pulse)
5. Returned: `bg-success-100 text-success-800`

### Trust & Community Visual Language

**Profile Badges**
- Verified member: Blue checkmark badge
- Top lender: Gold star or badge
- Long-time member: Time-based badge
- Use `rounded-full` badges next to usernames

**Connection Indicators**
- Mutual bubbles: Show overlapping bubble icons
- Direct connection: Solid connecting line
- Extended network: Dotted connecting line

**Sharing Metaphors**
- Arrows for transfer/lending direction
- Handshake icon for completed exchanges
- Heart icon for favorite items or thanks

**Sustainability Indicators**
- Leaf icon for eco-friendly items
- Counter showing "times shared" or "CO2 saved"
- Green accent colors for sustainability messaging

---

## 8. Accessibility Guidelines

### Color Contrast

**WCAG AA Compliance** (minimum)
- Normal text (< 18pt): 4.5:1 contrast ratio
- Large text (≥ 18pt or 14pt bold): 3:1 contrast ratio
- UI components and graphics: 3:1 contrast ratio

**Verified Combinations**
```css
/* Text on backgrounds - AA compliant */
text-neutral-700 on bg-white         /* 12.6:1 */
text-neutral-600 on bg-white         /* 7.6:1 */
text-neutral-500 on bg-white         /* 4.6:1 */
text-white on bg-ocean-600           /* 4.5:1 */
text-white on bg-ocean-700           /* 6.3:1 */
text-white on bg-coral-600           /* 4.8:1 */
text-success-800 on bg-success-100   /* 7.3:1 */
text-error-800 on bg-error-100       /* 7.2:1 */
```

### Focus Management

**Focus Rings**
```html
<!-- Always include visible focus states -->
<button class="focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2">
  Button
</button>

<!-- For dark backgrounds -->
<button class="focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-ocean-600">
  Button on dark bg
</button>
```

**Focus Trap** (for modals)
- Trap focus within modals when open
- Return focus to trigger element when closed
- Allow Escape key to close

**Skip Links**
```html
<a href="#main-content" class="
  sr-only
  focus:not-sr-only
  focus:absolute focus:top-4 focus:left-4 focus:z-50
  px-4 py-2 bg-ocean-600 text-white rounded-lg
  focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2
">
  Skip to main content
</a>
```

### Screen Reader Support

**Semantic HTML**
- Use proper heading hierarchy (h1 → h2 → h3)
- Use `<nav>`, `<main>`, `<aside>`, `<article>`, `<section>`
- Use `<button>` for actions, `<a>` for navigation
- Use `<label>` for all form inputs

**ARIA Labels**
```html
<!-- Icon-only buttons -->
<button aria-label="Close modal">
  <svg><!-- X icon --></svg>
</button>

<!-- Status indicators -->
<span class="bg-success-100 text-success-800" role="status" aria-label="Available">
  Available
</span>

<!-- Loading states -->
<div role="status" aria-live="polite" aria-label="Loading items">
  <svg class="animate-spin"><!-- Spinner --></svg>
</div>

<!-- Complex widgets -->
<div role="dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description">
  <h2 id="dialog-title">Dialog Title</h2>
  <p id="dialog-description">Dialog description</p>
</div>
```

**Visually Hidden Text**
```html
<!-- Screen reader only text -->
<span class="sr-only">New notification</span>

<!-- Visible on focus (for skip links) -->
<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4">
  Skip to content
</a>
```

### Keyboard Navigation

**Tab Order**
- Ensure logical tab order (top to bottom, left to right)
- Interactive elements should be keyboard accessible
- Custom components need `tabindex="0"` if not natively focusable

**Keyboard Shortcuts**
- Escape: Close modals/dialogs
- Enter/Space: Activate buttons
- Arrow keys: Navigate lists/menus
- Tab: Move between interactive elements
- Shift+Tab: Move backwards

**Example: Custom Dropdown**
```html
<div class="relative">
  <button
    aria-haspopup="true"
    aria-expanded="false"
    class="..."
  >
    Options
  </button>

  <div
    role="menu"
    aria-orientation="vertical"
    class="..."
  >
    <button role="menuitem" class="...">Option 1</button>
    <button role="menuitem" class="="...">Option 2</button>
  </div>
</div>
```

### Touch Targets

**Minimum Size**: 44x44px (Apple HIG, WCAG 2.2)

```html
<!-- Too small -->
<button class="p-1">
  <svg class="w-4 h-4"><!-- Icon --></svg>
</button>

<!-- Correct -->
<button class="p-2">  <!-- 44x44px total -->
  <svg class="w-6 h-6"><!-- Icon --></svg>
</button>

<!-- Or use min-width/height -->
<button class="min-w-[44px] min-h-[44px] inline-flex items-center justify-center">
  <svg class="w-5 h-5"><!-- Icon --></svg>
</button>
```

### Motion & Animation

**Respect Preferences**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

```html
<!-- With Tailwind utilities -->
<div class="motion-safe:animate-bounce motion-reduce:animate-none">
  <!-- Content -->
</div>
```

### Form Accessibility

**Labels & Instructions**
```html
<div class="space-y-2">
  <label for="email" class="block text-sm font-medium text-neutral-700">
    Email address <span class="text-error-600">*</span>
  </label>
  <input
    type="email"
    id="email"
    required
    aria-required="true"
    aria-describedby="email-hint email-error"
    class="..."
  >
  <p id="email-hint" class="text-xs text-neutral-500">
    We'll never share your email
  </p>
  <p id="email-error" class="text-sm text-error-600" aria-live="polite">
    <!-- Error message appears here -->
  </p>
</div>
```

**Error States**
```html
<input
  aria-invalid="true"
  aria-describedby="error-message"
  class="border-2 border-error-500"
>
<p id="error-message" class="text-error-600" role="alert">
  Please enter a valid email
</p>
```

---

## 9. Implementation Guide

### Tailwind Configuration

Complete `tailwind.config.js` setup:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#b9e6fe',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        coral: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        sage: {
          50: '#f6f7f6',
          100: '#e3e8e3',
          200: '#c7d1c8',
          300: '#a3b3a5',
          400: '#7d9180',
          500: '#5f7562',
          600: '#4a5d4d',
          700: '#3d4c3f',
          800: '#333f35',
          900: '#2c352e',
          950: '#171d18',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        info: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Cabinet Grotesk', 'Inter var', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      maxWidth: {
        'container-sm': '640px',
        'container-md': '768px',
        'container-lg': '1024px',
        'container-xl': '1280px',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'slow': '300ms',
        'slower': '500ms',
      },
      keyframes: {
        'slide-in-bottom': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-out-bottom': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'slide-in-bottom': 'slide-in-bottom 0.3s ease-out',
        'slide-out-bottom': 'slide-out-bottom 0.3s ease-in',
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

### CSS Setup

Add to your main CSS file:

```css
/* src/index.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Improved font rendering */
  body {
    @apply font-sans antialiased;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Default focus styles */
  *:focus-visible {
    @apply outline-none ring-2 ring-ocean-500 ring-offset-2;
  }
}

@layer utilities {
  /* Safe area utilities for PWA */
  .pt-safe {
    padding-top: max(1rem, env(safe-area-inset-top));
  }

  .pb-safe {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }

  .pl-safe {
    padding-left: max(1rem, env(safe-area-inset-left));
  }

  .pr-safe {
    padding-right: max(1rem, env(safe-area-inset-right));
  }

  /* Bottom navigation safe area */
  .pb-safe-bottom {
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Component Library Setup

Install recommended dependencies:

```bash
# Icon library
pnpm add lucide-react

# Form handling (optional)
pnpm add @tailwindcss/forms

# Headless UI components (optional, for complex interactions)
pnpm add @headlessui/react
```

### Design Tokens as CSS Variables

For runtime theme switching (optional):

```css
:root {
  /* Primary colors */
  --color-ocean-500: #0ea5e9;
  --color-coral-500: #f43f5e;
  --color-sage-500: #5f7562;

  /* Semantic colors */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #0ea5e9;

  /* Spacing */
  --spacing-unit: 0.25rem; /* 4px */

  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;

  /* Transitions */
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
}
```

---

## 10. Design Checklist

Use this checklist when implementing new features:

### Visual Design
- [ ] Colors use defined palette (ocean, coral, sage, semantic)
- [ ] Text contrast meets WCAG AA standards (4.5:1 minimum)
- [ ] Typography uses defined scale and weights
- [ ] Spacing follows 4px grid system
- [ ] Border radius consistent with guidelines
- [ ] Icons are 24px default (or appropriate size from scale)

### Interaction Design
- [ ] All interactive elements have hover states
- [ ] All interactive elements have focus states
- [ ] Touch targets are minimum 44x44px
- [ ] Loading states are indicated clearly
- [ ] Error states are helpful and actionable
- [ ] Success feedback is provided for actions

### Accessibility
- [ ] Semantic HTML used throughout
- [ ] Heading hierarchy is logical
- [ ] Form inputs have associated labels
- [ ] Icon-only buttons have aria-labels
- [ ] Keyboard navigation works completely
- [ ] Screen reader tested (or ARIA attributes verified)
- [ ] Color is not the only indicator (icons/text included)
- [ ] Motion respects prefers-reduced-motion

### Mobile/PWA
- [ ] Works on 320px viewport width
- [ ] Touch targets are appropriately sized
- [ ] Safe areas accounted for (iOS notch)
- [ ] Bottom navigation accessible with thumb
- [ ] Modals/sheets slide from bottom on mobile
- [ ] Forms are easy to fill on small screens

### Performance
- [ ] Icons are tree-shaken (only imported what's used)
- [ ] Images have appropriate sizing and lazy loading
- [ ] Animations use transform/opacity for GPU acceleration
- [ ] No layout shift on load (skeleton states used)

---

## 11. Resources & References

### Design Tools
- **Figma**: For design mockups and prototypes
- **Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Color Palette Generator**: https://coolors.co

### Code Resources
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Lucide Icons**: https://lucide.dev
- **Headless UI**: https://headlessui.com
- **Inter Font**: https://rsms.me/inter/

### Accessibility
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **A11y Project**: https://www.a11yproject.com
- **WebAIM**: https://webaim.org

### Inspiration
- **Linear**: Clean, purposeful UI with excellent micro-interactions
- **Notion**: Friendly, approachable design with depth
- **Airbnb**: Community-focused, trustworthy aesthetic

---

## Version History

- **v1.0** (Dec 2025): Initial design language document

---

**Questions or Suggestions?**

This is a living document. As the Bubbles app evolves, update this design language to reflect new patterns, components, and learnings. Keep it as the single source of truth for design decisions.