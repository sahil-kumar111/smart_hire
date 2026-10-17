from datetime import datetime

from pydantic import BaseModel


class InterviewQuestionResponse(BaseModel):

    id: int

    resume_id: int

    question: str

    category: str

    difficulty: str

    expected_points: list[str]

    created_at: datetime

    model_config = {
        "from_attributes": True
    }

class InterviewQuestionListResponse(BaseModel):

    questions: list[InterviewQuestionResponse]