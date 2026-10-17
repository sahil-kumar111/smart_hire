from app.ai.skill_extractor import SkillExtractor
from app.models.resume import Resume
from app.models.resume_analysis import ResumeAnalysis
from app.repositories.resume_analysis_repository import (
    ResumeAnalysisRepository,
)


class ResumeAnalysisService:

    def __init__(
        self,
        repository: ResumeAnalysisRepository,
    ):
        self.repository = repository

    def analyze_resume(
        self,
        resume: Resume,
    ):

        existing = self.repository.get_by_resume_id(
            resume.id
        )

        if existing:
            return existing

        extractor = SkillExtractor()

        result = extractor.extract(
            resume.extracted_text
        )

        analysis = ResumeAnalysis(

            resume_id=resume.id,

            technical_skills=result.get("technical_skills", []),
            soft_skills=result.get("soft_skills", []),
            frameworks=result.get("frameworks", []),
            tools=result.get("tools", []),
            databases=result.get("databases", []),
            cloud=result.get("cloud", []),
            certifications=result.get("certifications", []),
            education=result.get("education", []),
            experience=result.get("experience", []),
            projects=result.get("projects", []),
        )

        return self.repository.create(
            analysis
        )