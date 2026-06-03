from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate, TaskOut, TaskUpdate
from app.services.log_service import log_activity
from app.utils.rbac import get_current_user, require_roles

router = APIRouter(prefix="/tasks", tags=["Tasks"])


def serialize_task(task: Task) -> TaskOut:
    return TaskOut(
        id=task.id,
        title=task.title,
        description=task.description,
        status=task.status,
        assigned_to=task.assigned_to,
        created_by=task.created_by,
        created_at=task.created_at,
        assignee_name=task.assignee.name if task.assignee else None,
    )


@router.get("", response_model=list[TaskOut])
def list_tasks(
    status: str | None = None,
    assigned_to: int | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Task)
    if current_user.role.name != "admin":
        query = query.filter(Task.assigned_to == current_user.id)
    elif assigned_to is not None:
        query = query.filter(Task.assigned_to == assigned_to)
    if status is not None:
        if status not in {"pending", "completed"}:
            raise HTTPException(status_code=400, detail="Invalid task status")
        query = query.filter(Task.status == status)
    return [serialize_task(task) for task in query.order_by(Task.created_at.desc()).all()]


@router.post("", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(
    payload: TaskCreate,
    current_user: User = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    assignee = db.query(User).filter(User.id == payload.assigned_to).first()
    if not assignee:
        raise HTTPException(status_code=404, detail="Assigned user not found")
    if assignee.role.name != "user":
        raise HTTPException(status_code=400, detail="Tasks can be assigned only to users")

    task = Task(
        title=payload.title,
        description=payload.description,
        assigned_to=payload.assigned_to,
        created_by=current_user.id,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    log_activity(
        db,
        current_user.id,
        "task_created",
        f"Created task {task.id} for user {payload.assigned_to}",
    )
    return serialize_task(task)


@router.patch("/{task_id}", response_model=TaskOut)
def update_task_status(
    task_id: int,
    payload: TaskUpdate,
    current_user: User = Depends(require_roles("user")),
    db: Session = Depends(get_db),
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.assigned_to != current_user.id:
        raise HTTPException(status_code=403, detail="You can update only your own tasks")

    task.status = payload.status
    db.commit()
    db.refresh(task)
    log_activity(
        db,
        current_user.id,
        "task_status_updated",
        f"Updated task {task.id} to {task.status}",
    )
    return serialize_task(task)
