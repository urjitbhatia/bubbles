# Workflow: Styling

Apply TailwindCSS styles to components.

## Instructions

1. Use Tailwind utility classes directly in JSX
2. Follow responsive design patterns (mobile-first)
3. Use consistent spacing and color scales
4. Extract repeated patterns to components

## Common Patterns

### Layout
```tsx
// Container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Flexbox
<div className="flex items-center justify-between">

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### Cards
```tsx
<div className="bg-white rounded-lg shadow-sm border p-6">
  <h3 className="text-lg font-semibold mb-2">Title</h3>
  <p className="text-gray-600">Content</p>
</div>
```

### Buttons
```tsx
// Primary
<button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50">

// Secondary
<button className="bg-gray-200 text-gray-900 px-4 py-2 rounded-md font-medium hover:bg-gray-300">

// Danger
<button className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700">
```

### Forms
```tsx
// Input
<input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

// Label
<label className="block text-sm font-medium text-gray-700 mb-1">
```

### Responsive
```tsx
// Mobile-first: base styles, then breakpoints
<div className="text-sm md:text-base lg:text-lg">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
<div className="hidden md:block">  {/* Show on md+ */}
<div className="md:hidden">        {/* Show on mobile only */}
```

### States
```tsx
// Hover
className="hover:bg-gray-100"

// Focus
className="focus:ring-2 focus:ring-blue-500 focus:outline-none"

// Disabled
className="disabled:opacity-50 disabled:cursor-not-allowed"

// Loading
className="animate-spin"
```

## Expected Inputs

- Component to style
- Design requirements
- Responsive behavior needs

## Expected Outputs

- Tailwind utility classes applied
- Responsive design implemented
- Consistent with project style
