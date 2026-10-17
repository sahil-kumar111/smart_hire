from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.interview_session import InterviewSession
from app.models.interview_monitor import InterviewMonitor
from app.models.recruiter_shortlist import RecruiterShortlist
from app.models.user import User


class InterviewHistoryService:

    def get_history(
        self,
        db: Session,
        current_user: Optional[User] = None,
    ):
        query = (
            db.query(
                InterviewSession.id.label("session_id"),
                InterviewSession.user_id,
                InterviewSession.interview_type,
                InterviewSession.status.label("session_status"),
                InterviewSession.started_at,
                InterviewSession.completed_at,
                User.full_name.label("candidate_name"),
                User.email.label("candidate_email"),
            )
            .join(User, InterviewSession.user_id == User.id)
        )

        if current_user and (current_user.role or "").lower() == "candidate":
            query = query.filter(InterviewSession.user_id == current_user.id)

        sessions = query.order_by(InterviewSession.id.desc()).all()
        seen_sessions = set()
        history = []

        for s in sessions:
            seen_sessions.add(s.session_id)

            monitor = (
                db.query(InterviewMonitor)
                .filter(InterviewMonitor.session_id == s.session_id)
                .order_by(InterviewMonitor.created_at.desc())
                .first()
            )
            score = round(monitor.overall_score, 2) if monitor and monitor.overall_score is not None else 0.0

            date_val = s.completed_at or s.started_at or (monitor.created_at if monitor else None)
            date_str = date_val.isoformat() if date_val else ""

            shortlist = (
                db.query(RecruiterShortlist)
                .filter(RecruiterShortlist.session_id == s.session_id)
                .order_by(RecruiterShortlist.updated_at.desc())
                .first()
            )
            raw_status = (shortlist.status if shortlist else "pending").lower().strip()
            if raw_status == "shortlisted":
                raw_status = "selected"
            if raw_status not in ["pending", "selected", "rejected"]:
                raw_status = "pending"

            history.append(
                {
                    "session_id": s.session_id,
                    "overall_score": score,
                    "date": date_str,
                    "interview_type": s.interview_type or "technical",
                    "session_status": s.session_status or "COMPLETED",
                    "candidate_name": s.candidate_name,
                    "candidate_email": s.candidate_email,
                    "status": raw_status,
                    "selection_status": raw_status,
                }
            )

        # Fallback for any monitor-only records not in interview_sessions
        if not (current_user and (current_user.role or "").lower() == "candidate"):
            orphan_monitors = (
                db.query(
                    InterviewMonitor.session_id,
                    func.avg(InterviewMonitor.overall_score).label("overall_score"),
                    func.max(InterviewMonitor.created_at).label("date"),
                )
                .filter(InterviewMonitor.session_id.notin_(seen_sessions) if seen_sessions else True)
                .group_by(InterviewMonitor.session_id)
                .order_by(func.max(InterviewMonitor.created_at).desc())
                .all()
            )
            for m in orphan_monitors:
                shortlist = (
                    db.query(RecruiterShortlist)
                    .filter(RecruiterShortlist.session_id == m.session_id)
                    .order_by(RecruiterShortlist.updated_at.desc())
                    .first()
                )
                raw_status = (shortlist.status if shortlist else "pending").lower().strip()
                if raw_status == "shortlisted":
                    raw_status = "selected"
                if raw_status not in ["pending", "selected", "rejected"]:
                    raw_status = "pending"

                history.append(
                    {
                        "session_id": m.session_id,
                        "overall_score": round(m.overall_score, 2) if m.overall_score is not None else 0.0,
                        "date": m.date.isoformat() if m.date else "",
                        "interview_type": "technical",
                        "session_status": "COMPLETED",
                        "candidate_name": "Candidate",
                        "candidate_email": "",
                        "status": raw_status,
                        "selection_status": raw_status,
                    }
                )

        return history