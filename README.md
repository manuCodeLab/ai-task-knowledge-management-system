# AI-Powered Task & Knowledge Management System

This project is an AI-powered task and knowledge management system.

Admins can upload knowledge documents and assign tasks to users.
Users can search uploaded documents using semantic AI search and complete assigned tasks.

The backend is built with FastAPI, MySQL, JWT authentication, RBAC, and ChromaDB for vector search.
The frontend is built with React.js.

Core features:
- JWT login
- Admin/User role-based access
- Document upload for .txt and .pdf files
- Embedding-based semantic search
- Task assignment and status update
- Activity logging
- Basic analytics dashboard

## Project Structure

```txt
backend/
  app/
    main.py
    database.py
    models/
    schemas/
    routes/
    services/
    utils/
  uploads/
  requirements.txt
frontend/
  src/
    pages/
    components/
    services/
    App.jsx
```

## Backend Setup

1. Create a MySQL database:

```sql
CREATE DATABASE ai_task_knowledge;
```

2. Create and activate a virtual environment, then install dependencies:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

3. Create a `.env` file in `backend/`:

```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/ai_task_knowledge
JWT_SECRET_KEY=change-this-secret
DEFAULT_ADMIN_NAME=Admin
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=admin123
DEFAULT_USER_NAME=User
DEFAULT_USER_EMAIL=user@example.com
DEFAULT_USER_PASSWORD=user123
```

4. Start the API:

```bash
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The React app runs at `http://localhost:5173`.

## Default Logins

The backend seeds one admin and one user on startup if the emails do not exist:

```txt
Admin: admin@example.com / admin123
User: user@example.com / user123
```

## Required APIs

```txt
POST /auth/login
GET /tasks
POST /tasks
PATCH /tasks/{id}
POST /documents/upload
GET /documents
POST /search
GET /analytics
```

## Assignment Requirement Status

```txt
Authentication & RBAC: Done
MySQL relational schema with PK/FK: Done
Document upload for .txt and .pdf files: Done
Embedding-based semantic search with ChromaDB: Done
Task create, view, and status update: Done
Dynamic filtering API: Done with /tasks?status=pending and /tasks?assigned_to=2
Activity logging: Done for login, document upload, task create/update, and search
Analytics: Done with task counts, document/user/log counts, search count, and top searched queries
React frontend: Done
```
