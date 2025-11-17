from datetime import datetime
from pydantic import BaseModel


class OccupancyEventIn(BaseModel):
    bus_id: int
    route_id: int | None = None
    timestamp: datetime
    boarded: int = 0
    alighted: int = 0
    total_passengers: int
    latitude: float | None = None
    longitude: float | None = None
    source_id: str | None = None
    raw_json: dict | None = None
