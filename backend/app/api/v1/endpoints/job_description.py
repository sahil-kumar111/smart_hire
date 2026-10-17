from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.schemas.job_description import (
    JobDescriptionCreate,
    JobDescriptionResponse,
    ResumeMatchRequest,
    ResumeMatchResponse,
)
from app.services.job_description_service import JobDescriptionService

router = APIRouter()


@router.post("/job-description", response_model=JobDescriptionResponse)
def save_job_description(
    payload: JobDescriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not payload.jd_text.strip():
        raise HTTPException(status_code=400, detail="Job Description cannot be empty")

    service = JobDescriptionService(db)
    jd = service.save_jd(current_user.id, payload.jd_text.strip())
    return jd


@router.get("/job-description", response_model=JobDescriptionResponse)
def get_job_description(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = JobDescriptionService(db)
    jd = service.get_jd(current_user.id)

    if not jd:
        raise HTTPException(status_code=404, detail="No Job Description found")

    return jd


@router.post("/resume/match", response_model=ResumeMatchResponse)
def match_resume_with_jd(
    payload: ResumeMatchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = JobDescriptionService(db)

    try:
        result = service.match_resume(current_user.id, payload.resume_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))