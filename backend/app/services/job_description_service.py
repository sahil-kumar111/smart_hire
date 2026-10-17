from sqlalchemy.orm import Session
from app.repositories.job_description_repository import JobDescriptionRepository
from app.repositories.resume_repository import ResumeRepository
from app.models.resume_analysis import ResumeAnalysis
from groq import Groq
from dotenv import load_dotenv
import json
import os

load_dotenv()


class JobDescriptionService:

    def __init__(self, db: Session):
        self.db = db
        self.jd_repo = JobDescriptionRepository(db)
        self.resume_repo = ResumeRepository(db)
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    def save_jd(self, user_id: int, jd_text: str):
        return self.jd_repo.create_or_update(user_id, jd_text)

    def get_jd(self, user_id: int):
        return self.jd_repo.get_by_user(user_id)

    def match_resume(self, user_id: int, resume_id: int) -> dict:
        # 1. Get JD
        jd = self.jd_repo.get_by_user(user_id)
        if not jd or not jd.jd_text.strip():
            raise ValueError("No Job Description found. Please save a JD first.")

        # 2. Get Resume
        resume = self.resume_repo.get_by_id(resume_id)
        if not resume:
            raise ValueError("Resume not found.")

        # 3. Build resume context
        analysis = (
            self.db.query(ResumeAnalysis)
            .filter(ResumeAnalysis.resume_id == resume_id)
            .first()
        )

        if analysis:
            resume_context = f"""
Technical Skills: {analysis.technical_skills}
Soft Skills: {analysis.soft_skills}
Frameworks: {analysis.frameworks}
Tools: {analysis.tools}
Databases: {analysis.databases}
Cloud: {analysis.cloud}
Certifications: {analysis.certifications}
Education: {analysis.education}
Experience: {analysis.experience}
Projects: {analysis.projects}
"""
        else:
            resume_context = resume.extracted_text or ""

        # 4. LLM Prompt
        prompt = f"""
You are an expert technical recruiter and resume analyst.

Compare the candidate's resume with the Job Description and return a JSON object with this exact structure:

{{
  "match_score": <number between 0 and 100>,
  "matching_skills": ["skill1", "skill2"],
  "missing_skills": ["skill1", "skill2"],
  "summary": "<2-3 sentence honest summary>"
}}

Rules:
- match_score = overall fit (skills + experience relevance)
- matching_skills = important skills present in both
- missing_skills = important skills required in JD but missing/weak in resume
- Keep lists concise (max 12 items)
- Return ONLY valid JSON. No markdown.

========== JOB DESCRIPTION ==========
{jd.jd_text}

========== CANDIDATE RESUME ==========
{resume_context}
"""

        try:
            response = self.client.chat.completions.create(
                model="openai/gpt-oss-120b", 
                messages=[
                    {
                        "role": "system",
                        "content": "You are a precise resume-to-job matching engine. Always respond with pure JSON only.",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.2,
                response_format={"type": "json_object"},
            )

            content = response.choices[0].message.content
            result = json.loads(content)

            return {
                "match_score": float(result.get("match_score", 0)),
                "matching_skills": result.get("matching_skills", [])[:15],
                "missing_skills": result.get("missing_skills", [])[:15],
                "summary": result.get("summary", "Unable to generate summary."),
            }

        except Exception as e:
            print("Groq Match Error:", str(e))
            raise ValueError("Failed to analyze resume match. Please try again.")