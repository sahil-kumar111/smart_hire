from pydantic import BaseModel


class QuestionReport(BaseModel):

    question: str

    candidate_answer: str

    score: float

    strengths: list[str]

    weaknesses: list[str]

    ideal_answer: str

    feedback: str


class InterviewReportResponse(BaseModel):

    overall_score: float

    recommendation: str

    summary: str

    overall_strengths: list[str]

    overall_weaknesses: list[str]

    learning_plan: list[str]

    total_questions: int

    answered_questions: int

    questions: list[QuestionReport]