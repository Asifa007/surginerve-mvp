"""
SurgiNerve – SQLAlchemy ORM models
"""
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import relationship

from app.database import Base


def _now() -> datetime:
    return datetime.now(timezone.utc)


class Robot(Base):
    __tablename__ = "robots"

    id = Column(Integer, primary_key=True, index=True)
    robot_name = Column(String(120), nullable=False)
    model_number = Column(String(80), nullable=False)
    installation_date = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(30), default="active")  # active | maintenance | offline

    # relationships
    sensor_readings = relationship("SensorReading", back_populates="robot", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="robot", cascade="all, delete-orphan")


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    robot_id = Column(Integer, ForeignKey("robots.id", ondelete="CASCADE"), nullable=False, index=True)
    temperature = Column(Float, nullable=False)   # °C
    vibration = Column(Float, nullable=False)     # mm/s
    current = Column(Float, nullable=False)       # Amperes
    timestamp = Column(DateTime(timezone=True), default=_now, nullable=False)

    robot = relationship("Robot", back_populates="sensor_readings")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    robot_id = Column(Integer, ForeignKey("robots.id", ondelete="CASCADE"), nullable=False, index=True)
    failure_probability = Column(Float, nullable=False)
    risk_level = Column(String(10), nullable=False)  # Low | Medium | High
    explanation = Column(JSON, nullable=False)
    timestamp = Column(DateTime(timezone=True), default=_now, nullable=False)

    robot = relationship("Robot", back_populates="predictions")
