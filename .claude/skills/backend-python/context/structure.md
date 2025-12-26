# Backend Python Structure

```
api/
├── src/
│   ├── models/             # Pydantic models
│   │   ├── __init__.py
│   │   ├── item.py         # Item schemas
│   │   └── user.py         # User schemas
│   │
│   ├── routes/             # API endpoints
│   │   ├── __init__.py     # Router aggregation
│   │   ├── items.py        # Items CRUD
│   │   └── user.py         # User endpoints
│   │
│   ├── __init__.py
│   ├── worker.py           # Workers entry point
│   ├── httpserver.py       # FastAPI app setup
│   ├── dependencies.py     # Auth dependencies
│   └── supabase_client.py  # Supabase configuration
│
├── supabase/               # Database (shared with Rust)
│   ├── migrations/
│   ├── seed/
│   └── config.toml
│
├── tests/
│   ├── __init__.py
│   └── test_health.py
│
├── .dev.vars.example       # Environment template
├── wrangler.jsonc          # Workers config
├── pyproject.toml          # Python deps (uv)
└── Makefile
```

## Conventions

- **Models**: Pydantic BaseModel classes
- **Routes**: FastAPI APIRouter with `/api/v1` prefix
- **Dependencies**: Use `Depends()` for injection
- **Async**: All route handlers are async
