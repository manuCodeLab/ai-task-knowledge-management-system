from datetime import datetime

from pydantic import BaseModel


class DocumentOut(BaseModel):
    id: int
    title: str
    file_path: str
    content_type: str | None = None
    file_size: int | None = None
    uploaded_by: int
    uploaded_at: datetime | None

    model_config = {"from_attributes": True}
