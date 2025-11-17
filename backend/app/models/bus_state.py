from datetime import datetime
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.base import Base


class BusState(Base):
    __tablename__ = "bus_state"

    bus_id = Column(Integer, ForeignKey("buses.id"), primary_key=True)
    last_update = Column(DateTime, nullable=False)
    total_passengers = Column(Integer, nullable=False)
    occupancy_level = Column(String(20), nullable=False)  # POCA, MEDIA, LLENA
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=True)
    status = Column(String(30), default="online")
    updated_at = Column(DateTime, default=datetime.utcnow)

    bus = relationship("Bus", lazy="joined")
    route = relationship("Route", lazy="joined")
