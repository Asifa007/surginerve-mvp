# 🧠 SurgiNerve – Smart Predictive Maintenance for Surgical Robots

SurgiNerve is a full-stack AI-powered predictive maintenance system designed for surgical robots.  
It simulates real-time IoT sensor data and predicts equipment failure risk using an Explainable Boosting Machine (EBM), providing interpretable feature-level explanations.

Built by **Asifa Firdhouse (Backend & Machine Learning)** and  
**Deepapriya R (Frontend & UI/UX)**.

---

## 🚀 Live Demo

🌐 Frontend (Vercel):  
https://surginerve-mvp.vercel.app

🔗 Backend API (Render):  
https://surginerve-backend.onrender.com/docs

---

## 🏗️ System Architecture

Frontend (React + Vite + TypeScript) → Vercel  
Backend (FastAPI + Uvicorn) → Render  
Database → SQLAlchemy (Production DB)  
Machine Learning → Explainable Boosting Machine (EBM)

Real-Time Flow:
1. Frontend triggers `/auto-generate`
2. Backend generates simulated IoT data
3. ML model predicts failure probability
4. Results stored in database
5. Dashboard updates every 5 seconds

---

## ⚙️ Key Features

- Real-time IoT sensor simulation
- AI-based failure probability prediction
- Risk classification (Low / Medium / High)
- Explainable ML feature contribution output
- Interactive dashboard with auto-refresh
- Production-ready cloud deployment
- Clean API architecture
- Scalable backend design

---

## 📊 Machine Learning Model

Model Used: **Explainable Boosting Machine (EBM)**

Input Features:
- Temperature
- Vibration
- Current

Output:
- Failure Probability
- Risk Level
- Per-feature contribution explanation

The model is pre-trained and loaded during backend startup.

---

## 📷 Dashboard Preview

<p align="center">
  <img src="assets/SurgiNerve-1.jpg" width="30%">
  <img src="assets/SurgiNerve-2.jpg" width="30%">
  <img src="assets/SurgiNerve-3.jpg" width="30%">
  <img src="assets/SurgiNerve-4.jpg" width="30%">
</p>

<p align="center">
  <img src="assets/SurgiNerve-5.jpg" width="30%">
  <img src="assets/SurgiNerve-6.jpg" width="30%">
  <img src="assets/SurgiNerve-7.jpg" width="30%">
  <img src="assets/SurgiNerve-8.jpg" width="30%">
</p>

```
![Dashboard](assets/dashboard.png)
```
## 🧪 Local Development Setup
1️⃣ Clone Repository
```
git clone https://github.com/Asifa007/surginerve-mvp.git
cd surginerve-mvp
```
## 2️⃣ Backend Setup
```
cd backend
pip install -r requirements.txt
python -m app.ml.train_model
uvicorn app.main:app --reload
```
Backend runs at:
```
http://localhost:8000
```
3️⃣ Frontend Setup
```
cd frontend
npm install
npm run dev
```
Frontend runs at:
```
http://localhost:5173
```
## 🌍 Environment Variables
Frontend (.env)
VITE_API_URL=http://localhost:8000
Production (Vercel Environment Variable)
VITE_API_URL=https://surginerve-backend.onrender.com

## 📡 API Endpoints
Method	Endpoint	Description
GET	/health	Service health check
GET	/robots/	Get all robots
POST	/robots/	Create robot
GET	/sensor-readings/	Get sensor readings
GET	/predictions/	Get predictions
GET	/auto-generate	Generate new sensor + prediction

## Swagger Docs:

/docs

## 🛠 Tech Stack

**Frontend:**
React
TypeScript
Vite
Tailwind CSS
Axios
Recharts

**Backend:**
FastAPI
SQLAlchemy
Pydantic
Uvicorn

**Machine Learning:**
Explainable Boosting Machine
scikit-learn

**Deployment:**
Vercel (Frontend)
Render (Backend)

## 👥 Team

| Name | Role | Responsibilities |
|------|------|-----------------|
| Asifa Firdhouse | AI & Backend Engineer | ML Model, API Design, Database Architecture, Cloud Deployment |
| Deepapriya R | Frontend Engineer & UI Designer | React Dashboard, UI/UX Design, Data Visualization |

## 📌 Project Highlights

- Converted Docker-based background simulation into cloud-safe request-driven generation.
- Integrated ML predictions with explainability.
- Designed production-ready API structure.
- Implemented real-time dashboard auto-refresh.
- Deployed full-stack application to cloud infrastructure.

## 📄 License

MIT License

Copyright (c) 2026 Asifa Firdhouse

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files to deal in the Software
without restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies.

## 🌟 Future Enhancements

* Authentication & role-based access control
* WebSocket-based real-time updates
* Advanced anomaly detection models
* Performance monitoring dashboard
* CI/CD pipeline integration
