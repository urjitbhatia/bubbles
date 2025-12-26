# Workflow: Create Model

Create Pydantic models for request/response schemas.

## Instructions

1. Create model file in `api/src/models/`
2. Define Pydantic BaseModel classes
3. Use proper type hints
4. Add docstrings for OpenAPI docs
5. Export from `models/__init__.py`

## Template

```python
"""
[Entity] models

Pydantic models for [entity]-related operations.
"""

from typing import Optional
from pydantic import BaseModel, Field

class [Entity]Create(BaseModel):
    """Request model for creating a [entity]."""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)

class [Entity](BaseModel):
    """Response model for a [entity]."""
    id: str
    name: str
    description: Optional[str] = None
    created_at: str
    user_id: str

class [Entity]Update(BaseModel):
    """Request model for updating a [entity]."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)

class [Entity]List(BaseModel):
    """Paginated list of [entity]s."""
    items: list[[Entity]]
    total: int
    page: int
    limit: int
```

## Field Validation

```python
from pydantic import Field, field_validator

class MyModel(BaseModel):
    # Required with constraints
    name: str = Field(..., min_length=1, max_length=100)

    # Optional with default
    count: int = Field(default=0, ge=0)

    # Custom validation
    @field_validator('name')
    @classmethod
    def name_must_be_valid(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()
```

## Expected Inputs

- Entity name and fields
- Validation requirements
- Optional vs required fields

## Expected Outputs

- Model file in `api/src/models/`
- Create, Read, Update, List models
- Proper type hints and validation
