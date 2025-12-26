"""
API Routes

All route modules are aggregated here and included in the main router.
"""

from fastapi import APIRouter

from routes.items import router as items_router
from routes.user import router as user_router


router = APIRouter()

# Include all route modules
router.include_router(items_router, prefix="/items", tags=["Items"])
router.include_router(user_router, prefix="/user", tags=["User"])
