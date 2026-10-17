from fastapi import HTTPException, status

from app.auth.hashing import hash_password, verify_password
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserRegister


class AuthService:

    def __init__(self, repository: UserRepository):
        self.repository = repository

    def register_user(self, user_data: UserRegister):
        existing_user = self.repository.get_by_email(user_data.email)

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered.",
            )

        role = (getattr(user_data, "role", None) or "candidate").lower().strip()

        if role not in ["candidate", "recruiter", "admin"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid role. Must be candidate, recruiter, or admin.",
            )

        new_user = User(
            full_name=user_data.full_name,
            email=user_data.email,
            hashed_password=hash_password(user_data.password),
            role=role,  # ✅ from request, not hardcoded
        )

        return self.repository.create(new_user)

    def authenticate_user(self, email: str, password: str):
        user = self.repository.get_by_email(email)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        if not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        return user