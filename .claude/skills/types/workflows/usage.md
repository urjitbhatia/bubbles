# Workflow: Using Generated Types

How to use the auto-generated TypeScript types.

## Instructions

1. Import types from `../types/api`
2. Create type aliases for readability
3. Use with `apiClient` for type-safe calls

## Basic Usage

```typescript
import { apiClient } from '../lib/api-client';
import type { components } from '../types/api';

// Create type alias
type Item = components['schemas']['Item'];

// Use in component
const [items, setItems] = useState<Item[]>([]);

// Type-safe API call
const { data, error } = await apiClient.GET('/api/v1/items');
if (data) {
  setItems(data.items);  // data.items is Item[]
}
```

## Common Type Imports

```typescript
import type { paths, components, operations } from '../types/api';

// Schema types (models)
type Item = components['schemas']['Item'];
type ItemCreate = components['schemas']['ItemCreate'];
type UserProfile = components['schemas']['UserProfile'];

// Path types (for custom handling)
type ItemsPath = paths['/api/v1/items'];
type ItemsGetResponse = ItemsPath['get']['responses']['200']['content']['application/json'];
```

## In Service Layer

Create a services file to centralize API calls:

```typescript
// services/itemService.ts
import { apiClient } from '../lib/api-client';
import type { components } from '../types/api';

type Item = components['schemas']['Item'];
type ItemCreate = components['schemas']['ItemCreate'];

export async function getItems(page = 1, limit = 10) {
  const { data, error } = await apiClient.GET('/api/v1/items', {
    params: { query: { page, limit } }
  });

  if (error) throw new Error('Failed to fetch items');
  return data;
}

export async function createItem(item: ItemCreate): Promise<Item> {
  const { data, error } = await apiClient.POST('/api/v1/items', {
    body: item
  });

  if (error) throw new Error('Failed to create item');
  return data!;
}
```

## In Components

```typescript
import { getItems, createItem } from '../services/itemService';
import type { components } from '../types/api';

type Item = components['schemas']['Item'];

function ItemList() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    getItems().then(data => setItems(data.items));
  }, []);

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

## Expected Inputs

- Which types to use
- Where to use them

## Expected Outputs

- Type-safe component code
- Proper imports from api.ts
