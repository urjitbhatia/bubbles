# Items & Inventory Components

This directory contains all UI components for the personal item inventory management feature (FEAT-048).

## Component Overview

### Reusable Components

#### `ItemAvailabilityBadge.tsx`
Displays the availability status of an item based on quantity and active loans.

**Props:**
- `available: number` - Number of available copies
- `total: number` - Total quantity owned

**Logic:**
- All available (qty = available): Green "Available"
- Partially available: Yellow "X of Y Available"
- None available: Gray "All Lent Out"

**Usage:**
```tsx
<ItemAvailabilityBadge available={2} total={4} />
```

---

#### `BubbleSharePills.tsx`
Shows which bubbles an item is shared to as colored pills/tags.

**Props:**
- `bubbles: Array<{ id: string; name: string }>` - List of bubbles item is shared to
- `onAdd?: () => void` - Optional callback to add more bubbles

**Usage:**
```tsx
<BubbleSharePills
  bubbles={[{ id: 'b1', name: 'Family Circle' }]}
  onAdd={() => setShowShareModal(true)}
/>
```

---

#### `ItemCard.tsx`
Card component for displaying an item in grid or list view.

**Props:**
- `id: string` - Item ID
- `name: string` - Item name
- `description?: string | null` - Optional description
- `quantity: number` - Total quantity
- `availableQuantity: number` - Available quantity
- `sharedBubbles: Array<{ id: string; name: string }>` - Bubbles shared to

**Features:**
- Links to item detail page
- Gradient placeholder for image (MVP has no photos)
- Shows availability badge
- Displays shared bubbles
- Hover state with shadow transition

**Usage:**
```tsx
<ItemCard
  id="123"
  name="Mountain Bike"
  description="Trek Marlin 7"
  quantity={1}
  availableQuantity={0}
  sharedBubbles={[...]}
/>
```

---

### Modal Components

#### `AddItemModal.tsx`
Modal for adding a new item to inventory.

**Props:**
- `isOpen: boolean` - Whether modal is visible
- `onClose: () => void` - Close callback
- `onAdd: (item) => Promise<void>` - Submit callback
- `availableBubbles: Array<{ id: string; name: string }>` - Bubbles user can share to

**Form Fields:**
- Name (required)
- Description (optional)
- Quantity (number, min 1, default 1)
- Share to Bubbles (checkboxes, optional)

**Features:**
- Form validation
- Loading state
- Error display
- Responsive (bottom sheet on mobile, centered on desktop)

**Usage:**
```tsx
<AddItemModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onAdd={handleAddItem}
  availableBubbles={bubbles}
/>
```

---

#### `EditItemForm.tsx`
Inline form for editing item details.

**Props:**
- `item: { id, name, description, quantity }` - Current item data
- `activeLoans: number` - Number of active loans
- `onSave: (item) => Promise<void>` - Save callback
- `onCancel: () => void` - Cancel callback

**Features:**
- Same fields as add form
- Validation prevents reducing quantity below active loans
- Warning message when reducing quantity with active loans
- Loading state during save

**Usage:**
```tsx
<EditItemForm
  item={currentItem}
  activeLoans={2}
  onSave={handleSave}
  onCancel={() => setIsEditing(false)}
/>
```

---

#### `DeleteItemModal.tsx`
Confirmation dialog for deleting an item.

**Props:**
- `isOpen: boolean` - Whether modal is visible
- `onClose: () => void` - Close callback
- `onDelete: () => Promise<void>` - Delete callback
- `itemName: string` - Name of item being deleted
- `activeLoans: number` - Number of active loans

**Features:**
- Warning icon
- Special warning if active loans exist
- Destructive action styling (red)
- Confirmation required

**Usage:**
```tsx
<DeleteItemModal
  isOpen={showDelete}
  onClose={() => setShowDelete(false)}
  onDelete={handleDelete}
  itemName="Mountain Bike"
  activeLoans={1}
/>
```

---

#### `ShareToBubblesModal.tsx`
Modal for selecting which bubbles to share an item to.

**Props:**
- `isOpen: boolean` - Whether modal is visible
- `onClose: () => void` - Close callback
- `onSave: (bubbleIds: string[]) => Promise<void>` - Save callback
- `availableBubbles: Array<{ id: string; name: string }>` - All available bubbles
- `currentlySharedTo: string[]` - Currently selected bubble IDs
- `itemName: string` - Name of item being shared

**Features:**
- Multi-select checkboxes
- Pre-selects currently shared bubbles
- Empty state if no bubbles exist
- Loading state during save

**Usage:**
```tsx
<ShareToBubblesModal
  isOpen={showShare}
  onClose={() => setShowShare(false)}
  onSave={handleShare}
  availableBubbles={bubbles}
  currentlySharedTo={['b1', 'b2']}
  itemName="Mountain Bike"
/>
```

---

## Pages

### `InventoryPage.tsx`
Main inventory listing page at `/inventory`.

**Features:**
- Grid/List view toggle
- Search bar
- Add Item FAB/button
- Empty state
- No results state
- Loading skeletons
- Responsive grid (1-4 columns)

**Mock Data:**
Currently uses mock data for development. Replace with actual API calls:
```tsx
// Replace this:
setItems([...mockItems])

// With this:
const { data } = await apiClient.GET('/api/v1/items/me')
setItems(data?.items ?? [])
```

