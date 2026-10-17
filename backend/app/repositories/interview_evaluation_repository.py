from sqlalchemy.orm import Session

from app.models.interview_evaluation import (
    InterviewEvaluation,
)


class InterviewEvaluationRepository:

    def __init__(
        self,
        db: Session,
    ):
        self.db = db

    def create(
        self,
        evaluation: InterviewEvaluation,
    ):

        self.db.add(
            evaluation
        )

        self.db.commit()

        self.db.refresh(
            evaluation
        )

        return evaluation

    def get_by_answer_id(
        self,
        answer_id: int,
    ):

        return (
            self.db.query(
                InterviewEvaluation
            )
            .filter(
                InterviewEvaluation.answer_id == answer_id
            )
            .first()
        )