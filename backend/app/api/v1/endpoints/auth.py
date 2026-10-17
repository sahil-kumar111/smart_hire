from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.jwt_handler import create_access_token
from app.database.dependencies import get_db
from app.repositories.user_repository import UserRepository
from app.schemas.user import (
    UserRegister,
    UserResponse,
    UserLogin,
    TokenResponse,
)
from app.services.auth_service import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201,
)
def register(
    user: UserRegister,
    db: Session = Depends(get_db),
):
    repository = UserRepository(db)
    service = AuthService(repository)

    created_user = service.register_user(user)

    return created_user


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    user: UserLogin,
    db: Session = Depends(get_db),
):
    repository = UserRepository(db)
    service = AuthService(repository)

    authenticated_user = service.authenticate_user(
        user.email,
        user.password,
    )

    access_token = create_access_token(
        {
            "sub": authenticated_user.email,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }