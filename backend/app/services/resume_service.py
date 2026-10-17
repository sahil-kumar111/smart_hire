from app.models.resume import Resume
from app.repositories.resume_repository import ResumeRepository
from app.utils.pdf_parser import extract_text_from_pdf
from app.ai.skill_extractor import SkillExtractor


class ResumeService:

    def __init__(
        self,
        repository: ResumeRepository,
    ):
        self.repository = repository

    def create_resume(
        self,
        filename,
        file_path,
        owner_id,
    ):

        extracted_text = extract_text_from_pdf(
            file_path
        )

        resume = Resume(

            filename=filename,

            file_path=file_path,

            extracted_text=extracted_text,

            owner_id=owner_id,

        )

        return self.repository.create(
            resume
        )
    
    def analyze_resume(
        self,
        resume,
    ):
        extractor = SkillExtractor()
        return extractor.extract(
            resume.extracted_text
        )
    
    def get_user_resumes(
        self,
        user_id,
    ):
        return self.repository.get_by_user(
            user_id
        )

    def get_resume_by_id(
        self,
        resume_id,
    ):
        return self.repository.get_by_id(
            resume_id
        )

    def delete_resume(
        self,
        resume,
    ):
        self.repository.delete(
            resume
        )