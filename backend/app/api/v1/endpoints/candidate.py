from fastapi import APIRouter, Depends

from app.auth.roles import require_role
from app.models.user import User

router = APIRouter(
    prefix="/candidate",
    tags=["Candidate"]
)


@router.get("/dashboard")
def candidate_dashboard(
    current_user: User = Depends(
        require_role(["candidate"])
    )
):
    return {
        "message": f"Welcome Candidate {current_user.full_name}"
    }