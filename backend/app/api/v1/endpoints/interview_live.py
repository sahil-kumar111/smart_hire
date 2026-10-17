from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.interview_monitor import InterviewMonitor
from app.models.interview_monitor_snapshot import InterviewMonitorSnapshot
from app.models.interview_session import InterviewSession

router = APIRouter(
    prefix="/interview-live",
    tags=["Interview Live"],
)


@router.get("/{session_id}")
def get_live_metrics(
    session_id: int,
    db: Session = Depends(get_db),
):
    session = (
        db.query(InterviewSession)
        .filter(InterviewSession.id == session_id)
        .first()
    )
    status_str = "In Progress" if session and session.status == "IN_PROGRESS" else (session.status if session else "Active")

    # 1. Check latest snapshot
    latest_snapshot = (
        db.query(InterviewMonitorSnapshot)
        .filter(InterviewMonitorSnapshot.session_id == session_id)
        .order_by(InterviewMonitorSnapshot.second.desc())
        .first()
    )

    # 2. Check monitor report
    latest_report = (
        db.query(InterviewMonitor)
        .filter(InterviewMonitor.session_id == session_id)
        .order_by(InterviewMonitor.created_at.desc())
        .first()
    )

    if latest_snapshot:
        return {
            "overall_score": round(latest_snapshot.overall_score or 0.0, 1),
            "emotion": latest_snapshot.emotion or "Neutral",
            "eye_contact": "Good" if (latest_snapshot.eye_contact_score or 0) >= 70 else "Needs Improvement",
            "eye_contact_score": round(latest_snapshot.eye_contact_score or 0.0, 1),
            "confidence": round(latest_snapshot.overall_score or 0.0, 1),
            "fluency": round(latest_snapshot.fluency_score or 0.0, 1),
            "filler_words": latest_snapshot.filler_count or 0,
            "recommendation": latest_report.recommendation if latest_report else "Evaluating",
            "status": status_str,
        }

    if latest_report:
        return {
            "overall_score": round(latest_report.overall_score or 0.0, 1),
            "emotion": latest_report.dominant_emotion or "Neutral",
            "eye_contact": "Good" if (latest_report.eye_contact_score or 0) >= 70 else "Needs Improvement",
            "eye_contact_score": round(latest_report.eye_contact_score or 0.0, 1),
            "confidence": round(latest_report.confidence_score or 0.0, 1),
            "fluency": round(latest_report.fluency_score or 0.0, 1),
            "filler_words": latest_report.filler_count or 0,
            "recommendation": latest_report.recommendation or "In Progress",
            "status": status_str,
        }

    return {
        "overall_score": 0.0,
        "emotion": "Neutral",
        "eye_contact": "Awaiting Feed",
        "eye_contact_score": 0.0,
        "confidence": 0.0,
        "fluency": 0.0,
        "filler_words": 0,
        "recommendation": "Evaluating",
        "status": status_str,
    }