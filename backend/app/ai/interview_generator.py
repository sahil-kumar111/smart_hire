import json

from app.ai.groq_client import GroqClient
from app.ai.interview_prompt import interview_prompt


class InterviewGenerator:

    def __init__(self):

        self.client = GroqClient()

    def generate(
        self,
        resume_analysis: dict,
    ):

        prompt = interview_prompt(
            resume_analysis
        )

        response = self.client.generate(
            prompt
        )

        response = (
            response
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        return json.loads(response)