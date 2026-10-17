from sqlalchemy.orm import Session

from app.models.interview_answer import InterviewAnswer


class InterviewAnswerRepository:

    def __init__(
        self,
        db: Session,
    ):
        self.db = db

    def create(
        self,
        answer: InterviewAnswer,
    ):
        self.db.add(answer)
        self.db.commit()
        self.db.refresh(answer)
        return answer

    def get_by_session(
        self,
        session_id: int,
    ):
        return (
            self.db.query(
                InterviewAnswer
            )
            .filter(
                InterviewAnswer.session_id == session_id
            )
            .all()
        )
        
    def get_answers_with_evaluation(
        self,
        session_id: int,
    ):
        return (
            self.db.query(
                InterviewAnswer
            )
            .filter(
                InterviewAnswer.session_id == session_id
            )
            .all()
        )