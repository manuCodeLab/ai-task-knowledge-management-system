from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.activity_log import ActivityLog
from app.models.document import Document
from app.models.task import Task
from app.models.user import User
from app.schemas.analytics import AnalyticsOut
from app.utils.rbac import require_roles

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("", response_model=AnalyticsOut)
def analytics(current_user=Depends(require_roles("admin")), db: Session = Depends(get_db)):
    return AnalyticsOut(
        total_users=db.query(User).count(),
        total_tasks=db.query(Task).count(),
        pending_tasks=db.query(Task).filter(Task.status == "pending").count(),
        completed_tasks=db.query(Task).filter(Task.status == "completed").count(),
        total_documents=db.query(Document).count(),
        total_activity_logs=db.query(ActivityLog).count(),
    )
