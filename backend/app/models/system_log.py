from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String, Text, JSON
from app.db.base import Base


class SystemLog(Base):
    __tablename__ = "system_logs"

    id = Column(Integer, primary_key=True, index=True)
    level = Column(String(20), default="INFO")
    message = Column(Text, nullable=False)
    context_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
