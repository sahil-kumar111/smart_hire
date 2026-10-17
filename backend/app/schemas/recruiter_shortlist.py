from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ShortlistUpdate(BaseModel):
    session_id: int
    status: str  # pending | shortlisted | rejected


class ShortlistResponse(BaseModel):
    id: int
    recruiter_id: int
    session_id: int
    status: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}