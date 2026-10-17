from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.live_interview_service import LiveInterviewService

router = APIRouter()


class StartInterviewRequest(BaseModel):
    session_id: int


class ChatRequest(BaseModel):
    session_id: int
    message: str


@router.post("/start")
def start_interview(
    request: StartInterviewRequest,
    db: Session = Depends(get_db),
):
    service = LiveInterviewService(db)

    reply = service.start_interview(
        request.session_id
    )

    return {
        "message": reply
    }


@router.post("/chat")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
):
    service = LiveInterviewService(db)

    reply = service.chat(
        session_id=request.session_id,
        answer=request.message,
    )

    return {
        "message": reply
    }


@router.get("/history/{session_id}")
def history(
    session_id: int,
    db: Session = Depends(get_db),
):
    service = LiveInterviewService(db)

    messages = service.history(
        session_id
    )

    return messages


@router.post("/finish/{session_id}")
def finish(
    session_id: int,
    db: Session = Depends(get_db),
):
    service = LiveInterviewService(db)

    service.finish(session_id)

    return {
        "message": "Interview completed."
    }