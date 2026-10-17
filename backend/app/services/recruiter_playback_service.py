from sqlalchemy.orm import Session

from app.models.interview_monitor_snapshot import (
    InterviewMonitorSnapshot,
)


class RecruiterPlaybackService:

    def get_playback(
        self,
        db: Session,
        session_id: int,
    ):

        snapshots = (

            db.query(
                InterviewMonitorSnapshot
            )

            .filter(
                InterviewMonitorSnapshot.session_id
                == session_id
            )

            .order_by(
                InterviewMonitorSnapshot.second.asc()
            )

            .all()

        )

        playback = []

        for snapshot in snapshots:

            playback.append(

                {

                    "id": snapshot.id,

                    "second": snapshot.second,

                    "emotion": snapshot.emotion,

                    "eye_contact_score": snapshot.eye_contact_score,

                    "fluency_score": snapshot.fluency_score,

                    "filler_count": snapshot.filler_count,

                    "overall_score": snapshot.overall_score,

                    "created_at": snapshot.created_at,

                }

            )

        return playback