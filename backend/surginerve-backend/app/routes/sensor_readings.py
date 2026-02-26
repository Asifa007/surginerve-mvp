"""
SurgiNerve – /sensor-readings endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.db_models import Robot, SensorReading
from app.schemas.schemas import SensorReadingCreate, SensorReadingOut

router = APIRouter(prefix="/sensor-readings", tags=["Sensor Readings"])


@router.get("/", response_model=list[SensorReadingOut], summary="List sensor readings")
def list_readings(
    robot_id: int | None = Query(None, description="Filter by robot ID"),
    skip: int = 0,
    limit: int = 200,
    db: Session = Depends(get_db),
):
    q = db.query(SensorReading)
    if robot_id is not None:
        q = q.filter(SensorReading.robot_id == robot_id)
    return q.order_by(SensorReading.timestamp.desc()).offset(skip).limit(limit).all()


@router.post(
    "/",
    response_model=SensorReadingOut,
    status_code=status.HTTP_201_CREATED,
    summary="Record a new sensor reading",
)
def create_reading(payload: SensorReadingCreate, db: Session = Depends(get_db)):
    # Validate robot exists
    if not db.query(Robot).filter(Robot.id == payload.robot_id).first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Robot {payload.robot_id} not found")

    reading = SensorReading(**payload.model_dump())
    db.add(reading)
    db.commit()
    db.refresh(reading)
    return reading
