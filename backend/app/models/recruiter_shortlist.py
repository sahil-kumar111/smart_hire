from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint, func
from app.database.base import Base  # use your actual Base import


class RecruiterShortlist(Base):
    __tablename__ = "recruiter_shortlists"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_id = Column(Integer, nullable=False)
    status = Column(String(20), default="pending", nullable=False)  # pending | shortlisted | rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    __table_args__ = (
        UniqueConstraint("recruiter_id", "session_id", name="uq_recruiter_session"),
    )