from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    Text,
    func,
)

from sqlalchemy.orm import relationship

from app.database.base import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    filename = Column(
        String,
        nullable=False,
    )

    file_path = Column(
        String,
        nullable=False,
    )

    extracted_text = Column(
        Text,
        nullable=True,
    )

    uploaded_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    owner_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    owner = relationship(
        "User",
        back_populates="resumes",
    )
    
    analysis = relationship(
        "ResumeAnalysis",
        back_populates="resume",
        uselist=False,
        cascade="all, delete-orphan",
    )
    
    questions = relationship(
        "InterviewQuestion",
        back_populates="resume",
        cascade="all, delete-orphan",
    )
    
    sessions = relationship(
        "InterviewSession",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )