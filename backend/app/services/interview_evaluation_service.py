from app.ai.interview_evaluator import (
    InterviewEvaluator,
)

from app.models.interview_answer import (
    InterviewAnswer,
)

from app.models.interview_evaluation import (
    InterviewEvaluation,
)

from app.repositories.interview_evaluation_repository import (
    InterviewEvaluationRepository,
)


class InterviewEvaluationService:

    def __init__(
        self,
        repository: InterviewEvaluationRepository,
    ):
        self.repository = repository

    def evaluate_answer(
        self,
        answer: InterviewAnswer,
    ):

        existing = self.repository.get_by_answer_id(
            answer.id
        )

        if existing:
            return existing

        evaluator = InterviewEvaluator()

        result = evaluator.evaluate(
            answer.question.question,
            answer.candidate_answer,
        )

        evaluation = InterviewEvaluation(

            answer_id=answer.id,

            score=result["score"],

            strengths=result["strengths"],

            weaknesses=result["weaknesses"],

            ideal_answer=result["ideal_answer"],

            feedback=result.get("feedback","No feedback generated."),
        
        )

        return self.repository.create(
            evaluation
        )