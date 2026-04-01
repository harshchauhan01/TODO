# Todo App

A full-stack todo application built with **Django REST Framework**, **React + Vite**, **PostgreSQL**, and **Docker**. The app supports secure user accounts, task management, pagination, prioritization, due dates, and offline-first usage with local caching and sync when the connection returns.

## Features

- User authentication with JWT
- Create, update, complete, and delete tasks
- Task priority and due date support
- Paginated task list with custom sorting
- Searchable backend task API
- Offline-first frontend experience
- IndexedDB local storage for tasks
- Service worker caching for offline page refresh
- Sync queue for offline changes
- Dockerized deployment with Nginx reverse proxy

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Axios
- React Hot Toast
- IndexedDB for offline persistence
- Service Worker for caching

### Backend
- Django 5
- Django REST Framework
- SimpleJWT
- CORS headers
- PostgreSQL
- WhiteNoise

### Infrastructure
- Docker
- Docker Compose
- Nginx

## Project Structure

```text
Todo/
├── backend/
│   ├── manage.py
│   ├── api/
│   └── backend/
├── frontend/
│   ├── src/
│   ├── public/
│   └── Dockerfile
├── nginx/
└── docker-compose.yml
```

## API Overview

The backend exposes these main endpoints:

- `GET /` - simple home response
- `POST /api/register/` - create a new user
- `POST /api/token/` - obtain JWT access and refresh tokens
- `POST /api/token/refresh/` - refresh access token
- `GET /api/me/` - get the current authenticated user
- `GET /api/todo/` - list user tasks
- `POST /api/todo/` - create a task
- `GET /api/todo/{id}/` - retrieve a task
- `PATCH /api/todo/{id}/` - update a task
- `DELETE /api/todo/{id}/` - delete a task
- `POST /api/todo/{id}/mark_complete/` - toggle completion state

The todo list is scoped to the authenticated user.

## Offline Mode

The app is designed to work even when the network is unavailable:

- Tasks are cached locally in IndexedDB
- The service worker caches the app shell for offline refreshes
- Offline create/update/delete actions are queued locally
- Pending changes sync automatically when the connection comes back
- A manual sync action is available in the UI

## Getting Started

### Prerequisites

- Node.js 20+ for the frontend
- Python 3.11+ for the backend
- PostgreSQL 15+ if you are running without Docker
- Docker and Docker Compose for the easiest setup

### Run with Docker

From the repository root:

```bash
docker compose up --build
```

This starts:

- Backend on `http://localhost:8000`
- Frontend on `http://localhost:3100`
- Nginx proxy on `http://localhost:9080`

### Local Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

If you are not using Docker, update the database settings in `backend/backend/settings.py` to point at your local PostgreSQL instance.

### Local Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend API to be available at the configured axios base URL.

## Environment Notes

The Docker setup uses these backend environment values:

- `DEBUG`
- `ALLOWED_HOSTS`
- `DB_CONN_MAX_AGE`
- `GUNICORN_WORKERS`
- `GUNICORN_THREADS`
- `GUNICORN_TIMEOUT`

The backend is configured to use PostgreSQL container service `db` in the default Docker Compose setup.

## Development Notes

- The task list is sorted by completion, priority, and due date.
- Offline tasks are stored locally and synced later.
- The app uses JWT authentication for protected API calls.
- The frontend build is production-ready through Vite.

## Troubleshooting

### Offline page refresh still shows a network error

1. Open DevTools and unregister the old service worker.
2. Clear site data once.
3. Reload the app while online.
4. Go offline and refresh again.

### Tasks do not appear offline

1. Confirm the app was opened online at least once so the cache and IndexedDB were initialized.
2. Check that the user is authenticated.
3. Verify IndexedDB contains the `TodoAppDB` database in DevTools.

### Docker build fails

1. Make sure you are building from the repository root.
2. Confirm the frontend build passes with `npm run build` inside `frontend/`.
3. Check that your local Docker Engine is running.

## License

No license file is currently included in this repository.
