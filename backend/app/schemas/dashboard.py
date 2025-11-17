from datetime import datetime
from pydantic import BaseModel


class BusStateOut(BaseModel):
  bus_id: int
  internal_code: str
  route_id: int | None
  route_code: str | None
  total_passengers: int
  occupancy_level: str
  latitude: float | None
  longitude: float | None
  last_update: datetime

  class Config:
      from_attributes = True
