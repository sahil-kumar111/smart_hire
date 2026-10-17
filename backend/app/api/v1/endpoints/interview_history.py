from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.interview_history_service import (
    InterviewHistoryService,
)

router = APIRouter(
    prefix="/interview-monitor",
    tags=["Interview History"],
)


@router.get("/history")
def get_history(
    db: Session = Depends(get_db),
):

    return InterviewHistoryService().get_history(
        db
    )