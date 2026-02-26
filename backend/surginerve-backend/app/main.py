"""
SurgiNerve – FastAPI application entry point
"""
import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import Base, engine
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
    allow_origins=settings.ALLOWED_ORIGINS,
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


# ── Startup / Shutdown ────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup_event():
    logger.info("Starting %s v%s", settings.APP_NAME, settings.APP_VERSION)
    # Create tables if they don't exist (use Alembic for migrations in production)
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables verified / created.")

    # Pre-load ML model
    try:
        from app.ml.predict import get_model
        get_model()
        logger.info("ML model loaded successfully.")
    except FileNotFoundError:
        logger.warning(
            "Model file not found. Run 'python -m app.ml.train_model' first."
        )


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("%s shutting down.", settings.APP_NAME)


# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"], summary="Health check")
def health_check():
    return {"status": "ok", "app": settings.APP_NAME, "version": settings.APP_VERSION}


@app.get("/", tags=["Health"], summary="Root")
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "docs": "/docs",
        "version": settings.APP_VERSION,
    }
