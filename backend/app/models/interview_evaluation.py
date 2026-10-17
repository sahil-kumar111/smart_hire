from sqlalchemy import (
    Integer,
    ForeignKey,
    Text,
    JSON,
)

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from app.database.base import Base


class InterviewEvaluation(Base):

    __tablename__ = "interview_evaluations"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    answer_id: Mapped[int] = mapped_column(
        ForeignKey(
            "interview_answers.id",
            ondelete="CASCADE",
        ),
        unique=True,
    )

    score: Mapped[int] = mapped_column(
        Integer,
    )

    strengths: Mapped[list] = mapped_column(
        JSON,
    )

    weaknesses: Mapped[list] = mapped_column(
        JSON,
    )

    ideal_answer: Mapped[str] = mapped_column(
        Text,
    )

    feedback: Mapped[str] = mapped_column(
        Text,
    )

    answer = relationship(
        "InterviewAnswer",
        back_populates="evaluation",
    )