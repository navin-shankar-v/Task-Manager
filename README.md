# Task Management System


Simple full-stack Task Management System.

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT (Bearer token)

## Folder structure

- `backend/` Express API
- `frontend/` React app (Vite)

## Local setup

### 1) Backend

Create a local env file (do **not** commit secrets). This workspace blocks committing `.env*`, so use your own local `.env`.

Copy `backend/env.example` into `backend/.env` and fill it in:

- `MONGO_URI`: your Mongo connection string
- `JWT_SECRET`: any long random string
- `CLIENT_ORIGIN`: `http://localhost:5173`

Install + run:

```bash
cd backend
npm install
npm run dev
```

API health: `GET /api/health`

### 2) Frontend

Copy `frontend/env.example` into `frontend/.env` and (optionally) update `VITE_API_URL`.

Install + run:

```bash
cd frontend
npm install
npm run dev
```

Open: `http://localhost:5173`

## API endpoints (summary)

### Auth
- `POST /api/auth/register` → `{ token, user }`
- `POST /api/auth/login` → `{ token, user }`

### Projects (auth required)
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id` (includes progress)
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id` (also deletes project tasks)

### Tasks (auth required)
- `GET /api/tasks?projectId=...`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /api/tasks/stats/dashboard`

## Deployment notes

### Backend (Render)

- **Build command**: `npm install`
- **Start command**: `npm start`
- **Root directory**: `backend`
- **Env vars**: `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN` (your Vercel URL), `PORT` (Render provides)

### Frontend (Vercel)

- **Root directory**: `frontend`
- **Env var**: `VITE_API_URL` = your Render API base + `/api`


