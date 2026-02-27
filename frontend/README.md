# Welcome to SurgiNerve MVP
SurgiNerve is a medical dashboard MVP designed to provide a clean, responsive interface for managing healthcare-related data.
This project consists of a React frontend and a FastAPI backend.

## What technologies are used for this project?

  - Frontend
  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - shadcn-ui
  - Backend
  - FastAPI
  - PostgreSQL
  - SQLAlchemy

**📁 Project Structure**

surginerve-mvp/
│
├── frontend/              # React application
├── backend/               # Backend root
│   └── surginerve-backend/
│       └── app/           # FastAPI source code
└── README.md

**⚙️ Running the Project Locally**

1️⃣ Frontend
Copy code

cd frontend
npm install
npm run dev
The frontend will run on: http://localhost:8080⁠/

2️⃣ Backend
Copy code

cd backend/surginerve-backend
pip install -r requirements.txt
uvicorn app.main:app --reload
The backend will run on: http://127.0.0.1:8000⁠/
API Docs: http://127.0.0.1:8000/docs⁠/

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.


