from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.interview_monitoring_service import InterviewMonitoringService

router = APIRouter(
    prefix="/interview-monitor",
    tags=["Interview Monitoring Reports"],
)


@router.get("/report/{session_id}")
def get_report(
    session_id: int,
    db: Session = Depends(get_db),
):

    report = InterviewMonitoringService().get_by_session(
        db,
        session_id,
    )

    return report


@router.get("/reports")
def get_reports(
    db: Session = Depends(get_db),
):

    reports = InterviewMonitoringService().get_all(
        db,
    )

    return reports