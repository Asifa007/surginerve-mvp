# SurgiNerve – Backend API

> **Smart Predictive Maintenance System for Surgical Robots**  
> FastAPI · PostgreSQL · Explainable Boosting Machine (EBM) · Docker

---

## Overview

SurgiNerve collects real-time IoT sensor data from surgical robots, stores historical readings, and uses an **Explainable Boosting Machine** to predict failure risk. Every prediction includes per-feature importance scores so clinical engineers can understand *why* a robot is flagged.

Frontend: https://surginerve-guardian.lovable.app

---

## Quick Start (Docker — Recommended)

```bash
# 1. Clone the repo
git clone <repo-url>
cd surginerve-backend

# 2. Start services (PostgreSQL + API)
docker compose up --build

# API is live at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

Docker will automatically:
- Train the EBM model
- Run Alembic migrations
- Seed the database with sample robots, readings and predictions

---

## Local Development

### Prerequisites
- Python 3.11+
- PostgreSQL 15+

### Setup

```bash
# Create a virtual environment
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env – set DATABASE_URL to your local Postgres instance

# Run migrations
alembic upgrade head

# Train the ML model
python -m app.ml.train_model

# Seed sample data
python -m app.utils.seed_db

# Start the server
uvicorn app.main:app --reload
```

API → http://localhost:8000  
Swagger → http://localhost:8000/docs

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/health` | Health check |
| `GET`  | `/robots` | List all robots |
| `POST` | `/robots` | Register a new robot |
| `GET`  | `/sensor-readings` | List sensor readings (optional `?robot_id=`) |
| `POST` | `/sensor-readings` | Record a sensor reading |
| `POST` | `/predict` | **Real-time failure prediction** |
| `GET`  | `/predictions` | List stored predictions (optional `?robot_id=`) |
| `POST` | `/reload-model` | Hot-reload the ML model from disk |

### POST `/predict` — Example

**Request**
```json
{
  "robot_id": 1,
  "temperature": 88.5,
  "vibration": 7.3,
  "current": 19.1
}
```

**Response**
```json
{
  "robot_id": 1,
  "failure_probability": 0.87,
  "risk_level": "High",
  "explanation": {
    "temperature": 0.42,
    "vibration": 0.31,
    "current": 0.14
  },
  "timestamp": "2026-02-25T18:30:00Z"
}
```

Risk levels:
- `Low` → probability < 0.40
- `Medium` → 0.40 ≤ probability < 0.70
- `High` → probability ≥ 0.70

---

## ML Model

The **Explainable Boosting Machine** (EBM) is from Microsoft's `interpret` library. It's a glass-box model that produces accurate predictions **and** native feature-level explanations — no post-hoc approximations.

Features used:
| Feature | Unit |
|---------|------|
| `temperature` | °C |
| `vibration` | mm/s |
| `current` | Amperes |

Re-train on new data:
```bash
python -m app.ml.train_model
# Then hot-reload without restarting:
curl -X POST http://localhost:8000/reload-model
```

---

## Database Schema

```
robots
  id, robot_name, model_number, installation_date, status

sensor_readings
  id, robot_id (FK), temperature, vibration, current, timestamp

predictions
  id, robot_id (FK), failure_probability, risk_level, explanation (JSON), timestamp
```

---

## Project Structure

```
surginerve-backend/
├── app/
│   ├── main.py          – FastAPI app, CORS, startup events
│   ├── config.py        – Pydantic Settings (env-var driven)
│   ├── database.py      – SQLAlchemy engine & session
│   ├── models/          – ORM table definitions
│   ├── schemas/         – Pydantic request/response models
│   ├── routes/          – API route handlers
│   ├── ml/
│   │   ├── train_model.py  – Train & save EBM
│   │   ├── predict.py      – Inference + explainability
│   │   └── ebm_model.pkl   – Trained model (generated)
│   ├── utils/
│   │   └── seed_db.py   – Sample data seeder
│   └── middleware/
│       └── exception_handler.py
├── alembic/             – Database migrations
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Connecting the Frontend

The frontend at `https://surginerve-guardian.lovable.app` should point its API calls to your deployed backend URL.

CORS is pre-configured to allow requests from that origin. If you change the frontend domain, update `ALLOWED_ORIGINS` in `app/config.py` or set it via environment variables.

Example frontend configuration:
```js
const API_BASE = "https://your-backend-domain.com";

// Fetch all robots
const robots = await fetch(`${API_BASE}/robots`).then(r => r.json());

// Submit sensor data and get a prediction
const prediction = await fetch(`${API_BASE}/predict`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ robot_id: 1, temperature: 88.5, vibration: 7.3, current: 19.1 })
}).then(r => r.json());
```

---

## Deployment

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://surginerve:surginerve@localhost:5432/surginerve_db` | Postgres connection string |
| `DEBUG` | `false` | Enable debug mode |
| `MODEL_PATH` | `app/ml/ebm_model.pkl` | Path to trained model |

### Recommended Platforms
- **Railway** – `railway up` with a Postgres plugin
- **Render** – Web Service + PostgreSQL add-on
- **AWS ECS / Fargate** – Use the provided Dockerfile

---

## License

MIT
