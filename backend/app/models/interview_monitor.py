from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    Text,
    DateTime,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class InterviewMonitor(Base):

    __tablename__ = "interview_monitor_reports"

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
        back_populates="monitor_reports",
    )
    
    transcript = Column(
        Text,
        nullable=False,
    )

    word_count = Column(
        Integer,
        default=0,
    )

    duration = Column(
        Float,
        default=0,
    )

    filler_count = Column(
        Integer,
        default=0,
    )

    fluency_score = Column(
        Float,
        default=0,
    )

    confidence_score = Column(
        Float,
        default=0,
    )

    dominant_emotion = Column(
        String,
        nullable=False,
    )

    eye_contact_score = Column(
        Float,
        default=0,
    )

    overall_score = Column(
        Float,
        default=0,
    )

    recommendation = Column(
        String,
        nullable=False,
    )

    summary = Column(
        Text,
        nullable=True,
    )

    strengths = Column(
        JSON,
        nullable=True,
    )

    weaknesses = Column(
        JSON,
        nullable=True,
    )

    suggestions = Column(
        JSON,
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )