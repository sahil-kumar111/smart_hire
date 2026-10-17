from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.dependencies import get_db
from app.models.user import User
from app.schemas.user import UserResponse

# Import models that reference user / resume
from app.models.resume import Resume
from app.models.interview_session import InterviewSession
from app.models.job_description import JobDescription

# Optional models – comment out if import fails
try:
    from app.models.recruiter_shortlist import RecruiterShortlist
except Exception:
    RecruiterShortlist = None

try:
    from app.models.resume_analysis import ResumeAnalysis
except Exception:
    ResumeAnalysis = None

try:
    from app.models.interview_conversation import InterviewConversation
except Exception:
    InterviewConversation = None

try:
    from app.models.interview_answer import InterviewAnswer
except Exception:
    InterviewAnswer = None

try:
    from app.models.interview_monitor import InterviewMonitor
except Exception:
    InterviewMonitor = None

try:
    from app.models.interview_monitor_snapshot import InterviewMonitorSnapshot
except Exception:
    InterviewMonitorSnapshot = None

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("", response_model=list[UserResponse])
@router.get("/", response_model=list[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if (current_user.role or "").lower() != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return db.query(User).order_by(User.id.desc()).all()


@router.delete("/me")
def delete_my_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_id = current_user.id

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        # 1. Shortlist rows created by this user (if recruiter)
        if RecruiterShortlist is not None:
            db.query(RecruiterShortlist).filter(
                RecruiterShortlist.recruiter_id == user_id
            ).delete(synchronize_session=False)

        # 2. Job descriptions
        db.query(JobDescription).filter(
            JobDescription.user_id == user_id
        ).delete(synchronize_session=False)

        # 3. Get all sessions of this user
        sessions = (
            db.query(InterviewSession)
            .filter(InterviewSession.user_id == user_id)
            .all()
        )
        session_ids = [s.id for s in sessions]

        if session_ids:
            # Child tables of sessions
            if InterviewMonitorSnapshot is not None:
                db.query(InterviewMonitorSnapshot).filter(
                    InterviewMonitorSnapshot.session_id.in_(session_ids)
                ).delete(synchronize_session=False)

            if InterviewMonitor is not None:
                db.query(InterviewMonitor).filter(
                    InterviewMonitor.session_id.in_(session_ids)
                ).delete(synchronize_session=False)

            if InterviewConversation is not None:
                db.query(InterviewConversation).filter(
                    InterviewConversation.session_id.in_(session_ids)
                ).delete(synchronize_session=False)

            if InterviewAnswer is not None:
                db.query(InterviewAnswer).filter(
                    InterviewAnswer.session_id.in_(session_ids)
                ).delete(synchronize_session=False)

            # Delete sessions
            db.query(InterviewSession).filter(
                InterviewSession.user_id == user_id
            ).delete(synchronize_session=False)

        # 4. Resumes + analysis
        resumes = db.query(Resume).filter(Resume.owner_id == user_id).all()
        resume_ids = [r.id for r in resumes]

        if resume_ids and ResumeAnalysis is not None:
            db.query(ResumeAnalysis).filter(
                ResumeAnalysis.resume_id.in_(resume_ids)
            ).delete(synchronize_session=False)

        # Any remaining sessions linked only by resume_id
        if resume_ids:
            leftover_sessions = (
                db.query(InterviewSession)
                .filter(InterviewSession.resume_id.in_(resume_ids))
                .all()
            )
            leftover_ids = [s.id for s in leftover_sessions]
            if leftover_ids:
                if InterviewMonitorSnapshot is not None:
                    db.query(InterviewMonitorSnapshot).filter(
                        InterviewMonitorSnapshot.session_id.in_(leftover_ids)
                    ).delete(synchronize_session=False)
                if InterviewMonitor is not None:
                    db.query(InterviewMonitor).filter(
                        InterviewMonitor.session_id.in_(leftover_ids)
                    ).delete(synchronize_session=False)
                if InterviewConversation is not None:
                    db.query(InterviewConversation).filter(
                        InterviewConversation.session_id.in_(leftover_ids)
                    ).delete(synchronize_session=False)
                if InterviewAnswer is not None:
                    db.query(InterviewAnswer).filter(
                        InterviewAnswer.session_id.in_(leftover_ids)
                    ).delete(synchronize_session=False)
                db.query(InterviewSession).filter(
                    InterviewSession.resume_id.in_(resume_ids)
                ).delete(synchronize_session=False)

        db.query(Resume).filter(Resume.owner_id == user_id).delete(
            synchronize_session=False
        )

        # 5. Finally delete user
        db.delete(user)
        db.commit()

        return {"message": "Account deleted successfully"}

    except Exception as e:
        db.rollback()
        print("Delete account error:", e)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete account: {str(e)}",
        )