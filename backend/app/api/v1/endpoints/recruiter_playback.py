from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.services.recruiter_playback_service import (
    RecruiterPlaybackService,
)

router = APIRouter(
    prefix="/recruiter-playback",
    tags=["Recruiter Playback"],
)


@router.get("/{session_id}")

def recruiter_playback(
    session_id: int,
    db: Session = Depends(get_db),
):

    return RecruiterPlaybackService().get_playback(
        db,
        session_id,
    )