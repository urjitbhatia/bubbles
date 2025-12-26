# Workflow: API Integration

Add API calls to frontend components using the type-safe client.

## Instructions

1. Ensure types are up-to-date: `pnpm run generate-types`
2. Import the API client and types
3. Implement the API call with proper error handling
4. Handle loading and error states in UI

## Template

```typescript
import { apiClient } from '../lib/api-client';
import type { components } from '../types/api';

// Define type alias for readability
type MyResponse = components['schemas']['MyResponse'];

// In component:
const [data, setData] = useState<MyResponse | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  async function fetchData() {
    try {
      const { data, error } = await apiClient.GET('/api/v1/endpoint');
      if (error) throw new Error('Failed to fetch');
      setData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);
```

## API Methods

```typescript
// GET
const { data, error } = await apiClient.GET('/api/v1/items', {
  params: { query: { page: 1 } }
});

// POST
const { data, error } = await apiClient.POST('/api/v1/items', {
  body: { name: 'Item' }
});

// PATCH
const { data, error } = await apiClient.PATCH('/api/v1/items/{item_id}', {
  params: { path: { item_id: 'uuid' } },
  body: { name: 'Updated' }
});

// DELETE
const { error } = await apiClient.DELETE('/api/v1/items/{item_id}', {
  params: { path: { item_id: 'uuid' } }
});
```

## Expected Inputs

- Endpoint to call
- Request parameters/body
- Response handling requirements

## Expected Outputs

- Type-safe API call implementation
- Loading/error state handling
- UI updates based on response
