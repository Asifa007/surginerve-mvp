"""
SurgiNerve – Prediction & explainability service.

Loads the trained EBM once at startup and exposes:
  - predict_failure()  → failure_probability, risk_level, explanation dict
  - reload_model()     → hot-reload without restarting the server
"""
from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

import joblib
import numpy as np

from app.config import settings

logger = logging.getLogger(__name__)

_model = None  # module-level singleton


def _load_model():
    global _model
    path = Path(settings.MODEL_PATH)
    if not path.exists():
        raise FileNotFoundError(
            f"Model not found at '{path}'. Run: python -m app.ml.train_model"
        )
    _model = joblib.load(path)
    logger.info("EBM model loaded from %s", path)


def get_model():
    """Return the loaded model, loading it on first call."""
    if _model is None:
        _load_model()
    return _model


def reload_model() -> str:
    """Force re-load the model from disk (used by /reload-model endpoint)."""
    _load_model()
    return f"Model reloaded from {settings.MODEL_PATH}"


def _risk_level(probability: float) -> str:
    if probability >= 0.7:
        return "High"
    if probability >= 0.4:
        return "Medium"
    return "Low"


def predict_failure(
    temperature: float,
    vibration: float,
    current: float,
) -> dict[str, Any]:
    """
    Run inference and return prediction + per-feature explanation.

    Returns
    -------
    {
        "failure_probability": float,
        "risk_level": "Low" | "Medium" | "High",
        "explanation": {"temperature": float, "vibration": float, "current": float},
    }
    """
    model = get_model()
    X = np.array([[temperature, vibration, current]])

    # failure probability (class 1)
    proba = float(model.predict_proba(X)[0][1])

    # ── EBM local explanation ────────────────────────────────────────────────
    # interpret's EBM exposes per-feature scores via explain_local
    local_exp = model.explain_local(X, y=None)
    data = local_exp.data(0)
    # data["names"] → feature names (+ intercept)
    # data["scores"] → contribution scores
    names  = data.get("names", [])
    scores = data.get("scores", [])

    explanation: dict[str, float] = {}
    for name, score in zip(names, scores):
        if name in ("temperature", "vibration", "current"):
            explanation[name] = round(float(score), 4)

    # Fallback: populate any missing features with 0
    for feat in ("temperature", "vibration", "current"):
        explanation.setdefault(feat, 0.0)

    return {
        "failure_probability": round(proba, 4),
        "risk_level": _risk_level(proba),
        "explanation": explanation,
    }
