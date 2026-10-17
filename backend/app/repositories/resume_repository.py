from sqlalchemy.orm import Session

from app.models.resume import Resume
from app.models.resume_analysis import ResumeAnalysis
from app.models.interview_question import InterviewQuestion
from app.models.interview_session import InterviewSession


class ResumeRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, resume: Resume):
        self.db.add(resume)
        self.db.commit()
        self.db.refresh(resume)
        return resume

    def get_by_user(self, user_id: int):
        return (
            self.db.query(Resume)
            .filter(Resume.owner_id == user_id)
            .order_by(Resume.uploaded_at.desc())
            .all()
        )

    def get_by_id(self, resume_id: int):
        return (
            self.db.query(Resume)
            .filter(Resume.id == resume_id)
            .first()
        )

    def delete(self, resume: Resume):
        resume_id = resume.id

        self.db.query(InterviewSession).filter(
            InterviewSession.resume_id == resume_id
        ).delete(synchronize_session=False)

        self.db.query(InterviewQuestion).filter(
            InterviewQuestion.resume_id == resume_id
        ).delete(synchronize_session=False)

        self.db.query(ResumeAnalysis).filter(
            ResumeAnalysis.resume_id == resume_id
        ).delete(synchronize_session=False)

        self.db.delete(resume)
        self.db.commit()