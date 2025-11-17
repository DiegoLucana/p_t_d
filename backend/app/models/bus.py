from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String
from app.db.base import Base


class Bus(Base):
    __tablename__ = "buses"

    id = Column(Integer, primary_key=True, index=True)
    internal_code = Column(String(50), unique=True, index=True, nullable=False)
    plate = Column(String(20), unique=True, index=True, nullable=False)
    fleet = Column(String(100), nullable=True)
    max_capacity = Column(Integer, nullable=False)
    model = Column(String(100), nullable=True)
    year = Column(Integer, nullable=True)
    status = Column(String(30), default="active")  # active, inactive, maintenance, etc.
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )
