"""
API Routes

All route modules are aggregated here and included in the main router.
"""

from fastapi import APIRouter

from routes.items import router as items_router
from routes.user import router as user_router
from routes.bubbles import router as bubbles_router
from routes.loans import router as loans_router


router = APIRouter()

# Include all route modules
router.include_router(items_router, prefix="/items", tags=["Items"])
router.include_router(user_router, prefix="/user", tags=["User"])
router.include_router(bubbles_router, prefix="/bubbles", tags=["Bubbles"])
router.include_router(loans_router, prefix="/loans", tags=["Loans"])
