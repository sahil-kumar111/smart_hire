from sqlalchemy.orm import Session

from app.models.interview_monitor_snapshot import (
    InterviewMonitorSnapshot,
)


class MonitorSnapshotService:

    def save(
        self,
        db: Session,
        data: dict,
    ):

        snapshot = InterviewMonitorSnapshot(

            session_id=data["session_id"],

            second=data["second"],

            emotion=data["emotion"],

            eye_contact_score=data["eye_contact_score"],

            fluency_score=data["fluency_score"],

            filler_count=data["filler_count"],

            overall_score=data["overall_score"],

        )

        db.add(snapshot)

        db.commit()

        db.refresh(snapshot)

        return snapshot