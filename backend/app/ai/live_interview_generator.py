from app.ai.groq_client import GroqClient
from app.ai.live_interview_prompt import live_interview_prompt


class LiveInterviewGenerator:

    def __init__(self):
        self.client = GroqClient()

    def generate(
        self,
        resume_analysis: dict,
        conversation_history: list,
        candidate_answer: str,
        interview_type: str = "technical",
    ) -> str:

        history = ""

        for message in conversation_history:
            role = message.role.capitalize()
            history += f"{role}: {message.message}\n"

        prompt = live_interview_prompt(
            resume_analysis=resume_analysis,
            conversation_history=history,
            candidate_answer=candidate_answer,
            interview_type=interview_type,
        )

        response = self.client.generate(prompt)

        return response.strip()