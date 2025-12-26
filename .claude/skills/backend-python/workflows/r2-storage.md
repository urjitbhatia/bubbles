# Workflow: R2 Storage

Work with Cloudflare R2 object storage.

## Instructions

1. Access R2 binding from request scope
2. Use R2 API for operations
3. Handle missing binding gracefully

## Access R2 Binding

```python
from fastapi import Request, HTTPException

async def get_r2_binding(req: Request):
    env = req.scope.get("env")
    r2 = getattr(env, "STORAGE", None)

    if not r2:
        raise HTTPException(
            status_code=503,
            detail="Storage not available"
        )

    return r2
```

## R2 Operations

### Upload Object
```python
@router.post("/upload")
async def upload_file(
    req: Request,
    file: UploadFile,
    current_user: CurrentUser,
):
    r2 = await get_r2_binding(req)
    user_id, _ = current_user

    key = f"users/{user_id}/{file.filename}"
    content = await file.read()

    await r2.put(key, content, {
        "httpMetadata": {
            "contentType": file.content_type
        }
    })

    return {"key": key}
```

### Download Object
```python
@router.get("/download/{key:path}")
async def download_file(
    req: Request,
    key: str,
    current_user: CurrentUser,
):
    r2 = await get_r2_binding(req)

    obj = await r2.get(key)
    if not obj:
        raise HTTPException(status_code=404, detail="File not found")

    content = await obj.arrayBuffer()
    return Response(
        content=bytes(content),
        media_type=obj.httpMetadata.contentType or "application/octet-stream"
    )
```

### List Objects
```python
@router.get("/files")
async def list_files(
    req: Request,
    prefix: str = "",
    current_user: CurrentUser,
):
    r2 = await get_r2_binding(req)
    user_id, _ = current_user

    result = await r2.list({
        "prefix": f"users/{user_id}/{prefix}"
    })

    return {
        "objects": [
            {"key": obj.key, "size": obj.size}
            for obj in result.objects
        ]
    }
```

### Delete Object
```python
@router.delete("/files/{key:path}")
async def delete_file(
    req: Request,
    key: str,
    current_user: CurrentUser,
):
    r2 = await get_r2_binding(req)
    await r2.delete(key)
    return {"deleted": key}
```

## Expected Inputs

- Operation type (upload, download, list, delete)
- File/object details

## Expected Outputs

- R2 operation implementation
- Error handling for missing binding
