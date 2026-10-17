from sqlalchemy.orm import Session

from app.models.interview_conversation import (
    InterviewConversation,
)


class InterviewConversationRepository:

    def __init__(
        self,
        db: Session,
    ):
        self.db = db

    def create(
        self,
        conversation: InterviewConversation,
    ):
        self.db.add(conversation)
        self.db.commit()
        self.db.refresh(conversation)
        return conversation

    def get_messages(
        self,
        session_id: int,
    ):

        return (

            self.db.query(
                InterviewConversation
            )

            .filter(
                InterviewConversation.session_id
                == session_id
            )

            .order_by(
                InterviewConversation.created_at.asc()
            )

            .all()

        )