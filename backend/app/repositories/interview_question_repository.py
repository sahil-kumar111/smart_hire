from sqlalchemy.orm import Session

from app.models.interview_question import InterviewQuestion


class InterviewQuestionRepository:

    def __init__(
        self,
        db: Session,
    ):
        self.db = db

    def create(
        self,
        question: InterviewQuestion,
    ):
        self.db.add(question)
        self.db.commit()
        self.db.refresh(question)
        return question

    def get_by_resume(
        self,
        resume_id: int,
    ):
        return (
            self.db.query(
                InterviewQuestion
            )
            .filter(
                InterviewQuestion.resume_id == resume_id
            )
            .all()
        )
        
    def delete_by_resume(
        self,
        resume_id: int,
    ):
        self.db.query(
            InterviewQuestion
            ).filter(
                InterviewQuestion.resume_id == resume_id
            ).delete()
        self.db.commit()