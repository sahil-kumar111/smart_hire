from app.ai.interview_chat import InterviewChat
from datetime import datetime
from app.models.interview_conversation import (
    InterviewConversation,
)

from app.repositories.interview_conversation_repository import (
    InterviewConversationRepository,
)

from app.repositories.interview_session_repository import (
    InterviewSessionRepository,
)


class InterviewConversationService:

    def __init__(
        self,
        conversation_repository: InterviewConversationRepository,
        session_repository: InterviewSessionRepository,
    ):
        self.conversation_repository = conversation_repository
        self.session_repository = session_repository
        self.interview_chat = InterviewChat()

    def chat(
        self,
        session_id: int,
        candidate_message: str,
    ):
        session = self.session_repository.get_by_id(session_id)

        if session is None:
            raise Exception("Interview session not found.")

        analysis = session.resume.analysis

        resume_analysis = {
            "technical_skills": analysis.technical_skills,
            "soft_skills": analysis.soft_skills,
            "frameworks": analysis.frameworks,
            "tools": analysis.tools,
            "databases": analysis.databases,
            "cloud": analysis.cloud,
            "certifications": analysis.certifications,
            "education": analysis.education,
            "experience": analysis.experience,
            "projects": analysis.projects,
        }

        # Save candidate message (skip empty first call if you want)
        if candidate_message and candidate_message.strip():
            candidate = InterviewConversation(
                session_id=session_id,
                role="candidate",
                message=candidate_message,
            )
            self.conversation_repository.create(candidate)

        history = self.conversation_repository.get_messages(session_id)

        conversation = []
        for msg in history:
            conversation.append(
                {
                    "role": msg.role,
                    "message": msg.message,
                }
            )

        # ✅ Get interview type from session
        interview_type = getattr(session, "interview_type", "technical") or "technical"

        ai_response = self.interview_chat.reply(
            resume_analysis=resume_analysis,
            conversation=conversation,
            candidate_message=candidate_message,
            interview_type=interview_type,   # ✅ pass it
        )

        interviewer = InterviewConversation(
            session_id=session_id,
            role="interviewer",
            message=ai_response["reply"],
        )
        self.conversation_repository.create(interviewer)

        if ai_response.get("interview_finished"):
            session.status = "COMPLETED"
            session.completed_at = datetime.utcnow()
            self.session_repository.db.commit()

        return ai_response