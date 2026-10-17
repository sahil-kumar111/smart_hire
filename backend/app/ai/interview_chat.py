import json

from app.ai.groq_client import GroqClient
from app.ai.interview_prompt import interview_prompt


class InterviewChat:

    def __init__(self):
        self.client = GroqClient()

    def reply(
        self,
        resume_analysis,
        conversation,
        candidate_message,
        interview_type: str = "technical",
    ):
        prompt = interview_prompt(
            resume_analysis,
            conversation,
            candidate_message,
            interview_type=interview_type,
        )

        response = self.client.generate(prompt)

        response = (
            response
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        return json.loads(response)