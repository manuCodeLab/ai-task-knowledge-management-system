from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(Enum("pending", "completed"), default="pending", nullable=False)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    assignee = relationship(
        "User", foreign_keys=[assigned_to], back_populates="assigned_tasks"
    )
    creator = relationship("User", foreign_keys=[created_by], back_populates="created_tasks")
