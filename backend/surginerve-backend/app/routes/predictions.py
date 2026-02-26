"""
SurgiNerve – /predictions & /predict endpoints
"""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.ml.predict import predict_failure, reload_model
from app.models.db_models import Prediction, Robot
from app.schemas.schemas import MessageResponse, PredictRequest, PredictResponse, PredictionOut

router = APIRouter(tags=["Predictions"])


# ── Real-time prediction ──────────────────────────────────────────────────────
@router.post(
    "/predict",
    response_model=PredictResponse,
    summary="Predict failure risk for a robot",
)
def predict(payload: PredictRequest, db: Session = Depends(get_db)):
    # Validate robot exists
    if not db.query(Robot).filter(Robot.id == payload.robot_id).first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Robot {payload.robot_id} not found")

    result = predict_failure(
        temperature=payload.temperature,
        vibration=payload.vibration,
        current=payload.current,
    )

    now = datetime.now(timezone.utc)

    # Persist prediction
    prediction = Prediction(
        robot_id=payload.robot_id,
        failure_probability=result["failure_probability"],
        risk_level=result["risk_level"],
        explanation=result["explanation"],
        timestamp=now,
    )
    db.add(prediction)
    db.commit()

    return PredictResponse(
        robot_id=payload.robot_id,
        failure_probability=result["failure_probability"],
        risk_level=result["risk_level"],
        explanation=result["explanation"],
        timestamp=now,
    )


# ── Prediction history ────────────────────────────────────────────────────────
@router.get(
    "/predictions",
    response_model=list[PredictionOut],
    summary="List stored predictions",
)
def list_predictions(
    robot_id: int | None = Query(None, description="Filter by robot ID"),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    q = db.query(Prediction)
    if robot_id is not None:
        q = q.filter(Prediction.robot_id == robot_id)
    return q.order_by(Prediction.timestamp.desc()).offset(skip).limit(limit).all()


# ── Model management ──────────────────────────────────────────────────────────
@router.post(
    "/reload-model",
    response_model=MessageResponse,
    summary="Reload the ML model from disk without restarting",
)
def reload():
    try:
        message = reload_model()
        return MessageResponse(message=message)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc))
