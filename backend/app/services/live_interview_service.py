from sqlalchemy.orm import Session

from app.models.interview_session import InterviewSession
from app.models.resume_analysis import ResumeAnalysis

from app.repositories.interview_conversation_repository import (
    InterviewConversationRepository,
)

from app.ai.live_interview_generator import (
    LiveInterviewGenerator,
)


class LiveInterviewService:

    def __init__(self, db: Session):
        self.db = db
        self.repository = InterviewConversationRepository(db)
        self.generator = LiveInterviewGenerator()

    def start_interview(self, session_id: int):
        session = (
            self.db.query(InterviewSession)
            .filter(InterviewSession.id == session_id)
            .first()
        )

        if session is None:
            raise Exception("Interview session not found.")

        interview_type = getattr(session, "interview_type", "technical") or "technical"

        if interview_type == "hr":
            welcome = (
                "Hello! Welcome to your HR Interview with SmartHire AI.\n\n"
                "I have reviewed your resume.\n\n"
                "Let's begin with a quick introduction.\n\n"
                "Please introduce yourself and tell me about your background."
            )
        elif interview_type == "managerial":
            welcome = (
                "Hello! Welcome to your Managerial Interview with SmartHire AI.\n\n"
                "I have reviewed your resume.\n\n"
                "Today we'll focus on leadership and decision-making.\n\n"
                "Please introduce yourself and share a brief overview of your experience."
            )
        else:
            welcome = (
                "Hello! Welcome to your Technical Interview with SmartHire AI.\n\n"
                "I have reviewed your resume.\n\n"
                "Let's begin.\n\n"
                "Please introduce yourself and highlight your technical background."
            )

        self.repository.add_message(
            session_id=session_id,
            role="assistant",
            message=welcome,
        )

        return welcome

    def chat(self, session_id: int, answer: str):
        self.repository.add_message(
            session_id=session_id,
            role="candidate",
            message=answer,
        )

        session = (
            self.db.query(InterviewSession)
            .filter(InterviewSession.id == session_id)
            .first()
        )

        if session is None:
            raise Exception("Interview session not found.")

        analysis = (
            self.db.query(ResumeAnalysis)
            .filter(ResumeAnalysis.resume_id == session.resume_id)
            .first()
        )

        if analysis is None:
            raise Exception("Resume analysis not found.")

        history = self.repository.get_conversation(session_id)

        interview_type = getattr(session, "interview_type", "technical") or "technical"

        ai_reply = self.generator.generate(
            resume_analysis=analysis.__dict__,
            conversation_history=history,
            candidate_answer=answer,
            interview_type=interview_type,   # ← pass type
        )

        self.repository.add_message(
            session_id=session_id,
            role="assistant",
            message=ai_reply,
        )

        return ai_reply

    def history(self, session_id: int):
        return self.repository.get_conversation(session_id)

    def finish(self, session_id: int):
        session = (
            self.db.query(InterviewSession)
            .filter(InterviewSession.id == session_id)
            .first()
        )

        if session is None:
            raise Exception("Interview session not found.")

        session.status = "COMPLETED"
        self.db.commit()
        return session