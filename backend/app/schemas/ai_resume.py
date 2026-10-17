from pydantic import BaseModel


class ResumeAnalysisResponse(BaseModel):

    technical_skills: list[str]

    soft_skills: list[str]

    frameworks: list[str]

    tools: list[str]

    databases: list[str]

    cloud: list[str]

    certifications: list[str]

    education: list[str]

    experience: list[str]

    projects: list[str]