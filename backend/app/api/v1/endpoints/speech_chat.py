from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.auth.dependencies import get_current_user

from app.models.user import User

from app.repositories.interview_session_repository import (
    InterviewSessionRepository,
)

from app.repositories.interview_conversation_repository import (
    InterviewConversationRepository,
)

from app.services.interview_conversation_service import (
    InterviewConversationService,
)

from app.services.speech_to_text_service import (
    SpeechToTextService,
)

router = APIRouter(
    prefix="/speech-chat",
    tags=["Speech Chat"],
)


@router.post("/{session_id}")
async def speech_chat(
    session_id: int,
    audio: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    session_repository = InterviewSessionRepository(db)

    session = session_repository.get_by_id(session_id)

    if (
        not session
        or session.user_id != current_user.id
    ):
        raise HTTPException(
            status_code=404,
            detail="Interview session not found.",
        )

    speech_service = SpeechToTextService()

    candidate_message = await speech_service.transcribe(
        audio
    )

    conversation_repository = (
        InterviewConversationRepository(db)
    )

    service = InterviewConversationService(
        conversation_repository,
        session_repository,
    )

    response = service.chat(
        session_id=session_id,
        candidate_message=candidate_message,
    )

    return {
        "transcript": candidate_message,
        "reply": response.get("reply", ""),
        "interview_finished": response.get(
            "interview_finished",
            False,
        ),
    }