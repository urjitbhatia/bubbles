# Workflow: Create Page

Create a new page component with routing.

## Instructions

1. Create page file in `web/src/pages/[PageName].tsx`
2. Add route in `web/src/App.tsx`
3. If protected, add auth check
4. Implement page layout and content

## Template

```typescript
import { useAuth } from '../lib/auth';
import { Navigate } from 'react-router-dom';

export default function [PageName]() {
  // For protected pages:
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center py-12">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">[Page Title]</h1>
      {/* Page content */}
    </div>
  );
}
```

## Adding Route

In `web/src/App.tsx`:

```typescript
import [PageName] from './pages/[PageName]';

// Inside Routes:
<Route path="/[route-path]" element={<[PageName] />} />
```

## Expected Inputs

- Page name and route path
- Whether it's protected (requires auth)
- Page content requirements

## Expected Outputs

- New page file in `web/src/pages/`
- Route added to App.tsx
- Navigation link (optional)
