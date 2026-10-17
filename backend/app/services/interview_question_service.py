from app.ai.interview_generator import InterviewGenerator
from app.models.interview_question import InterviewQuestion
from app.models.resume import Resume
from app.repositories.interview_question_repository import (
    InterviewQuestionRepository,
)
from app.repositories.resume_analysis_repository import (
    ResumeAnalysisRepository,
)


class InterviewQuestionService:

    def __init__(
        self,
        repository: InterviewQuestionRepository,
        analysis_repository: ResumeAnalysisRepository,
    ):
        self.repository = repository
        self.analysis_repository = analysis_repository

    def generate_questions(
        self,
        resume: Resume,
    ):

        existing = self.repository.get_by_resume(
            resume.id
        )

        if existing:
            return existing

        analysis = self.analysis_repository.get_by_resume_id(
            resume.id
        )

        if not analysis:
            raise Exception(
                "Resume must be analyzed first."
            )

        generator = InterviewGenerator()

        result = generator.generate(
            {
                "technical_skills": analysis.technical_skills,
                "soft_skills": analysis.soft_skills,
                "frameworks": analysis.frameworks,
                "tools": analysis.tools,
                "databases": analysis.databases,
                "cloud": analysis.cloud,
                "certifications": analysis.certifications,
                "education": analysis.education,
                "experience": analysis.experience,
                "projects": analysis.projects,
            }
        )

        questions = []

        for item in result:

            question = InterviewQuestion(

                resume_id=resume.id,

                question=item["question"],

                category=item["category"],

                difficulty=item["difficulty"],

                expected_points=item["expected_points"],
            )

            questions.append(
                self.repository.create(question)
            )

        return questions