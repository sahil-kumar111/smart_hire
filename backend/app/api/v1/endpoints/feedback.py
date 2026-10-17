from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.interview_monitor import InterviewMonitor

router = APIRouter(
    prefix="/feedback",
    tags=["AI Feedback"],
)


@router.get("/{session_id}")
def get_feedback(
    session_id: int,
    db: Session = Depends(get_db),
):

    report = (
        db.query(InterviewMonitor)
        .filter(
            InterviewMonitor.session_id == session_id
        )
        .first()
    )

    if report is None:

        raise HTTPException(
            status_code=404,
            detail="Interview report not found.",
        )

    return {

        "overall_score": report.overall_score,

        "recommendation": report.recommendation,

        "transcript": report.transcript,

        "word_count": report.word_count,

        "fluency_score": report.fluency_score,

        "filler_count": report.filler_count,

        "dominant_emotion": report.dominant_emotion,

        "eye_contact_score": report.eye_contact_score,

        "feedback": {

            "summary": report.summary,

            "strengths": report.strengths,

            "weaknesses": report.weaknesses,

            "suggestions": report.suggestions,

        }

    }