from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.interview_monitor import InterviewMonitor


class InterviewAnalyticsService:

    def get_session_analytics(
        self,
        db: Session,
        session_id: int,
    ):

        reports = (

            db.query(InterviewMonitor)

            .filter(
                InterviewMonitor.session_id == session_id
            )

            .order_by(
                InterviewMonitor.created_at.asc()
            )

            .all()

        )

        if len(reports) == 0:

            return None

        # ------------------------
        # Timeline
        # ------------------------

        timeline = []

        for report in reports:

            timeline.append(

                {

                    "time": report.created_at.strftime("%H:%M:%S"),

                    "score": report.overall_score,

                    "eye_contact": report.eye_contact_score,

                    "fluency": report.fluency_score,

                    "fillers": report.filler_count,

                    "emotion": report.dominant_emotion,

                    "transcript": report.transcript,

                }

            )

        # ------------------------
        # Average values
        # ------------------------

        average_score = round(

            sum(
                r.overall_score
                for r in reports
            ) / len(reports),

            2,

        )

        average_eye = round(

            sum(
                r.eye_contact_score
                for r in reports
            ) / len(reports),

            2,

        )

        average_fluency = round(

            sum(
                r.fluency_score
                for r in reports
            ) / len(reports),

            2,

        )

        average_fillers = round(

            sum(
                r.filler_count
                for r in reports
            ) / len(reports),

            2,

        )

        # ------------------------
        # Most common emotion
        # ------------------------

        emotions = {}

        for report in reports:

            emotion = report.dominant_emotion

            emotions[emotion] = emotions.get(
                emotion,
                0,
            ) + 1

        dominant_emotion = max(
            emotions,
            key=emotions.get,
        )

        # ------------------------
        # Recommendation
        # ------------------------

        if average_score >= 90:

            recommendation = "Outstanding"

        elif average_score >= 80:

            recommendation = "Excellent"

        elif average_score >= 70:

            recommendation = "Good"

        elif average_score >= 60:

            recommendation = "Average"

        else:

            recommendation = "Needs Improvement"

        return {

            "session_id": session_id,

            "overall_score": average_score,

            "recommendation": recommendation,

            "average_eye_contact": average_eye,

            "average_fluency": average_fluency,

            "average_fillers": average_fillers,

            "average_emotion": dominant_emotion,

            "timeline": timeline,

        }