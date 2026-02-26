"""
SurgiNerve – /robots endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.db_models import Robot
from app.schemas.schemas import RobotCreate, RobotOut

router = APIRouter(prefix="/robots", tags=["Robots"])


@router.get("/", response_model=list[RobotOut], summary="List all robots")
def list_robots(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Robot).offset(skip).limit(limit).all()


@router.get("/{robot_id}", response_model=RobotOut, summary="Get a single robot")
def get_robot(robot_id: int, db: Session = Depends(get_db)):
    robot = db.query(Robot).filter(Robot.id == robot_id).first()
    if not robot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Robot {robot_id} not found")
    return robot


@router.post("/", response_model=RobotOut, status_code=status.HTTP_201_CREATED, summary="Register a new robot")
def create_robot(payload: RobotCreate, db: Session = Depends(get_db)):
    robot = Robot(**payload.model_dump())
    db.add(robot)
    db.commit()
    db.refresh(robot)
    return robot
