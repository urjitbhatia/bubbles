# Workflow: Authentication

Implement authentication features using Supabase Auth.

## Instructions

1. Use the `useAuth` hook from `lib/auth.tsx`
2. Handle loading states during auth checks
3. Redirect unauthenticated users appropriately
4. Clear state on logout

## Auth Hook Usage

```typescript
import { useAuth } from '../lib/auth';

function MyComponent() {
  const {
    user,       // Current user or null
    session,    // Current session or null
    loading,    // True during initial auth check
    signIn,     // (email, password) => Promise
    signUp,     // (email, password) => Promise
    signOut     // () => Promise
  } = useAuth();
}
```

## Protected Route Pattern

```typescript
function ProtectedPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <PageContent />;
}
```

## Login Form Pattern

```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState<string | null>(null);
const { signIn } = useAuth();
const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  try {
    await signIn(email, password);
    navigate('/dashboard');
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Login failed');
  }
};
```

## Expected Inputs

- Type of auth feature (login, signup, logout, protected route)
- Redirect destinations
- Error handling requirements

## Expected Outputs

- Auth-aware component implementation
- Proper loading state handling
- Error display
