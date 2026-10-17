from datetime import datetime

from pydantic import BaseModel

from app.schemas.resume_analysis import ResumeAnalysisResponse

class ResumeResponse(BaseModel):

    id: int

    filename: str

    file_path: str

    uploaded_at: datetime

    model_config = {
        "from_attributes": True
    }


class ResumeDetailsResponse(BaseModel):

    id: int

    filename: str

    file_path: str

    extracted_text: str | None = None

    uploaded_at: datetime

    model_config = {
        "from_attributes": True
    }

class ResumeAnalysisResult(BaseModel):

    resume: ResumeDetailsResponse

    analysis: ResumeAnalysisResponse