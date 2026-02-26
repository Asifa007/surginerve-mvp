"""
SurgiNerve – Train the Explainable Boosting Machine (EBM).

Usage (from project root):
    python -m app.ml.train_model

The trained model is saved to:  app/ml/ebm_model.pkl
"""
import os
import joblib
import numpy as np
import pandas as pd
from interpret.glassbox import ExplainableBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# ── Reproducible synthetic dataset ────────────────────────────────────────────
SEED = 42
N_SAMPLES = 5_000
rng = np.random.default_rng(SEED)


def _generate_dataset() -> pd.DataFrame:
    """
    Realistic synthetic predictive-maintenance dataset.

    Failure rules (mimic known degradation patterns):
      - temperature > 85 °C         → high heat stress
      - vibration > 7.0 mm/s        → mechanical wear
      - current > 18 A              → electrical overload
      Any two conditions met → failure=1
    """
    temp = rng.normal(loc=65, scale=15, size=N_SAMPLES).clip(20, 120)
    vib  = rng.exponential(scale=3.0, size=N_SAMPLES).clip(0, 15)
    curr = rng.normal(loc=13, scale=4, size=N_SAMPLES).clip(1, 30)

    cond_temp = temp > 85
    cond_vib  = vib  > 7.0
    cond_curr = curr > 18.0

    # failure if ≥2 conditions are met, + 5 % random noise
    score = cond_temp.astype(int) + cond_vib.astype(int) + cond_curr.astype(int)
    failure = (score >= 2).astype(int)
    noise = rng.random(N_SAMPLES) < 0.05
    failure = np.where(noise, 1 - failure, failure)

    return pd.DataFrame({"temperature": temp, "vibration": vib, "current": curr, "failure": failure})


def train_and_save(output_path: str = "app/ml/ebm_model.pkl") -> None:
    df = _generate_dataset()
    X = df[["temperature", "vibration", "current"]]
    y = df["failure"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=SEED)

    ebm = ExplainableBoostingClassifier(
        feature_names=["temperature", "vibration", "current"],
        max_bins=256,
        interactions=2,
        n_jobs=-1,
        random_state=SEED,
    )
    ebm.fit(X_train, y_train)

    y_pred = ebm.predict(X_test)
    print("── EBM Classification Report ──────────────────────────────")
    print(classification_report(y_test, y_pred, target_names=["Normal", "Failure"]))

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    joblib.dump(ebm, output_path)
    print(f"Model saved → {output_path}")


if __name__ == "__main__":
    train_and_save()
