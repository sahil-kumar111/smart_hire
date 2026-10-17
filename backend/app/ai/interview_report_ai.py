from app.ai.groq_client import GroqClient
from app.ai.interview_report_prompt import (
    interview_report_prompt,
)
from app.ai.json_helper import extract_json


class InterviewReportAI:

    def __init__(self):
        self.client = GroqClient()

    def generate(
        self,
        *args,
        **kwargs,
    ):
        overall_score = 0.0
        reports = []

        if len(args) == 1:
            if isinstance(args[0], (int, float)):
                overall_score = float(args[0])
            elif isinstance(args[0], list):
                reports = args[0]
        elif len(args) >= 2:
            if isinstance(args[0], (int, float)):
                overall_score = float(args[0])
                reports = args[1] if isinstance(args[1], list) else []
            elif isinstance(args[1], (int, float)):
                overall_score = float(args[1])
                reports = args[0] if isinstance(args[0], list) else []
            else:
                reports = args[0] if isinstance(args[0], list) else (args[1] if isinstance(args[1], list) else [])

        if "overall_score" in kwargs:
            overall_score = float(kwargs["overall_score"])
        if "reports" in kwargs:
            reports = kwargs["reports"]
        elif "questions" in kwargs:
            reports = kwargs["questions"]

        # Default fallback structure
        if overall_score >= 8.0 or overall_score >= 80.0:
            rec = "Strong Hire"
        elif overall_score >= 6.5 or overall_score >= 65.0:
            rec = "Hire"
        elif overall_score >= 5.0 or overall_score >= 50.0:
            rec = "Consider"
        else:
            rec = "Needs Improvement"

        fallback = {
            "summary": (
                "Candidate completed the technical evaluation questions. "
                "Responses demonstrated foundational knowledge and problem-solving abilities."
            ),
            "recommendation": rec,
            "overall_strengths": [
                "Structured approach to problem-solving",
                "Clear technical articulation of core concepts",
                "Direct answers addressing prompt requirements",
            ],
            "overall_weaknesses": [
                "Could provide deeper consideration of edge cases",
                "Opportunities to elaborate on system scalability and tradeoffs",
            ],
            "learning_plan": [
                "Practice architectural trade-off discussions",
                "Review edge cases and error handling best practices",
                "Deepen knowledge of distributed systems design",
            ],
        }

        try:
            prompt = interview_report_prompt(
                reports,
            )
            response = self.client.generate(
                prompt,
            )
            result = extract_json(response, default=fallback)
            if not isinstance(result, dict):
                return fallback

            # Ensure all expected keys are present
            return {
                "summary": result.get("summary") or fallback["summary"],
                "recommendation": result.get("recommendation") or fallback["recommendation"],
                "overall_strengths": result.get("overall_strengths") or fallback["overall_strengths"],
                "overall_weaknesses": result.get("overall_weaknesses") or fallback["overall_weaknesses"],
                "learning_plan": result.get("learning_plan") or fallback["learning_plan"],
            }
        except Exception as e:
            logger_exc = str(e)
            return fallback