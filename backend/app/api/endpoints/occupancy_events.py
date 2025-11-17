from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.api import deps
from app.models.occupancy_event import OccupancyEvent
from app.models.bus_state import BusState
from app.schemas.occupancy import OccupancyEventIn

router = APIRouter(prefix="/events", tags=["events"])


def map_occupancy_level(total_passengers: int, max_capacity: int) -> str:
    # Puedes parametrizar estos umbrales luego
    if total_passengers <= 9:
        return "POCA"
    elif total_passengers <= 22:
        return "MEDIA"
    return "LLENA"


@router.post("/occupancy")
def ingest_occupancy_event(
    event: OccupancyEventIn,
    db: Session = Depends(deps.get_db),
):
    # Guardar evento histórico
    db_event = OccupancyEvent(
        bus_id=event.bus_id,
        route_id=event.route_id,
        timestamp=event.timestamp,
        boarded=event.boarded,
        alighted=event.alighted,
        total_passengers=event.total_passengers,
        latitude=event.latitude,
        longitude=event.longitude,
        source_id=event.source_id,
        raw_json=event.raw_json,
    )
    db.add(db_event)

    # Actualizar estado del bus en tiempo real
    bus_state = db.query(BusState).filter(BusState.bus_id == event.bus_id).first()
    if not bus_state:
        bus_state = BusState(
            bus_id=event.bus_id,
            last_update=event.timestamp,
            total_passengers=event.total_passengers,
            occupancy_level="POCA",  # se recalcula luego
            latitude=event.latitude,
            longitude=event.longitude,
            route_id=event.route_id,
            status="online",
            updated_at=datetime.utcnow(),
        )
        db.add(bus_state)

    # Para obtener max_capacity real deberíamos join con Bus
    from app.models.bus import Bus

    bus = db.query(Bus).filter(Bus.id == event.bus_id).first()
    max_capacity = bus.max_capacity if bus else 50

    bus_state.total_passengers = event.total_passengers
    bus_state.last_update = event.timestamp
    bus_state.latitude = event.latitude
    bus_state.longitude = event.longitude
    bus_state.route_id = event.route_id
    bus_state.occupancy_level = map_occupancy_level(event.total_passengers, max_capacity)
    bus_state.updated_at = datetime.utcnow()

    db.commit()
    return {"status": "ok"}
