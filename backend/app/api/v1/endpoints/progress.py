from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.interview_monitor import InterviewMonitor

router = APIRouter(
    prefix="/progress",
    tags=["Progress Dashboard"],
)


@router.get("/")
def get_progress(
    db: Session = Depends(get_db),
):

    reports = (
        db.query(InterviewMonitor)
        .order_by(InterviewMonitor.created_at.asc())
        .all()
    )

    progress = []

    for report in reports:

        progress.append(

            {

                "session_id": report.session_id,

                "overall_score": report.overall_score,

                "fluency_score": report.fluency_score,

                "eye_contact_score": report.eye_contact_score,

                "emotion": report.dominant_emotion,

                "word_count": report.word_count,

                "filler_count": report.filler_count,

                "recommendation": report.recommendation,

                "date": report.created_at.strftime("%d-%m-%Y"),

            }

        )

    return progress