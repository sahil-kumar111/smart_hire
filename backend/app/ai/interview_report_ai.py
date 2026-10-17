import json

from app.ai.groq_client import GroqClient

from app.ai.interview_report_prompt import (
    interview_report_prompt,
)


class InterviewReportAI:

    def __init__(self):

        self.client = GroqClient()

    def generate(
        self,
        reports,
    ):

        prompt = interview_report_prompt(
            reports,
        )

        response = self.client.generate(
            prompt,
        )

        response = (
            response
            .replace(
                "```json",
                "",
            )
            .replace(
                "```",
                "",
            )
            .strip()
        )

        return json.loads(
            response,
        )