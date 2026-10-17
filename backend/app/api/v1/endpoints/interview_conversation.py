from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.interview_conversation import (
    ConversationRequest,
)

from app.services.live_interview_service import (
    LiveInterviewService,
)

router = APIRouter(
    prefix="/conversation",
    tags=["Live Interview"],
)


@router.post("/start/{resume_id}")
def start_interview(
    resume_id: int,
    db: Session = Depends(get_db),
):

    service = LiveInterviewService(db)

    return service.start_interview(
        resume_id
    )


@router.post("/reply")
def reply(
    request: ConversationRequest,
    db: Session = Depends(get_db),
):

    service = LiveInterviewService(db)

    return service.reply(
        request
    )


@router.post("/finish/{session_id}")
def finish(
    session_id: int,
    db: Session = Depends(get_db),
):

    service = LiveInterviewService(db)

    return service.finish(
        session_id
    )