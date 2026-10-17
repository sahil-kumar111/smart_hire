from sqlalchemy.orm import Session

from app.models.interview_monitor import InterviewMonitor


class InterviewMonitoringRepository:

    def create(
        self,
        db: Session,
        data: dict,
    ):
        record = InterviewMonitor(**data)
        db.add(record)
        db.commit()
        db.refresh(record)
        return record