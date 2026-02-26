"""
SurgiNerve – Database seed script.

Usage (from project root):
    python -m app.utils.seed_db
"""
from datetime import datetime, timedelta, timezone

from app.database import SessionLocal
from app.models.db_models import Prediction, Robot, SensorReading

ROBOTS = [
    {"robot_name": "NeuroArm Alpha",    "model_number": "NA-3000", "installation_date": datetime(2022, 3, 10, tzinfo=timezone.utc), "status": "active"},
    {"robot_name": "SpineBot X1",       "model_number": "SB-X100", "installation_date": datetime(2021, 7, 22, tzinfo=timezone.utc), "status": "active"},
    {"robot_name": "CardioBot Prime",   "model_number": "CB-P200", "installation_date": datetime(2023, 1, 5, tzinfo=timezone.utc),  "status": "maintenance"},
    {"robot_name": "OrthoBot Elite",    "model_number": "OB-E500", "installation_date": datetime(2020, 11, 14, tzinfo=timezone.utc),"status": "active"},
    {"robot_name": "LaparoBot Sigma",   "model_number": "LB-S700", "installation_date": datetime(2023, 6, 30, tzinfo=timezone.utc), "status": "active"},
]

READINGS_PER_ROBOT = [
    # (temperature, vibration, current, hours_ago)
    (62.1, 2.4, 12.5,  1),
    (68.3, 3.1, 13.8,  2),
    (75.0, 4.5, 15.2,  3),
    (82.4, 5.8, 16.9,  4),
    (90.1, 7.3, 18.4,  5),  # near-failure condition
    (55.6, 1.9, 11.3,  6),
    (60.0, 2.2, 12.0,  7),
]

PREDICTIONS_SAMPLE = [
    (0.12, "Low",    {"temperature": 0.04, "vibration": 0.05, "current": 0.03}),
    (0.45, "Medium", {"temperature": 0.18, "vibration": 0.15, "current": 0.12}),
    (0.88, "High",   {"temperature": 0.42, "vibration": 0.31, "current": 0.15}),
]


def seed() -> None:
    db = SessionLocal()
    try:
        if db.query(Robot).count() > 0:
            print("Database already seeded – skipping.")
            return

        now = datetime.now(timezone.utc)

        # Insert robots
        robot_objects = [Robot(**r) for r in ROBOTS]
        db.add_all(robot_objects)
        db.flush()

        # Insert sensor readings
        for robot in robot_objects:
            for temp, vib, curr, hrs in READINGS_PER_ROBOT:
                reading = SensorReading(
                    robot_id=robot.id,
                    temperature=temp,
                    vibration=vib,
                    current=curr,
                    timestamp=now - timedelta(hours=hrs),
                )
                db.add(reading)

        # Insert sample predictions
        for robot in robot_objects:
            for i, (prob, risk, expl) in enumerate(PREDICTIONS_SAMPLE):
                pred = Prediction(
                    robot_id=robot.id,
                    failure_probability=prob,
                    risk_level=risk,
                    explanation=expl,
                    timestamp=now - timedelta(hours=i * 3),
                )
                db.add(pred)

        db.commit()
        print(f"Seeded {len(robot_objects)} robots, readings and predictions ✓")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
