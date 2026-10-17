from app.ai.groq_client import GroqClient
from app.ai.interview_prompt import interview_question_generation_prompt
from app.ai.json_helper import extract_json


class InterviewGenerator:

    def __init__(self):
        self.client = GroqClient()

    def generate(
        self,
        resume_analysis: dict,
    ):
        prompt = interview_question_generation_prompt(
            resume_analysis
        )

        response = self.client.generate(
            prompt
        )

        return extract_json(response)