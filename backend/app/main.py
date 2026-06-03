import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, SessionLocal, engine
from app.models.role import Role
from app.models.user import User
from app.routes import analytics, auth, documents, search, tasks
from app.services.auth_service import hash_password

load_dotenv()

app = FastAPI(title="AI Task Knowledge Management API")

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def seed_defaults():
    db = SessionLocal()
    try:
        admin_role = db.query(Role).filter(Role.name == "admin").first()
        user_role = db.query(Role).filter(Role.name == "user").first()

        if not admin_role:
            admin_role = Role(name="admin")
            db.add(admin_role)
        if not user_role:
            user_role = Role(name="user")
            db.add(user_role)
        db.commit()
        db.refresh(admin_role)

        admin_email = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@example.com")
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        if not existing_admin:
            db.add(
                User(
                    name=os.getenv("DEFAULT_ADMIN_NAME", "Admin"),
                    email=admin_email,
                    password_hash=hash_password(
                        os.getenv("DEFAULT_ADMIN_PASSWORD", "admin123")
                    ),
                    role_id=admin_role.id,
                )
            )
            db.commit()

        user_email = os.getenv("DEFAULT_USER_EMAIL", "user@example.com")
        existing_user = db.query(User).filter(User.email == user_email).first()
        if not existing_user:
            db.add(
                User(
                    name=os.getenv("DEFAULT_USER_NAME", "User"),
                    email=user_email,
                    password_hash=hash_password(
                        os.getenv("DEFAULT_USER_PASSWORD", "user123")
                    ),
                    role_id=user_role.id,
                )
            )
            db.commit()
    finally:
        db.close()


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    seed_defaults()


app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(documents.router)
app.include_router(search.router)
app.include_router(analytics.router)


@app.get("/")
def health_check():
    return {"status": "ok", "service": "AI Task Knowledge Management API"}
