# Visual Reference - Items & Inventory UI

## Component Visual Breakdown

### 1. Inventory Page (`/inventory`)

```
┌────────────────────────────────────────────────────────────┐
│ Bubbles Navigation Bar                                      │
│ [Home] [Dashboard] [Inventory*] [Profile] [Bubbles] [→]   │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  My Inventory                                               │
│  Manage your items and share them with your bubbles        │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ [🔍 Search items...]         [Grid] [List]  [+ Add Item]  │
└────────────────────────────────────────────────────────────┘

Grid View (4 columns on desktop):

┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ ╱╲   ╱╲  ╱╲  │ │ ╱╲   ╱╲  ╱╲  │ │ ╱╲   ╱╲  ╱╲  │ │ ╱╲   ╱╲  ╱╲  │
│  ╲  ╱  ╲╱  ╲ │ │  ╲  ╱  ╲╱  ╲ │ │  ╲  ╱  ╲╱  ╲ │ │  ╲  ╱  ╲╱  ╲ │
│   ╲╱        ╲│ │   ╲╱        ╲│ │   ╲╱        ╲│ │   ╲╱        ╲│
│   [Available]│ │[All Lent Out]│ │ [2 of 4...]  │ │  [Available] │
│              │ │              │ │              │ │              │
│ Mountain Bike│ │ Camping Tent │ │Folding Chairs│ │ Power Drill  │
│ Quantity: 1  │ │ Quantity: 1  │ │ Quantity: 4  │ │ Quantity: 1  │
│              │ │              │ │              │ │              │
│ Trek Marlin  │ │ 4-person tent│ │ Set of 4...  │ │ DeWalt...    │
│ 7, 29-inch..│ │ with rainfly│ │ portable...  │ │ cordless...  │
│ ─────────────│ │ ─────────────│ │ ─────────────│ │ ─────────────│
│ Shared to:   │ │ Shared to:   │ │ Shared to:   │ │ Shared to:   │
│ [Family...] │ │ [Family...]  │ │ [Family...]  │ │ [Neighbor...]│
│ [Neighbor..]│ │              │ │ [Work Fri..]│ │              │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

**Color Scheme:**
- Card backgrounds: White (#ffffff)
- Borders: Neutral-200 (#e5e5e5)
- Image placeholder: Gradient from ocean-100 to sage-100
- Available badge: Green background (success-100/800)
- Partial badge: Yellow background (warning-100/800)
- Lent out badge: Gray background (neutral-100/700)
- Bubble pills: Ocean-100/800

---

### 2. Empty State

```
                  ┌────────────────────┐
                  │                    │
                  │    ╱────────╲      │
                  │   ╱  ╱╲  ╱╲  ╲     │
                  │  │  ╱  ╲╱  ╲  │    │
                  │   ╲    📦    ╱     │
                  │    ╲────────╱      │
                  │                    │
                  └────────────────────┘
                   (Gradient circle)

                    No Items Yet

        Start building your lending library by
            adding items you're willing to share.

                  [Add Your First Item]
```

**Design:**
- Gradient circle: ocean-100 to sage-100
- Icon: Box/package in ocean-300
- Button: Ocean-600 background

---

### 3. Add Item Modal

```
┌─────────────────────────────────────────────────────────┐
│  Add New Item                                     [×]   │
│  Add an item to your inventory                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Item Name *                                            │
│  ┌────────────────────────────────────────────────┐    │
│  │ e.g., Mountain Bike                            │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Description                                            │
│  ┌────────────────────────────────────────────────┐    │
│  │ Describe your item...                          │    │
│  │                                                 │    │
│  │                                                 │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Quantity                                               │
│  ┌────────────────────────────────────────────────┐    │
│  │ 1                                               │    │
│  └────────────────────────────────────────────────┘    │
│  How many of this item do you have?                    │
│                                                          │
│  Share to Bubbles (optional)                           │
│  ☑ Family Circle                                       │
│  ☐ Neighborhood                                        │
│  ☑ Work Friends                                        │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                    [Cancel]  [Add Item]                 │
└─────────────────────────────────────────────────────────┘
```

**Design:**
- Modal: Rounded corners (rounded-2xl)
- Inputs: Border-neutral-300, focus:ring-ocean-500
- Checkboxes: Ocean-600 when checked
- Add button: Ocean-600 background
- Footer: Neutral-50 background

---

### 4. Item Detail Page (`/items/123`)

```
← Back to Inventory

