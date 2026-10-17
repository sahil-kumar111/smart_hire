from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.services.interview_analytics_service import (
    InterviewAnalyticsService,
)

router = APIRouter(
    prefix="/interview-monitor",
    tags=["Interview Analytics"],
)


@router.get("/analytics/{session_id}")
def get_analytics(
    session_id: int,
    db: Session = Depends(get_db),
):

    analytics = InterviewAnalyticsService().get_session_analytics(
        db,
        session_id,
    )

    if analytics is None:

        raise HTTPException(
            status_code=404,
            detail="No monitoring reports found.",
        )

    return analytics