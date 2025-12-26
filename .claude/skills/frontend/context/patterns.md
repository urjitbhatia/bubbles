# Frontend Patterns

## API Calls (Type-Safe)

```typescript
import { apiClient } from '../lib/api-client';
import type { components } from '../types/api';

type Item = components['schemas']['Item'];

// GET request
const { data, error } = await apiClient.GET('/api/v1/items', {
  params: { query: { page: 1, limit: 10 } }
});

// POST request
const { data, error } = await apiClient.POST('/api/v1/items', {
  body: { name: 'New Item', description: 'Description' }
});
```

## Authentication Hook

```typescript
import { useAuth } from '../lib/auth';

function MyComponent() {
  const { user, session, loading, signIn, signOut } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" />;

  return <div>Welcome {user.email}</div>;
}
```

## Protected Route Pattern

```typescript
function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;

  return <DashboardContent />;
}
```

## Data Fetching Pattern

```typescript
function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    async function fetchItems() {
      try {
        const { data, error } = await apiClient.GET('/api/v1/items');
        if (error) throw new Error('Failed to fetch');
        setItems(data?.items ?? []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [user]);

  // render...
}
```

## Component Pattern

```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false
}: ButtonProps) {
  const baseClasses = "px-4 py-2 rounded-md font-medium";
  const variantClasses = variant === 'primary'
    ? "bg-blue-600 text-white hover:bg-blue-700"
    : "bg-gray-200 text-gray-900 hover:bg-gray-300";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} disabled:opacity-50`}
    >
      {children}
    </button>
  );
}
```
