from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.roles import require_role
from app.auth.dependencies import get_current_user
from app.database.dependencies import get_db
from app.models.user import User
from app.services.interview_history_service import InterviewHistoryService

router = APIRouter(
    prefix="/candidate",
    tags=["Candidate"]
)


@router.get("/dashboard")
def candidate_dashboard(
    current_user: User = Depends(
        require_role(["candidate"])
    )
):
    return {
        "message": f"Welcome Candidate {current_user.full_name}"
    }


@router.get("/interviews")
def get_candidate_interviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return InterviewHistoryService().get_history(
        db,
        current_user=current_user,
    )