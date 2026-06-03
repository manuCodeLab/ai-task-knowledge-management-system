# Backend

FastAPI backend for the AI-Powered Task & Knowledge Management System.

## Environment

Create `backend/.env`:

```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/ai_task_knowledge
JWT_SECRET_KEY=change-this-secret
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440
FRONTEND_ORIGIN=http://localhost:5173
DEFAULT_ADMIN_NAME=Admin
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=admin123
DEFAULT_USER_NAME=User
DEFAULT_USER_EMAIL=user@example.com
DEFAULT_USER_PASSWORD=user123
```

## Run

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```
