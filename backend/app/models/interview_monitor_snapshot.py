from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    DateTime,
    ForeignKey,
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.base import Base


class InterviewMonitorSnapshot(Base):

    __tablename__ = "interview_monitor_snapshots"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    session_id = Column(
        Integer,
        ForeignKey(
            "interview_sessions.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    session = relationship(
        "InterviewSession",
        back_populates="monitor_snapshots",
    )

    second = Column(
        Float,
        nullable=False,
    )

    emotion = Column(
        String,
        nullable=False,
    )

    eye_contact_score = Column(
        Float,
        default=0,
    )

    fluency_score = Column(
        Float,
        default=0,
    )

    filler_count = Column(
        Integer,
        default=0,
    )

    overall_score = Column(
        Float,
        default=0,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )