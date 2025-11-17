from datetime import datetime
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import relationship

from app.db.base import Base


class OccupancyEvent(Base):
    __tablename__ = "occupancy_events"

    id = Column(Integer, primary_key=True, index=True)
    bus_id = Column(Integer, ForeignKey("buses.id"), nullable=False, index=True)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=True, index=True)
    timestamp = Column(DateTime, nullable=False, index=True)

    boarded = Column(Integer, default=0)
    alighted = Column(Integer, default=0)
    total_passengers = Column(Integer, nullable=False)

    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    source_id = Column(String(100), nullable=True)  # edge device id, etc.
    raw_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    bus = relationship("Bus", lazy="joined")
    route = relationship("Route", lazy="joined")
