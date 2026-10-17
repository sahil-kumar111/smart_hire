from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.interview_monitor_snapshot import (
    InterviewMonitorSnapshot,
)

router = APIRouter(
    prefix="/monitor-history",
    tags=["Interview Monitoring"],
)


@router.get("/{session_id}")

def history(
    session_id: int,
    db: Session = Depends(get_db),
):

    snapshots = (

        db.query(
            InterviewMonitorSnapshot
        )

        .filter(
            InterviewMonitorSnapshot.session_id == session_id
        )

        .order_by(
            InterviewMonitorSnapshot.second
        )

        .all()

    )

    return snapshots