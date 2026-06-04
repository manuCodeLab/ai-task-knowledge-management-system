from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.activity_log import ActivityLog


def log_activity(db: Session, user_id: int, action: str, details: str | None = None):
    log = ActivityLog(user_id=user_id, action=action, details=details)
    db.add(log)
    db.commit()
    return log


def log_activity_async(user_id: int, action: str, details: str | None = None):
    db = SessionLocal()
    try:
        log_activity(db, user_id, action, details)
    finally:
        db.close()
