from datetime import datetime
from pydantic import BaseModel


class ValidationSessionCreate(BaseModel):
    max_capacity_declared: int
    bus_id: int | None = None


class ValidationSessionOut(BaseModel):
    id: int
    bus_id: int | None
    max_capacity_declared: int
    original_video_path: str | None
    original_video_url: str | None = None
    processed_video_path: str | None
    processed_video_url: str | None = None
    status: str
    total_frames: int | None
    detected_max_occupancy: int | None
    processing_started_at: datetime | None
    processing_finished_at: datetime | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ValidationFrameStatOut(BaseModel):
    id: int
    frame_index: int | None
    timestamp_relative: float | None
    detected_passengers: int
    raw_metadata_json: dict | None
    created_at: datetime

    class Config:
        from_attributes = True
