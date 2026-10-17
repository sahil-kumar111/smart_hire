from pathlib import Path
import shutil

from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException,
)
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.file_config import RESUME_FOLDER
from app.database.dependencies import get_db
from app.models.user import User
from app.repositories.resume_repository import ResumeRepository
from app.schemas.resume import (ResumeResponse,ResumeDetailsResponse)
from app.services.resume_service import ResumeService
from app.schemas.ai_resume import ResumeAnalysisResponse
from app.repositories.resume_analysis_repository import (ResumeAnalysisRepository)
from app.services.resume_analysis_service import (ResumeAnalysisService)
from app.schemas.resume import (ResumeAnalysisResult)




router = APIRouter(
    prefix="/resume",
    tags=["Resume"],
)


@router.post(
    "/upload",
    response_model=ResumeResponse,
)
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed.",
        )

    filename = (
        f"{current_user.id}_{file.filename}"
    )

    file_path = RESUME_FOLDER / filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer,
        )

    repository = ResumeRepository(db)

    service = ResumeService(repository)

    resume = service.create_resume(
        filename=file.filename,
        file_path=str(file_path),
        owner_id=current_user.id,
    )

    return resume


@router.get(
    "/me",
    response_model=list[ResumeResponse],
)
def get_my_resumes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    repository = ResumeRepository(db)

    service = ResumeService(repository)

    return service.get_user_resumes(
        current_user.id
    )

@router.get(
    "/{resume_id}",
    response_model=ResumeDetailsResponse,
)
def get_resume_details(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    repository = ResumeRepository(db)

    service = ResumeService(repository)

    resume = service.get_resume_by_id(
        resume_id
    )

    if (
        not resume
        or resume.owner_id != current_user.id
    ):
        raise HTTPException(
            status_code=404,
            detail="Resume not found.",
        )

    return resume

@router.get(
    "/download/{resume_id}",
)
def download_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    repository = ResumeRepository(db)

    resume = repository.get_by_id(
        resume_id
    )

    if (
        not resume
        or resume.owner_id != current_user.id
    ):
        raise HTTPException(
            status_code=404,
            detail="Resume not found.",
        )

    return FileResponse(
        path=resume.file_path,
        filename=resume.filename,
    )

@router.get(
    "/analyze/{resume_id}",
    response_model=ResumeAnalysisResult,
)
def analyze_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    resume_repository = ResumeRepository(db)

    resume = resume_repository.get_by_id(
        resume_id
    )

    if (
        not resume
        or resume.owner_id != current_user.id
    ):
        raise HTTPException(
            status_code=404,
            detail="Resume not found.",
        )

    analysis_repository = ResumeAnalysisRepository(
        db
    )

    analysis_service = ResumeAnalysisService(
        analysis_repository
    )

    analysis = analysis_service.analyze_resume(
        resume
    )

    return {
        "resume": resume,
        "analysis": analysis,
    }

@router.delete(
    "/{resume_id}",
)
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    repository = ResumeRepository(db)

    resume = repository.get_by_id(
        resume_id
    )

    if (
        not resume
        or resume.owner_id != current_user.id
    ):
        raise HTTPException(
            status_code=404,
            detail="Resume not found.",
        )

    Path(
        resume.file_path
    ).unlink(
        missing_ok=True
    )

    repository.delete(
        resume
    )

    return {
        "message": "Resume deleted successfully."
    }