from pydantic import BaseModel


class InterviewMonitoringCreate(BaseModel):

    session_id: int

    transcript: str

    emotion: str

    eye_contact: float

    filler_words: int

    fluency_score: float

    confidence_score: float

    overall_score: float