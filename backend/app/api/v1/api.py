from fastapi import APIRouter

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.users import router as users_router
from app.api.v1.endpoints.resume import router as resume_router
from app.api.v1.endpoints.candidate import router as candidate_router
from app.api.v1.endpoints.recruiter import router as recruiter_router
from app.api.v1.endpoints.admin import router as admin_router
from app.api.v1.endpoints.interview import router as interview_router
from app.api.v1.endpoints.speech import router as speech_router
from app.api.v1.endpoints.interview_monitor import router as monitor_router
from app.api.v1.endpoints.interview_monitor_report import router as monitor_report_router
from app.api.v1.endpoints.interview_analytics import router as analytics_router
from app.api.v1.endpoints.interview_history import router as history_router
from app.api.v1.endpoints.report import router as report_router
from app.api.v1.endpoints.progress import router as progress_router
from app.api.v1.endpoints.feedback import router as feedback_router
from app.api.v1.endpoints.monitor_history import router as monitor_history_router
from app.api.v1.endpoints.recruiter_playback import router as recruiter_playback_router
from app.api.v1.endpoints import live_interview
from app.api.v1.endpoints import interview_conversation
from app.api.v1.endpoints import speech_chat
from app.api.v1.endpoints import interview_live
from app.api.v1.endpoints import job_description
from app.api.v1.endpoints import recruiter_shortlist




api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(resume_router)
api_router.include_router(candidate_router)
api_router.include_router(recruiter_router)
api_router.include_router(admin_router)
api_router.include_router(interview_router)
api_router.include_router(speech_router)
api_router.include_router(monitor_router)
api_router.include_router(monitor_report_router)
api_router.include_router(analytics_router)
api_router.include_router(history_router)
api_router.include_router(report_router)
api_router.include_router(progress_router)
api_router.include_router(feedback_router)
api_router.include_router(monitor_history_router)
api_router.include_router(recruiter_playback_router)
api_router.include_router(
    live_interview.router,
    prefix="/live-interview",
    tags=["Live Interview"],
)
api_router.include_router(
    interview_conversation.router
)
api_router.include_router(speech_chat.router)
api_router.include_router(interview_live.router)
api_router.include_router(
    job_description.router,
    tags=["Job Description"],
)
api_router.include_router(recruiter_shortlist.router)