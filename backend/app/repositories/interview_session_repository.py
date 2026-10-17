from sqlalchemy.orm import Session

from app.models.interview_session import InterviewSession


class InterviewSessionRepository:

    def __init__(
        self,
        db: Session,
    ):
        self.db = db

    def create(
        self,
        session: InterviewSession,
    ):
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session

    def get_by_id(
        self,
        session_id: int,
    ):
        return (
            self.db.query(
                InterviewSession
            )
            .filter(
                InterviewSession.id == session_id
            )
            .first()
        )

    def get_by_user(
        self,
        user_id: int,
    ):
        return (
            self.db.query(
                InterviewSession
            )
            .filter(
                InterviewSession.user_id == user_id
            )
            .order_by(
                InterviewSession.started_at.desc()
            )
            .all()
        )

    def update(
        self,
        session: InterviewSession,
    ):
        self.db.commit()
        self.db.refresh(session)
        return session