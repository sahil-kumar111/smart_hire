from sqlalchemy.orm import Session

from backend.app.models.interview_monitor import InterviewMonitoring


class InterviewMonitoringRepository:

    def create(
        self,
        db: Session,
        data: dict,
    ):

        record = InterviewMonitoring(**data)

        db.add(record)

        db.commit()

        db.refresh(record)

        return record