from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    DateTime,
    String,
    Text,
    func,
)

from sqlalchemy.orm import relationship

from app.database.base import Base


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    resume_id = Column(
        Integer,
        ForeignKey("resumes.id"),
        nullable=False,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    status = Column(
        String,
        default="IN_PROGRESS",
        nullable=False,
    )

    # NEW
    interview_type = Column(
        String(50),
        default="technical",
        nullable=False,
    )

    started_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    completed_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    answers = relationship(
        "InterviewAnswer",
        back_populates="session",
        cascade="all, delete-orphan",
    )

    conversation_messages = relationship(
        "InterviewConversation",
        back_populates="session",
        cascade="all, delete-orphan",
    )

    monitor_reports = relationship(
        "InterviewMonitor",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    monitor_snapshots = relationship(
        "InterviewMonitorSnapshot",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    resume = relationship("Resume")
    user = relationship("User")