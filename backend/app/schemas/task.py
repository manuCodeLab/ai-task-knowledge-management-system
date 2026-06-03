from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    assigned_to: int


class TaskUpdate(BaseModel):
    status: Literal["pending", "completed"]


class TaskOut(BaseModel):
    id: int
    title: str
    description: str | None
    status: str
    assigned_to: int
    created_by: int
    created_at: datetime | None
    assignee_name: str | None = None

    model_config = {"from_attributes": True}
