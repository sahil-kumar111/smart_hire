import json

from app.ai.groq_client import GroqClient
from app.ai.prompts import resume_skill_prompt


class SkillExtractor:

    def __init__(self):

        self.client = GroqClient()

    def extract(
        self,
        resume_text: str,
    ):

        prompt = resume_skill_prompt(
            resume_text
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