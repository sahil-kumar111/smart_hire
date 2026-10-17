from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.interview_history_service import (
    InterviewHistoryService,
)

from app.auth.dependencies import get_optional_current_user
from app.models.user import User

router = APIRouter(
    prefix="/interview-monitor",
    tags=["Interview History"],
)


@router.get("/history")
def get_history(
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user),
):
    return InterviewHistoryService().get_history(
        db,
        current_user=current_user,
    )