---

### `ItemDetailPage.tsx`
Item detail page at `/items/:id`.

**Features:**
- Full item details
- Edit mode (inline form)
- Delete button with confirmation
- Bubble sharing section
- Availability display
- Tabbed interface (Details / History)
- Loan history list
- Quick actions sidebar
- Responsive layout

**Tabs:**
- **Details**: Availability, shared bubbles
- **History**: Loan history (placeholder for FEAT-052)

**Mock Data:**
Currently uses mock data. Replace with actual API calls:
```tsx
// Fetch item
const { data: item } = await apiClient.GET('/api/v1/items/{item_id}', {
  params: { path: { item_id: id } }
})

// Fetch loan history (when API is ready)
const { data: loans } = await apiClient.GET('/api/v1/items/{item_id}/loans', {
  params: { path: { item_id: id } }
})
```

---

## Design Language Compliance

All components follow the Bubbles Design Language (`/Users/urjit/code/bubbles/docs/DESIGN_LANGUAGE.md`):

### Colors
- **Primary**: `ocean-600` for buttons, links
- **Success**: `success-*` for available items
- **Warning**: `warning-*` for partially available
- **Error**: `error-*` for delete actions
- **Neutral**: `neutral-*` for borders, text, disabled states

### Typography
- **Headings**: `font-display` for page titles, `font-semibold` for sections
- **Body**: `text-base` (16px) for readability
- **Labels**: `text-sm` font-medium
- **Captions**: `text-xs` for metadata

### Spacing
- **Cards**: `p-6` for generous padding
- **Modals**: `p-6` content, `gap-3` buttons
- **Stack**: `space-y-4` for lists, `space-y-6` for sections

### Interactions
- **Hover**: Smooth color transitions (200ms)
- **Focus**: Ring with offset for keyboard navigation
- **Loading**: Spinner animations
- **Disabled**: 50% opacity + cursor-not-allowed

### Accessibility
- All interactive elements have focus states
- Icon buttons have aria-labels
- Forms have proper labels and error messages
- Color is not the only indicator (text + icons)
- Touch targets are 44x44px minimum

---

## API Integration

### Mock vs. Real Data

All components currently use mock data. To integrate with the backend:

1. **Update API types** in `/Users/urjit/code/bubbles/web/src/types/api.ts`
2. **Run type generation**: `cd web && pnpm run generate-types`
3. **Import types**: `import type { components } from '../types/api'`
4. **Replace mock functions** with API calls using `apiClient`

### Example API Integration

```tsx
// Before (mock)
const handleAddItem = async (newItem) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  setItems(prev => [{ id: Date.now().toString(), ...newItem }, ...prev])
}

// After (real API)
const handleAddItem = async (newItem) => {
  const { data, error } = await apiClient.POST('/api/v1/items', {
    body: {
      name: newItem.name,
      description: newItem.description || null,
      quantity: newItem.quantity,
    }
  })

  if (error) throw new Error('Failed to add item')

  // Share to bubbles
  for (const bubbleId of newItem.bubbleIds) {
    await apiClient.POST('/api/v1/items/{item_id}/share', {
      params: { path: { item_id: data.id } },
      body: { bubble_id: bubbleId }
    })
  }

  // Refresh items list
  fetchItems()
}
```

---

## File Structure

```
web/src/
├── components/
│   └── items/
│       ├── ItemAvailabilityBadge.tsx
│       ├── BubbleSharePills.tsx
│       ├── ItemCard.tsx
│       ├── AddItemModal.tsx
│       ├── EditItemForm.tsx
│       ├── DeleteItemModal.tsx
│       ├── ShareToBubblesModal.tsx
│       └── README.md (this file)
├── pages/
│   ├── InventoryPage.tsx
│   └── ItemDetailPage.tsx
└── types/
    └── api.ts
```

---

## Testing Checklist

- [ ] Inventory page loads with mock data
- [ ] Search filters items correctly
- [ ] Grid/List view toggle works
- [ ] Add Item modal opens and closes
- [ ] Add Item form validates required fields
- [ ] Item card links to detail page
- [ ] Detail page loads item data
- [ ] Edit mode works with validation
- [ ] Delete confirmation shows warnings for active loans
- [ ] Share modal allows selecting bubbles
- [ ] All components are responsive (mobile to desktop)
- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Loading states show during async operations

---

## Next Steps

1. **Backend API**: Implement item endpoints (CRUD, sharing, loans)
2. **Type Generation**: Run `pnpm run generate-types` after backend is ready
3. **Replace Mock Data**: Update all `TODO` comments with real API calls
4. **Image Upload**: Add photo upload when ready (currently placeholder gradients)
5. **Loan Management**: Implement request/lend/return flows (FEAT-049)
6. **Real-time Updates**: Add subscriptions for loan status changes
7. **Optimistic Updates**: Improve UX with optimistic UI updates
8. **Error Handling**: Add toast notifications for errors
9. **Loading States**: Add skeleton screens instead of spinners
10. **Testing**: Write integration tests for all flows

---

## Questions?

For design decisions, see `/Users/urjit/code/bubbles/docs/DESIGN_LANGUAGE.md`

For feature specs, see `/Users/urjit/code/bubbles/docs/SPEC.md`
