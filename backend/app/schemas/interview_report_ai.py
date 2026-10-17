import json

from app.ai.groq_client import GroqClient


class InterviewReportAI:

    def __init__(self):

        self.client = GroqClient()

    def generate(
        self,
        overall_score: float,
        questions: list,
    ):

        prompt = f"""
You are an expert Senior Technical Interviewer.

A candidate has completed an AI interview.

Overall Interview Score:
{overall_score}/10

Below are all interview questions with candidate answers and evaluations.

{json.dumps(questions, indent=2)}

Analyze the complete interview.

Return ONLY valid JSON.

The JSON format MUST be:

{{
    "summary": "A concise overall interview summary.",

    "overall_strengths": [
        "...",
        "...",
        "..."
    ],

    "overall_weaknesses": [
        "...",
        "...",
        "..."
    ],

    "learning_plan": [
        "...",
        "...",
        "..."
    ],

    "recommendation": "Strong Hire"
}}

Rules:

- Recommendation must be exactly one of:
  - Strong Hire
  - Hire
  - Consider
  - Needs Improvement

- overall_strengths must contain 3 concise bullet points.

- overall_weaknesses must contain 3 concise bullet points.

- learning_plan must contain 3 actionable improvement suggestions.

- Return ONLY JSON.
"""

        response = self.client.generate(
            prompt
        )

        response = (
            response
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        try:

            return json.loads(response)

        except Exception:

            return {

                "summary":
                    "Unable to generate AI interview summary.",

                "overall_strengths": [],

                "overall_weaknesses": [],

                "learning_plan": [],

                "recommendation":
                    "Needs Improvement",

            }