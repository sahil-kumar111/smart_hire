from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.dependencies import get_db

from app.models.user import User

from app.repositories.resume_repository import ResumeRepository
from app.repositories.resume_analysis_repository import (
    ResumeAnalysisRepository,
)
from app.repositories.interview_question_repository import (
    InterviewQuestionRepository,
)
from app.repositories.interview_session_repository import (
    InterviewSessionRepository,
)
from app.repositories.interview_answer_repository import (
    InterviewAnswerRepository,
)
from app.repositories.interview_evaluation_repository import (
    InterviewEvaluationRepository,
)
from app.repositories.interview_conversation_repository import (
    InterviewConversationRepository,
)

from app.services.interview_question_service import (
    InterviewQuestionService,
)
from app.services.interview_session_service import (
    InterviewSessionService,
)
from app.services.interview_answer_service import (
    InterviewAnswerService,
)
from app.services.interview_evaluation_service import (
    InterviewEvaluationService,
)
from app.services.interview_report_service import (
    InterviewReportService,
)
from app.services.interview_conversation_service import (
    InterviewConversationService,
)

from app.schemas.interview_question import (
    InterviewQuestionResponse,
)
from app.schemas.interview_session import (
    InterviewSessionResponse,
    StartInterviewRequest,
)
from app.schemas.interview_answer import (
    InterviewAnswerCreate,
    InterviewAnswerResponse,
)
from app.schemas.interview_report import (
    InterviewReportResponse,
)
from app.schemas.interview_chat import (
    InterviewChatRequest,
    InterviewChatResponse,
)


router = APIRouter(
    prefix="/interview",
    tags=["Interview"],
)


@router.get(
    "/generate/{resume_id}",
    response_model=list[InterviewQuestionResponse],
)
def generate_questions(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    resume_repository = ResumeRepository(db)

    resume = resume_repository.get_by_id(
        resume_id
    )

    if (
        not resume
        or resume.owner_id != current_user.id
    ):
        raise HTTPException(
            status_code=404,
            detail="Resume not found.",
        )

    question_repository = InterviewQuestionRepository(
        db
    )

    analysis_repository = ResumeAnalysisRepository(
        db
    )

    service = InterviewQuestionService(
        question_repository,
        analysis_repository,
    )

    return service.generate_questions(
        resume
    )


@router.post(
    "/start/{resume_id}",
    response_model=InterviewSessionResponse,
)
def start_interview(
    resume_id: int,
    payload: StartInterviewRequest = StartInterviewRequest(),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume_repository = ResumeRepository(db)

    resume = resume_repository.get_by_id(resume_id)

    if not resume or resume.owner_id != current_user.id:
        raise HTTPException(
            status_code=404,
            detail="Resume not found.",
        )

    interview_type = (payload.interview_type or "technical").lower().strip()

    if interview_type not in ["hr", "technical", "managerial"]:
        raise HTTPException(
            status_code=400,
            detail="interview_type must be one of: hr, technical, managerial",
        )

    repository = InterviewSessionRepository(db)
    service = InterviewSessionService(repository)

    return service.start_session(
        resume.id,
        current_user.id,
        interview_type=interview_type,
    )


@router.post(
    "/chat/{session_id}",
    response_model=InterviewChatResponse,
)
def interview_chat(
    session_id: int,
    payload: InterviewChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    session_repository = InterviewSessionRepository(
        db
    )

    session = session_repository.get_by_id(
        session_id
    )

    if (
        not session
        or session.user_id != current_user.id
    ):
        raise HTTPException(
            status_code=404,
            detail="Interview session not found.",
        )

    conversation_repository = (
        InterviewConversationRepository(db)
    )

    service = InterviewConversationService(
        conversation_repository,
        session_repository,
    )

    return service.chat(
        session_id=session_id,
        candidate_message=payload.message,
    )


@router.post(
    "/answer",
    response_model=InterviewAnswerResponse,
)
def save_answer(
    answer: InterviewAnswerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    answer_repository = InterviewAnswerRepository(
        db
    )

    answer_service = InterviewAnswerService(
        answer_repository
    )

    saved_answer = answer_service.save_answer(
        session_id=answer.session_id,
        question_id=answer.question_id,
        candidate_answer=answer.candidate_answer,
    )

    evaluation_repository = (
        InterviewEvaluationRepository(db)
    )

    evaluation_service = (
        InterviewEvaluationService(
            evaluation_repository
        )
    )

    evaluation_service.evaluate_answer(
        saved_answer
    )

    db.refresh(saved_answer)

    return saved_answer


@router.post(
    "/finish/{session_id}",
    response_model=InterviewSessionResponse,
)
def finish_interview(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    repository = InterviewSessionRepository(
        db
    )

    session = repository.get_by_id(
        session_id
    )

    if (
        not session
        or session.user_id != current_user.id
    ):
        raise HTTPException(
            status_code=404,
            detail="Interview session not found.",
        )

    service = InterviewSessionService(
        repository
    )

    return service.finish_session(
        session
    )


@router.get(
    "/sessions",
    response_model=list[InterviewSessionResponse],
)
def get_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    repository = InterviewSessionRepository(
        db
    )

    service = InterviewSessionService(
        repository
    )

    return service.get_user_sessions(
        current_user.id
    )


@router.get(
    "/report/{session_id}",
    response_model=InterviewReportResponse,
)
def interview_report(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    repository = InterviewAnswerRepository(
        db
    )

    service = InterviewReportService(
        repository
    )

    return service.get_report(
        session_id
    )

@router.get(
    "/sessions",
    response_model=list[
        InterviewSessionResponse
    ],
)
def get_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):

    repository = InterviewSessionRepository(
        db
    )

    service = InterviewSessionService(
        repository
    )

    return service.get_user_sessions(
        current_user.id
    )