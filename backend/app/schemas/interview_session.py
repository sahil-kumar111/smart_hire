from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class StartInterviewRequest(BaseModel):
    interview_type: Optional[str] = "technical"  # hr | technical | managerial


class InterviewSessionResponse(BaseModel):
    id: int
    resume_id: int
    user_id: int
    status: str
    interview_type: str = "technical"
    started_at: datetime
    completed_at: datetime | None = None

    model_config = {
        "from_attributes": True
    }