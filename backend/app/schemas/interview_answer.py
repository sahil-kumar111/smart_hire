from datetime import datetime

from pydantic import BaseModel
from app.schemas.interview_evaluation import (
    InterviewEvaluationResponse,
)

class InterviewAnswerCreate(BaseModel):

    session_id: int

    question_id: int

    candidate_answer: str


class InterviewAnswerResponse(BaseModel):

    id: int

    session_id: int

    question_id: int

    candidate_answer: str
    
    evaluation: InterviewEvaluationResponse | None = None

    ai_score: float | None = None

    ai_feedback: str | None = None

    created_at: datetime

    model_config = {
        "from_attributes": True
    }