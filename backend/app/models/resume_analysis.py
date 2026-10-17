from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    ForeignKey,
    JSON,
    func,
)

from sqlalchemy.orm import relationship

from app.database.base import Base


class ResumeAnalysis(Base):

    __tablename__ = "resume_analysis"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    resume_id = Column(
        Integer,
        ForeignKey(
            "resumes.id",
            ondelete="CASCADE",
        ),
        unique=True,
        nullable=False,
    )

    technical_skills = Column(
        JSON,
        nullable=False,
        default=list,
    )

    soft_skills = Column(
        JSON,
        nullable=False,
        default=list,
    )

    frameworks = Column(
        JSON,
        nullable=False,
        default=list,
    )

    tools = Column(
        JSON,
        nullable=False,
        default=list,
    )

    databases = Column(
        JSON,
        nullable=False,
        default=list,
    )

    cloud = Column(
        JSON,
        nullable=False,
        default=list,
    )

    certifications = Column(
        JSON,
        nullable=False,
        default=list,
    )

    education = Column(
        JSON,
        nullable=False,
        default=list,
    )

    experience = Column(
        JSON,
        nullable=False,
        default=list,
    )

    projects = Column(
        JSON,
        nullable=False,
        default=list,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    resume = relationship(
        "Resume",
        back_populates="analysis",
    )