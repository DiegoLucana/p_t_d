from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.db.base import Base


class BusAssignment(Base):
    __tablename__ = "bus_assignments"

    id = Column(Integer, primary_key=True, index=True)
    bus_id = Column(Integer, ForeignKey("buses.id"), nullable=False)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False)
    assigned_from = Column(DateTime, nullable=False)
    assigned_to = Column(DateTime, nullable=True)  # NULL si vigente

    bus = relationship("Bus", lazy="joined")
    route = relationship("Route", lazy="joined")
