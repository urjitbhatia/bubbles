# Workflow: Create Component

Create a new React component following project conventions.

## Instructions

1. Determine the component's purpose and name (PascalCase)
2. Create file in `web/src/components/[ComponentName].tsx`
3. Define TypeScript interface for props
4. Implement component with TailwindCSS styling
5. Export as named export

## Template

```typescript
interface [ComponentName]Props {
  // Define props here
}

export function [ComponentName]({ ...props }: [ComponentName]Props) {
  return (
    <div className="...">
      {/* Component content */}
    </div>
  );
}
```

## Expected Inputs

- Component name and purpose
- Props requirements
- Styling requirements

## Expected Outputs

- New component file in `web/src/components/`
- TypeScript interface for props
- TailwindCSS styling

## Checklist

- [ ] PascalCase component name
- [ ] Props interface defined
- [ ] Named export (not default)
- [ ] TailwindCSS classes for styling
- [ ] Proper TypeScript types
