from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class JobDescriptionCreate(BaseModel):
    jd_text: str


class JobDescriptionResponse(BaseModel):
    id: int
    user_id: int
    jd_text: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ResumeMatchRequest(BaseModel):
    resume_id: int


class ResumeMatchResponse(BaseModel):
    match_score: float
    matching_skills: List[str]
    missing_skills: List[str]
    summary: str