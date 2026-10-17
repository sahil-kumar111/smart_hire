from datetime import datetime

from app.models.interview_session import (
    InterviewSession,
)
from app.repositories.interview_session_repository import (
    InterviewSessionRepository,
)


class InterviewSessionService:

    def __init__(
        self,
        repository: InterviewSessionRepository,
    ):
        self.repository = repository

    def start_session(
        self,
        resume_id: int,
        user_id: int,
        interview_type: str = "technical",
    ):
        session = InterviewSession(
            resume_id=resume_id,
            user_id=user_id,
            status="IN_PROGRESS",
            interview_type=interview_type,
        )
        return self.repository.create(session)

    def finish_session(
        self,
        session: InterviewSession,
    ):

        session.status = "COMPLETED"

        session.completed_at = datetime.utcnow()

        return self.repository.update(
            session
        )

    def get_user_sessions(
        self,
        user_id: int,
    ):
        return self.repository.get_by_user(
            user_id
        )