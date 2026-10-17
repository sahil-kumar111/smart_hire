from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    Text,
    Float,
    DateTime,
    ForeignKey,
)

from sqlalchemy.orm import relationship

from app.database.base import Base


class InterviewAnswer(Base):

    __tablename__ = "interview_answers"

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

    question_id = Column(
        Integer,
        ForeignKey(
            "interview_questions.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    candidate_answer = Column(
        Text,
        nullable=False,
    )

    ai_score = Column(
        Float,
        nullable=True,
    )

    ai_feedback = Column(
        Text,
        nullable=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    session = relationship(
        "InterviewSession",
        back_populates="answers",
    )

    question = relationship(
        "InterviewQuestion",
        back_populates="answers",
    )

    evaluation = relationship(
        "InterviewEvaluation",
        back_populates="answer",
        cascade="all, delete-orphan",
        uselist=False,
    )