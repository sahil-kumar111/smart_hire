from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db  # your actual get_db
from app.auth.dependencies import get_current_user  # your actual import
from app.models.user import User
from app.schemas.recruiter_shortlist import ShortlistUpdate, ShortlistResponse
from app.repositories.recruiter_shortlist_repository import RecruiterShortlistRepository

router = APIRouter(
    prefix="/recruiter/shortlist",
    tags=["Recruiter Shortlist"],
)


@router.get("", response_model=list[ShortlistResponse])
def list_shortlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if (current_user.role or "").lower() != "recruiter":
        raise HTTPException(status_code=403, detail="Recruiter only")

    repo = RecruiterShortlistRepository(db)
    return repo.get_by_recruiter(current_user.id)


@router.post("", response_model=ShortlistResponse)
def update_shortlist(
    payload: ShortlistUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if (current_user.role or "").lower() != "recruiter":
        raise HTTPException(status_code=403, detail="Recruiter only")

    status = (payload.status or "pending").lower().strip()
    if status not in ["pending", "shortlisted", "rejected"]:
        raise HTTPException(
            status_code=400,
            detail="status must be pending, shortlisted, or rejected",
        )

    repo = RecruiterShortlistRepository(db)
    return repo.upsert(current_user.id, payload.session_id, status)