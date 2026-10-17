from app.models.interview_answer import InterviewAnswer
from app.repositories.interview_answer_repository import (
    InterviewAnswerRepository,
)


class InterviewAnswerService:

    def __init__(
        self,
        repository: InterviewAnswerRepository,
    ):
        self.repository = repository

    def save_answer(
        self,
        session_id: int,
        question_id: int,
        candidate_answer: str,
    ):

        answer = InterviewAnswer(

            session_id=session_id,

            question_id=question_id,

            candidate_answer=candidate_answer,

        )

        return self.repository.create(
            answer
        )

    def get_answers(
        self,
        session_id: int,
    ):
        return self.repository.get_by_session(
            session_id
        )