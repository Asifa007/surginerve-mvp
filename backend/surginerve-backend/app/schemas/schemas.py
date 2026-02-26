"""
SurgiNerve – Pydantic schemas (request/response validation)
"""
from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


# ── Robot ────────────────────────────────────────────────────────────────────
class RobotCreate(BaseModel):
    robot_name: str = Field(..., min_length=1, max_length=120)
    model_number: str = Field(..., min_length=1, max_length=80)
    installation_date: datetime
    status: str = Field(default="active", pattern="^(active|maintenance|offline)$")


class RobotOut(RobotCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


# ── Sensor Reading ────────────────────────────────────────────────────────────
class SensorReadingCreate(BaseModel):
    robot_id: int = Field(..., gt=0)
    temperature: float = Field(..., ge=-50, le=300, description="°C")
    vibration: float = Field(..., ge=0, le=100, description="mm/s")
    current: float = Field(..., ge=0, le=200, description="Amperes")


class SensorReadingOut(SensorReadingCreate):
    id: int
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True)


# ── Prediction ────────────────────────────────────────────────────────────────
class PredictRequest(BaseModel):
    robot_id: int = Field(..., gt=0)
    temperature: float = Field(..., ge=-50, le=300)
    vibration: float = Field(..., ge=0, le=100)
    current: float = Field(..., ge=0, le=200)


class PredictResponse(BaseModel):
    robot_id: int
    failure_probability: float
    risk_level: str
    explanation: dict[str, Any]
    timestamp: datetime


class PredictionOut(BaseModel):
    id: int
    robot_id: int
    failure_probability: float
    risk_level: str
    explanation: dict[str, Any]
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True)


# ── Generic ───────────────────────────────────────────────────────────────────
class MessageResponse(BaseModel):
    message: str
    detail: Any = None
