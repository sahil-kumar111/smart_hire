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

            technical_skills=result["technical_skills"],

            soft_skills=result["soft_skills"],

            frameworks=result["frameworks"],

            tools=result["tools"],

            databases=result["databases"],

            cloud=result["cloud"],

            certifications=result["certifications"],

            education=result["education"],

            experience=result["experience"],

            projects=result["projects"],
        )

        return self.repository.create(
            analysis
        )