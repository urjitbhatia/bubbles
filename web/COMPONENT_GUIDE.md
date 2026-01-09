# Component Visual Guide

This guide shows the visual hierarchy and layout of the Auth & Profile components.

## Login Page (`/login`)

```
┌─────────────────────────────────────────────────────────────────┐
│                      Gradient Background                         │
│                    (ocean-50 → white → sage-50)                  │
│                                                                   │
│                          ┌───────┐                               │
│                          │ Logo  │                               │
│                          │Bubbles│                               │
│                          └───────┘                               │
│                                                                   │
│                    Welcome to Bubbles                            │
│             Share what you own. Borrow what you need.            │
│                                                                   │
│    ┌─────────────────────────────────────────────────────┐      │
│    │                                                       │      │
│    │  Sign in to continue                                 │      │
│    │  Join trusted circles and start sharing...           │      │
│    │                                                       │      │
│    │  ┌─────────────────────────────────────────────┐    │      │
│    │  │  [G] Continue with Google                   │    │      │
│    │  └─────────────────────────────────────────────┘    │      │
│    │                                                       │      │
│    │  ─────────── Or continue with email ────────────     │      │
│    │                                                       │      │
│    │  Email address *                                     │      │
│    │  ┌─────────────────────────────────────────────┐    │      │
│    │  │ your.email@example.com                      │    │      │
│    │  └─────────────────────────────────────────────┘    │      │
│    │                                                       │      │
│    │  ┌─────────────────────────────────────────────┐    │      │
│    │  │  [Mail] Send magic link                     │    │      │
│    │  └─────────────────────────────────────────────┘    │      │
│    │                                                       │      │
│    └─────────────────────────────────────────────────────┘      │
│                                                                   │
│         By signing in, you agree to our Terms and Privacy        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Ocean-blue circular logo with overlapping circles
- Centered layout with max-width constraint
- White card with shadow on gradient background
- Google button uses secondary variant (white bg, ocean border)
- Magic link button uses primary variant (ocean bg)
- Responsive padding adapts to screen size

## Profile Setup Page (`/profile/setup`)

```
┌─────────────────────────────────────────────────────────────────┐
│                      Gradient Background                         │
│                                                                   │
│                          ┌───────┐                               │
│                          │ User  │                               │
│                          │ Icon  │                               │
│                          └───────┘                               │
│                                                                   │
│                   Complete Your Profile                          │
│                Help your community recognize you                 │
│                                                                   │
│    ┌─────────────────────────────────────────────────────┐      │
│    │                                                       │      │
│    │  Display Name *                                      │      │
│    │  ┌─────────────────────────────────────────────┐    │      │
│    │  │ John Doe                                    │    │      │
│    │  └─────────────────────────────────────────────┘    │      │
│    │  This is how your name will appear to others        │      │
│    │                                                       │      │
│    │  Username (optional)                                 │      │
│    │  ┌─────────────────────────────────────────────┐    │      │
│    │  │ john_doe                                 [✓]│    │      │
│    │  └─────────────────────────────────────────────┘    │      │
│    │  ✓ Username is available                            │      │
│    │  Choose a unique username that others can use...    │      │
│    │                                                       │      │
│    │  ┌─────────────────────────────────────────────┐    │      │
│    │  │  [Save] Continue                            │    │      │
│    │  └─────────────────────────────────────────────┘    │      │
│    │                                                       │      │
│    │            Skip username for now                     │      │
│    │                                                       │      │
│    └─────────────────────────────────────────────────────┘      │
│                                                                   │
│    ┌───────────────────────────────────────────────────┐        │
│    │ You can always update your profile later from... │        │
│    └───────────────────────────────────────────────────┘        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- User icon in ocean-100 circle
- Display name required (red asterisk)
- Username with live availability check
  - Spinner while checking
  - Green checkmark if available
  - Red X if taken
- Skip option for username
- Info box below form

## Profile Page - View Mode (`/profile`)

