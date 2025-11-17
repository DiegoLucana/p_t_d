from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, JSON, Float
from sqlalchemy.orm import relationship

from app.db.base import Base


class ValidationSession(Base):
    __tablename__ = "validation_sessions"

    id = Column(Integer, primary_key=True, index=True)
    created_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    bus_id = Column(Integer, ForeignKey("buses.id"), nullable=True)
    max_capacity_declared = Column(Integer, nullable=False)

    original_video_path = Column(Text, nullable=True)
    processed_video_path = Column(Text, nullable=True)

    status = Column(String(20), default="PENDING")  # PENDING, PROCESSING, COMPLETED, FAILED
    total_frames = Column(Integer, nullable=True)
    detected_max_occupancy = Column(Integer, nullable=True)

    processing_started_at = Column(DateTime, nullable=True)
    processing_finished_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    created_by = relationship("User", lazy="joined")
    bus = relationship("Bus", lazy="joined")


class ValidationFrameStat(Base):
    __tablename__ = "validation_frame_stats"

    id = Column(Integer, primary_key=True, index=True)
    validation_session_id = Column(Integer, ForeignKey("validation_sessions.id"), nullable=False)
    frame_index = Column(Integer, nullable=True)
    timestamp_relative = Column(Float, nullable=True)  # segundos desde el inicio del video

    detected_passengers = Column(Integer, nullable=False)
    raw_metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("ValidationSession", backref="frame_stats")