┌─────────────────────────────────────────┐ ┌─────────────────┐
│                                         │ │ Quick Actions   │
│  Mountain Bike              [Edit] [🗑] │ │                 │
│  [Available]  Quantity: 1               │ │ [Share] Manage  │
│                                         │ │        Sharing  │
│  Trek Marlin 7, 29-inch wheels, perfect│ │                 │
│  for trail riding. Well maintained and │ │ [✎] Edit Item   │
│  regularly serviced.                   │ │                 │
│                                         │ │ [🗑] Delete Item│
│  Added January 15, 2024                │ │                 │
│                                         │ └─────────────────┘
├─────────────────────────────────────────┤
│ [Details] [History]                     │
├─────────────────────────────────────────┤
│                                         │
│  Availability                           │
│  1 of 1 available                       │
│  Currently lent to 0 people             │
│                                         │
│  Shared With                            │
│  [Family Circle] [Neighborhood]         │
│  [+ Add Bubble]                         │
│                                         │
└─────────────────────────────────────────┘
```

**History Tab:**
```
├─────────────────────────────────────────┤
│ [Details] [History*]                    │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Sarah Chen             [Active]  │  │
│  │ Borrowed: Mar 1, 2024            │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Mike Johnson        [Returned]   │  │
│  │ Borrowed: Feb 10, 2024           │  │
│  │ Returned: Feb 17, 2024           │  │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

**Design:**
- Active tab: Ocean-600 border, ocean-700 text
- History items: Neutral-50 background
- Active badge: Warning-100/800
- Returned badge: Success-100/800

---

### 5. Delete Confirmation Modal

```
        ┌────────────────────────────────┐
        │                                │
        │         ┌────────┐             │
        │         │   ⚠️   │             │
        │         └────────┘             │
        │     (Error-100 bg)             │
        │                                │
        │      Delete Item?              │
        │                                │
        │  Are you sure you want to      │
        │  delete Mountain Bike?         │
        │                                │
        │  ┌──────────────────────────┐  │
        │  │ ⚠️ Warning: This item is │  │
        │  │ currently lent to 1      │  │
        │  │ person. Deleting will    │  │
        │  │ remove the lending       │  │
        │  │ records.                 │  │
        │  └──────────────────────────┘  │
        │   (Warning-50 background)      │
        │                                │
        │  This action cannot be undone. │
        │                                │
        │      [Delete Item]             │
        │         (Red button)           │
        │                                │
        │         [Cancel]               │
        │                                │
        └────────────────────────────────┘
```

**Design:**
- Warning icon: Error-100 circle, error-600 icon
- Warning box: Warning-50 background, warning-800 text
- Delete button: Error-600 background
- Cancel button: White with neutral border

---

### 6. Share to Bubbles Modal

```
┌─────────────────────────────────────────────────────┐
│  Share to Bubbles                             [×]   │
│  Mountain Bike                                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Select bubbles to share this item with:            │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │ ☑ Family Circle                            │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │ ☑ Neighborhood                             │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │ ☐ Work Friends                             │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
├─────────────────────────────────────────────────────┤
│                       [Cancel]  [Save]              │
└─────────────────────────────────────────────────────┘
```

**Design:**
- Checkbox rows: Hover state with neutral-50
- Checked boxes: Ocean-600
- Save button: Ocean-600 background

---

## Color Palette Reference

