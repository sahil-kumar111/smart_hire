from pydantic import BaseModel


class InterviewEvaluationResponse(BaseModel):

    id: int

    answer_id: int

    score: int

    strengths: list[str]

    weaknesses: list[str]

    ideal_answer: str

    feedback: str

    model_config = {
        "from_attributes": True
    }