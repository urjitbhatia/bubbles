# Type Usage Patterns

## Importing Types

```typescript
// Import the client
import { apiClient } from '../lib/api-client';

// Import type definitions
import type { paths, components } from '../types/api';

// Create type aliases for readability
type Item = components['schemas']['Item'];
type ItemCreate = components['schemas']['ItemCreate'];
type ItemList = components['schemas']['ItemList'];
```

## Making Type-Safe API Calls

```typescript
// GET request
const { data, error } = await apiClient.GET('/api/v1/items', {
  params: {
    query: { page: 1, limit: 10 }
  }
});
// data is typed as ItemList | undefined

// POST request
const { data, error } = await apiClient.POST('/api/v1/items', {
  body: {
    name: 'New Item',
    description: 'Optional description'
  }
});
// body is type-checked against ItemCreate

// GET with path parameters
const { data, error } = await apiClient.GET('/api/v1/items/{item_id}', {
  params: {
    path: { item_id: 'uuid-here' }
  }
});

// PATCH request
const { data, error } = await apiClient.PATCH('/api/v1/items/{item_id}', {
  params: { path: { item_id: 'uuid' } },
  body: { name: 'Updated Name' }
});

// DELETE request
const { error } = await apiClient.DELETE('/api/v1/items/{item_id}', {
  params: { path: { item_id: 'uuid' } }
});
```

## Re-exporting Types

In `web/src/services/apiClient.ts`:

```typescript
// Re-export commonly used types
import type { components } from '../types/api';

export type Item = components['schemas']['Item'];
export type ItemCreate = components['schemas']['ItemCreate'];
export type ItemList = components['schemas']['ItemList'];
export type UserProfile = components['schemas']['UserProfile'];
```

## Extending Generated Types

```typescript
import type { components } from '../types/api';

// Extend with frontend-specific fields
type Item = components['schemas']['Item'] & {
  isSelected?: boolean;  // UI state
  isLoading?: boolean;   // Loading state
};
```

## Type Guards

```typescript
function isItem(obj: unknown): obj is Item {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj
  );
}
```
