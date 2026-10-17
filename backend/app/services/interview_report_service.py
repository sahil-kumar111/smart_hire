from app.repositories.interview_answer_repository import (
    InterviewAnswerRepository,
)

from app.ai.interview_report_ai import (
    InterviewReportAI,
)

from app.ai.interview_report_ai import InterviewReportAI

class InterviewReportService:

    def __init__(
        self,
        repository: InterviewAnswerRepository,
    ):
        self.repository = repository

        self.ai = InterviewReportAI()

    def get_report(
        self,
        session_id: int,
    ):

        answers = (
            self.repository.get_answers_with_evaluation(
                session_id
            )
        )

        if not answers:

            return {

                "overall_score": 0,

                "recommendation": "No Result",

                "summary": "No interview data available.",

                "overall_strengths": [],

                "overall_weaknesses": [],

                "learning_plan": [],

                "total_questions": 0,

                "answered_questions": 0,

                "questions": [],

            }

        reports = []

        total_score = 0

        answered = 0

        for answer in answers:

            evaluation = answer.evaluation

            if evaluation is None:

                continue

            answered += 1

            total_score += evaluation.score

            reports.append(

                {

                    "question":
                        answer.question.question,

                    "candidate_answer":
                        answer.candidate_answer,

                    "score":
                        evaluation.score,

                    "strengths":
                        evaluation.strengths,

                    "weaknesses":
                        evaluation.weaknesses,

                    "ideal_answer":
                        evaluation.ideal_answer,

                    "feedback":
                        evaluation.feedback,

                }

            )

            ai = InterviewReportAI()

            ai_report = ai.generate(
                reports,
            )

        overall_score = (

            round(

                total_score / answered,

                2,

            )

            if answered

            else 0

        )

        ai_report = self.ai.generate(

            overall_score,

            reports,

        )

        return {

    "overall_score":
        overall_score,

    "recommendation":
        ai_report["recommendation"],

    "summary":
        ai_report["summary"],

    "overall_strengths":
        ai_report["overall_strengths"],

    "overall_weaknesses":
        ai_report["overall_weaknesses"],

    "learning_plan":
        ai_report["learning_plan"],

    "total_questions":
        len(answers),

    "answered_questions":
        answered,

    "questions":
        reports,

}