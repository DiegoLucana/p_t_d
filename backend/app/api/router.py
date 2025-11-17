from fastapi import APIRouter

from app.api.endpoints import (
    auth,
    users,
    validation,
    dashboard,
    occupancy_events,
    health,
)

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(validation.router)
api_router.include_router(dashboard.router)
api_router.include_router(occupancy_events.router)
api_router.include_router(health.router)
