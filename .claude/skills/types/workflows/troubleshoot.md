# Workflow: Troubleshoot Types

Fix type synchronization issues between frontend and backend.

## Common Issues

### 1. Types Don't Match API Response

**Symptom**: TypeScript says property exists but runtime shows undefined.

**Cause**: Types are out of sync with backend.

**Fix**:
```bash
cd web
pnpm run generate-types
```

### 2. Property Missing in Type

**Symptom**: `Property 'X' does not exist on type 'Y'`

**Cause**: Backend model changed but types not regenerated.

**Fix**:
1. Check backend model has the property
2. Regenerate types
3. Restart TypeScript server in IDE

### 3. Type Generation Fails

**Symptom**: Error running `pnpm run generate-types`

**Cause**: Backend not running or OpenAPI endpoint broken.

**Fix**:
```bash
# Check backend is running
curl http://localhost:9999/api/v1/health

# Check OpenAPI endpoint
curl http://localhost:9999/openapi.json | head -50

# If error in OpenAPI, check backend logs
```

### 4. Stale Types in IDE

**Symptom**: IDE shows old types, but file is updated.

**Fix**:
- VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server"
- Clear cache: `rm -rf node_modules/.cache`

### 5. Optional vs Required Mismatch

**Symptom**: Type says required but API allows null.

**Cause**: Backend model uses `Optional` incorrectly.

**Fix** (Python):
```python
# Ensure Optional is used correctly
class Item(BaseModel):
    description: Optional[str] = None  # Correct
    # NOT: description: str = None
```

### 6. Import Path Errors

**Symptom**: Cannot find module '../types/api'

**Fix**: Ensure types file exists and path is correct:
```bash
ls web/src/types/api.ts
```

If missing, regenerate.

## Verification Steps

1. **Check backend model**:
   - Python: `api/src/models/*.py`
   - Rust: `api-rust/src/models/*.rs`

2. **Check OpenAPI output**:
   ```bash
   curl http://localhost:9999/openapi.json | jq '.components.schemas.Item'
   ```

3. **Check generated types**:
   ```bash
   grep "Item" web/src/types/api.ts | head -20
   ```

4. **Run TypeScript check**:
   ```bash
   cd web && pnpm exec tsc --noEmit
   ```

## Expected Inputs

- Error message or symptom

## Expected Outputs

- Resolved type issue
- Synced types between frontend/backend
