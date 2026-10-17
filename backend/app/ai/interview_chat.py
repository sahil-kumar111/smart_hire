from app.ai.groq_client import GroqClient
from app.ai.interview_prompt import interview_prompt
from app.ai.json_helper import extract_json


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

        try:
            parsed = extract_json(response)
            if isinstance(parsed, dict) and "reply" in parsed:
                return parsed
        except Exception:
            pass

        # If LLM responded with raw text rather than JSON
        clean_text = (response or "").strip()
        is_finished = "INTERVIEW_COMPLETE" in clean_text
        if is_finished:
            clean_text = clean_text.replace("INTERVIEW_COMPLETE", "").strip()

        return {
            "reply": clean_text or "Thank you. Let's proceed to the next question.",
            "interview_finished": is_finished,
        }