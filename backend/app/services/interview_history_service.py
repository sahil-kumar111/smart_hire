from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.interview_monitor import InterviewMonitor


class InterviewHistoryService:

    def get_history(
        self,
        db: Session,
    ):

        sessions = (

            db.query(

                InterviewMonitor.session_id,

                func.avg(
                    InterviewMonitor.overall_score
                ).label("overall_score"),

                func.max(
                    InterviewMonitor.created_at
                ).label("date"),

            )

            .group_by(
                InterviewMonitor.session_id
            )

            .order_by(
                func.max(
                    InterviewMonitor.created_at
                ).desc()
            )

            .all()

        )

        history = []

        for session in sessions:

            history.append(

                {

                    "session_id": session.session_id,

                    "overall_score": round(
                        session.overall_score,
                        2,
                    ),

                    "date": session.date,

                }

            )

        return history