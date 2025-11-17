from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.models.bus_state import BusState
from app.models.bus import Bus
from app.models.route import Route
from app.schemas.dashboard import BusStateOut

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/buses/state", response_model=list[BusStateOut])
def get_buses_state(
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_user),
):
    query = (
        db.query(BusState, Bus, Route)
        .join(Bus, BusState.bus_id == Bus.id)
        .outerjoin(Route, BusState.route_id == Route.id)
    )

    results: list[BusStateOut] = []
    for state, bus, route in query:
        results.append(
            BusStateOut(
                bus_id=bus.id,
                internal_code=bus.internal_code,
                route_id=route.id if route else None,
                route_code=route.code if route else None,
                total_passengers=state.total_passengers,
                occupancy_level=state.occupancy_level,
                latitude=state.latitude,
                longitude=state.longitude,
                last_update=state.last_update,
            )
        )

    return results
