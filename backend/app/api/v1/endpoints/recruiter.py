from fastapi import APIRouter, Depends

from app.auth.roles import require_role
from app.models.user import User

router = APIRouter(
    prefix="/recruiter",
    tags=["Recruiter"]
)


@router.get("/dashboard")
def recruiter_dashboard(
    current_user: User = Depends(
        require_role(["recruiter"])
    )
):
    return {
        "message": f"Welcome Recruiter {current_user.full_name}"
    }