```
┌─────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  Nav: Home | Dashboard | Inventory | Profile                │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  Profile                                                      │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ┌─────────────────────────────────────────────────────────┐ │ │
│ │ │        Ocean Gradient Header (ocean-500 → ocean-600)    │ │ │
│ │ │                                                           │ │ │
│ │ │                                                           │ │ │
│ │ └─────────────────────────────────────────────────────────┘ │ │
│ │                                                               │ │
│ │      ┌─────────────┐                                         │ │
│ │      │             │                                         │ │
│ │      │   Avatar    │  (overlaps header)                      │ │
│ │      │  (128x128)  │                                         │ │
│ │      │             │                                         │ │
│ │      └─────────────┘                                         │ │
│ │                                                               │ │
│ │      John Doe                                                │ │
│ │      @johndoe                                                │ │
│ │                                                               │ │
│ │      [Mail] john.doe@example.com                             │ │
│ │      [Calendar] Joined December 1, 2024                      │ │
│ │                                                               │ │
│ │      ──────────────────────────────────────                  │ │
│ │                                                               │ │
│ │      ┌───────────────────────────────────────────┐          │ │
│ │      │  [Edit] Edit Profile                      │          │ │
│ │      └───────────────────────────────────────────┘          │ │
│ │                                                               │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  Account Actions                                              │ │
│ │                                                               │ │
│ │  ┌───────────────────────────────────────────────────────┐  │ │
│ │  │  [LogOut] Sign Out                                     │  │ │
│ │  └───────────────────────────────────────────────────────┘  │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  Your Activity                                                │ │
│ │                                                               │ │
│ │  ┌────────┐  ┌────────┐  ┌────────┐                         │ │
│ │  │   0    │  │   0    │  │   0    │                         │ │
│ │  │ Items  │  │ Times  │  │Bubbles │                         │ │
│ │  │ Shared │  │Borrowed│  │        │                         │ │
│ │  └────────┘  └────────┘  └────────┘                         │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Ocean gradient header banner
- Large circular avatar overlapping header
- Profile info with icons
- Edit button switches to edit mode
- Destructive red "Sign Out" button
- Activity stats in grid (3 columns)

## Profile Page - Edit Mode (`/profile`)

```
┌─────────────────────────────────────────────────────────────────┐
│                         [Nav bar same]                           │
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ┌─────────────────────────────────────────────────────────┐ │ │
│ │ │        Ocean Gradient Header                            │ │ │
│ │ └─────────────────────────────────────────────────────────┘ │ │
│ │                                                               │ │
│ │      ┌─────────────┐                                         │ │
│ │      │   Avatar    │                                         │ │
│ │      └─────────────┘                                         │ │
│ │                                                               │ │
│ │      Edit Profile                                            │ │
│ │                                                               │ │
│ │      Display Name *                                          │ │
│ │      ┌─────────────────────────────────────────────┐        │ │
│ │      │ John Doe                                    │        │ │
│ │      └─────────────────────────────────────────────┘        │ │
│ │                                                               │ │
│ │      Username (optional)                                     │ │
│ │      ┌─────────────────────────────────────────────┐        │ │
│ │      │ johndoe                                  [✓]│        │ │
│ │      └─────────────────────────────────────────────┘        │ │
│ │                                                               │ │
│ │      ┌──────────────────────┐  ┌──────────────────────┐    │ │
│ │      │  [X] Cancel          │  │  [Save] Save Changes │    │ │
│ │      └──────────────────────┘  └──────────────────────┘    │ │
│ │                                                               │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│                  [Account Actions hidden in edit mode]           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Same ProfileForm component used in setup
- Cancel button (secondary variant)
- Save button (primary variant)
- Account actions hidden during edit
- Stats hidden during edit

## Component Hierarchy

### Login Page
```
LoginPage
├── Logo (custom SVG)
├── Heading + Tagline
└── Card
    ├── Title + Description
    ├── GoogleAuthButton
    │   └── Button (secondary variant)
    ├── Divider
    └── MagicLinkForm
        ├── Input (email)
        └── Button (primary variant)
```

### Profile Setup Page
```
ProfileSetupPage
├── Icon (UserCircle)
├── Heading + Description
├── Card
│   └── ProfileForm (isSetup=true)
│       ├── Input (display name)
│       ├── UsernameInput
│       │   ├── Input with status icon
│       │   └── Validation messages
│       ├── Button (Continue)
│       └── Skip link
└── Info box
```

### Profile Page (View Mode)
```
ProfilePage
├── Header banner (gradient)
├── Avatar (overlapping)
├── Profile info
│   ├── Name + Username
│   ├── Email (with icon)
│   └── Join date (with icon)
├── Edit button
├── Account Actions card
│   └── Sign Out button
└── Activity Stats card
    └── Grid (3 columns)
```

### Profile Page (Edit Mode)
```
ProfilePage
├── Header banner (gradient)
├── Avatar
└── ProfileForm
    ├── Input (display name)
    ├── UsernameInput
    └── Buttons (Cancel + Save)
```

## Color Usage

### Primary Actions
- Buttons: `bg-ocean-600 hover:bg-ocean-700`
- Links: `text-ocean-600 hover:text-ocean-700`
- Logo: `text-ocean-600`

