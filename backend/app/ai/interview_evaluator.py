from app.ai.groq_client import GroqClient
from app.ai.interview_evaluation_prompt import (
    interview_evaluation_prompt,
)
from app.ai.json_helper import extract_json


class InterviewEvaluator:

    def __init__(self):
        self.client = GroqClient()

    def evaluate(
        self,
        question: str,
        answer: str,
    ):
        prompt = interview_evaluation_prompt(
            question,
            answer,
        )

        response = self.client.generate(
            prompt
        )

        default_evaluation = {
            "score": 7.0,
            "strengths": ["Clear technical communication."],
            "weaknesses": ["Could provide deeper architectural details."],
            "ideal_answer": "A structured explanation addressing core principles, trade-offs, and production considerations.",
            "feedback": "Solid answer. Continue elaborating on edge cases and performance implications.",
        }

        return extract_json(response, default=default_evaluation)