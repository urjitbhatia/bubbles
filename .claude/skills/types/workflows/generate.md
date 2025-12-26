# Workflow: Generate Types

Generate TypeScript types from backend OpenAPI schema.

## Instructions

1. Ensure backend is running at http://localhost:9990
2. Run type generation command
3. Verify types were generated correctly
4. Commit the updated types

## Steps

### 1. Start Backend

```bash
# Python backend
cd api && make dev

# OR Rust backend
cd api-rust && make dev
```

### 2. Verify OpenAPI Endpoint

```bash
curl http://localhost:9990/openapi.json | head -20
```

Should return JSON schema.

### 3. Generate Types

```bash
cd web
pnpm run generate-types
```

### 4. Verify Generation

Check `web/src/types/api.ts` was updated:
- File should have recent timestamp
- Should contain your new endpoints/models

### 5. Fix Import Errors

After regeneration, run TypeScript check:
```bash
pnpm exec tsc --noEmit
```

Fix any type errors in components using the API.

## Troubleshooting

### Backend Not Running
```
Error: connect ECONNREFUSED 127.0.0.1:9990
```
→ Start the backend first

### Invalid JSON
```
Error: Unexpected token
```
→ Check backend logs for errors at `/openapi.json`

### Types Don't Match
→ Clear node_modules/.cache and regenerate:
```bash
rm -rf node_modules/.cache
pnpm run generate-types
```

## Expected Inputs

- Backend running with updated API

## Expected Outputs

- Updated `web/src/types/api.ts`
- Type-safe API calls in frontend