### Status Colors
- **Available**: `bg-success-100 text-success-800` (#dcfce7 / #166534)
- **Partial**: `bg-warning-100 text-warning-800` (#fef3c7 / #92400e)
- **Unavailable**: `bg-neutral-100 text-neutral-700` (#f5f5f5 / #404040)

### Interactive Elements
- **Primary Button**: `bg-ocean-600 hover:bg-ocean-700` (#0284c7 / #0369a1)
- **Secondary Button**: `bg-white border-neutral-300 hover:bg-neutral-50`
- **Destructive**: `bg-error-600 hover:bg-error-700` (#dc2626 / #b91c1c)

### Backgrounds
- **Page**: `bg-neutral-50` (#fafafa)
- **Card**: `bg-white` (#ffffff)
- **Border**: `border-neutral-200` (#e5e5e5)

### Text
- **Primary**: `text-neutral-700` (#404040)
- **Secondary**: `text-neutral-600` (#525252)
- **Muted**: `text-neutral-500` (#737373)
- **Caption**: `text-neutral-400` (#a3a3a3)

---

## Responsive Breakpoints

### Mobile (< 640px)
- Grid: 1 column
- Modals: Slide from bottom (rounded top only)
- Navigation: Collapsed menu
- Touch targets: 44x44px minimum

### Tablet (640px - 1024px)
- Grid: 2-3 columns
- Modals: Centered with rounded corners
- Navigation: Visible links

### Desktop (> 1024px)
- Grid: 3-4 columns
- Modals: Centered, max-width container
- Navigation: Full horizontal
- Sidebar on detail page

---

## Animation Examples

### Button Hover
```
Normal:      bg-ocean-600
             ↓ (200ms transition)
Hover:       bg-ocean-700 + shadow-md
```

### Modal Entry
```
Closed:      opacity-0, translateY(100%)
             ↓ (300ms ease-out)
Open:        opacity-1, translateY(0)
```

### Card Hover
```
Normal:      shadow-sm
             ↓ (300ms transition)
Hover:       shadow-md
```

### Loading State
```
Button:      [Spinner ⟳] Processing...
List:        [Spinner ⟳] centered
Skeleton:    Pulsing gray boxes
```

---

## Icon Reference

Using standard SVG stroke icons (24x24px default):

- **Package/Box** (📦): Item placeholder
- **Plus** (+): Add item
- **Search** (🔍): Search bar
- **Grid** (⊞): Grid view
- **List** (☰): List view
- **Edit** (✎): Edit button
- **Trash** (🗑): Delete button
- **Share** (⤴): Share button
- **X** (×): Close modal
- **Check** (✓): Available status
- **Alert** (⚠️): Warning/error
- **Arrow** (←): Back navigation
- **Chevron** (›): Link indicator

---

## Accessibility Features

### Keyboard Navigation
- Tab: Move between interactive elements
- Enter/Space: Activate buttons
- Escape: Close modals
- Arrow keys: Navigate lists

### Focus States
```
Normal:      border-neutral-300
             ↓
Focus:       ring-2 ring-ocean-500 ring-offset-2
```

### Screen Reader Labels
- Icon buttons: `aria-label="Close modal"`
- Status badges: `role="status" aria-label="Available"`
- Form fields: Associated `<label>` elements
- Error messages: `aria-describedby` on inputs

---

## Mobile Optimizations

### Bottom Sheet Modal
```
Mobile:
┌─────────────────────┐
│                     │
│   Main Content      │
│                     │
│                     │
│ ╭─────────────────╮ │ ← Slides up from bottom
│ │  ───  Handle    │ │    Rounded top corners
│ │                 │ │    Touch-friendly
│ │  Modal Content  │ │
│ │                 │ │
│ └─────────────────┘ │
└─────────────────────┘
```

### Touch Targets
- Minimum size: 44x44px
- Adequate spacing between buttons
- Large hit areas for checkboxes
- Swipe-friendly list items

---

This visual reference complements the code implementation in:
- `/Users/urjit/code/bubbles/web/src/components/items/`
- `/Users/urjit/code/bubbles/web/src/pages/InventoryPage.tsx`
- `/Users/urjit/code/bubbles/web/src/pages/ItemDetailPage.tsx`