### Secondary Actions
- Border: `border-2 border-ocean-600`
- Background: `bg-white hover:bg-neutral-50`

### Success States
- Border: `border-success-500`
- Icon: `text-success-500`
- Message: `text-success-600`

### Error States
- Border: `border-error-500`
- Icon: `text-error-500`
- Message: `text-error-600`
- Button: `bg-error-600 hover:bg-error-700`

### Backgrounds
- Page: `bg-gradient-to-br from-ocean-50 via-white to-sage-50`
- Cards: `bg-white`
- Header banner: `bg-gradient-to-r from-ocean-500 to-ocean-600`
- Avatar placeholder: `bg-ocean-100`

### Text
- Headings: `text-neutral-700`
- Body: `text-neutral-600`
- Helper: `text-neutral-500`
- Placeholder: `text-neutral-400`

## Spacing

### Page Layout
- Max width: `max-w-md` (448px) for auth pages, `max-w-3xl` for profile
- Padding: `px-4 py-8` (mobile), `px-6` (tablet), `px-8` (desktop)

### Cards
- Padding: `p-6 sm:p-8`
- Gap between sections: `space-y-6`

### Forms
- Input spacing: `space-y-2` (label, input, helper)
- Form field spacing: `space-y-6`
- Button groups: `gap-3`

### Text
- Heading to body: `mb-2`
- Icon to text: `gap-3`

## Typography

### Headings
- Page title: `text-4xl font-bold` (Login)
- Page title: `text-3xl font-bold` (Profile Setup/Page)
- Section title: `text-2xl font-bold`
- Card title: `text-xl font-semibold`
- Subsection: `text-lg font-semibold`

### Body
- Primary: `text-base`
- Secondary: `text-sm`
- Helper: `text-xs`

## Interactive States

### Buttons
- Default: Base color with shadow
- Hover: Darker shade + larger shadow
- Active: Even darker shade
- Focus: Ring offset 2px, ring width 2px
- Disabled: 50% opacity, not-allowed cursor
- Loading: Spinner + disabled state

### Inputs
- Default: `border-neutral-300`
- Focus: `ring-2 ring-ocean-500 border-transparent`
- Error: `border-2 border-error-500`
- Success: `border-success-500`
- Disabled: `bg-neutral-100`

### Links
- Default: Underline
- Hover: Darker color + thicker underline

## Accessibility Features

### Keyboard Navigation
- All buttons and inputs focusable
- Visible focus rings
- Logical tab order

### Screen Readers
- ARIA labels on icon-only buttons
- Error messages linked via aria-describedby
- Required fields indicated with aria-required
- Invalid inputs marked with aria-invalid
- Loading states with role="status"

### Visual
- Sufficient color contrast (WCAG AA)
- Error states use icons + text (not color alone)
- Success states use icons + text
- Loading states use spinners + text

### Motion
- Reduced motion support in CSS
- Animations can be disabled system-wide

## Responsive Behavior

### Mobile (< 640px)
- Full-width buttons
- Single column layout
- Reduced padding (px-4)
- Smaller text sizes

### Tablet (640px - 1024px)
- Increased padding (px-6)
- Two-column button groups
- Larger touch targets

### Desktop (> 1024px)
- Maximum width containers
- Maximum padding (px-8)
- Hover states enabled
- Multi-column stats grid

## Loading States

### Full Page
```
┌─────────────────────────────┐
│                             │
│                             │
│          ┌───┐              │
│          │ ○ │  Spinner     │
│          └───┘              │
│                             │
│                             │
└─────────────────────────────┘
```

### Button
```
┌─────────────────────────┐
│  ○  Processing...       │
└─────────────────────────┘
```

### Username Check
```
┌─────────────────────────┐
│  john_doe           ○   │  (spinner)
└─────────────────────────┘

┌─────────────────────────┐
│  john_doe           ✓   │  (available)
└─────────────────────────┘

┌─────────────────────────┐
│  admin              ✗   │  (taken)
└─────────────────────────┘
```

## Error States

### Form Field
```
Display Name *
┌─────────────────────────┐
│                         │  (red border)
└─────────────────────────┘
⚠ Display name is required  (red text)
```

### Magic Link Success
```
┌────────────────────────────────┐
│  ✓ Check your email            │
│  We sent a magic link to...    │
└────────────────────────────────┘
(green background)
```

### Form-Level Error
```
┌────────────────────────────────┐
│  Failed to save profile        │
└────────────────────────────────┘
(red background)
```
