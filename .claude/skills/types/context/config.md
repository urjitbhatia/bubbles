# Type Generation Configuration

## How It Works

1. Backend (Python or Rust) exposes OpenAPI schema at `/openapi.json`
2. Frontend runs `openapi-typescript` to generate TypeScript types
3. Types are written to `web/src/types/api.ts`
4. Frontend uses types with `openapi-fetch` for type-safe API calls

## Generation Command

```bash
cd web
pnpm run generate-types
```

This runs:
```bash
openapi-typescript http://localhost:9990/openapi.json -o src/types/api.ts
```

## Requirements

- Backend must be running at http://localhost:9990
- `/openapi.json` endpoint must be accessible

## Generated File

Location: `web/src/types/api.ts`

Contents:
- `paths` - All API endpoints with request/response types
- `components` - Schema definitions (models)
- `operations` - Operation types

## Package Dependencies

In `web/package.json`:
```json
{
  "dependencies": {
    "openapi-fetch": "^0.15.0"
  },
  "devDependencies": {
    "openapi-typescript": "^7.10.1"
  }
}
```

## When to Regenerate

**Always regenerate after:**
- Adding new endpoints
- Changing request/response models
- Modifying Pydantic models (Python)
- Modifying Rust structs with ToSchema
- Changing route parameters
