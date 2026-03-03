"""
SurgiNerve – FastAPI application entry point
"""

import logging
import random

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import Base, engine, SessionLocal
from app.middleware.exception_handler import global_exception_handler
from app.routes import predictions, robots, sensor_readings

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Smart Predictive Maintenance System for Surgical Robots. "
        "Accepts real-time IoT sensor data, predicts failure risk using an "
        "Explainable Boosting Machine, and returns per-feature explanations."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # temporarily allow all for production testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Exception Handlers ────────────────────────────────────────────────────────
app.add_exception_handler(Exception, global_exception_handler)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": str(exc.body)},
    )


# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(robots.router)
app.include_router(sensor_readings.router)
app.include_router(predictions.router)


# ───────────────────────────────────────────────────────────────────────────────
# 🔥 CLOUD-SAFE SENSOR GENERATION
# Instead of background infinite loop, generate data when requested
# ───────────────────────────────────────────────────────────────────────────────

def generate_sensor_data():
    """
    Generates ONE new sensor reading + prediction.
    Called on-demand (cloud-safe).
    """

    from app.models.db_models import SensorReading, Prediction, Robot
    from app.ml.predict import predict_failure

    db = SessionLocal()

    try:
        robot = db.query(Robot).first()
        if not robot:
            logger.warning("No robot found. Create one using POST /robots/")
            return

        temperature = round(random.uniform(35, 75), 2)
        vibration = round(random.uniform(0.1, 1.5), 2)
        current = round(random.uniform(1.0, 5.0), 2)

        sensor = SensorReading(
            robot_id=robot.id,
            temperature=temperature,
            vibration=vibration,
            current=current,
        )
        db.add(sensor)
        db.flush()

        result = predict_failure(
            temperature=temperature,
            vibration=vibration,
            current=current,
        )

        prediction = Prediction(
            robot_id=robot.id,
            failure_probability=result["failure_probability"],
            risk_level=result["risk_level"],
            explanation=result["explanation"],
        )

        db.add(prediction)
        db.commit()

        logger.info(
            f"[GENERATED] Temp={temperature} | Vib={vibration} | "
            f"Curr={current} | Risk={result['risk_level']}"
        )

    except Exception as e:
        db.rollback()
        logger.error(f"Generation error: {e}")
    finally:
        db.close()


# ── Startup ───────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup_event():
    logger.info("Starting %s v%s", settings.APP_NAME, settings.APP_VERSION)

    Base.metadata.create_all(bind=engine)
    logger.info("Database tables verified / created.")

    # Pre-load ML model
    try:
        from app.ml.predict import get_model
        get_model()
        logger.info("ML model loaded successfully.")
    except FileNotFoundError:
        logger.warning("Model file not found.")


# ── Auto-generate data when frontend requests predictions ─────────────────────
@app.get("/auto-generate")
def auto_generate():
    """
    Frontend can call this endpoint every few seconds.
    It generates fresh data.
    """
    generate_sensor_data()
    return {"message": "New sensor data generated"}


# ── Health Endpoints ──────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }


@app.get("/", tags=["Health"])
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "docs": "/docs",
        "version": settings.APP_VERSION,
    }