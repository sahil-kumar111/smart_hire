from datetime import datetime

from pydantic import BaseModel


class Education(BaseModel):

    institution: str

    degree: str

    gpa: str | None = None

    grade: str | None = None

    start_date: str | None = None

    end_date: str | None = None


class Experience(BaseModel):

    title: str

    company: str

    location: str | None = None

    start_date: str | None = None

    end_date: str | None = None

    description: list[str]


class Project(BaseModel):

    title: str

    tech_stack: list[str]

    start_date: str | None = None

    end_date: str | None = None

    description: list[str]


class ResumeAnalysisResponse(BaseModel):

    id: int

    resume_id: int

    technical_skills: list[str]

    soft_skills: list[str]

    frameworks: list[str]

    tools: list[str]

    databases: list[str]

    cloud: list[str]

    certifications: list[str]

    education: list[Education]

    experience: list[Experience]

    projects: list[Project]

    created_at: datetime

    model_config = {
        "from_attributes": True
    }