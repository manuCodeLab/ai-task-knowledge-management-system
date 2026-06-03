from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)

    role = relationship("Role", back_populates="users")
    assigned_tasks = relationship(
        "Task", foreign_keys="Task.assigned_to", back_populates="assignee"
    )
    created_tasks = relationship(
        "Task", foreign_keys="Task.created_by", back_populates="creator"
    )
