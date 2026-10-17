from sqlalchemy.orm import Session

from app.models.interview_monitor import InterviewMonitor


class InterviewMonitoringService:

    def save(
        self,
        db: Session,
        report: dict,
    ):

        monitor = InterviewMonitor(

            session_id=report["session_id"],

            transcript=report["transcript"],

            word_count=report["word_count"],

            duration=report["duration"],

            filler_count=report["filler_count"],

            fluency_score=report["fluency_score"],

            confidence_score=report["confidence_score"],

            dominant_emotion=report["dominant_emotion"],

            eye_contact_score=report["eye_contact_score"],

            overall_score=report["overall_score"],

            recommendation=report["recommendation"],

            summary=report["summary"],

            strengths=report["strengths"],

            weaknesses=report["weaknesses"],

            suggestions=report["suggestions"],

        )

        db.add(monitor)

        db.commit()

        db.refresh(monitor)

        return monitor

    def get_by_session(
        self,
        db: Session,
        session_id: int,
    ):

        return (

            db.query(InterviewMonitor)

            .filter(
                InterviewMonitor.session_id == session_id
            )

            .order_by(
                InterviewMonitor.created_at.desc()
            )

            .all()

        )

    def get_all(
        self,
        db: Session,
    ):

        return (

            db.query(
                InterviewMonitor
            )

            .all()

        )